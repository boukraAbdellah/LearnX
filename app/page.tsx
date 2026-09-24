import React from "react";
import Link from "next/link";
import {
  Navigation,
  StarIcon,
  BottomBars,
} from "@/components/ui";
import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { PopularCoursesSlider, type PopularCourse } from "@/components/home/PopularCoursesSlider";
import { getCourses } from "@/sanity/lib/fetch";
import { getCourseCoverImageUrl } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

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
  popular: boolean;
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

export default async function HomePage() {
  const rawCourses = await getCourses();
  const allCourses = (rawCourses as CourseListing[] | null) ?? [];
  const popularCourses = allCourses.filter((course) => Boolean(course.popular));
  const courses = popularCourses.length > 0 ? popularCourses : allCourses;

  const sliderCourses: PopularCourse[] = courses.map((course) => ({
    _id: course._id,
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    level: course.level
      ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
      : "All Levels",
    duration: computeTotalDuration(course.modules) || "Self-paced",
    modulesCount: course.modulesCount ?? course.modules?.length ?? 0,
    coverImageUrl: getCourseCoverImageUrl(course.coverImage),
  }));

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
          <Navigation activeTab="courses" showActions={true} avatarSrc="/avatar.png" />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="pt-16 pb-14 md:pt-20 md:pb-16 px-6 md:px-12 flex flex-col items-center text-center">
            {/* Intelligent Learning Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#A5B4FC]/70 bg-[#EEF2FF] text-[#4338CA] text-[11px] font-semibold tracking-wider uppercase mb-7 shadow-2xs">
              INTELLIGENT LEARNING
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-bold text-[44px] md:text-[56px] text-[#0F172A] tracking-tight leading-[1.12] mb-5">
              Search your learning
              <br />
              in plain English.
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-[15px] md:text-[16.5px] text-[#64748B] leading-relaxed max-w-xl mx-auto mb-9 font-normal">
              LearnX understands what you want to learn and
              <br className="hidden sm:inline" />
              finds the exact lessons across all your courses.
            </p>

            {/* CTA Button */}
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] text-white font-medium text-[15px] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mb-12 group"
            >
              <span>Explore Courses</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            {/* Search Bar */}
            <HeroSearchBar />
          </section>

          {/* Section Divider Line */}
          <div className="w-full h-px bg-[#EDE5DF]" />

          {/* Popular Courses Section */}
          <section className="pt-10 pb-8 px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif font-bold text-[24px] md:text-[26px] text-[#0F172A] tracking-tight">
                  Popular Courses
                </h2>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#EEF2FF] text-[#4338CA] border border-[#A5B4FC]/60">
                  Featured
                </span>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors group"
              >
                <span>View all courses</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Popular Courses Slider (Without Arrows, Smooth Motion, Cover Images) */}
            <PopularCoursesSlider courses={sliderCourses} />

            {/* Weekly Updates Divider */}
            <div className="flex items-center justify-center gap-3.5 mt-14 mb-4">
              <div className="h-px bg-[#EDE5DF] flex-1 max-w-[140px] md:max-w-[180px]" />
              <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
                <StarIcon size={16} className="text-[#4F46E5]" />
                <span>New courses and lessons added every week.</span>
              </div>
              <div className="h-px bg-[#EDE5DF] flex-1 max-w-[140px] md:max-w-[180px]" />
            </div>
          </section>
        </main>

        {/* Signature Bottom Equalizer Graphic (Deep Indigo CSS/SVG) */}
        <BottomBars />
      </div>
    </div>
  );
}
