import React from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isHoveredState?: boolean; // For design system showcase demonstration
}

export function Button({
  variant = "primary",
  size = "lg",
  children,
  icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  isHoveredState = false,
  ...props
}: ButtonProps) {
  // Base classes: 44px height, 12px radius, Inter Medium font, transition
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-[12px] h-[44px] transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed text-[14px] [&>svg]:shrink-0";

  const sizeClasses = size === "lg" ? "px-4" : "px-3";

  let variantClasses = "";

  if (variant === "primary") {
    if (disabled) {
      variantClasses = "bg-[#E0E7FF] text-[#818CF8] border-transparent shadow-none";
    } else if (isHoveredState) {
      variantClasses = "bg-[#4338CA] text-white shadow-sm";
    } else {
      variantClasses =
        "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3730A3] shadow-sm";
    }
  } else if (variant === "secondary") {
    if (disabled) {
      variantClasses =
        "bg-white border border-[#A5B4FC] text-[#A5B4FC] shadow-none";
    } else if (isHoveredState) {
      variantClasses =
        "bg-[#EEF2FF] border border-[#4F46E5] text-[#4F46E5] shadow-sm";
    } else {
      variantClasses =
        "bg-white border border-[#6366F1] text-[#4F46E5] hover:bg-[#EEF2FF] hover:border-[#4F46E5] active:bg-[#E0E7FF] shadow-sm";
    }
  } else if (variant === "tertiary") {
    if (disabled) {
      variantClasses =
        "bg-white border border-[#E2E8F0] text-[#CBD5E1] shadow-none";
    } else if (isHoveredState) {
      variantClasses =
        "bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] shadow-sm";
    } else {
      variantClasses =
        "bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:bg-[#F1F5F9] shadow-sm";
    }
  } else if (variant === "text") {
    if (disabled) {
      variantClasses = "bg-transparent text-[#A5B4FC] border-transparent";
    } else if (isHoveredState) {
      variantClasses = "bg-transparent text-[#4338CA] border-transparent";
    } else {
      variantClasses =
        "bg-transparent text-[#4F46E5] hover:text-[#4338CA] active:text-[#3730A3] border-transparent";
    }
  }

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {icon}
        </span>
      )}
    </button>
  );
}
