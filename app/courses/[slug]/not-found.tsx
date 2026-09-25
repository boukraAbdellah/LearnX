import { NotFoundView } from "@/components/ui/not-found-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Not Found | LearnX",
  description: "The course you are looking for is currently unavailable or does not exist.",
};

export default function CourseNotFound() {
  return (
    <NotFoundView
      badgeText="Course Unavailable"
      title="Course Not Found"
      description="We couldn't locate the course you're looking for. It may have been archived, unpublished, or the link may have changed."
      primaryAction={{
        label: "Explore All Courses",
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
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      }
    />
  );
}
