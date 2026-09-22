"use client";

import React from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";

interface LessonNotesTabProps {
  notes?: PortableTextBlock[] | null;
}

const customPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif font-bold text-2xl text-neutral-900 tracking-tight mt-8 mb-4 border-b border-[#EDE5DF]/60 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-sans font-semibold text-lg text-neutral-900 mt-6 mb-3">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 py-1 my-4 italic text-neutral-700 bg-primary-50/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-1.5 my-4 text-sm sm:text-base text-neutral-700 marker:text-primary-500">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1.5 my-4 text-sm sm:text-base text-neutral-700 marker:text-primary-600 font-medium">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="text-xs bg-neutral-100 text-primary-700 font-mono px-1.5 py-0.5 rounded border border-neutral-200">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = value?.blank ? "_blank" : undefined;
      const rel = value?.blank ? "noopener noreferrer" : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-primary-600 hover:text-primary-700 underline font-medium transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    codeBlock: ({ value }) => {
      return (
        <div className="my-5 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md">
          {value?.language && (
            <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center justify-between">
              <span>{value.language}</span>
            </div>
          )}
          <pre className="p-4 text-xs sm:text-sm font-mono text-neutral-100 overflow-x-auto leading-relaxed">
            <code>{value?.code ?? ""}</code>
          </pre>
        </div>
      );
    },
  },
};

export function LessonNotesTab({ notes }: LessonNotesTabProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500 bg-white rounded-2xl border border-[#EDE5DF] p-8">
        <p className="text-sm font-medium">
          No additional notes authored for this lesson yet.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          Check out the Lesson Content tab for key points and reference
          resources.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDE5DF] p-6 sm:p-8 shadow-xs">
      <PortableText value={notes} components={customPortableTextComponents} />
    </div>
  );
}
