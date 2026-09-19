import React from "react";
import { CheckCircleIcon } from "@/components/ui/icons";

export interface LearningOutcome {
  icon?: string | null;
  title?: string | null;
  description?: string | null;
}

interface CourseOutcomesProps {
  outcomes: LearningOutcome[];
}

function OutcomeBadge({ icon }: { icon?: string | null }) {
  if (icon && icon.length <= 4) {
    return (
      <span className="text-xl leading-none select-none" aria-hidden="true">
        {icon}
      </span>
    );
  }

  return (
    <CheckCircleIcon
      size={20}
      className="text-primary-500 shrink-0"
      aria-hidden="true"
    />
  );
}

export function CourseOutcomes({ outcomes }: CourseOutcomesProps) {
  if (!outcomes || outcomes.length === 0) return null;

  return (
    <section className="px-6 lg:px-8 pb-8">
      <div className="bg-white border border-[#EDE5DF] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2.5 h-6 rounded-full bg-primary-500" />
          <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">
            What You&apos;ll Learn
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outcomes.map((outcome, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-4.5 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:border-primary-200 hover:bg-primary-50/20 transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <OutcomeBadge icon={outcome.icon} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[15px] text-neutral-900 mb-1 leading-snug">
                  {outcome.title}
                </p>
                {outcome.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {outcome.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
