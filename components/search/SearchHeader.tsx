"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  query: string;
  totalResults: number;
  totalCourses: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onSearchSubmit?: (newQuery: string) => void;
}

export function SearchHeader({
  query,
  totalResults,
  totalCourses,
  sortBy,
  onSortChange,
  onSearchSubmit,
}: SearchHeaderProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setInputValue(query);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && trimmed !== query) {
      if (onSearchSubmit) {
        onSearchSubmit(trimmed);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  return (
    <div className="w-full text-center max-w-[840px] mx-auto mb-8 sm:mb-10">
      {/* Search Results Pill */}
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] text-[11px] font-bold tracking-widest uppercase mb-4 shadow-2xs">
        SEARCH RESULTS
      </div>

      {/* Main Title */}
      <h1 className="font-serif text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-[#0F172A] tracking-tight leading-tight mb-2">
        Results for <span className="text-[#4F46E5]">“{query || "..."}”</span>
      </h1>

      {/* Result Count Subtitle */}
      <p className="text-[15px] sm:text-[16px] text-[#64748B] font-normal mb-8">
        Found {totalResults} result{totalResults === 1 ? "" : "s"} across {totalCourses} course{totalCourses === 1 ? "" : "s"}
      </p>

      {/* Search Input Bar */}
      <div className="w-full max-w-[680px] mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full relative flex items-center bg-white border border-[#E2E8F0] rounded-[16px] px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#CBD5E1] focus-within:border-[#4F46E5] focus-within:ring-3 focus-within:ring-[#4F46E5]/15 transition-all duration-200 cursor-text"
          onClick={() => searchInputRef.current?.focus()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#94A3B8] shrink-0 mr-3"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search topics, lessons, or video moments..."
            className="w-full bg-transparent text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
            aria-label="Search query"
          />
          <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-[11.5px] font-medium tracking-tight shadow-2xs select-none ml-2 shrink-0">
            ⌘ K
          </kbd>
        </form>
      </div>

      {/* Results Count & Sort Controls Bar */}
      <div className="flex items-center justify-between mt-8 pt-4 border-b border-[#EDE5DF]/80">
        <span className="text-[15px] font-semibold text-[#0F172A]">
          {totalResults} results
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="search-sort" className="sr-only">
            Sort results by
          </label>
          <div className="relative">
            <select
              id="search-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-transparent hover:bg-black/5 text-[14px] font-medium text-[#0F172A] pr-7 pl-3 py-1.5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
            >
              <option value="relevant">Most Relevant</option>
              <option value="duration-asc">Shortest Duration</option>
              <option value="duration-desc">Longest Duration</option>
              <option value="title">Alphabetical</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-[#64748B]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
