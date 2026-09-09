import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  onPageChange,
  className = "",
}: PaginationProps) {
  const pages: (number | string)[] = [1, 2, 3, "...", 8];

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[13px] font-medium select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeftIcon size={16} />
      </button>

      {pages.map((page, idx) => {
        if (typeof page === "string") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-[#94A3B8]"
            >
              {page}
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange?.(page)}
            className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-all cursor-pointer ${
              isActive
                ? "border border-[#6366F1] text-[#4F46E5] font-semibold bg-white shadow-xs"
                : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange?.(currentPage + 1)}
        className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
}
