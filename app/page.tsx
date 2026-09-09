"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navigation,
  CourseCard,
  SearchIcon,
  StarIcon,
  BottomBars,
} from "@/components/ui";

export default function HomePage() {
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
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
              Vertex understands what you want to learn and
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
          </section>

          {/* Section Divider Line */}
          <div className="w-full h-px bg-[#EDE5DF]" />

          {/* All Courses Section */}
          <section className="pt-10 pb-8 px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-serif font-bold text-[24px] md:text-[26px] text-[#0F172A] tracking-tight">
                All Courses
              </h2>
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

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Course 1: Next.js */}
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="18h 24m"
                modulesCount={12}
                icon={
                  <div className="w-11 h-11 rounded-[10px] bg-black text-white flex items-center justify-center font-bold text-[19px] select-none">
                    N
                  </div>
                }
                onClick={() => {
                  router.push("/courses/nextjs-for-production");
                }}
              />

              {/* Course 2: Docker Essentials */}
              <CourseCard
                title="Docker Essentials"
                description="Containerize applications and streamline your development workflow."
                level="Beginner"
                duration="10h 12m"
                modulesCount={8}
                icon={
                  <div className="w-12 h-11 flex items-center justify-center">
                    <Image
                      src="/docker-icon.png"
                      alt="Docker whale icon"
                      width={52}
                      height={42}
                      className="object-contain"
                    />
                  </div>
                }
                onClick={() => {
                  router.push("/courses/docker-essentials");
                }}
              />

              {/* Course 3: TypeScript Deep Dive */}
              <CourseCard
                title="TypeScript Deep Dive"
                description="Go beyond the basics and write safer, more expressive code."
                level="Intermediate"
                duration="14h 36m"
                modulesCount={10}
                icon={
                  <div className="w-11 h-11 rounded-[10px] bg-[#3178C6] text-white flex items-center justify-center font-bold text-[17px] tracking-tight select-none">
                    TS
                  </div>
                }
                onClick={() => {
                  router.push("/courses/typescript-deep-dive");
                }}
              />
            </div>

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
