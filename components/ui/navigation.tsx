"use client";

import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { VertexLogo, BellIcon } from "./icons";

export interface NavigationProps {
  activeTab?: "courses" | "my-learning" | string;
  showActions?: boolean;
  avatarSrc?: string;
  className?: string;
  onNotificationClick?: () => void;
}

export function Navigation({
  activeTab = "courses",
  showActions = true,
  className = "",
  onNotificationClick,
}: NavigationProps) {
  return (
    <nav
      className={`flex items-center justify-between px-6 lg:px-8 py-3.5 bg-transparent border-b border-[#EDE5DF] ${className}`}
    >
      <div className="flex items-center gap-8 md:gap-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <VertexLogo size={28} />
          <span className="font-serif font-bold text-[22px] tracking-tight text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
            Vertex
          </span>
        </Link>
        <div className="flex items-center gap-6 text-[14px] font-medium">
          <Link
            href="/courses"
            className={`transition-colors font-medium ${
              activeTab === "courses"
                ? "text-[#0F172A]"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Courses
          </Link>
          <Link
            href="/my-learning"
            className={`transition-colors font-medium ${
              activeTab === "my-learning"
                ? "text-[#0F172A]"
                : "text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            My Learning
          </Link>
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-[#0F172A] hover:text-[#4F46E5] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9]/70 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="text-[14px] font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] px-3.5 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <button
              type="button"
              onClick={onNotificationClick}
              aria-label="Notifications"
              className="text-[#334155] hover:text-[#0F172A] p-1.5 rounded-full hover:bg-[#F1F5F9]/60 transition-colors cursor-pointer"
            >
              <BellIcon size={20} />
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 md:w-9 md:h-9 ring-1 ring-[#EDE5DF]",
                },
              }}
            />
          </Show>
        </div>
      )}
    </nav>
  );
}

