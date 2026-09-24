"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  LockIcon,
  EyeIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";

export interface LessonStub {
  _id: string;
  title: string | null;
  slug: string | null;
  /** Duration in seconds as stored in Sanity */
  duration: number | null;
  isFreePreview: boolean;
}

export interface CourseModule {
  _key: string;
  title: string | null;
  summary: string | null;
  lessons: LessonStub[] | null;
}

interface CourseModuleListProps {
  modules: CourseModule[];
  courseSlug: string;
  totalDuration?: string | null;
  completedLessonIds?: string[];
}


const INITIAL_VISIBLE = 8;

/** Format seconds → "1h 24m" / "45m" */
function fmtSec(s: number | null | undefined): string {
  if (!s || s <= 0) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Compute module total seconds */
function computeModuleDuration(lessons: LessonStub[] | null): string {
  if (!lessons || lessons.length === 0) return "";
  const total = lessons.reduce((acc, l) => acc + (l.duration ?? 0), 0);
  return fmtSec(total);
}

export function CourseModuleList({
  modules,
  courseSlug,
  totalDuration,
  completedLessonIds,
}: CourseModuleListProps) {

  const [showAll, setShowAll] = useState(false);
  // Default first module expanded for immediate preview
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(modules.length > 0 ? [modules[0]._key] : [])
  );

  const visibleModules = showAll ? modules : modules.slice(0, INITIAL_VISIBLE);

  const totalLessons = modules.reduce(
    (acc, mod) => acc + (mod.lessons?.length ?? 0),
    0
  );

  const allExpanded =
    modules.length > 0 &&
    modules.every((mod) => expandedKeys.has(mod._key));

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

  function toggleAll() {
    if (allExpanded) {
      setExpandedKeys(new Set());
    } else {
      setExpandedKeys(new Set(modules.map((m) => m._key)));
    }
  }

  return (
    <section className="px-6 lg:px-8 pb-8">
      <div className="bg-white border border-[#EDE5DF] rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-6 rounded-full bg-primary-500" />
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">
              Course Curriculum
            </h2>
          </div>
          <p className="text-sm text-neutral-500">
            {modules.length} {modules.length === 1 ? "module" : "modules"} •{" "}
            {totalLessons} lessons
            {totalDuration && ` • ${totalDuration} total length`}
          </p>
        </div>

        {/* Expand / Collapse All Toggle */}
        <button
          type="button"
          onClick={toggleAll}
          className="self-start sm:self-auto text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100/70 border border-primary-200/60 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {allExpanded ? "Collapse All Modules" : "Expand All Modules"}
        </button>
      </div>

      {/* Module Accordion Items */}
      <div className="space-y-3">
        {visibleModules.map((mod, idx) => {
          const isExpanded = expandedKeys.has(mod._key);
          const lessonCount = mod.lessons?.length ?? 0;
          const moduleDuration = computeModuleDuration(mod.lessons);
          const formattedIndex = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={mod._key}
              className="border border-neutral-200/90 rounded-xl overflow-hidden transition-all duration-200 bg-white"
            >
              {/* Module Header Button */}
              <button
                type="button"
                onClick={() => toggleModule(mod._key)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 cursor-pointer ${
                  isExpanded ? "bg-neutral-50/80" : "hover:bg-neutral-50/50"
                }`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Module Number Badge */}
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center justify-center border border-neutral-200/60">
                    {formattedIndex}
                  </span>

                  {/* Title & Summary */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[15px] text-neutral-900 leading-snug">
                      {mod.title}
                    </h3>
                    {mod.summary && (
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                        {mod.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badges & Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-medium">
                    <span>
                      {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                    </span>
                    {moduleDuration && (
                      <>
                        <span>•</span>
                        <span>{moduleDuration}</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 bg-neutral-200/60" : "bg-neutral-100"
                    }`}
                  >
                    <ChevronDownIcon size={16} />
                  </div>
                </div>
              </button>

              {/* Expanded Lessons List */}
              {isExpanded && mod.lessons && mod.lessons.length > 0 && (
                <ul className="divide-y divide-neutral-100 border-t border-neutral-200/70 bg-neutral-50/30">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const href = lesson.slug
                      ? `/lessons/${lesson.slug}`
                      : `/courses/${courseSlug}`;

                    const isCompleted = completedLessonIds?.includes(lesson._id);

                    return (
                      <li key={lesson._id}>
                        <Link
                          href={href}
                          className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-primary-50/40 transition-colors group/lesson"
                        >
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {/* Icon Indicator */}
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircleIcon size={14} />
                              </div>
                            ) : lesson.isFreePreview ? (
                              <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 group-hover/lesson:scale-110 transition-transform">
                                <PlayCircleIcon size={14} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                                <LockIcon size={12} />
                              </div>
                            )}


                            {/* Lesson Title */}
                            <span
                              className={`text-sm leading-snug truncate ${
                                lesson.isFreePreview
                                  ? "text-neutral-800 font-medium group-hover/lesson:text-primary-600"
                                  : "text-neutral-600 font-normal"
                              }`}
                            >
                              <span className="text-neutral-400 mr-2 text-xs">
                                {idx + 1}.{lessonIdx + 1}
                              </span>
                              {lesson.title}
                            </span>
                          </div>

                          {/* Free Preview Tag & Duration */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            {lesson.isFreePreview && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 bg-primary-50 border border-primary-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <EyeIcon size={11} />
                                Preview
                              </span>
                            )}
                            {lesson.duration && (
                              <span className="flex items-center gap-1 text-xs text-neutral-400">
                                <ClockIcon size={12} />
                                {fmtSec(lesson.duration)}
                              </span>
                            )}
                          </div>
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

      {/* Show more / fewer modules */}
      {modules.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-6 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-2xs cursor-pointer"
          >
            {showAll ? (
              <>
                <span>Show fewer modules</span>
                <ChevronDownIcon size={16} className="rotate-180" />
              </>
            ) : (
              <>
                <span>Show all {modules.length} modules</span>
                <ChevronDownIcon size={16} />
              </>
            )}
          </button>
        </div>
      )}
      </div>
    </section>
  );
}
