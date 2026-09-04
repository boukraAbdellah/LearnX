import React from "react";
import { SearchIcon } from "./icons";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onShortcutClick?: () => void;
  shortcutLabel?: string;
}

export function SearchInput({
  className = "",
  placeholder = "Search anything ...",
  shortcutLabel = "⌘ K",
  onShortcutClick,
  ...props
}: SearchInputProps) {
  return (
    <div className="relative flex items-center w-full max-w-[360px]">
      <div className="absolute left-4 flex items-center pointer-events-none text-[#64748B]">
        <SearchIcon size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full h-[44px] pl-11 pr-14 bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#64748B] outline-none transition-colors focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]/50 ${className}`}
        {...props}
      />
      {shortcutLabel && (
        <div
          onClick={onShortcutClick}
          className="absolute right-3 flex items-center justify-center px-2 py-0.5 rounded-[6px] bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B] select-none cursor-pointer hover:bg-[#E2E8F0] transition-colors"
        >
          {shortcutLabel}
        </div>
      )}
    </div>
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full h-[44px] px-4 bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#64748B] outline-none transition-colors focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]/50 ${className}`}
      {...props}
    />
  );
}
