import React from "react";
import Link from "next/link";
import { Navigation } from "./navigation";
import { Button } from "./button";

export interface NotFoundViewProps {
  badgeText?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  activeTab?: "courses" | "my-learning" | string;
}

export function NotFoundView({
  badgeText = "404 Error",
  title,
  description,
  icon,
  primaryAction,
  secondaryAction = { label: "Back to Home", href: "/" },
  activeTab = "courses",
}: NotFoundViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#0F172A] selection:bg-[#4F46E5] selection:text-white">
      {/* Site Header */}
      <Navigation activeTab={activeTab} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-xl text-center flex flex-col items-center">
          {/* Icon Presentation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-[#EDE5DF] shadow-md flex items-center justify-center text-[#4F46E5] relative z-10 transition-transform duration-300 hover:scale-105">
              {icon || (
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 text-[#4F46E5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              )}
            </div>
            {/* Subtle glow / shadow accent */}
            <div
              className="absolute -inset-2 bg-gradient-to-tr from-[#EEF2FF] to-[#E0E7FF] rounded-3xl blur-md -z-0 opacity-70"
              aria-hidden="true"
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
            {badgeText}
          </div>

          {/* Title */}
          <h1 className="font-serif font-bold text-3xl md:text-5xl text-[#0F172A] tracking-tight leading-[1.15] mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-[#64748B] text-base md:text-lg leading-relaxed max-w-md mb-8">
            {description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link href={primaryAction.href} className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto min-w-[160px] shadow-sm"
              >
                {primaryAction.label}
              </Button>
            </Link>

            {secondaryAction && (
              <Link href={secondaryAction.href} className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[160px]"
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>

          {/* Helpful Navigation Links */}
          <div className="mt-12 pt-8 border-t border-[#EDE5DF] w-full flex flex-wrap items-center justify-center gap-6 text-sm text-[#64748B]">
            <span>Need assistance?</span>
            <Link
              href="/courses"
              className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
            >
              All Courses
            </Link>
            <span className="text-[#CBD5E1]">•</span>
            <Link
              href="/my-learning"
              className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
            >
              My Learning
            </Link>
            <span className="text-[#CBD5E1]">•</span>
            <Link
              href="/"
              className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
            >
              Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
