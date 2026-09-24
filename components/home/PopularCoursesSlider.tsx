"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/ui/cards";

export interface PopularCourse {
  _id: string;
  title: string | null;
  slug: string | null;
  summary: string | null;
  coverImageUrl?: string | null;
  level: string | null;
  duration: string;
  modulesCount: number;
}

interface PopularCoursesSliderProps {
  courses: PopularCourse[];
}

export function PopularCoursesSlider({ courses }: PopularCoursesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [pointerStartX, setPointerStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const totalCourses = courses.length;

  // Responsive visible cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Double the courses for smooth infinite wrap
  const extendedCourses = totalCourses > 0 ? [...courses, ...courses] : [];

  const nextSlide = useCallback(() => {
    if (totalCourses <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [totalCourses]);

  const prevSlide = useCallback(() => {
    if (totalCourses <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? totalCourses - 1 : prev - 1));
  }, [totalCourses]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Seamless wrap-around after transition completes
  const handleTransitionEnd = () => {
    if (currentIndex >= totalCourses) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  // Auto-play interval with pause on hover
  useEffect(() => {
    if (isHovered || isDragging || totalCourses <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, isDragging, totalCourses, nextSlide]);

  if (totalCourses === 0) {
    return (
      <div className="text-center py-12 bg-white border border-[#EDE5DF] rounded-2xl p-8">
        <p className="text-[#64748B] text-sm">
          No popular courses found.
        </p>
      </div>
    );
  }

  // Pointer / Touch swipe handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setPointerStartX(e.clientX);
    setDragOffset(0);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || pointerStartX === null) return;
    setDragOffset(e.clientX - pointerStartX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }

    setPointerStartX(null);
    setDragOffset(0);
  };

  const activeDotIndex = currentIndex % totalCourses;

  return (
    <div
      className="w-full relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
        setDragOffset(0);
      }}
    >
      {/* Slider Viewport */}
      <div
        className="w-full overflow-hidden py-2 -mx-2.5 px-2.5 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="flex will-change-transform"
          style={{
            transform: `translateX(calc(-${currentIndex * (100 / visibleCount)}% + ${dragOffset}px))`,
            transition: isTransitioning
              ? "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        >
          {extendedCourses.map((course, idx) => {
            const isClone = idx >= totalCourses;
            const uniqueKey = `${course._id}-${isClone ? "clone-" : ""}${idx}`;

            return (
              <div
                key={uniqueKey}
                className="shrink-0 px-2.5 box-border"
                style={{ width: `${100 / visibleCount}%` }}
              >
                <Link
                  href={`/courses/${course.slug}`}
                  onClick={(e) => {
                    // Prevent accidental link navigation during horizontal drag/swipe
                    if (Math.abs(dragOffset) > 12) {
                      e.preventDefault();
                    }
                  }}
                  className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-[16px]"
                >
                  <CourseCard
                    title={course.title ?? "Untitled Course"}
                    description={course.summary ?? ""}
                    level={course.level ?? "All Levels"}
                    duration={course.duration}
                    modulesCount={course.modulesCount}
                    coverImage={course.coverImageUrl}
                    popular={true}
                    className="h-full hover:-translate-y-1 transition-all duration-200"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators (Without arrows, smooth active indicator) */}
      <div className="flex items-center justify-center gap-2 pt-6">
        {courses.map((course, idx) => {
          const isActive = activeDotIndex === idx;
          return (
            <button
              key={course._id || idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${course.title ?? "Course"}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                isActive
                  ? "w-8 bg-[#4F46E5] shadow-xs"
                  : "w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
