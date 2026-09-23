import React from "react";
import Link from "next/link";

export function SearchBrowseCallout() {
  return (
    <aside className="w-full bg-[#FAF8F5] border border-[#EDE5DF] rounded-[18px] p-5 sm:p-6 mt-10 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] flex items-center justify-center shrink-0 shadow-2xs">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[15px] sm:text-[16px] text-[#0F172A] leading-snug">
              Can’t find what you’re looking for?
            </h4>
            <p className="text-[13.5px] text-[#64748B] mt-0.5">
              Try different keywords or browse our full course catalog.
            </p>
          </div>
        </div>

        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[13.5px] font-semibold text-[#0F172A] hover:text-[#4F46E5] hover:border-[#C7D2FE] shadow-2xs hover:shadow-xs transition-all shrink-0 self-stretch sm:self-auto justify-center"
        >
          <span>Browse all courses</span>
          <span>→</span>
        </Link>
      </div>
    </aside>
  );
}
