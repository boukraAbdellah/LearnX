import { NotFoundView } from "@/components/ui/not-found-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson Not Found | LearnX",
  description: "The lesson you are looking for is currently unavailable or does not exist.",
};

export default function LessonNotFound() {
  return (
    <NotFoundView
      badgeText="Lesson Unavailable"
      title="Lesson Not Found"
      description="The lesson or video material you requested couldn't be found. It may have been updated, relocated, or the link is incorrect."
      primaryAction={{
        label: "Browse All Courses",
        href: "/courses",
      }}
      secondaryAction={{
        label: "Back to Home",
        href: "/",
      }}
      activeTab="courses"
      icon={
        <svg
          className="w-10 h-10 md:w-12 md:h-12 text-[#4F46E5]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
          />
        </svg>
      }
    />
  );
}
