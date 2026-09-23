"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation, BottomBars } from "@/components/ui";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { SearchBrowseCallout } from "@/components/search/SearchBrowseCallout";
import type { SearchApiResponse, SearchResultItem } from "@/components/search/types";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";

  const [data, setData] = useState<SearchApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("relevant");

  useEffect(() => {
    let isCancelled = false;

    async function fetchResults() {
      if (!q.trim()) {
        setData({
          query: "",
          totalResults: 0,
          totalCourses: 0,
          results: [],
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        if (!res.ok) {
          throw new Error(`Search request failed with status ${res.status}`);
        }
        const json: SearchApiResponse = await res.json();
        if (!isCancelled) {
          setData(json);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "Failed to load search results.";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchResults();

    return () => {
      isCancelled = true;
    };
  }, [q]);

  const handleNewSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const sortedResults = useMemo(() => {
    if (!data?.results) return [];
    const items = [...data.results];

    switch (sortBy) {
      case "duration-asc":
        return items.sort((a, b) => a.duration - b.duration);
      case "duration-desc":
        return items.sort((a, b) => b.duration - a.duration);
      case "title":
        return items.sort((a, b) => a.title.localeCompare(b.title));
      case "relevant":
      default:
        return items.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    }
  }, [data, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between selection:bg-[#4F46E5]/15 selection:text-[#4F46E5]">
      <div>
        <Navigation activeTab="" />

        <main className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <SearchHeader
            query={q}
            totalResults={data?.totalResults ?? 0}
            totalCourses={data?.totalCourses ?? 0}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSearchSubmit={handleNewSearch}
          />

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full bg-white border border-[#E2E8F0] rounded-[18px] p-6 animate-pulse flex flex-col md:flex-row gap-6"
                >
                  <div className="w-full md:w-[260px] aspect-[16/10] bg-[#F1F5F9] rounded-[12px] shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-[#F1F5F9] rounded w-1/4" />
                    <div className="h-6 bg-[#F1F5F9] rounded w-3/4" />
                    <div className="h-4 bg-[#F1F5F9] rounded w-full" />
                    <div className="h-4 bg-[#F1F5F9] rounded w-2/3" />
                    <div className="h-8 bg-[#F1F5F9] rounded w-1/3 pt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-12 px-4 bg-white border border-red-200 rounded-[18px]">
              <p className="text-red-600 font-medium mb-2">Something went wrong</p>
              <p className="text-sm text-[#64748B] mb-4">{error}</p>
              <button
                onClick={() => router.refresh()}
                className="px-4 py-2 bg-[#4F46E5] text-white text-sm font-medium rounded-lg hover:bg-[#4338CA] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && !error && (!data || data.results.length === 0) && (
            <div className="text-center py-16 px-4 bg-white border border-[#E2E8F0] rounded-[18px] shadow-xs">
              <div className="w-14 h-14 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h3 className="font-serif text-[22px] font-bold text-[#0F172A] mb-2">
                No matching results found
              </h3>
              <p className="text-[14.5px] text-[#64748B] max-w-md mx-auto mb-6">
                We couldn&apos;t find any lessons or video moments matching &ldquo;{q}&rdquo;. Try searching for general topics like &ldquo;data fetching&rdquo;, &ldquo;routing&rdquo;, or &ldquo;docker&rdquo;.
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-[14px] font-semibold hover:bg-[#4338CA] transition-colors shadow-xs"
              >
                Browse All Courses →
              </button>
            </div>
          )}

          {/* Results List */}
          {!loading && !error && sortedResults.length > 0 && (
            <div className="space-y-4">
              {sortedResults.map((result: SearchResultItem) => (
                <SearchResultCard key={result.id} result={result} />
              ))}
            </div>
          )}

          {/* Bottom Callout Banner */}
          {!loading && <SearchBrowseCallout />}
        </main>
      </div>

      <BottomBars />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4F46E5]" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
