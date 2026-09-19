"use client";

import React from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/progress-bar";

interface CourseProgressBarProps {
  /** 0–100 */
  progress: number;
  continuePath: string;
}

export function CourseProgressBar({
  progress,
  continuePath,
}: CourseProgressBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 border-t border-[#EDE5DF] bg-white/95 backdrop-blur-md shadow-[0_-4px_16px_-2px_rgba(15,23,42,0.06)]">
      <div className="max-w-[1024px] mx-auto px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Progress label + bar */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider">
            Your Progress
          </span>
          <ProgressBar
            value={progress}
            showLabel={true}
            className="min-w-[160px] max-w-[240px]"
          />
        </div>

        {/* CTA */}
        <Link
          href={continuePath}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-medium text-sm shadow-sm hover:shadow transition-all duration-200 group"
        >
          <span>Continue Learning</span>
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
  );
}
