import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { Navigation } from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BottomBars } from "@/components/ui/bottom-bars";
import { CourseIcon } from "@/components/home/CourseIcon";

import {
  PlayCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  ChevronRightIcon,
  UserIcon,
} from "@/components/ui/icons";
import { getCourses, getUserProgress } from "@/sanity/lib/fetch";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "My Learning — LearnX",
  description:
    "Track your course progress, resume active lessons, and view completed certifications.",
};

interface LessonStub {
  _id: string;
  duration?: number | null;
}

interface ModuleStub {
  _key: string;
  title?: string | null;
  lessons?: LessonStub[] | null;
}

interface CourseItem {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  coverImage?: SanityImageSource | null;
  level: string | null;
  price: number | null;
  isPopular?: boolean;
  category?: { title?: string | null; slug?: string | null } | null;
  instructor?: { name?: string | null; photo?: SanityImageSource | null } | null;
  modules?: ModuleStub[] | null;
}

interface CourseProgressEntry {
  courseId?: string;
  courseSlug?: string;
  lastLessonId?: string;
  lastLessonSlug?: string;
  lastLessonTitle?: string;
  lastPositionSeconds?: number;
  updatedAt?: string;
}

interface ProgressResult {
  completedLessonIds?: string[] | null;
  courseProgress?: CourseProgressEntry[] | null;
}

/* ---------- Helpers ---------- */

function formatTimestamp(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getResumeHref(
  course: CourseItem,
  resumeInfo?: CourseProgressEntry
): string {
  const resumeSlug =
    resumeInfo?.lastLessonSlug ||
    (course.modules?.[0]?.lessons?.[0] as { slug?: string })?.slug ||
    null;

  const resumeTimestamp = resumeInfo?.lastPositionSeconds || 0;

  return resumeSlug
    ? `/lessons/${resumeSlug}${resumeTimestamp > 0 ? `?start=${resumeTimestamp}` : ""
    }`
    : `/courses/${course.slug}`;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F5]";

/* ---------- Page ---------- */

export default async function MyLearningPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  const pageBackground = {
    backgroundColor: "#FAF7F5",
    backgroundImage: `repeating-linear-gradient(45deg, #F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px)`,
  } as const;

  // Unauthenticated State
  if (!userId) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-start relative"
        style={pageBackground}
      >
        <div className="w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col justify-between relative">
          <header className="w-full">
            <Navigation activeTab="my-learning" showActions />
          </header>

          {/* Breadcrumbs Navigation */}
          <div className="px-6 lg:px-8 pt-5 pb-2">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "My Learning" },
              ]}
            />
          </div>

          <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-8 py-12">
            <div className="w-full max-w-[640px] bg-white border border-[#EDE5DF] rounded-3xl px-6 sm:px-12 py-12 text-center shadow-sm">
              <div className="relative w-20 h-20 mx-auto mb-7">
                <div className="absolute inset-0 rounded-3xl bg-primary-100/60 rotate-6" />
                <div className="relative w-full h-full rounded-3xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-xs">
                  <BookOpenIcon size={36} />
                </div>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#0F172A] tracking-tight mb-4 text-balance">
                Track your learning journey
              </h1>

              <p className="text-[#64748B] text-base max-w-[460px] mx-auto leading-relaxed mb-8">
                Sign in to keep track of completed lessons, save video
                timestamps, and pick up right where you left off across all
                courses.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto shadow-sm">
                    Sign in to view progress
                  </Button>
                </SignInButton>
                <Link
                  href="/courses"
                  className={`w-full sm:w-auto rounded-xl ${focusRing}`}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Browse catalog
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 pt-8 border-t border-[#F1F5F9] text-left">
                {[
                  {
                    icon: <CheckCircleIcon size={16} />,
                    tone: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    title: "Lesson progress",
                    text: "See what you've finished.",
                  },
                  {
                    icon: <PlayCircleIcon size={16} />,
                    tone: "bg-primary-50 text-primary-600 border-primary-100",
                    title: "Saved timestamps",
                    text: "Resume videos mid-lesson.",
                  },
                  {
                    icon: <ClockIcon size={16} />,
                    tone: "bg-indigo-50 text-indigo-600 border-indigo-100",
                    title: "Every device",
                    text: "Your place follows you.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex sm:flex-col gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${item.tone}`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Signature Bottom Equalizer Graphic */}
          <BottomBars />
        </div>
      </div>
    );
  }

  // Authenticated State: Load user progress & courses
  const [userProgressData, rawCourses] = await Promise.all([
    getUserProgress(userId),
    getCourses(),
  ]);

  const courses = (rawCourses ?? []) as CourseItem[];

  const progress = (userProgressData as ProgressResult) || {};
  const completedLessonIds = new Set(progress.completedLessonIds || []);
  const courseProgressList = progress.courseProgress || [];

  // Categorize courses into In-Progress, Completed, and Not-Started
  const processedCourses = courses.map((course) => {
    const allLessons: LessonStub[] = (course.modules ?? []).flatMap(
      (m) => m.lessons ?? []
    );
    const totalLessons = allLessons.length;
    const completedCount = allLessons.filter(
      (l) => l._id && completedLessonIds.has(l._id)
    ).length;

    const percent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const resumeInfo = courseProgressList.find(
      (cp) => cp.courseId === course._id || cp.courseSlug === course.slug
    );

    return {
      course,
      totalLessons,
      completedCount,
      percent,
      isCompleted: totalLessons > 0 && completedCount >= totalLessons,
      isStarted:
        completedCount > 0 ||
        Boolean(resumeInfo?.lastLessonSlug || resumeInfo?.lastPositionSeconds),
      resumeInfo,
    };
  });

  // Most recently touched course first
  const inProgressCourses = processedCourses
    .filter((c) => c.isStarted && !c.isCompleted)
    .sort(
      (a, b) =>
        new Date(b.resumeInfo?.updatedAt ?? 0).getTime() -
        new Date(a.resumeInfo?.updatedAt ?? 0).getTime()
    );
  const completedCourses = processedCourses.filter((c) => c.isCompleted);
  const totalCompletedLessons = completedLessonIds.size;

  const [featured, ...otherInProgress] = inProgressCourses;

  const userDisplayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Learner";

  const metrics = [
    {
      label: "In progress",
      value: inProgressCourses.length,
      unit: inProgressCourses.length === 1 ? "course" : "courses",
      icon: <ClockIcon size={18} />,
      tone: "bg-primary-50 text-primary-600 border-primary-100",
    },
    {
      label: "Completed",
      value: completedCourses.length,
      unit: completedCourses.length === 1 ? "course" : "courses",
      icon: <CheckCircleIcon size={18} />,
      tone: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      label: "Lessons mastered",
      value: totalCompletedLessons,
      unit: totalCompletedLessons === 1 ? "lesson" : "lessons",
      icon: <BookOpenIcon size={18} />,
      tone: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={pageBackground}
    >
      <div className="w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col justify-between relative">
        {/* Navigation Bar */}
        <header className="w-full">
          <Navigation activeTab="my-learning" showActions />
        </header>

        {/* Breadcrumbs Navigation */}
        <div className="px-6 lg:px-8 pt-5 pb-2">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "My Learning" },
            ]}
          />
        </div>

        <main className="flex-1 w-full px-6 lg:px-8 py-6 pb-16">
          {/* Header & Metrics Dashboard */}
          <div className="bg-white border border-[#EDE5DF] rounded-3xl shadow-xs mb-10 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-white outline outline-2 outline-primary-200 bg-neutral-100">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={userDisplayName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <UserIcon size={26} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0F172A] leading-tight tracking-tight truncate">
                      Welcome back, {userDisplayName}
                    </h1>
                    <p className="text-sm text-[#64748B] mt-1">
                      Track your learning milestones and resume where you left
                      off.
                    </p>
                  </div>
                </div>

                <Link
                  href="/courses"
                  className={`self-start md:self-auto rounded-xl ${focusRing}`}
                >
                  <Button variant="secondary" size="md" className="gap-2">
                    <SparklesIcon size={14} className="text-primary-500 shrink-0" />
                    <span>Explore catalog</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#EDE5DF] bg-[#FAF7F5]/60 divide-y sm:divide-y-0 sm:divide-x divide-[#EDE5DF]">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-center gap-4 px-6 sm:px-8 py-5">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${m.tone}`}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-sans text-[#0F172A] leading-none tabular-nums">
                      {m.value}{" "}
                      <span className="text-sm font-normal text-[#64748B]">
                        {m.unit}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#64748B] mt-1.5">
                      {m.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: In Progress Courses */}
          {featured && (
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-6 rounded-full bg-primary-500" />
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">
                  Continue learning
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {inProgressCourses.length} active
                </span>
              </div>

              {/* Featured: last course you touched */}
              {(() => {
                const {
                  course,
                  percent,
                  completedCount,
                  totalLessons,
                  resumeInfo,
                } = featured;
                const resumeHref = getResumeHref(course, resumeInfo);
                const resumeTimestamp = resumeInfo?.lastPositionSeconds || 0;
                const lessonsLeft = totalLessons - completedCount;

                return (
                  <div className="relative bg-gradient-to-br from-primary-50/70 via-white to-white border border-[#EDE5DF] rounded-3xl p-6 sm:p-8 shadow-xs mb-6 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500" />

                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-5">
                          <CourseIcon
                            slug={course.slug ?? "course"}
                            title={course.title ?? "Course"}
                            coverImage={course.coverImage}
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-neutral-500 mb-1">
                              Last active course &middot;{" "}
                              {course.category?.title ?? "Engineering"} &middot;{" "}
                              {course.level ?? "All levels"}
                            </p>
                            <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 leading-snug">
                              <Link
                                href={`/courses/${course.slug}`}
                                className={`hover:text-primary-600 transition-colors rounded ${focusRing}`}
                              >
                                {course.title}
                              </Link>
                            </h3>
                          </div>
                        </div>

                        <div className="max-w-[560px]">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-sm font-semibold text-neutral-800">
                              {percent}% complete
                            </span>
                            <span className="text-xs text-neutral-500 tabular-nums">
                              {completedCount} of {totalLessons} lessons
                              {lessonsLeft > 0 ? ` · ${lessonsLeft} left` : ""}
                            </span>
                          </div>
                          <ProgressBar value={percent} showLabel={false} />
                        </div>
                      </div>

                      <div className="lg:w-[300px] shrink-0 flex flex-col gap-4">
                        {resumeInfo?.lastLessonTitle && (
                          <div className="rounded-2xl bg-white border border-[#EDE5DF] p-4">
                            <p className="text-xs text-neutral-500 mb-1">
                              Where you stopped
                            </p>
                            <p className="text-sm font-semibold text-neutral-900 line-clamp-2">
                              {resumeInfo.lastLessonTitle}
                            </p>
                            {resumeTimestamp > 0 && (
                              <p className="text-xs text-primary-600 font-medium mt-1 tabular-nums">
                                Resume at {formatTimestamp(resumeTimestamp)}
                              </p>
                            )}
                          </div>
                        )}
                        <Link
                          href={resumeHref}
                          className={`rounded-xl ${focusRing}`}
                        >
                          <Button size="lg" className="w-full gap-2 shadow-sm">
                            <PlayCircleIcon size={16} className="shrink-0" />
                            <span>Resume lesson</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Other in-progress courses */}
              {otherInProgress.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherInProgress.map(
                    ({
                      course,
                      percent,
                      completedCount,
                      totalLessons,
                      resumeInfo,
                    }) => {
                      const resumeHref = getResumeHref(course, resumeInfo);

                      return (
                        <div
                          key={course._id}
                          className="group bg-white border border-[#EDE5DF] rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-primary-200 transition-all duration-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-4 mb-5">
                              <div className="flex items-center gap-3.5 min-w-0">
                                <CourseIcon
                                  slug={course.slug ?? "course"}
                                  title={course.title ?? "Course"}
                                  coverImage={course.coverImage}
                                />

                                <div className="min-w-0">
                                  <h3 className="font-serif font-bold text-lg text-neutral-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                    <Link
                                      href={`/courses/${course.slug}`}
                                      className={`rounded ${focusRing}`}
                                    >
                                      {course.title}
                                    </Link>
                                  </h3>
                                  <p className="text-xs text-neutral-500 mt-0.5">
                                    {course.category?.title ?? "Engineering"}{" "}
                                    &middot; {course.level ?? "All levels"}
                                  </p>
                                </div>
                              </div>

                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 shrink-0 tabular-nums">
                                {percent}%
                              </span>
                            </div>

                            {/* Progress Track */}
                            <div className="mb-5">
                              <ProgressBar value={percent} showLabel={false} />
                              <p className="text-xs text-neutral-500 mt-2 tabular-nums">
                                {completedCount} of {totalLessons} lessons
                                completed
                              </p>
                            </div>

                            {resumeInfo?.lastLessonTitle && (
                              <div className="flex items-center gap-2.5 rounded-xl bg-[#FAF7F5] border border-[#EDE5DF] px-3.5 py-2.5 mb-5">
                                <PlayCircleIcon
                                  size={16}
                                  className="text-primary-500 shrink-0"
                                />
                                <p className="text-xs text-neutral-600 truncate">
                                  <span className="text-neutral-400">
                                    Up next:{" "}
                                  </span>
                                  {resumeInfo.lastLessonTitle}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Resume CTA */}
                          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-3">
                            <Link
                              href={`/courses/${course.slug}`}
                              className={`text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors rounded ${focusRing}`}
                            >
                              Course details
                            </Link>
                            <Link
                              href={resumeHref}
                              className={`rounded-xl ${focusRing}`}
                            >
                              <Button size="md" className="gap-2">
                                <PlayCircleIcon size={14} className="shrink-0" />
                                <span>Resume lesson</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          )}

          {/* Section 2: Completed Courses */}
          {completedCourses.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-6 rounded-full bg-emerald-500" />
                <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">
                  Completed courses
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {completedCourses.length} finished
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map(({ course, totalLessons }) => (
                  <div
                    key={course._id}
                    className="group relative bg-white border border-[#EDE5DF] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex items-center justify-between gap-4 overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />

                    <div className="flex items-center gap-4 min-w-0 pl-1">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircleIcon size={24} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-base text-neutral-900 truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {totalLessons} lessons completed &middot; 100%
                          finished
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className={`rounded-xl shrink-0 ${focusRing}`}
                    >
                      <Button
                        variant="secondary"
                        size="md"
                        className="gap-1.5"
                      >
                        <span>Review</span>
                        <ChevronRightIcon
                          size={12}
                          className="shrink-0 transition-transform group-hover:translate-x-0.5"
                        />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: Empty State (Learner has started 0 courses) */}
          {inProgressCourses.length === 0 && completedCourses.length === 0 && (
            <div className="bg-white border border-[#EDE5DF] rounded-3xl p-10 sm:p-14 text-center shadow-xs max-w-xl mx-auto my-8">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-2xl bg-primary-100/60 rotate-6" />
                <div className="relative w-full h-full rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 flex items-center justify-center">
                  <BookOpenIcon size={30} />
                </div>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-neutral-900 mb-2">
                You haven&apos;t started any courses yet
              </h3>
              <p className="text-neutral-500 text-sm mb-7 leading-relaxed max-w-sm mx-auto">
                Explore our catalog of in-depth engineering courses and begin
                your learning journey today.
              </p>
              <Link
                href="/courses"
                className={`inline-block rounded-xl ${focusRing}`}
              >
                <Button size="md" className="gap-2">
                  <SparklesIcon size={14} className="shrink-0" />
                  <span>Browse all courses</span>
                </Button>
              </Link>
            </div>
          )}
        </main>

        {/* Signature Bottom Equalizer Graphic */}
        <BottomBars />
      </div>
    </div>
  );
}