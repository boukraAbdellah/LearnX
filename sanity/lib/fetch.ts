/**
 * Typed fetch helpers for LearnX server-side data access.
 *
 * All functions in this file are SERVER-ONLY.
 * Do NOT import this file from 'use client' components.
 *
 * Each helper wraps sanityFetch (from the Live Content API) with the
 * corresponding query and params, so call-sites stay clean.
 */
import { sanityFetch } from './live'
import {
  COURSE_BY_SLUG_QUERY,
  COURSE_SLUGS_QUERY,
  COURSES_BY_CATEGORY_QUERY,
  COURSES_QUERY,
  INSTRUCTOR_BY_SLUG_QUERY,
  INSTRUCTOR_SLUGS_QUERY,
  LESSON_BY_SLUG_QUERY,
  LESSON_COURSE_QUERY,
  LESSON_SLUGS_QUERY,
  USER_PROGRESS_QUERY,
} from './queries'


// ─── Catalog ─────────────────────────────────────────────────────────────────

/** Returns all published courses for the catalog page. */
export async function getCourses() {
  const { data } = await sanityFetch({ query: COURSES_QUERY })
  return data
}

/** Returns an array of `{ slug }` objects for generateStaticParams. */
export async function getCourseSlugs() {
  const { data } = await sanityFetch({ query: COURSE_SLUGS_QUERY })
  return data
}

// ─── Course Detail ────────────────────────────────────────────────────────────

/**
 * Returns the full course document for a given slug, including expanded modules.
 * Returns null if not found — use `notFound()` in the page.
 */
export async function getCourseBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

// ─── Lesson ───────────────────────────────────────────────────────────────────

/**
 * Returns the full lesson document for a given slug.
 * Includes Portable Text notes, key points, pro tip, and resources.
 * Returns null if not found.
 */
export async function getLessonBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

/** Returns an array of `{ slug }` objects for generateStaticParams on lesson pages. */
export async function getLessonSlugs() {
  const { data } = await sanityFetch({ query: LESSON_SLUGS_QUERY })
  return data
}

/**
 * Returns the course that contains the given lesson (reverse-reference lookup).
 * Used for breadcrumbs and deriving module/lesson position numbers.
 * @param lessonId - the Sanity document _id of the lesson
 */
export async function getLessonCourse(lessonId: string) {
  const { data } = await sanityFetch({
    query: LESSON_COURSE_QUERY,
    params: { lessonId },
  })
  return data
}

// ─── Instructor ───────────────────────────────────────────────────────────────

/**
 * Returns the full instructor profile including their courses.
 * Returns null if not found.
 */
export async function getInstructorBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: INSTRUCTOR_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

/** Returns an array of `{ slug }` objects for generateStaticParams on instructor pages. */
export async function getInstructorSlugs() {
  const { data } = await sanityFetch({ query: INSTRUCTOR_SLUGS_QUERY })
  return data
}

// ─── Category ─────────────────────────────────────────────────────────────────

/**
 * Returns courses filtered by category slug.
 * Used by /categories/[slug] pages.
 */
export async function getCoursesByCategory(categorySlug: string) {
  const { data } = await sanityFetch({
    query: COURSES_BY_CATEGORY_QUERY,
    params: { categorySlug },
  })
  return data
}

// ─── Progress ─────────────────────────────────────────────────────────────────

/**
 * Returns learner progress for a given Clerk userId.
 * Returns null if not found.
 */
export async function getUserProgress(userId: string) {
  const { data } = await sanityFetch({
    query: USER_PROGRESS_QUERY,
    params: { userId },
  })
  return data
}

