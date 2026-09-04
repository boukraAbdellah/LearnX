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
    styleClasses = "bg-[#FFEEE5] text-[#F97316] border border-[#FED7AA]/40";
  } else if (variant === "lesson") {
    styleClasses = "bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]/50";
  } else if (variant === "popular") {
    styleClasses = "bg-[#FFF7ED] text-[#EA580C] border border-[#FDBA74]/40";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[11px] font-bold tracking-wider uppercase ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
}
