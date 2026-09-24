"use client";

import React, { useState } from "react";
import {
  LearnXLogo,
  BellIcon,
  BellFilledIcon,
  SearchIcon,
  SearchFilledIcon,
  PlayCircleIcon,
  PlayCircleFilledIcon,
  FileTextIcon,
  FileTextFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  BarChartIcon,
  BarChartFilledIcon,
  ClockIcon,
  ClockFilledIcon,
  UserIcon,
  UserFilledIcon,
  ChevronRightIcon,
  EyeIcon,
  GridIcon,
  TargetIcon,
  AccessibleIcon,
  Button,
  SearchInput,
  Select,
  Badge,
  StatusIndicator,
  ProgressBar,
  CourseCard,
  LessonVideoCard,
  LessonTopicCard,
  ResourceCard,
  Navigation,
  Breadcrumbs,
  Pagination,
  ExternalLinkIcon,
} from "@/components/ui";

export default function DesignSystemPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [progressVal, setProgressVal] = useState(35);

  const primaryColors = [
    { name: "Primary 500", hex: "#4F46E5", bg: "bg-[#4F46E5]", text: "text-white" },
    { name: "Primary 400", hex: "#6366F1", bg: "bg-[#6366F1]", text: "text-white" },
    { name: "Primary 300", hex: "#818CF8", bg: "bg-[#818CF8]", text: "text-white" },
    { name: "Primary 200", hex: "#A5B4FC", bg: "bg-[#A5B4FC]", text: "text-[#0F172A]" },
    { name: "Primary 100", hex: "#E0E7FF", bg: "bg-[#E0E7FF]", text: "text-[#4F46E5]" },
  ];

  const neutralColors = [
    { name: "Neutral 900", hex: "#0F172A", bg: "bg-[#0F172A]", border: "", text: "text-white" },
    { name: "Neutral 700", hex: "#334155", bg: "bg-[#334155]", border: "", text: "text-white" },
    { name: "Neutral 500", hex: "#64748B", bg: "bg-[#64748B]", border: "", text: "text-white" },
    { name: "Neutral 300", hex: "#CBD5E1", bg: "bg-[#CBD5E1]", border: "", text: "text-[#0F172A]" },
    { name: "Neutral 200", hex: "#E2E8F0", bg: "bg-[#E2E8F0]", border: "", text: "text-[#0F172A]" },
    { name: "Neutral 100", hex: "#F1F5F9", bg: "bg-[#F1F5F9]", border: "", text: "text-[#0F172A]" },
    { name: "Neutral 50", hex: "#FAFAFC", bg: "bg-[#FAFAFC]", border: "border border-[#E2E8F0]", text: "text-[#0F172A]" },
    { name: "White", hex: "#FFFFFF", bg: "bg-white", border: "border border-[#E2E8F0]", text: "text-[#0F172A]" },
  ];

  const typeScale = [
    { style: "Display 1", font: "Playfair Display", size: "48 / 56", weight: "Bold", use: "Page titles", class: "display-1" },
    { style: "Display 2", font: "Playfair Display", size: "36 / 44", weight: "Bold", use: "Section titles", class: "display-2" },
    { style: "Heading 1", font: "Inter", size: "28 / 36", weight: "Semi Bold", use: "Card titles", class: "heading-1" },
    { style: "Heading 2", font: "Inter", size: "22 / 30", weight: "Semi Bold", use: "Sub section", class: "heading-2" },
    { style: "Heading 3", font: "Inter", size: "18 / 26", weight: "Medium", use: "Small titles", class: "heading-3" },
    { style: "Body Large", font: "Inter", size: "16 / 24", weight: "Regular", use: "Body copy", class: "body-large" },
    { style: "Body", font: "Inter", size: "14 / 20", weight: "Regular", use: "Supporting text", class: "body-base" },
    { style: "Small", font: "Inter", size: "12 / 16", weight: "Regular", use: "Captions, meta", class: "caption-small" },
  ];

  const spacingUnits = [
    { px: 4, rem: "0.25rem", height: "h-3" },
    { px: 8, rem: "0.5rem", height: "h-4" },
    { px: 12, rem: "0.75rem", height: "h-6" },
    { px: 16, rem: "1rem", height: "h-8" },
    { px: 24, rem: "1.5rem", height: "h-11" },
    { px: 32, rem: "2rem", height: "h-14" },
    { px: 40, rem: "2.5rem", height: "h-16" },
    { px: 48, rem: "3rem", height: "h-20" },
    { px: 64, rem: "4rem", height: "h-24" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] py-12 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title Header */}
        <header className="border-b border-[#E2E8F0] pb-10">
          <div className="flex items-center gap-3 mb-4">
            <LearnXLogo size={36} />
            <span className="font-serif font-bold text-[24px] tracking-tight text-[#0F172A]">
              Learn<span className="text-[#4F46E5]">X</span>
            </span>
          </div>
          <h1 className="font-serif text-5xl font-bold text-[#0F172A] mb-3">
            Design System
          </h1>
          <p className="text-[#64748B] text-[16px] max-w-2xl leading-relaxed">
            A unified design language for LearnX learning platform. Clean, modern and focused on clarity, consistency and intuitive learning experiences.
          </p>
          <div className="mt-4 text-[12px] font-semibold text-[#64748B] tracking-wider uppercase">
            VERSION 1.0 • MAY 2025
          </div>
        </header>

        {/* 01 COLORS */}
        <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
          <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
            01 Colors
          </h2>

          {/* Primary */}
          <div className="mb-8">
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Primary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {primaryColors.map((color) => (
                <div key={color.name} className="flex flex-col">
                  <div className={`h-20 rounded-[12px] ${color.bg} shadow-sm mb-2`} />
                  <span className="text-[13px] font-medium text-[#0F172A]">{color.name}</span>
                  <span className="text-[12px] font-mono text-[#64748B]">{color.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Neutral */}
          <div>
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Neutral</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {neutralColors.map((color) => (
                <div key={color.name} className="flex flex-col">
                  <div className={`h-16 rounded-[12px] ${color.bg} ${color.border} shadow-sm mb-2`} />
                  <span className="text-[12px] font-medium text-[#0F172A] truncate">{color.name}</span>
                  <span className="text-[11px] font-mono text-[#64748B]">{color.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 02 TYPOGRAPHY & 03 TYPE SCALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 02 Typography */}
          <section className="lg:col-span-4 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
                02 Typography
              </h2>

              <div className="space-y-8">
                <div>
                  <div className="font-serif text-6xl text-[#0F172A] mb-2 font-normal">Ag</div>
                  <h3 className="font-serif text-xl font-bold text-[#0F172A]">Playfair Display</h3>
                  <p className="text-[13px] text-[#64748B] mt-1">Elegant • Readable • Timeless</p>
                </div>

                <div className="border-t border-[#F1F5F9] pt-6">
                  <div className="font-sans text-6xl text-[#0F172A] mb-2 font-normal">Ag</div>
                  <h3 className="font-sans text-xl font-semibold text-[#0F172A]">Inter</h3>
                  <p className="text-[13px] text-[#64748B] mt-1">Clean • Modern • Highly legible</p>
                </div>
              </div>
            </div>
          </section>

          {/* 03 Type Scale */}
          <section className="lg:col-span-8 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm overflow-x-auto">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
              03 Type Scale
            </h2>
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-medium pb-2">
                  <th className="pb-3 pr-4">Style</th>
                  <th className="pb-3 pr-4">Font</th>
                  <th className="pb-3 pr-4">Size / Line Height</th>
                  <th className="pb-3 pr-4">Weight</th>
                  <th className="pb-3">Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {typeScale.map((t) => (
                  <tr key={t.style} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#0F172A] whitespace-nowrap">
                      {t.style}
                    </td>
                    <td className="py-3 pr-4 text-[#334155] whitespace-nowrap">{t.font}</td>
                    <td className="py-3 pr-4 font-mono text-[#64748B] whitespace-nowrap">{t.size}</td>
                    <td className="py-3 pr-4 text-[#334155] whitespace-nowrap">{t.weight}</td>
                    <td className="py-3 text-[#64748B]">{t.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 04 SPACING SYSTEM & 05 RADIUS & SHADOWS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 04 Spacing */}
          <section className="lg:col-span-6 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-2">
              04 Spacing System
            </h2>
            <p className="text-[13px] text-[#64748B] mb-6">Base unit: 4px</p>

            <div className="flex items-end gap-3 justify-between overflow-x-auto pt-6 pb-2">
              {spacingUnits.map((u) => (
                <div key={u.px} className="flex flex-col items-center">
                  <div className={`w-8 bg-[#A5B4FC] rounded-[4px] mb-2`} style={{ height: `${Math.max(12, u.px)}px` }} />
                  <span className="text-[12px] font-semibold text-[#0F172A]">{u.px}</span>
                  <span className="text-[10px] text-[#64748B]">({u.rem})</span>
                </div>
              ))}
            </div>
          </section>

          {/* 05 Radius & Shadows */}
          <section className="lg:col-span-6 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm space-y-8">
            <div>
              <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-4">
                05 Radius & Shadows
              </h2>
              <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Radius</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                {[
                  { label: "4px (xs)", radius: "rounded-[4px]" },
                  { label: "8px (sm)", radius: "rounded-[8px]" },
                  { label: "12px (md)", radius: "rounded-[12px]" },
                  { label: "16px (lg)", radius: "rounded-[16px]" },
                  { label: "24px (xl)", radius: "rounded-[24px]" },
                  { label: "Full (circle)", radius: "rounded-full" },
                ].map((r) => (
                  <div key={r.label} className="flex flex-col items-center">
                    <div className={`w-12 h-12 bg-white border border-[#CBD5E1] ${r.radius} mb-1.5`} />
                    <span className="text-[11px] text-[#64748B]">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Shadows</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {[
                  { name: "Sm", spec: "0 1px 2px 0 rgba(15,23,42,0.05)", shadow: "shadow-[0_1px_2px_0_rgba(15,23,42,0.05)]" },
                  { name: "Md", spec: "0 4px 12px -2px rgba(15,23,42,0.08)", shadow: "shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)]" },
                  { name: "Lg", spec: "0 12px 24px -4px rgba(15,23,42,0.10)", shadow: "shadow-[0_12px_24px_-4px_rgba(15,23,42,0.10)]" },
                  { name: "Xl", spec: "0 20px 40px -8px rgba(15,23,42,0.12)", shadow: "shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)]" },
                ].map((s) => (
                  <div key={s.name} className="flex flex-col items-center">
                    <div className={`w-full h-16 bg-white border border-[#E2E8F0] rounded-[12px] ${s.shadow} mb-1.5`} />
                    <span className="text-[12px] font-semibold text-[#0F172A]">{s.name}</span>
                    <span className="text-[9px] font-mono text-[#64748B] truncate max-w-[120px]">{s.spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 06 ICONS */}
        <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase">
              06 Icons
            </h2>
            <div className="text-[12px] text-[#64748B]">
              <span className="font-semibold text-[#0F172A]">Specs:</span> 24x24px grid • 2px stroke width (outline) • Rounded line caps • Consistent optical balance
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Outline Style</h3>
              <div className="flex items-center gap-6 text-[#0F172A] flex-wrap">
                <BellIcon size={24} />
                <SearchIcon size={24} />
                <PlayCircleIcon size={24} />
                <FileTextIcon size={24} />
                <BookmarkIcon size={24} />
                <BarChartIcon size={24} />
                <ClockIcon size={24} />
                <UserIcon size={24} />
                <ChevronRightIcon size={24} />
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] pt-6">
              <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Filled Style</h3>
              <div className="flex items-center gap-6 text-[#0F172A] flex-wrap">
                <BellFilledIcon size={24} />
                <SearchFilledIcon size={24} />
                <PlayCircleFilledIcon size={24} />
                <FileTextFilledIcon size={24} />
                <BookmarkFilledIcon size={24} />
                <BarChartFilledIcon size={24} />
                <ClockFilledIcon size={24} />
                <UserFilledIcon size={24} />
                <ChevronRightIcon size={24} className="stroke-[3]" />
              </div>
            </div>
          </div>
        </section>

        {/* 07 BUTTONS & 08 INPUTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 07 Buttons */}
          <section className="lg:col-span-7 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
              07 Buttons
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="text-[#64748B] font-medium border-b border-[#E2E8F0]">
                    <th className="pb-3 pr-2">State</th>
                    <th className="pb-3 pr-2">Primary</th>
                    <th className="pb-3 pr-2">Secondary</th>
                    <th className="pb-3 pr-2">Tertiary</th>
                    <th className="pb-3">Text</th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {/* Default */}
                  <tr>
                    <td className="py-3 pr-2 font-medium text-[#64748B]">Default</td>
                    <td className="py-3 pr-2">
                      <Button variant="primary" size="md">Get Started</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="secondary" size="md">Explore Courses</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="tertiary" size="md" icon={<ExternalLinkIcon size={14} />}>
                        View Lesson
                      </Button>
                    </td>
                    <td className="py-3">
                      <Button variant="text" size="md" icon={<PlayCircleIcon size={16} />} iconPosition="right">
                        Watch Video
                      </Button>
                    </td>
                  </tr>

                  {/* Hover */}
                  <tr>
                    <td className="py-3 pr-2 font-medium text-[#64748B]">Hover</td>
                    <td className="py-3 pr-2">
                      <Button variant="primary" size="md" isHoveredState>Get Started</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="secondary" size="md" isHoveredState>Explore Courses</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="tertiary" size="md" isHoveredState icon={<ExternalLinkIcon size={14} />}>
                        View Lesson
                      </Button>
                    </td>
                    <td className="py-3">
                      <Button variant="text" size="md" isHoveredState icon={<PlayCircleIcon size={16} />} iconPosition="right">
                        Watch Video
                      </Button>
                    </td>
                  </tr>

                  {/* Disabled */}
                  <tr>
                    <td className="py-3 pr-2 font-medium text-[#64748B]">Disabled</td>
                    <td className="py-3 pr-2">
                      <Button variant="primary" size="md" disabled>Get Started</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="secondary" size="md" disabled>Explore Courses</Button>
                    </td>
                    <td className="py-3 pr-2">
                      <Button variant="tertiary" size="md" disabled icon={<ExternalLinkIcon size={14} />}>
                        View Lesson
                      </Button>
                    </td>
                    <td className="py-3">
                      <Button variant="text" size="md" disabled icon={<PlayCircleIcon size={16} />} iconPosition="right">
                        Watch Video
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[12px] text-[#64748B] space-y-1">
              <p>• <strong>Height:</strong> 44px (default)</p>
              <p>• <strong>Padding:</strong> 0 16px (lg), 0 12px (md)</p>
              <p>• <strong>Radius:</strong> 12px</p>
              <p>• <strong>Font:</strong> Inter Medium (14–16px)</p>
            </div>
          </section>

          {/* 08 Inputs */}
          <section className="lg:col-span-5 bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
                08 Inputs
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
                    Search / Text Input
                  </label>
                  <SearchInput />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
                    Select
                  </label>
                  <Select
                    options={[
                      { value: "most-relevant", label: "Most Relevant" },
                      { value: "newest", label: "Newest First" },
                      { value: "popular", label: "Most Popular" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F1F5F9] text-[12px] text-[#64748B] space-y-1">
              <p>• <strong>Height:</strong> 44px</p>
              <p>• <strong>Radius:</strong> 12px</p>
              <p>• <strong>Border:</strong> 1px solid #E2E8F0</p>
              <p>• <strong>Padding:</strong> 0 16px</p>
              <p>• <strong>Focus:</strong> Border color #6366F1</p>
            </div>
          </section>
        </div>

        {/* 09 BADGES, 10 STATUS, 11 PROGRESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 09 Badges */}
          <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
              09 Badges / Tags
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="video">Video</Badge>
              <Badge variant="lesson">Lesson</Badge>
              <Badge variant="popular">Popular</Badge>
            </div>
          </section>

          {/* 10 Status */}
          <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
              10 Status / Indicators
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StatusIndicator status="in-progress" />
              <StatusIndicator status="completed" />
              <StatusIndicator status="now-playing" />
              <StatusIndicator status="locked" />
            </div>
          </section>

          {/* 11 Progress Bar */}
          <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
            <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
              11 Progress Bar
            </h2>
            <ProgressBar value={progressVal} />
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] text-[#64748B]">Adjust:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-24 accent-[#4F46E5] cursor-pointer"
              />
            </div>
          </section>
        </div>

        {/* 12 CARDS */}
        <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
          <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
            12 Cards
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Course Card */}
            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-2">Course Card</span>
              <CourseCard
                title="Next.js for Production"
                description="Build scalable, high-performance web applications with Next.js."
                level="Intermediate"
                duration="16h 24m"
                modulesCount={12}
              />
            </div>

            {/* Lesson Card (Video) */}
            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-2">Lesson Card (Video)</span>
              <LessonVideoCard
                title="Data Fetching in Server Components"
                description="Learn how to fetch data on the server using async/await and Next.js best practices."
                lessonNumber="Lesson 5.1"
                timestamp="12:45"
              />
            </div>

            {/* Lesson Card (Lesson) */}
            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-2">Lesson Card (Lesson)</span>
              <LessonTopicCard
                title="Data Fetching & Caching"
                description="Explore different data fetching methods in Next.js and how to cache and revalidate data for optimal performance."
                moduleLabel="Module 5"
              />
            </div>

            {/* Resource Card */}
            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-2">Resource Card</span>
              <ResourceCard
                title="Caching and Revalidation Guide"
                description="Deep dive into Next.js caching strategies."
                format="PDF"
                fileSize="1.2 MB"
              />
            </div>
          </div>
        </section>

        {/* 13 NAVIGATION */}
        <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-2">
            13 Navigation
          </h2>

          <div>
            <span className="block text-[12px] font-medium text-[#64748B] mb-2">Header Navigation</span>
            <div className="border border-[#E2E8F0] rounded-[12px] overflow-hidden">
              <Navigation activeTab="courses" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F1F5F9]">
            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-3">Breadcrumbs</span>
              <Breadcrumbs
                items={[
                  { label: "All Courses", href: "#" },
                  { label: "Next.js for Production", href: "#" },
                  { label: "Data Fetching & Caching" },
                ]}
              />
            </div>

            <div>
              <span className="block text-[12px] font-medium text-[#64748B] mb-3">Pagination</span>
              <Pagination
                currentPage={currentPage}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          </div>
        </section>

        {/* 14 PRINCIPLES */}
        <section className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm">
          <h2 className="text-[12px] font-bold tracking-wider text-[#4F46E5] uppercase mb-6">
            14 Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-[#4F46E5] shrink-0 mt-0.5">
                <EyeIcon size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Clarity First</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Every element should communicate clearly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-[#4F46E5] shrink-0 mt-0.5">
                <GridIcon size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Consistency</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Use components and patterns consistently across the platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-[#4F46E5] shrink-0 mt-0.5">
                <TargetIcon size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Focus & Calm</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Remove noise and help learners focus on what matters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="text-[#4F46E5] shrink-0 mt-0.5">
                <AccessibleIcon size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Accessible</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  Design with accessibility and inclusivity in mind.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
