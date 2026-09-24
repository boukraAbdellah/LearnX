import React from "react";
import Image from "next/image";
import { Badge } from "./badge";
import {
  BarChartIcon,
  ClockIcon,
  PlayCircleIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "./icons";

export interface CourseCardProps {
  title: string;
  description: string;
  level: string;
  duration: string;
  modulesCount: number;
  icon?: React.ReactNode;
  coverImage?: string | null;
  popular?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CourseCard({
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "18h 24m",
  modulesCount = 12,
  icon,
  coverImage,
  popular,
  className = "",
  onClick,
}: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#EDE5DF] rounded-[16px] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group ${className}`}
    >
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          {coverImage ? (
            <div className="w-11 h-11 rounded-[10px] overflow-hidden border border-[#EDE5DF] relative shrink-0 shadow-2xs">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="44px"
              />
            </div>
          ) : icon ? (
            icon
          ) : (
            <div className="w-11 h-11 rounded-[10px] bg-black text-white flex items-center justify-center font-bold text-[19px]">
              N
            </div>
          )}
          {popular && (
            <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide uppercase bg-[#EEF2FF] text-[#4338CA] border border-[#A5B4FC]/60">
              Popular
            </span>
          )}
        </div>
        <h3 className="font-serif font-bold text-[17px] text-[#0F172A] leading-snug mb-2 group-hover:text-[#4F46E5] transition-colors">
          {title}
        </h3>
        <p className="text-[#64748B] text-[13.5px] leading-relaxed line-clamp-3 mb-5">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between text-[11.5px] sm:text-[12px] text-[#64748B] pt-3.5 sm:pt-4 border-t border-[#F1F5F9] whitespace-nowrap gap-1">
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <BarChartIcon size={13.5} className="text-[#94A3B8] shrink-0" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <ClockIcon size={13.5} className="text-[#94A3B8] shrink-0" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <FileTextIcon size={13.5} className="text-[#94A3B8] shrink-0" />
          <span>{modulesCount} modules</span>
        </div>
      </div>
    </div>
  );
}

export interface LessonVideoCardProps {
  title: string;
  description: string;
  lessonNumber: string;
  timestamp: string;
  className?: string;
  onWatch?: () => void;
}

export function LessonVideoCard({
  title = "Data Fetching in Server Components",
  description = "Learn how to fetch data on the server using async/await and Next.js best practices.",
  lessonNumber = "Lesson 5.1",
  timestamp = "12:45",
  className = "",
  onWatch,
}: LessonVideoCardProps) {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="mb-2.5">
          <Badge variant="video">VIDEO</Badge>
        </div>
        <h3 className="font-semibold text-[16px] text-[#0F172A] leading-tight mb-1.5">
          {title}
        </h3>
        <p className="text-[#64748B] text-[13px] leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px] gap-2">
        <span className="text-[#64748B] whitespace-nowrap shrink-0">
          {lessonNumber} • {timestamp}
        </span>
        <button
          type="button"
          onClick={onWatch}
          className="inline-flex items-center gap-1.5 text-[#4F46E5] font-medium hover:text-[#4338CA] cursor-pointer text-[13px] transition-colors whitespace-nowrap shrink-0"
        >
          <PlayCircleIcon size={16} className="shrink-0" />
          <span>Watch from {timestamp}</span>
        </button>
      </div>
    </div>
  );
}

export interface LessonTopicCardProps {
  title: string;
  description: string;
  moduleLabel: string;
  className?: string;
  onView?: () => void;
}

export function LessonTopicCard({
  title = "Data Fetching & Caching",
  description = "Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance.",
  moduleLabel = "Module 5",
  className = "",
  onView,
}: LessonTopicCardProps) {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="mb-2.5">
          <Badge variant="lesson">LESSON</Badge>
        </div>
        <h3 className="font-semibold text-[16px] text-[#0F172A] leading-tight mb-1.5">
          {title}
        </h3>
        <p className="text-[#64748B] text-[13px] leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px] gap-2">
        <span className="text-[#64748B] whitespace-nowrap shrink-0">{moduleLabel}</span>
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 text-[#4F46E5] font-medium hover:text-[#4338CA] cursor-pointer text-[13px] transition-colors whitespace-nowrap shrink-0"
        >
          <span>View lesson</span>
          <ExternalLinkIcon size={14} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}

export interface ResourceCardProps {
  title: string;
  description: string;
  format: string;
  fileSize: string;
  className?: string;
  onDownload?: () => void;
}

export function ResourceCard({
  title = "Caching and Revalidation Guide",
  description = "Deep dive into Next.js caching strategies.",
  format = "PDF",
  fileSize = "1.2 MB",
  className = "",
  onDownload,
}: ResourceCardProps) {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="w-9 h-9 rounded-[8px] bg-[#F1F5F9] text-[#64748B] flex items-center justify-center mb-3">
          <FileTextIcon size={20} />
        </div>
        <h3 className="font-semibold text-[16px] text-[#0F172A] leading-tight mb-1.5">
          {title}
        </h3>
        <p className="text-[#64748B] text-[13px] leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px] gap-2">
        <span className="text-[#64748B] whitespace-nowrap shrink-0">
          {format} • {fileSize}
        </span>
        <button
          type="button"
          onClick={onDownload}
          className="text-[#4F46E5] hover:text-[#4338CA] cursor-pointer p-1 transition-colors shrink-0"
          aria-label="Download resource"
        >
          <ExternalLinkIcon size={16} />
        </button>
      </div>
    </div>
  );
}
