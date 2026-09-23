"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui";

export function HeroSearchBar() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-[620px] mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className="w-full relative flex items-center bg-white border border-[#E2E8F0] rounded-[14px] px-4 py-3 shadow-xs hover:border-[#CBD5E1] focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all duration-150 cursor-text"
        onClick={() => searchInputRef.current?.focus()}
      >
        <SearchIcon size={19} className="text-[#94A3B8] shrink-0 mr-3" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask anything about your learning..."
          className="w-full bg-transparent text-[14.5px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
          aria-label="Ask anything about your learning"
        />
        <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-[11.5px] font-medium tracking-tight shadow-2xs select-none ml-2">
          ⌘ K
        </kbd>
      </form>
    </div>
  );
}
