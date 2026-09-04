import React from "react";
import Link from "next/link";
import { VertexLogo } from "./icons";

export interface NavigationProps {
  activeTab?: "courses" | "my-learning" | string;
  className?: string;
}

export function Navigation({
  activeTab = "courses",
  className = "",
}: NavigationProps) {
  return (
    <nav
      className={`flex items-center justify-between px-6 py-4 bg-white border-b border-[#E2E8F0] ${className}`}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5">
          <VertexLogo size={28} />
          <span className="font-serif font-bold text-[20px] tracking-tight text-[#0F172A]">
            Vertex
          </span>
        </Link>
        <div className="flex items-center gap-6 text-[14px] font-medium">
          <Link
            href="#"
            className={`transition-colors ${
              activeTab === "courses"
                ? "text-[#F97316]"
                : "text-[#334155] hover:text-[#0F172A]"
            }`}
          >
            Courses
          </Link>
          <Link
            href="#"
            className={`transition-colors ${
              activeTab === "my-learning"
                ? "text-[#F97316]"
                : "text-[#334155] hover:text-[#0F172A]"
            }`}
          >
            My Learning
          </Link>
        </div>
      </div>
    </nav>
  );
}
