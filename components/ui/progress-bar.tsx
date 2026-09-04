import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`flex items-center gap-4 w-full ${className}`}>
      <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]/50">
        <div
          className="h-full bg-[#F97316] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[13px] text-[#334155] whitespace-nowrap">
          <strong className="font-semibold text-[#0F172A]">{clampedValue}%</strong>{" "}
          complete
        </span>
      )}
    </div>
  );
}
