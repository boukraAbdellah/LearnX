"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

export interface NavLessonTarget {
  title: string;
  slug: string;
  duration?: number | null;
}

interface LessonBottomNavProps {
  previousLesson?: NavLessonTarget | null;
  nextLesson?: NavLessonTarget | null;
  courseSlug: string;
}

/** Format seconds to "1h 24m" or "45m" */
function fmtSec(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function LessonBottomNav({
  previousLesson,
  nextLesson,
  courseSlug,
}: LessonBottomNavProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="w-full pt-8 pb-12 mt-12 border-t border-[#EDE5DF] flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      {/* Previous Lesson Link */}
      <div className="w-full sm:w-auto flex items-center justify-start">
        {previousLesson ? (
          <Link
            href={`/lessons/${previousLesson.slug}`}
            className="flex items-center gap-3.5 group text-left"
          >
            <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-white group-hover:border-primary-300 group-hover:bg-primary-50/50 flex items-center justify-center text-neutral-600 group-hover:text-primary-600 transition-all shrink-0 shadow-2xs">
              <ChevronLeftIcon
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Previous Lesson
              </span>
              <span className="font-semibold text-sm text-neutral-800 group-hover:text-primary-600 transition-colors truncate block max-w-[200px] sm:max-w-[240px]">
                {previousLesson.title}
              </span>
              {previousLesson.duration && (
                <span className="text-xs text-neutral-400 block">
                  {fmtSec(previousLesson.duration)}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeftIcon size={14} />
            <span>Course Overview</span>
          </Link>
        )}
      </div>

      {/* Next Lesson Link */}
      <div className="w-full sm:w-auto flex items-center justify-end">
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="flex items-center gap-3.5 group text-right ml-auto"
          >
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Next Lesson
              </span>
              <span className="font-semibold text-sm text-neutral-800 group-hover:text-primary-600 transition-colors truncate block max-w-[200px] sm:max-w-[240px]">
                {nextLesson.title}
              </span>
              {nextLesson.duration && (
                <span className="text-xs text-neutral-400 block">
                  {fmtSec(nextLesson.duration)}
                </span>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-500 group-hover:bg-primary-600 active:bg-primary-700 flex items-center justify-center text-white transition-all shrink-0 shadow-xs group-hover:shadow-sm">
              <ChevronRightIcon
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </Link>
        ) : (
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Complete Course</span>
            <ChevronRightIcon size={14} />
          </Link>
        )}
      </div>
    </nav>
  );
}
