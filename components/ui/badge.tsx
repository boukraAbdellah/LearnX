import React from "react";

export type BadgeVariant = "video" | "lesson" | "popular";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "video",
  children,
  className = "",
}: BadgeProps) {
  let styleClasses = "";

  if (variant === "video") {
    styleClasses = "bg-[#E0E7FF] text-[#4F46E5] border border-[#A5B4FC]/40";
  } else if (variant === "lesson") {
    styleClasses = "bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/50";
  } else if (variant === "popular") {
    styleClasses = "bg-[#EEF2FF] text-[#4338CA] border border-[#818CF8]/40";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold tracking-wider uppercase ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
}
