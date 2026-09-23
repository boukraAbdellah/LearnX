export interface VideoSearchResult {
  id: string;
  type: "video";
  title: string;
  description: string;
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string;
  moduleNumber: number;
  lessonNumber: string;
  lessonTitle: string;
  lessonSlug: string;
  thumbnailUrl: string | null;
  startSeconds: number;
  timestampLabel: string;
  duration: number;
  score?: number;
}

export interface LessonSearchResult {
  id: string;
  type: "lesson";
  title: string;
  description: string;
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string;
  moduleNumber: number;
  lessonNumber: string;
  lessonSlug: string;
  keyPoints: string[];
  duration: number;
  score?: number;
}

export type SearchResultItem = VideoSearchResult | LessonSearchResult;

export interface SearchApiResponse {
  query: string;
  totalResults: number;
  totalCourses: number;
  results: SearchResultItem[];
}
