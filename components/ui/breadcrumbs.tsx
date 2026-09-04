import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "./icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({
  items = [
    { label: "All Courses", href: "#" },
    { label: "Next.js for Production", href: "#" },
    { label: "Data Fetching & Caching" },
  ],
  className = "",
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-[13px] text-[#64748B] flex-wrap ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-[#CBD5E1] shrink-0">
                <ChevronRightIcon size={14} />
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-[#0F172A] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#0F172A]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
