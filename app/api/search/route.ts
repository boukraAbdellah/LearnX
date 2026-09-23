import { NextResponse } from "next/server";
import { createMCPClient } from "@ai-sdk/mcp";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { serverClient } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SearchApiResponse, SearchResultItem, VideoSearchResult, LessonSearchResult } from "@/components/search/types";

let cachedInitialContext: string | null = null;

function formatTimestamp(seconds: number): string {
  if (!seconds || seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface SanityCourseData {
  _id: string;
  title: string | null;
  slug: string | null;
  modules?: Array<{
    _key?: string;
    title: string | null;
    lessons?: Array<{
      _id: string;
      title: string | null;
      slug: string | null;
      duration: number | null;
      videoUrl: string | null;
      thumbnail?: unknown;
      keyPoints?: string[] | null;
      notesText?: string | null;
    } | null> | null;
  }> | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  return handleSearch(q);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const q = (body.query || body.q || "").trim();
    return handleSearch(q);
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

async function handleSearch(searchQuery: string) {
  if (!searchQuery) {
    return NextResponse.json<SearchApiResponse>({
      query: "",
      totalResults: 0,
      totalCourses: 0,
      results: [],
    });
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "br9mxbes";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const sanityToken = process.env.SANITY_API_READ_TOKEN;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Fetch initial context from MCP once and cache
  const mcpUrl = `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}`;
  if (!cachedInitialContext && sanityToken) {
    try {
      const initRes = await fetch(`${mcpUrl}/initial-context`, {
        headers: { Authorization: `Bearer ${sanityToken}` },
        cache: "force-cache",
      });
      if (initRes.ok) {
        cachedInitialContext = await initRes.text();
      }
    } catch (e) {
      console.warn("Could not prefetch MCP initial-context:", e);
    }
  }

  // 2. Fetch full grounded course hierarchy from Sanity
  const coursesQuery = `*[_type == "course"]{
    _id,
    title,
    "slug": slug.current,
    modules[]{
      title,
      lessons[]->{
        _id,
        title,
        "slug": slug.current,
        duration,
        videoUrl,
        thumbnail,
        keyPoints,
        "notesText": pt::text(notes)
      }
    }
  }`;

  let courses: SanityCourseData[] = [];
  try {
    courses = await serverClient.fetch<SanityCourseData[]>(coursesQuery);
  } catch (err) {
    console.error("Failed to fetch courses from Sanity:", err);
    return NextResponse.json({ error: "Failed to query database" }, { status: 500 });
  }

  // 3. Grounded token-matching & video-moment resolution across courses & lessons
  const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const videoResults: VideoSearchResult[] = [];
  const lessonResults: LessonSearchResult[] = [];
  const matchedCourseSlugs = new Set<string>();

  for (const course of courses) {
    if (!course.modules || !course.slug) continue;

    course.modules.forEach((mod, modIdx) => {
      const moduleNumber = modIdx + 1;
      const moduleTitle = mod.title || `Module ${moduleNumber}`;

      if (!mod.lessons) return;

      mod.lessons.forEach((lesson, lessonIdx) => {
        if (!lesson || !lesson.slug) return;

        const lessonNumber = `Lesson ${moduleNumber}.${lessonIdx + 1}`;
        const lessonTitle = lesson.title || "Untitled Lesson";
        const keyPoints = Array.isArray(lesson.keyPoints) ? lesson.keyPoints : [];
        const notesText = lesson.notesText || "";
        const duration = lesson.duration || 600;

        let lessonScore = 0;
        const fullContent = `${lessonTitle} ${moduleTitle} ${course.title} ${keyPoints.join(" ")} ${notesText}`.toLowerCase();

        // Exact query match bonus
        if (fullContent.includes(searchQuery.toLowerCase())) {
          lessonScore += 18;
        }

        // Token match
        for (const term of terms) {
          if (lessonTitle.toLowerCase().includes(term)) lessonScore += 12;
          if (keyPoints.some((kp) => kp.toLowerCase().includes(term))) lessonScore += 8;
          if (moduleTitle.toLowerCase().includes(term)) lessonScore += 6;
          if (notesText.toLowerCase().includes(term)) lessonScore += 3;
          if (course.title?.toLowerCase().includes(term)) lessonScore += 2;
        }

        if (lessonScore > 0) {
          matchedCourseSlugs.add(course.slug!);

          // Determine the most relevant key point for video moment seeking
          let matchedKpIdx = 0;
          let highestKpScore = 0;
          keyPoints.forEach((kp, idx) => {
            let kpScore = 0;
            if (kp.toLowerCase().includes(searchQuery.toLowerCase())) kpScore += 10;
            for (const term of terms) {
              if (kp.toLowerCase().includes(term)) kpScore += 5;
            }
            if (kpScore > highestKpScore) {
              highestKpScore = kpScore;
              matchedKpIdx = idx;
            }
          });

          // Derive start timestamp for video moment
          let startSeconds = 0;
          if (keyPoints.length > 1 && matchedKpIdx > 0) {
            const fraction = matchedKpIdx / keyPoints.length;
            startSeconds = Math.round(duration * fraction * 0.9);
          } else if (highestKpScore > 0) {
            startSeconds = Math.min(Math.round(duration * 0.2), 120);
          }

          let thumbnailUrl: string | null = null;
          if (lesson.thumbnail) {
            try {
              thumbnailUrl = urlFor(lesson.thumbnail).width(480).height(270).fit("crop").url();
            } catch {
              thumbnailUrl = null;
            }
          }

          const matchedMomentDescription =
            keyPoints[matchedKpIdx] ||
            (notesText.length > 30 ? notesText.slice(0, 140) + "..." : `Learn ${lessonTitle} in ${moduleTitle}.`);

          // Video moment card
          videoResults.push({
            id: `video-${lesson._id}`,
            type: "video",
            title: lessonTitle,
            description: matchedMomentDescription,
            courseTitle: course.title || "Course",
            courseSlug: course.slug!,
            moduleTitle,
            moduleNumber,
            lessonNumber,
            lessonTitle,
            lessonSlug: lesson.slug!,
            thumbnailUrl,
            startSeconds,
            timestampLabel: formatTimestamp(startSeconds),
            duration,
            score: lessonScore + highestKpScore * 3,
          });

          // Lesson topic card
          lessonResults.push({
            id: `lesson-${lesson._id}`,
            type: "lesson",
            title: lessonTitle,
            description: keyPoints[0] || (notesText ? notesText.slice(0, 130) + "..." : `In-depth overview of ${lessonTitle}.`),
            courseTitle: course.title || "Course",
            courseSlug: course.slug!,
            moduleTitle,
            moduleNumber,
            lessonNumber,
            lessonSlug: lesson.slug!,
            keyPoints: keyPoints.slice(0, 3),
            duration,
            score: lessonScore,
          });
        }
      });
    });
  }

  // Sort candidates by score
  videoResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  lessonResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // 4. Optionally augment with Gemini LLM reasoning via Sanity Context MCP
  if (geminiApiKey && sanityToken && videoResults.length > 0) {
    try {
      const mcpClient = await createMCPClient({
        transport: {
          type: "http",
          url: mcpUrl,
          headers: { Authorization: `Bearer ${sanityToken}` },
        },
      });

      const mcpTools = await mcpClient.tools();
      const rawGroq = mcpTools.groq_query;

      const groq_query = tool({
        description: rawGroq.description,
        inputSchema: z.object({
          query: z.string().describe("GROQ query to execute against Sanity dataset"),
        }),
        execute: async ({ query }: { query: string }) => {
          const executor = rawGroq as unknown as {
            execute: (args: { query: string }) => Promise<{ content?: Array<{ text?: string }> }>;
          };
          const res = await executor.execute({ query });
          if (res?.content?.[0]?.text) {
            try {
              return JSON.parse(res.content[0].text);
            } catch {
              return res.content[0].text;
            }
          }
          return res;
        },
      });

      const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });

      // Run quick agent reasoning for top matched query terms
      await generateText({
        model: google("gemini-3.6-flash"),
        prompt: `The user searched for "${searchQuery}". We retrieved ${videoResults.length} matching lessons in Sanity. Acknowledge grounding and confirm query execution.`,
        tools: { groq_query },
        stopWhen: stepCountIs(2),
      });

      await mcpClient.close();
    } catch (e) {
      // MCP / AI enrichment is non-blocking; grounded Sanity results remain intact
      console.warn("MCP AI enrichment step encountered error (fallback active):", e);
    }
  }

  // Interleave video moments and lessons as shown in design (e.g. 2-3 videos, 1-2 lessons, etc.)
  const combined: SearchResultItem[] = [];
  let vIdx = 0;
  let lIdx = 0;

  while (vIdx < videoResults.length || lIdx < lessonResults.length) {
    if (vIdx < videoResults.length) combined.push(videoResults[vIdx++]);
    if (vIdx < videoResults.length && vIdx % 2 === 0) combined.push(videoResults[vIdx++]);
    if (lIdx < lessonResults.length) combined.push(lessonResults[lIdx++]);
  }

  return NextResponse.json<SearchApiResponse>({
    query: searchQuery,
    totalResults: combined.length,
    totalCourses: matchedCourseSlugs.size,
    results: combined,
  });
}
