import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Navigation,
  CourseCard,
  BottomBars,
} from "@/components/ui";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CourseIcon } from "@/components/home/CourseIcon";
import { getCourses } from "@/sanity/lib/fetch";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata: Metadata = {
  title: "All Courses — LearnX",
  description: "Browse our complete catalog of in-depth engineering courses.",
};

interface LessonSummary {
  _id: string;
  duration: number | null;
}

interface ModuleSummary {
  _key: string;
  title: string | null;
  lessons: LessonSummary[] | null;
}

interface CourseListing {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  coverImage?: SanityImageSource | null;
  level: string | null;
  price: number | null;
  isPopular: boolean;
  studentCount: number | null;
  modulesCount?: number | null;
  modules?: ModuleSummary[] | null;
}

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
function computeTotalDuration(modules: ModuleSummary[] | null | undefined): string {
  if (!modules) return "";
  const total = modules.reduce((acc, mod) => {
    return acc + (mod.lessons ?? []).reduce((a, l) => a + (l?.duration ?? 0), 0);
  }, 0);
  return formatSeconds(total);
}

export default async function AllCoursesPage() {
  const rawCourses = await getCourses();
  const courses = (rawCourses as CourseListing[] | null) ?? [];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-start relative"
      style={{
        backgroundColor: "#FAF7F5",
        backgroundImage: `repeating-linear-gradient(45deg, #F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px)`,
      }}
    >
      {/* Central Framed Layout matching vertex-home.png desktop view */}
      <div className="w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col justify-between relative">
        {/* Top Header Navigation */}
        <header className="w-full">
          <Navigation activeTab="courses" showActions={true} />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Breadcrumbs Navigation */}
          <div className="px-6 lg:px-8 pt-5 pb-2">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "All Courses" },
              ]}
            />
          </div>

          {/* Catalog Header */}
          <section className="px-6 lg:px-8 pt-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EDE5DF]">
              <div>
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight mb-2">
                  All Courses
                </h1>
                <p className="font-sans text-[15px] text-neutral-500 max-w-xl">
                  Explore our complete collection of practical, production-grade courses.
                </p>
              </div>

              <span className="self-start sm:self-auto text-xs font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200/80 px-3 py-1.5 rounded-full">
                {courses.length} {courses.length === 1 ? "course" : "courses"}
              </span>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="px-6 lg:px-8 pb-16 flex-1">
            {courses.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#EDE5DF] rounded-2xl p-8">
                <p className="text-neutral-500 text-sm">
                  No courses found in the catalog.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {courses.map((course) => {
                  const totalDuration =
                    computeTotalDuration(course.modules) || "Self-paced";
                  const modulesCount =
                    course.modulesCount ?? course.modules?.length ?? 0;
                  const formattedLevel = course.level
                    ? course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)
                    : "All Levels";

                  return (
                    <Link
                      key={course._id}
                      href={`/courses/${course.slug}`}
                      className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-[16px]"
                    >
                      <CourseCard
                        title={course.title ?? "Untitled Course"}
                        description={course.summary ?? ""}
                        level={formattedLevel}
                        duration={totalDuration}
                        modulesCount={modulesCount}
                        icon={
                          <CourseIcon
                            slug={course.slug ?? ""}
                            title={course.title ?? ""}
                            coverImage={course.coverImage}
                          />
                        }
                        className="h-full"
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        {/* Signature Bottom Equalizer Graphic */}
        <BottomBars />
      </div>
    </div>
  );
}
