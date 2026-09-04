import React from "react";
import { Badge } from "./badge";
import {
  BarChartIcon,
  ClockIcon,
  BookmarkIcon,
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
  className?: string;
  onClick?: () => void;
}

export function CourseCard({
  title = "Next.js for Production",
  description = "Build scalable, high-performance web applications with Next.js.",
  level = "Intermediate",
  duration = "16h 24m",
  modulesCount = 12,
  icon,
  className = "",
  onClick,
}: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-[16px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        <div className="w-10 h-10 rounded-[10px] bg-black text-white flex items-center justify-center font-bold text-[18px] mb-3">
          {icon ?? "N"}
        </div>
        <h3 className="font-semibold text-[16px] text-[#0F172A] leading-tight mb-1.5">
          {title}
        </h3>
        <p className="text-[#64748B] text-[13px] leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3 text-[12px] text-[#64748B] pt-3 border-t border-[#F1F5F9]">
        <div className="flex items-center gap-1.5">
          <BarChartIcon size={14} />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon size={14} />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookmarkIcon size={14} />
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
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px]">
        <span className="text-[#64748B]">
          {lessonNumber} • {timestamp}
        </span>
        <button
          type="button"
          onClick={onWatch}
          className="inline-flex items-center gap-1.5 text-[#F97316] font-medium hover:text-[#EA580C] cursor-pointer text-[13px] transition-colors"
        >
          <PlayCircleIcon size={16} />
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
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px]">
        <span className="text-[#64748B]">{moduleLabel}</span>
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 text-[#F97316] font-medium hover:text-[#EA580C] cursor-pointer text-[13px] transition-colors"
        >
          <span>View lesson</span>
          <ExternalLinkIcon size={14} />
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
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[12px]">
        <span className="text-[#64748B]">
          {format} • {fileSize}
        </span>
        <button
          type="button"
          onClick={onDownload}
          className="text-[#F97316] hover:text-[#EA580C] cursor-pointer p-1 transition-colors"
          aria-label="Download resource"
        >
          <ExternalLinkIcon size={16} />
        </button>
      </div>
    </div>
  );
}
