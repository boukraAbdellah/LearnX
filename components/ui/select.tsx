import React from "react";
import { ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export function Select({
  options,
  className = "",
  defaultValue,
  value,
  onChange,
  ...props
}: SelectProps) {
  return (
    <div className="relative inline-flex items-center w-full max-w-[240px]">
      <select
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className={`w-full h-[44px] pl-4 pr-10 bg-white border border-[#E2E8F0] rounded-[12px] text-[14px] text-[#0F172A] font-medium appearance-none cursor-pointer outline-none transition-colors focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]/50 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 flex items-center pointer-events-none text-[#64748B]">
        <ChevronDownIcon size={18} />
      </div>
    </div>
  );
}
