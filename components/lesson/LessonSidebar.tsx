"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  PlayCircleFilledIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/icons";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

export interface SidebarLesson {
  _id: string;
  title: string | null;
  slug: string | null;
  duration?: number | null;
  isFreePreview?: boolean;
}

export interface SidebarModule {
  _key: string;
  title: string | null;
  summary?: string | null;
  lessons: SidebarLesson[] | null;
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  courseCoverImage?: SanityImageSource | null;
  currentLessonSlug: string;
  currentModuleKey?: string | null;
  modules: SidebarModule[];
  progressPercent?: number;
}

/** Format seconds to "1h 28m" or "45m" */
function fmtSec(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Compute module total seconds */
function computeModuleDuration(lessons: SidebarLesson[] | null): string {
  if (!lessons || lessons.length === 0) return "";
  const total = lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);
  return fmtSec(total);
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  courseCoverImage,
  currentLessonSlug,
  currentModuleKey,
  modules,
  progressPercent = 35,
}: LessonSidebarProps) {
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Expanded modules state: default open the active module
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    const keys = new Set<string>();
    if (currentModuleKey) {
      keys.add(currentModuleKey);
    } else if (modules.length > 0) {
      // Find module containing the current lesson
      const activeMod = modules.find((m) =>
        (m.lessons ?? []).some((l) => l.slug === currentLessonSlug)
      );
      if (activeMod) {
        keys.add(activeMod._key);
      } else {
        keys.add(modules[0]._key);
      }
    }
    return keys;
  });

  const activeModuleIndex = modules.findIndex((m) =>
    (m.lessons ?? []).some((l) => l.slug === currentLessonSlug)
  );

  function toggleModule(key: string) {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const coverUrl = courseCoverImage
    ? urlFor(courseCoverImage).width(96).height(96).url()
    : null;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Top Back Link */}
      <div className="px-5 py-4 border-b border-[#EDE5DF]/80">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-colors group"
        >
          <ChevronLeftIcon
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Back to course</span>
        </Link>
      </div>

      {/* Course Info Header */}
      <div className="p-5 border-b border-[#EDE5DF]/80 flex items-center gap-3.5 bg-neutral-50/40">
        <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={courseTitle}
              fill
              className="object-cover"
            />
          ) : (
            <span className="font-serif font-bold text-lg text-white">
              {courseTitle.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/courses/${courseSlug}`}
            className="font-sans font-semibold text-sm text-neutral-900 hover:text-primary-600 transition-colors line-clamp-1 block"
          >
            {courseTitle}
          </Link>
          <p className="text-xs text-neutral-500 mt-0.5 font-medium">
            {progressPercent}% complete
          </p>
        </div>
      </div>

      {/* Module Overview Counter */}
      <div className="px-5 py-3 border-b border-[#EDE5DF]/60 bg-neutral-50/70 flex items-center justify-between text-xs text-neutral-600 font-semibold">
        <span>
          Module {activeModuleIndex >= 0 ? activeModuleIndex + 1 : 1} of{" "}
          {modules.length}
        </span>
        <span className="text-[11px] text-neutral-400 font-normal">
          {modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0)}{" "}
          lessons
        </span>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#EDE5DF]/60">
        {modules.map((mod, modIdx) => {
          const isExpanded = expandedKeys.has(mod._key);
          const hasCurrentLesson = (mod.lessons ?? []).some(
            (l) => l.slug === currentLessonSlug
          );
          const moduleDuration = computeModuleDuration(mod.lessons);
          // Dummy logic: earlier modules are treated as completed for display
          const isCompleted =
            activeModuleIndex >= 0 && modIdx < activeModuleIndex;

          return (
            <div key={mod._key} className="bg-white">
              {/* Module Header Button */}
              <button
                type="button"
                onClick={() => toggleModule(mod._key)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors cursor-pointer ${
                  hasCurrentLesson
                    ? "bg-primary-50/30"
                    : "hover:bg-neutral-50/60"
                }`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Module Number Circle Badge */}
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 border ${
                      hasCurrentLesson
                        ? "bg-primary-500 text-white border-primary-600 shadow-2xs"
                        : isCompleted
                        ? "bg-primary-50 text-primary-700 border-primary-200"
                        : "bg-neutral-100 text-neutral-600 border-neutral-200"
                    }`}
                  >
                    {modIdx + 1}
                  </span>

                  {/* Module Title & Duration */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-medium truncate ${
                        hasCurrentLesson
                          ? "text-neutral-900 font-semibold"
                          : "text-neutral-700"
                      }`}
                    >
                      {mod.title}
                    </p>
                    {moduleDuration && (
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {moduleDuration}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Indicator or Chevron */}
                <div className="shrink-0 flex items-center gap-1.5 text-neutral-400">
                  {isCompleted ? (
                    <div className="text-primary-600">
                      <CheckCircleIcon size={16} />
                    </div>
                  ) : (
                    <ChevronDownIcon
                      size={14}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-neutral-700" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Sub-lessons list if expanded */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <ul className="divide-y divide-neutral-100 bg-[#FAF7F5]/50 border-t border-[#EDE5DF]/50">
                  {mod.lessons.map((lesson) => {
                    const isPlaying = lesson.slug === currentLessonSlug;
                    const href = lesson.slug
                      ? `/lessons/${lesson.slug}`
                      : `/courses/${courseSlug}`;

                    return (
                      <li key={lesson._id}>
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between gap-3 px-5 py-3 transition-colors ${
                            isPlaying
                              ? "bg-primary-50/60 border-l-2 border-primary-600 font-medium"
                              : "hover:bg-neutral-100/60 text-neutral-600"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Marker dot */}
                            {isPlaying ? (
                              <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0 ring-4 ring-primary-100" />
                            ) : (
                              <div className="w-2 h-2 rounded-full border border-neutral-300 shrink-0" />
                            )}

                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs truncate ${
                                  isPlaying
                                    ? "text-primary-700 font-semibold"
                                    : "text-neutral-700"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              {isPlaying ? (
                                <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mt-0.5">
                                  Now playing
                                </p>
                              ) : (
                                lesson.duration && (
                                  <p className="text-[11px] text-neutral-400 mt-0.5">
                                    {fmtSec(lesson.duration)}
                                  </p>
                                )
                              )}
                            </div>
                          </div>

                          {/* Right Play Indicator */}
                          {isPlaying && (
                            <div className="text-primary-600 shrink-0">
                              <PlayCircleFilledIcon size={18} />
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Toggle Button */}
      <div className="lg:hidden w-full px-4 py-3 bg-white border-b border-[#EDE5DF] flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={`/courses/${courseSlug}`}
            className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
            aria-label="Back to course"
          >
            <ChevronLeftIcon size={18} />
          </Link>
          <span className="text-xs font-semibold text-neutral-800 truncate">
            {courseTitle}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <MenuIcon size={14} />
          <span>Curriculum</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[#EDE5DF]">
              <span className="font-semibold text-sm text-neutral-900">
                Curriculum
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close curriculum"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 border-r border-[#EDE5DF] bg-white self-stretch min-h-screen">
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
