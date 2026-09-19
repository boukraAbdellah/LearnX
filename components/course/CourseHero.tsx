import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  BarChartIcon,
  ClockIcon,
  FileTextIcon,
  UserIcon,
  BookmarkIcon,
} from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export interface CourseHeroProps {
  slug: string;
  title: string | null;
  summary: string | null;
  coverImage?: SanityImageSource | null;
  level: string | null;
  isPopular: boolean;
  studentCount: number | null;
  moduleCount: number;
  lessonCount?: number;
  totalDuration?: string | null;
  firstLessonSlug?: string | null;
  category?: { title?: string | null; slug?: string | null } | null;
  instructor?: { name?: string | null; photo?: SanityImageSource | null } | null;
  price?: number | null;
}

export function CourseHero({
  slug,
  title,
  summary,
  coverImage,
  level,
  isPopular,
  studentCount,
  moduleCount,
  lessonCount = 0,
  totalDuration,
  firstLessonSlug,
  category,
  instructor,
  price,
}: CourseHeroProps) {
  const continuePath = firstLessonSlug
    ? `/lessons/${firstLessonSlug}`
    : `/courses/${slug}`;

  const coverSrc = coverImage
    ? urlFor(coverImage).width(640).height(480).fit("crop").url()
    : null;

  const instructorPhoto = instructor?.photo
    ? urlFor(instructor.photo).width(48).height(48).fit("crop").url()
    : null;

  return (
    <section className="px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 lg:gap-10 items-start">
      {/* Course Cover Image */}
      <div className="w-full md:w-[300px] shrink-0 rounded-2xl overflow-hidden border border-[#EDE5DF] bg-neutral-900 aspect-[4/3] relative shadow-xs">
        {coverSrc ? (
          <Image
            src={coverSrc}
            alt={title ?? "Course cover"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-serif font-bold text-6xl select-none">
            {title?.[0] ?? "C"}
          </div>
        )}

        {/* Free preview or price overlay if available */}
        {price != null && price > 0 ? (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-900 font-bold text-xs shadow-sm">
            ${price}
          </div>
        ) : null}
      </div>

      {/* Main Metadata Column */}
      <div className="flex-1 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {category?.title && (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary-50 border border-primary-200/80 text-primary-600">
              {category.title}
            </span>
          )}
          {isPopular && (
            <Badge variant="popular">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Popular
              </span>
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-[1.18] mb-3">
          {title}
        </h1>

        {/* Summary */}
        {summary && (
          <p className="font-sans text-neutral-600 text-[15px] sm:text-base leading-relaxed mb-4 max-w-2xl">
            {summary}
          </p>
        )}

        {/* Instructor Byline */}
        {instructor?.name && (
          <div className="flex items-center gap-2.5 mb-5 text-sm text-neutral-600">
            {instructorPhoto ? (
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                <Image
                  src={instructorPhoto}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-[10px]">
                {instructor.name[0]}
              </div>
            )}
            <span>
              Taught by{" "}
              <span className="text-neutral-900 font-medium">
                {instructor.name}
              </span>
            </span>
          </div>
        )}

        {/* Real Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-neutral-500 mb-6">
          {level && (
            <span className="flex items-center gap-1.5">
              <BarChartIcon size={14} className="text-neutral-400" />
              <span className="capitalize">{level}</span>
            </span>
          )}
          {totalDuration && (
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} className="text-neutral-400" />
              <span>{totalDuration}</span>
            </span>
          )}
          {moduleCount > 0 && (
            <span className="flex items-center gap-1.5">
              <FileTextIcon size={14} className="text-neutral-400" />
              <span>
                {moduleCount} {moduleCount === 1 ? "module" : "modules"}
                {lessonCount > 0 && ` (${lessonCount} lessons)`}
              </span>
            </span>
          )}
          {studentCount != null && studentCount > 0 && (
            <span className="flex items-center gap-1.5">
              <UserIcon size={14} className="text-neutral-400" />
              <span>
                {studentCount >= 1000
                  ? `${(studentCount / 1000).toFixed(1)}k students`
                  : `${studentCount} students`}
              </span>
            </span>
          )}
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={continuePath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium text-[15px] shadow-sm hover:shadow transition-all duration-200 group"
          >
            <span>Continue Learning</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 bg-white text-neutral-700 font-medium text-[15px] hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-150 shadow-2xs cursor-pointer"
          >
            <BookmarkIcon size={16} />
            <span>Bookmark</span>
          </button>
        </div>
      </div>
    </section>
  );
}
