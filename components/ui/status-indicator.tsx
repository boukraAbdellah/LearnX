import React from "react";
import { CheckCircleIcon, LockIcon } from "./icons";

export type StatusType = "in-progress" | "completed" | "now-playing" | "locked";

export interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusIndicator({
  status,
  label,
  className = "",
}: StatusIndicatorProps) {
  let icon: React.ReactNode = null;
  let defaultLabel = "";
  let textClass = "text-[#0F172A]";

  if (status === "in-progress") {
    defaultLabel = "In Progress";
    icon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="14 6"
        className="animate-spin-slow"
      >
        <circle cx="8" cy="8" r="6" />
      </svg>
    );
  } else if (status === "completed") {
    defaultLabel = "Completed";
    icon = (
      <span className="text-[#16A34A]">
        <CheckCircleIcon size={16} />
      </span>
    );
  } else if (status === "now-playing") {
    defaultLabel = "Now Playing";
    icon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="#4F46E5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="7" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="1.5" />
        <polygon points="6.5 5 11 8 6.5 11 6.5 5" fill="#4F46E5" />
      </svg>
    );
  } else if (status === "locked") {
    defaultLabel = "Locked";
    textClass = "text-[#64748B]";
    icon = (
      <span className="text-[#64748B]">
        <LockIcon size={16} />
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 text-[13px] font-medium ${textClass} ${className}`}
    >
      <span className="inline-flex items-center justify-center shrink-0">
        {icon}
      </span>
      <span>{label ?? defaultLabel}</span>
    </div>
  );
}
