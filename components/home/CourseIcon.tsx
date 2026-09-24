import React from "react";
import Image from "next/image";
import { getCourseCoverImageUrl } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface CourseIconProps {
  slug: string;
  title: string;
  coverImage?: SanityImageSource | null;
}

export function CourseIcon({ slug, title, coverImage }: CourseIconProps) {
  // 1. Cover image from course document
  const coverSrc = getCourseCoverImageUrl(coverImage, 96, 96);
  if (coverSrc) {
    return (
      <div className="w-11 h-11 rounded-[10px] overflow-hidden border border-[#EDE5DF] relative shrink-0 shadow-2xs">
        <Image
          src={coverSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="44px"
        />
      </div>
    );
  }
  if (slug.includes("nextjs") || slug.includes("next-js")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-black text-white flex items-center justify-center font-bold text-[19px] select-none shadow-2xs">
        N
      </div>
    );
  }

  // 2. Docker / DevOps
  if (slug.includes("docker") || slug.includes("devops")) {
    return (
      <div className="w-12 h-11 flex items-center justify-center">
        <Image
          src="/docker-icon.png"
          alt="Docker whale icon"
          width={52}
          height={42}
          className="object-contain"
        />
      </div>
    );
  }

  // 3. TypeScript
  if (slug.includes("typescript")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#3178C6] text-white flex items-center justify-center font-bold text-[17px] tracking-tight select-none shadow-2xs">
        TS
      </div>
    );
  }

  // 4. Python
  if (slug.includes("python")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#3776AB] text-white flex items-center justify-center font-bold text-[17px] tracking-tight select-none shadow-2xs">
        Py
      </div>
    );
  }

  // 5. React
  if (slug.includes("react")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#1E293B] text-[#38BDF8] flex items-center justify-center font-bold text-[17px] tracking-tight select-none shadow-2xs">
        Re
      </div>
    );
  }

  // 6. PostgreSQL
  if (slug.includes("postgres") || slug.includes("postgresql") || slug.includes("sql")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#2C5282] text-white flex items-center justify-center font-bold text-[16px] tracking-tight select-none shadow-2xs">
        PG
      </div>
    );
  }

  // 7. AI / LLMs
  if (slug.includes("llm") || slug.includes("ai-apps")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#6366F1] text-white flex items-center justify-center font-bold text-[17px] tracking-tight select-none shadow-2xs">
        AI
      </div>
    );
  }

  // 8. RAG
  if (slug.includes("rag") || slug.includes("retrieval")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#059669] text-white flex items-center justify-center font-bold text-[14.5px] font-mono tracking-tighter select-none shadow-2xs">
        RAG
      </div>
    );
  }

  // 9. System Design
  if (slug.includes("system-design")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#D97706] text-white flex items-center justify-center font-bold text-[16px] tracking-tight select-none shadow-2xs">
        SD
      </div>
    );
  }

  // 10. Security
  if (slug.includes("security")) {
    return (
      <div className="w-11 h-11 rounded-[10px] bg-[#DC2626] text-white flex items-center justify-center font-bold text-[14.5px] font-mono tracking-tighter select-none shadow-2xs">
        SEC
      </div>
    );
  }

  // Fallback: First 2 letters
  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="w-11 h-11 rounded-[10px] bg-[#0F172A] text-white flex items-center justify-center font-bold text-[16px] tracking-tight select-none shadow-2xs">
      {initials || "C"}
    </div>
  );
}
