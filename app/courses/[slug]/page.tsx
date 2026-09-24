import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navigation } from "@/components/ui/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CourseHero } from "@/components/course/CourseHero";
import { CourseOutcomes } from "@/components/course/CourseOutcomes";
import { CourseModuleList } from "@/components/course/CourseModuleList";
import { CourseProgressBar } from "@/components/course/CourseProgressBar";
import { CourseInstructor } from "@/components/course/CourseInstructor";
import { getCourseBySlug, getUserProgress } from "@/sanity/lib/fetch";
import { serverClient } from "@/sanity/lib/client";
import { COURSE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { auth } from "@clerk/nextjs/server";
import type { SanityImageSource } from "@sanity/image-url";


// ─── Local types matching COURSE_BY_SLUG_QUERY projection ────────────────────

interface LessonStub {
  _id: string;
  title: string | null;
  slug: string | null;
  /** Duration in seconds as stored in Sanity */
  duration: number | null;
  isFreePreview: boolean;
}

interface CourseModule {
  _key: string;
  title: string | null;
  summary: string | null;
  lessons: LessonStub[] | null;
}

interface LearningOutcome {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
}

interface CourseCategory {
  title?: string | null;
  slug?: string | null;
}

interface CourseInstructorData {
  _id?: string;
  name?: string | null;
  slug?: string | null;
  photo?: SanityImageSource | null;
  expertise?: string[] | null;
}

interface CourseDetail {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  coverImage: SanityImageSource | null;
  level: string | null;
  price: number | null;
  isPopular: boolean | null;
  studentCount: number | null;
  learningOutcomes: LearningOutcome[] | null;
  category: CourseCategory | null;
  instructor: CourseInstructorData | null;
  modules: CourseModule[] | null;
}

// ─── Static params ───────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await serverClient.fetch<Array<{ slug: string | null }>>(
    COURSE_SLUGS_QUERY
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
  const raw = await getCourseBySlug(slug);
  const course = raw as CourseDetail | null;
  if (!course) return {};
  return {
    title: `${course.title ?? "Course"} — LearnX`,
    description: course.summary ?? undefined,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a duration in seconds to "1h 24m" or "45m". */
function formatSeconds(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Sum lesson durations (in seconds) across all modules and format. */
function computeTotalDuration(modules: CourseModule[] | null): string {
  if (!modules) return "";
  const total = modules.reduce((acc, mod) => {
    return acc + (mod.lessons ?? []).reduce((a, l) => a + (l.duration ?? 0), 0);
  }, 0);
  return formatSeconds(total);
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getCourseBySlug(slug);
  const course = raw as CourseDetail | null;

  if (!course) notFound();

  const modules: CourseModule[] = (course.modules ?? []).map((mod) => ({
    _key: mod._key,
    title: mod.title ?? null,
    summary: mod.summary ?? null,
    lessons: (mod.lessons ?? []).map((l) => ({
      _id: l._id,
      title: l.title ?? null,
      slug: l.slug ?? null,
      duration: typeof l.duration === "number" ? l.duration : null,
      isFreePreview: l.isFreePreview ?? false,
    })),
  }));

  const totalDuration = computeTotalDuration(modules);
  const totalLessons = modules.reduce(
    (acc, mod) => acc + (mod.lessons?.length ?? 0),
    0
  );

  const firstLessonSlug = modules[0]?.lessons?.[0]?.slug ?? null;
  const { userId } = await auth();
  const userProgressData = userId ? await getUserProgress(userId) : null;

  interface UserProgressData {
    completedLessonIds?: string[] | null;
    courseProgress?: Array<{
      courseId?: string;
      courseSlug?: string;
      lastLessonSlug?: string;
      lastPositionSeconds?: number;
    }> | null;
  }

  const progressRecord = (userProgressData as UserProgressData) || null;
  const completedIds = new Set(progressRecord?.completedLessonIds || []);

  const allLessons = modules.flatMap((m) => m.lessons ?? []);
  const completedInCourse = allLessons.filter((l) => completedIds.has(l._id));
  const realProgressPercent =
    totalLessons > 0 ? Math.round((completedInCourse.length / totalLessons) * 100) : 0;

  const courseResume = progressRecord?.courseProgress?.find(
    (cp) => cp.courseId === course._id || cp.courseSlug === slug
  );

  let continuePath = `/courses/${slug}`;
  if (courseResume?.lastLessonSlug) {
    continuePath = `/lessons/${courseResume.lastLessonSlug}${
      courseResume.lastPositionSeconds ? `?start=${courseResume.lastPositionSeconds}` : ""
    }`;
  } else {
    const nextUncompleted = allLessons.find((l) => !completedIds.has(l._id)) || allLessons[0];
    if (nextUncompleted?.slug) {
      continuePath = `/lessons/${nextUncompleted.slug}`;
    } else if (firstLessonSlug) {
      continuePath = `/lessons/${firstLessonSlug}`;
    }
  }

  const outcomes: LearningOutcome[] = (course.learningOutcomes ?? []).filter(
    (o): o is LearningOutcome => !!o
  );


  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        backgroundColor: "#FAF7F5",
        backgroundImage: `repeating-linear-gradient(45deg, #F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px)`,
      }}
    >
      {/* Central Framed Layout matching vertex-home.png desktop view */}
      <div className="w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col relative pb-28 sm:pb-24">
        {/* Top Header Navigation */}
        <header className="w-full">
          <Navigation activeTab="courses" showActions />
        </header>

        {/* Breadcrumbs Navigation */}
        <div className="px-6 lg:px-8 pt-5 pb-2">
          <Breadcrumbs
            items={[
              { label: "All Courses", href: "/courses" },
              { label: course.title ?? slug },
            ]}
          />
        </div>

        {/* Course Hero Header with Cover Image, Metadata & Actions */}
        <CourseHero
          slug={slug}
          title={course.title}
          summary={course.summary}
          coverImage={course.coverImage}
          level={course.level}
          isPopular={course.isPopular ?? false}
          studentCount={course.studentCount}
          moduleCount={modules.length}
          lessonCount={totalLessons}
          totalDuration={totalDuration || null}
          firstLessonSlug={firstLessonSlug}
          category={course.category}
          instructor={course.instructor}
          price={course.price}
        />

        {/* Divider */}
        <div className="w-full h-px bg-[#EDE5DF] mb-8" />

        {/* What You'll Learn Outcomes */}
        {outcomes.length > 0 && <CourseOutcomes outcomes={outcomes} />}

        {/* Course Curriculum Modules */}
        {modules.length > 0 && (
          <CourseModuleList
            modules={modules}
            courseSlug={slug}
            totalDuration={totalDuration || null}
            completedLessonIds={Array.from(completedIds)}
          />

        )}

        {/* Instructor Spotlight */}
        {course.instructor && (
          <CourseInstructor instructor={course.instructor} />
        )}
      </div>

      {/* Sticky Bottom Progress Bar */}
      <CourseProgressBar
        progress={realProgressPercent}
        continuePath={continuePath}
        totalLessons={totalLessons}
      />

    </div>
  );
}
