"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClockIcon,
  BarChartIcon,
  UserIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  ChevronRightIcon,
} from "@/components/ui/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LessonHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  lessonNumberLabel?: string; // e.g. "LESSON 5.1"
  title: string;
  summary?: string | null;
  duration?: number | null;
  level?: string | null;
  studentCount?: number | null;
}

/** Format seconds to human-readable string: e.g. "1h 28m" or "45m" */
function formatDuration(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function LessonHeader({
  breadcrumbs,
  lessonNumberLabel,
  title,
  summary,
  duration,
  level,
  studentCount,
}: LessonHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const formattedDuration = formatDuration(duration);
  const formattedStudents =
    typeof studentCount === "number" && studentCount > 0
      ? studentCount.toLocaleString()
      : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 font-medium">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRightIcon size={12} className="text-neutral-400 shrink-0 mx-0.5" />
              )}
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="hover:text-primary-600 transition-colors truncate max-w-[180px] sm:max-w-none"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={`truncate max-w-[200px] sm:max-w-none ${
                    isLast ? "text-neutral-800 font-semibold" : ""
                  }`}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Lesson Badge & Title Row */}
      <div className="flex flex-col gap-2">
        {lessonNumberLabel && (
          <div className="self-start">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 border border-primary-200/80 px-2.5 py-0.5 rounded-md">
              {lessonNumberLabel}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-neutral-900 tracking-tight leading-tight">
            {title}
          </h1>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark lesson"}
            className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
              isBookmarked
                ? "border-primary-500 bg-primary-50 text-primary-600 shadow-2xs"
                : "border-neutral-200 bg-white text-neutral-400 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {isBookmarked ? (
              <BookmarkFilledIcon size={18} className="text-primary-600" />
            ) : (
              <BookmarkIcon size={18} />
            )}
          </button>
        </div>

        {summary && (
          <p className="text-base text-neutral-600 font-sans leading-relaxed mt-1">
            {summary}
          </p>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-xs text-neutral-500 font-medium pt-1 pb-2">
        {formattedDuration && (
          <div className="flex items-center gap-1.5">
            <ClockIcon size={15} className="text-neutral-400" />
            <span>{formattedDuration}</span>
          </div>
        )}

        {level && (
          <div className="flex items-center gap-1.5 capitalize">
            <BarChartIcon size={15} className="text-neutral-400" />
            <span>{level}</span>
          </div>
        )}

        {formattedStudents && (
          <div className="flex items-center gap-1.5">
            <UserIcon size={15} className="text-neutral-400" />
            <span>{formattedStudents} students</span>
          </div>
        )}
      </div>
    </div>
  );
}
