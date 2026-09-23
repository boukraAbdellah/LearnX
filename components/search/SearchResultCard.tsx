"use client";

import React from "react";
import Link from "next/link";
import type { SearchResultItem, VideoSearchResult, LessonSearchResult } from "./types";
import { CourseIcon } from "@/components/home/CourseIcon";

interface SearchResultCardProps {
  result: SearchResultItem;
}

function getYouTubeThumbnail(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  if (result.type === "video") {
    return <VideoResultCard result={result} />;
  }
  return <LessonResultCard result={result} />;
}

function VideoResultCard({ result }: { result: VideoSearchResult }) {
  const thumbnail = result.thumbnailUrl || getYouTubeThumbnail(result.thumbnailUrl || undefined);

  return (
    <article className="w-full bg-white border border-[#E2E8F0] rounded-[18px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center">
        {/* Video Thumbnail Section */}
        <Link
          href={`/lessons/${result.lessonSlug}?start=${result.startSeconds}`}
          className="w-full md:w-[240px] lg:w-[260px] aspect-[16/10] shrink-0 rounded-[12px] overflow-hidden relative bg-[#0F172A] group cursor-pointer block border border-[#0F172A]/10 shadow-2xs"
          aria-label={`Watch ${result.title} from ${result.timestampLabel}`}
        >
          {thumbnail ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnail}
              alt={result.title}
              className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#1E293B] to-[#0F172A]">
              <div className="text-white/40 font-mono text-sm">LearnX Video</div>
            </div>
          )}

          {/* Central Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-black/80 transition-all duration-200 shadow-md">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="translate-x-0.5"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>

          {/* Timestamp / Duration Badge in bottom-right */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[5px] bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium tracking-wide">
            {result.timestampLabel || "00:00"}
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* Header: Course + Badge */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center scale-75 origin-left">
                  <CourseIcon slug={result.courseSlug} title={result.courseTitle} />
                </div>
                <span className="text-[13.5px] font-medium text-[#475569] truncate">
                  {result.courseTitle}
                </span>
              </div>
              <span className="shrink-0 text-[10.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/60">
                VIDEO
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#0F172A] leading-snug mb-1.5 hover:text-[#4F46E5] transition-colors">
              <Link href={`/lessons/${result.lessonSlug}?start=${result.startSeconds}`}>
                {result.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="text-[13.5px] sm:text-[14px] text-[#64748B] leading-relaxed line-clamp-2 mb-3">
              {result.description}
            </p>
          </div>

          {/* Footer Metadata & Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[12.5px] text-[#64748B] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>{result.lessonNumber}</span>
              <span className="text-[#CBD5E1]">·</span>
              <span className="flex items-center gap-1 text-[#64748B]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                {result.moduleTitle}
              </span>
            </div>

            <Link
              href={`/lessons/${result.lessonSlug}?start=${result.startSeconds}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA] group/btn transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#4F46E5]">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>Watch from {result.timestampLabel}</span>
              <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function LessonResultCard({ result }: { result: LessonSearchResult }) {
  return (
    <article className="w-full bg-white border border-[#E2E8F0] rounded-[18px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center">
        {/* Left Side: Structured Key Points Box */}
        <div className="w-full md:w-[240px] lg:w-[260px] min-h-[140px] shrink-0 rounded-[12px] bg-[#FAF8F5] border border-[#EFE9E4] p-4 flex flex-col justify-between relative shadow-2xs">
          <div>
            <div className="mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <ul className="space-y-1.5 text-[12px] text-[#475569] leading-tight">
              {result.keyPoints && result.keyPoints.length > 0 ? (
                result.keyPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="flex items-start gap-1.5">
                    <span className="text-[#94A3B8] select-none shrink-0">•</span>
                    <span className="line-clamp-1">{point}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-1.5">
                  <span className="text-[#94A3B8] select-none shrink-0">•</span>
                  <span className="line-clamp-1">In-depth lesson concepts</span>
                </li>
              )}
            </ul>
          </div>

          <div className="self-end mt-2">
            <div className="w-5 h-5 rounded-full bg-[#475569] text-white flex items-center justify-center shadow-2xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            {/* Header: Course + Badge */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center scale-75 origin-left">
                  <CourseIcon slug={result.courseSlug} title={result.courseTitle} />
                </div>
                <span className="text-[13.5px] font-medium text-[#475569] truncate">
                  {result.courseTitle}
                </span>
              </div>
              <span className="shrink-0 text-[10.5px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/60">
                LESSON
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#0F172A] leading-snug mb-1.5 hover:text-[#4F46E5] transition-colors">
              <Link href={`/lessons/${result.lessonSlug}`}>
                {result.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="text-[13.5px] sm:text-[14px] text-[#64748B] leading-relaxed line-clamp-2 mb-3">
              {result.description}
            </p>
          </div>

          {/* Footer Metadata & Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
            <div className="text-[12.5px] text-[#64748B] font-medium">
              Module {result.moduleNumber}
            </div>

            <Link
              href={`/lessons/${result.lessonSlug}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F46E5] hover:text-[#4338CA] group/btn transition-colors"
            >
              <span>View lesson</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#4F46E5]">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
