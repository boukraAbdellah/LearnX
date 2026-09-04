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
    "inline-flex items-center justify-center font-medium rounded-[12px] h-[44px] transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed text-[14px]";

  const sizeClasses = size === "lg" ? "px-4" : "px-3";

  let variantClasses = "";

  if (variant === "primary") {
    if (disabled) {
      variantClasses = "bg-[#FFEEE5] text-[#FDBA74] border-transparent shadow-none";
    } else if (isHoveredState) {
      variantClasses = "bg-[#EA580C] text-white shadow-sm";
    } else {
      variantClasses =
        "bg-[#F97316] text-white hover:bg-[#EA580C] active:bg-[#C2410C] shadow-sm";
    }
  } else if (variant === "secondary") {
    if (disabled) {
      variantClasses =
        "bg-white border border-[#FED7AA] text-[#FED7AA] shadow-none";
    } else if (isHoveredState) {
      variantClasses =
        "bg-[#FFF7ED] border border-[#F97316] text-[#F97316] shadow-sm";
    } else {
      variantClasses =
        "bg-white border border-[#FB923C] text-[#F97316] hover:bg-[#FFF7ED] hover:border-[#F97316] active:bg-[#FFEDD5] shadow-sm";
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
      variantClasses = "bg-transparent text-[#FED7AA] border-transparent";
    } else if (isHoveredState) {
      variantClasses = "bg-transparent text-[#EA580C] border-transparent";
    } else {
      variantClasses =
        "bg-transparent text-[#F97316] hover:text-[#EA580C] active:text-[#C2410C] border-transparent";
    }
  }

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="mr-2 inline-flex">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="ml-2 inline-flex">{icon}</span>}
    </button>
  );
}
