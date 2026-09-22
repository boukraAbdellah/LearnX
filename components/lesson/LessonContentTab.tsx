"use client";

import React from "react";
import {
  CheckCircleIcon,
  LightbulbIcon,
  DocumentTextIcon,
  GithubIcon,
  ExternalLinkIcon,
} from "@/components/ui/icons";

export interface LessonResource {
  type?: string | null;
  title: string;
  description?: string | null;
  url?: string | null;
}

interface LessonContentTabProps {
  overview?: string | null;
  keyPoints?: string[] | null;
  proTip?: string | null;
  resources?: LessonResource[] | null;
}

/** Pick appropriate resource icon based on type string */
function renderResourceIcon(type?: string | null) {
  const t = (type ?? "").toLowerCase();
  if (t === "github" || t.includes("repo") || t.includes("code")) {
    return <GithubIcon size={18} className="text-neutral-700" />;
  }
  return <DocumentTextIcon size={18} className="text-primary-600" />;
}

export function LessonContentTab({
  overview,
  keyPoints,
  proTip,
  resources,
}: LessonContentTabProps) {
  const points = keyPoints?.filter(Boolean) ?? [];
  const resList = resources?.filter((r) => r.title) ?? [];

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      {overview && (
        <section aria-labelledby="overview-heading">
          <h2
            id="overview-heading"
            className="font-sans font-bold text-xl sm:text-2xl text-neutral-900 mb-3"
          >
            Overview
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
            {overview}
          </p>
        </section>
      )}

      {/* In this lesson you will: Key Points */}
      {points.length > 0 && (
        <section aria-labelledby="keypoints-heading" className="pt-2">
          <h3
            id="keypoints-heading"
            className="font-sans font-semibold text-base sm:text-lg text-neutral-900 mb-4"
          >
            In this lesson you will:
          </h3>
          <ul className="space-y-3">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="text-primary-600 shrink-0 mt-0.5">
                  <CheckCircleIcon size={18} />
                </div>
                <span className="text-sm sm:text-base text-neutral-700 leading-snug">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pro Tip Callout Box */}
      {proTip && (
        <div className="bg-[#FFF9F5] border border-[#F3ECE7] rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-primary-100/70 text-primary-600 flex items-center justify-center shrink-0 border border-primary-200/60 mt-0.5">
            <LightbulbIcon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-sans font-bold text-sm text-neutral-900">
              Pro Tip
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
              {proTip}
            </p>
          </div>
        </div>
      )}

      {/* Resources Section */}
      {resList.length > 0 && (
        <section aria-labelledby="resources-heading" className="pt-2">
          <h3
            id="resources-heading"
            className="font-sans font-bold text-xl text-neutral-900 mb-4"
          >
            Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resList.map((res, idx) => {
              const content = (
                <div className="h-full bg-white border border-[#EDE5DF] hover:border-primary-200 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                        {renderResourceIcon(res.type)}
                      </div>
                      {res.url && (
                        <div className="text-neutral-400 group-hover:text-primary-600 transition-colors shrink-0">
                          <ExternalLinkIcon size={14} />
                        </div>
                      )}
                    </div>
                    <h4 className="font-sans font-semibold text-sm text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>
              );

              if (res.url) {
                return (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return <div key={idx}>{content}</div>;
            })}
          </div>
        </section>
      )}
    </div>
  );
}
