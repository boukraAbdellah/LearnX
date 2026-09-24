import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, serverClient } from "@/sanity/lib/client";
import { USER_PROGRESS_QUERY } from "@/sanity/lib/queries";

interface ProgressRequestBody {
  courseId?: string;
  lessonId?: string;
  completed?: boolean;
  positionSeconds?: number;
}

/**
 * GET /api/progress
 * Returns the authenticated user's current progress document.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await serverClient.fetch(USER_PROGRESS_QUERY, { userId });
    return NextResponse.json({ progress: progress ?? null });
  } catch (error) {
    console.error("[API /api/progress GET error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Updates lesson completion or video position for the authenticated user.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as ProgressRequestBody;
    const { courseId, lessonId, completed, positionSeconds } = body;

    if (!lessonId && !courseId) {
      return NextResponse.json(
        { error: "Missing required fields (lessonId or courseId)" },
        { status: 400 }
      );
    }

    const hasWriteToken = Boolean(
      process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN
    );

    if (!hasWriteToken) {
      console.warn(
        "[API /api/progress] Neither SANITY_API_WRITE_TOKEN nor SANITY_API_READ_TOKEN is configured."
      );
      return NextResponse.json(
        {
          error:
            "Write token is not configured in environment. Please add SANITY_API_WRITE_TOKEN to .env.local",
        },
        { status: 503 }
      );
    }

    const docId = `progress.${userId}`;

    // 1. Ensure progress document exists
    await writeClient.createIfNotExists({
      _id: docId,
      _type: "progress",
      userId,
      completedLessons: [],
      courseProgress: [],
    });

    // 2. Handle completion toggle if specified
    if (lessonId && typeof completed === "boolean") {
      if (completed) {
        // Fetch current document to prevent duplicate entries
        const currentDoc = await writeClient.getDocument<{
          completedLessons?: Array<{ _ref?: string }>;
        }>(docId);

        const alreadyCompleted = currentDoc?.completedLessons?.some(
          (ref) => ref._ref === lessonId
        );

        if (!alreadyCompleted) {
          await writeClient
            .patch(docId)
            .setIfMissing({ completedLessons: [] })
            .append("completedLessons", [
              {
                _type: "reference",
                _ref: lessonId,
                _key: `comp-${lessonId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
              },
            ])
            .commit({ autoGenerateArrayKeys: true });
        }
      } else {
        // Unmark complete: remove reference from completedLessons
        await writeClient
          .patch(docId)
          .unset([`completedLessons[_ref=="${lessonId}"]`])
          .commit();
      }
    }

    // 3. Handle video resume position update if specified
    if (courseId && (positionSeconds !== undefined || lessonId)) {
      const currentDoc = await writeClient.getDocument<{
        courseProgress?: Array<{
          _key?: string;
          course?: { _ref?: string };
          lastLesson?: { _ref?: string };
          lastPositionSeconds?: number;
          updatedAt?: string;
        }>;
      }>(docId);

      const existingEntries = currentDoc?.courseProgress || [];
      const matchIndex = existingEntries.findIndex(
        (entry) => entry.course?._ref === courseId
      );

      const updatedEntry = {
        _key:
          matchIndex >= 0
            ? existingEntries[matchIndex]._key
            : `cp-${courseId.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        course: { _type: "reference", _ref: courseId },
        ...(lessonId
          ? { lastLesson: { _type: "reference", _ref: lessonId } }
          : matchIndex >= 0 && existingEntries[matchIndex].lastLesson
          ? { lastLesson: existingEntries[matchIndex].lastLesson }
          : {}),
        lastPositionSeconds:
          positionSeconds !== undefined
            ? positionSeconds
            : matchIndex >= 0
            ? existingEntries[matchIndex].lastPositionSeconds
            : 0,
        updatedAt: new Date().toISOString(),
      };

      if (matchIndex >= 0) {
        // Replace matching entry
        await writeClient
          .patch(docId)
          .set({
            [`courseProgress[${matchIndex}]`]: updatedEntry,
          })
          .commit();
      } else {
        // Append new course progress entry
        await writeClient
          .patch(docId)
          .setIfMissing({ courseProgress: [] })
          .append("courseProgress", [updatedEntry])
          .commit({ autoGenerateArrayKeys: true });
      }
    }

    // 4. Return updated progress
    const updatedProgress = await serverClient.fetch(USER_PROGRESS_QUERY, {
      userId,
    });

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
    });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string };
    console.error("[API /api/progress POST error]:", err.message || err);

    if (err.statusCode === 403) {
      return NextResponse.json(
        {
          error:
            "Sanity write permission denied. Ensure SANITY_API_WRITE_TOKEN has Editor role.",
          details: err.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update progress", details: err.message },
      { status: 500 }
    );
  }
}
