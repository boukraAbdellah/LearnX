import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/components/ui/navigation";
import { LessonSidebar, type SidebarModule } from "@/components/lesson/LessonSidebar";
import { LessonHeader, type BreadcrumbItem } from "@/components/lesson/LessonHeader";
import { LessonVideoEmbed } from "@/components/lesson/LessonVideoEmbed";
import { LessonTabs } from "@/components/lesson/LessonTabs";
import { LessonBottomNav, type NavLessonTarget } from "@/components/lesson/LessonBottomNav";
import { getLessonBySlug, getLessonCourse } from "@/sanity/lib/fetch";
import { serverClient } from "@/sanity/lib/client";
import { LESSON_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "next-sanity";

// ─── Local Types ─────────────────────────────────────────────────────────────

interface LessonResourceData {
  type?: string | null;
  title: string;
  description?: string | null;
  url?: string | null;
}

interface LessonDetailData {
  _id: string;
  title: string | null;
  slug: string | null;
  videoUrl?: string | null;
  thumbnail?: SanityImageSource | null;
  poster?: SanityImageSource | null;
  duration?: number | null;
  freePreview?: boolean | null;
  isFreePreview?: boolean;
  studentCount?: number | null;
  notes?: PortableTextBlock[] | null;
  keyPoints?: string[] | null;
  proTip?: string | null;
  resources?: LessonResourceData[] | null;
}

interface CourseModuleLessonStub {
  _id: string;
  title: string | null;
  slug: string | null;
  duration?: number | null;
  freePreview?: boolean | null;
  isFreePreview?: boolean;
}

interface CourseModuleData {
  _key: string;
  title: string | null;
  summary?: string | null;
  lessons: CourseModuleLessonStub[] | null;
}

interface ParentCourseData {
  _id: string;
  title: string | null;
  slug: string | null;
  coverImage?: SanityImageSource | null;
  level?: string | null;
  modules: CourseModuleData[] | null;
}

// ─── Static Params ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await serverClient.fetch<Array<{ slug: string | null }>>(
    LESSON_SLUGS_QUERY
  );
  return (slugs ?? [])
    .filter((s) => s.slug)
    .map((s) => ({ slug: s.slug! }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawLesson = await getLessonBySlug(slug);
  const lesson = rawLesson as LessonDetailData | null;
  if (!lesson) return {};

  return {
    title: `${lesson.title ?? "Lesson"} — LearnX`,
    description:
      lesson.keyPoints && lesson.keyPoints.length > 0
        ? lesson.keyPoints.join(", ")
        : `Watch ${lesson.title} on LearnX`,
  };
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // Extract start seconds if passed in URL (e.g. ?start=120 or ?t=120)
  const rawStart = resolvedSearchParams.start || resolvedSearchParams.t;
  const startSeconds =
    typeof rawStart === "string" && !isNaN(Number(rawStart))
      ? Number(rawStart)
      : null;

  const rawLesson = await getLessonBySlug(slug);
  const lesson = rawLesson as LessonDetailData | null;

  if (!lesson) notFound();

  // Reverse reference: find parent course containing this lesson
  const rawCourse = await getLessonCourse(lesson._id);
  const course = rawCourse as ParentCourseData | null;

  const modules: SidebarModule[] = (course?.modules ?? []).map((mod) => ({
    _key: mod._key,
    title: mod.title ?? "Module",
    summary: mod.summary ?? null,
    lessons: (mod.lessons ?? []).map((l) => ({
      _id: l._id,
      title: l.title ?? "Untitled Lesson",
      slug: l.slug ?? null,
      duration: typeof l.duration === "number" ? l.duration : null,
      isFreePreview: l.isFreePreview ?? false,
    })),
  }));

  // Derive module & lesson numbering (e.g. Lesson 5.1 in Data Fetching & Caching)
  let moduleNumber = 1;
  let lessonNumber = 1;
  let activeModuleKey: string | null = null;
  let activeModuleTitle = "Curriculum";

  if (course?.modules) {
    course.modules.forEach((mod, modIdx) => {
      const foundIdx = (mod.lessons ?? []).findIndex(
        (l) => l._id === lesson._id || l.slug === lesson.slug
      );
      if (foundIdx !== -1) {
        moduleNumber = modIdx + 1;
        lessonNumber = foundIdx + 1;
        activeModuleKey = mod._key;
        if (mod.title) activeModuleTitle = mod.title;
      }
    });
  }

  const lessonNumberLabel = `LESSON ${moduleNumber}.${lessonNumber}`;

  // Flatten lessons across modules to find previous and next lessons
  const allLessons: NavLessonTarget[] = [];
  modules.forEach((mod) => {
    (mod.lessons ?? []).forEach((l) => {
      if (l.slug && l.title) {
        allLessons.push({
          title: l.title,
          slug: l.slug,
          duration: l.duration ?? null,
        });
      }
    });
  });

  const currentLessonIndex = allLessons.findIndex((l) => l.slug === slug);
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  // Build breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "All Courses", href: "/courses" },
  ];
  if (course?.title && course?.slug) {
    breadcrumbs.push({
      label: course.title,
      href: `/courses/${course.slug}`,
    });
  }
  breadcrumbs.push({
    label: activeModuleTitle,
    href: course?.slug ? `/courses/${course.slug}` : undefined,
  });
  breadcrumbs.push({
    label: lesson.title ?? "Lesson",
  });

  // Calculate overview text: if lesson notes has a first paragraph, or use keyPoints fallback
  let overviewText: string | null = null;
  if (lesson.notes && Array.isArray(lesson.notes)) {
    type BlockSpan = { _type?: string; text?: string };
    type BlockLike = { _type?: string; style?: string; children?: BlockSpan[] };
    const blocks = lesson.notes as unknown as BlockLike[];
    const firstBlock = blocks.find(
      (b) => b._type === "block" && b.style === "normal"
    );
    if (firstBlock && Array.isArray(firstBlock.children)) {
      overviewText = firstBlock.children
        .map((c) => c.text ?? "")
        .join("");
    }
  }
  if (!overviewText) {
    overviewText = `In this lesson, you will master ${
      lesson.title ?? "the topic"
    } through focused explanations and practical demonstrations.`;
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        backgroundColor: "#FAF7F5",
        backgroundImage: `repeating-linear-gradient(45deg, #F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px)`,
      }}
    >
      {/* Central Framed Layout matching Vertex Design */}
      <div className="w-full max-w-[1440px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col relative">
        {/* Top Header Navigation */}
        <header className="w-full">
          <Navigation activeTab="courses" showActions />
        </header>

        {/* Split Layout: Left Curriculum Sidebar + Right Lesson Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-stretch">
          {/* Left Sidebar */}
          {course && (
            <LessonSidebar
              courseTitle={course.title ?? "Course"}
              courseSlug={course.slug ?? "overview"}
              courseCoverImage={course.coverImage}
              currentLessonSlug={slug}
              currentModuleKey={activeModuleKey}
              modules={modules}
              progressPercent={35}
            />
          )}

          {/* Right Main Lesson Area */}
          <main className="flex-1 min-w-0 px-6 sm:px-8 lg:px-12 py-8 flex flex-col gap-6">
            {/* Lesson Header (Breadcrumbs, Badge, Title, Bookmark, Meta) */}
            <LessonHeader
              breadcrumbs={breadcrumbs}
              lessonNumberLabel={lessonNumberLabel}
              title={lesson.title ?? "Lesson"}
              summary={
                course?.title
                  ? `Learn key techniques and workflows in ${course.title}.`
                  : null
              }
              duration={lesson.duration}
              level={course?.level ?? "Intermediate"}
              studentCount={lesson.studentCount ?? 3426}
            />

            {/* Inline Video Player Embed */}
            <LessonVideoEmbed
              videoUrl={lesson.videoUrl}
              startSeconds={startSeconds}
              title={lesson.title ?? "Lesson Video"}
              thumbnail={lesson.thumbnail ?? lesson.poster}
              duration={lesson.duration}
            />

            {/* Interactive Lesson Tabs (Content & Notes) */}
            <div className="mt-4">
              <LessonTabs
                overview={overviewText}
                keyPoints={lesson.keyPoints}
                proTip={
                  lesson.proTip ||
                  "Use caching and revalidation wisely to ensure your app stays fast and data remains fresh without unnecessary requests."
                }
                resources={lesson.resources}
                notes={lesson.notes}
              />
            </div>

            {/* Bottom Lesson Navigation (Previous & Next Lesson) */}
            <LessonBottomNav
              previousLesson={previousLesson}
              nextLesson={nextLesson}
              courseSlug={course?.slug ?? "courses"}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
