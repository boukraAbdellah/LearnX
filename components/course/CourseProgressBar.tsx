"use client";

import React from "react";
import Link from "next/link";

interface CourseProgressBarProps {
  /** 0–100 */
  progress: number;
  continuePath: string;
  totalLessons?: number;
  completedLessons?: number;
}

export function CourseProgressBar({
  progress,
  continuePath,
  totalLessons,
  completedLessons,
}: CourseProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const completed =
    completedLessons !== undefined
      ? completedLessons
      : totalLessons !== undefined
      ? Math.round((clampedProgress / 100) * totalLessons)
      : null;

  return (
    <div className="sticky bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 sm:px-6 w-full max-w-[1024px] mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04] rounded-2xl p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all duration-300">
        {/* Left Section: Icon + Metric + Progress Bar */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {/* Progress Icon Badge */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-xs">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>

          {/* Progress Details & Bar */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-semibold text-neutral-900 tracking-tight">
                  Your Progress
                </span>
                {completed !== null && totalLessons !== undefined && (
                  <span className="text-[11px] text-neutral-500 font-medium truncate">
                    • {completed} of {totalLessons} lessons completed
                  </span>
                )}
              </div>
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50 tabular-nums">
                {clampedProgress}% Complete
              </span>
            </div>

            {/* Custom Sleek Gradient Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 relative">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                style={{ width: `${clampedProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Action CTA Button */}
        <div className="shrink-0 flex items-center justify-end sm:justify-center">
          <Link
            href={continuePath}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white font-medium text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 transition-all duration-200 group"
          >
            <span>{clampedProgress > 0 ? "Continue Learning" : "Start Course"}</span>
            <svg
              width="14"
              height="14"
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
        </div>
      </div>
    </div>
  );
}
