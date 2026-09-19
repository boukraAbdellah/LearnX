import React from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { UserIcon } from "@/components/ui/icons";

export interface InstructorProps {
  instructor: {
    _id?: string;
    name?: string | null;
    slug?: string | null;
    photo?: SanityImageSource | null;
    expertise?: string[] | string | null;
  } | null;
}

export function CourseInstructor({ instructor }: InstructorProps) {
  if (!instructor || !instructor.name) return null;

  const photoSrc = instructor.photo
    ? urlFor(instructor.photo).width(160).height(160).fit("crop").url()
    : null;

  const expertiseList: string[] = Array.isArray(instructor.expertise)
    ? instructor.expertise.filter((item): item is string => Boolean(item))
    : typeof instructor.expertise === "string" && instructor.expertise.trim()
      ? [instructor.expertise.trim()]
      : [];

  return (
    <section className="px-6 lg:px-8 pb-8">
      <div className="bg-white border border-[#EDE5DF] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-6 rounded-full bg-primary-500" />
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">
            Instructor
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 shadow-xs">
            {photoSrc ? (
              <Image
                src={photoSrc}
                alt={instructor.name}
                fill
                className="object-cover"
                sizes="72px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                <UserIcon size={28} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h3 className="text-lg font-bold text-neutral-900">
                {instructor.name}
              </h3>
              {instructor.slug && (
                <Link
                  href={`/instructors/${instructor.slug}`}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View profile →
                </Link>
              )}
            </div>

            {/* Expertise Tags */}
            {expertiseList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {expertiseList.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
