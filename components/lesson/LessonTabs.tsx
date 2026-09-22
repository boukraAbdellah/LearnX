"use client";

import React, { useState } from "react";
import { LessonContentTab, type LessonResource } from "./LessonContentTab";
import { LessonNotesTab } from "./LessonNotesTab";
import type { PortableTextBlock } from "next-sanity";

interface LessonTabsProps {
  overview?: string | null;
  keyPoints?: string[] | null;
  proTip?: string | null;
  resources?: LessonResource[] | null;
  notes?: PortableTextBlock[] | null;
}

export function LessonTabs({
  overview,
  keyPoints,
  proTip,
  resources,
  notes,
}: LessonTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "notes">("content");

  return (
    <div className="w-full">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-8 border-b border-[#EDE5DF] mb-8">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`pb-3.5 text-sm sm:text-base font-medium transition-colors relative cursor-pointer ${
            activeTab === "content"
              ? "text-primary-600 font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span>Lesson Content</span>
          {activeTab === "content" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`pb-3.5 text-sm sm:text-base font-medium transition-colors relative cursor-pointer ${
            activeTab === "notes"
              ? "text-primary-600 font-semibold"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span>Notes</span>
          {activeTab === "notes" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === "content" ? (
        <LessonContentTab
          overview={overview}
          keyPoints={keyPoints}
          proTip={proTip}
          resources={resources}
        />
      ) : (
        <LessonNotesTab notes={notes} />
      )}
    </div>
  );
}
