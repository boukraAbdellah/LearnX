/**
 * GROQ query definitions for LearnX.
 *
 * All queries are wrapped in defineQuery for TypeGen support.
 * All projections are explicit — no whole-document fetches.
 * All queries use $params for variables (exception: slice bounds).
 */
import { defineQuery } from 'next-sanity'

// ─── Catalog ─────────────────────────────────────────────────────────────────

/**
 * Full course catalog — ordered newest first.
 * Used by the catalog/homepage listing page.
 */
export const COURSES_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    "isPopular": coalesce(popular, false),
    studentCount,
    "modulesCount": count(modules),
    "category": category->{ title, "slug": slug.current },
    "instructor": instructor->{ name, "slug": slug.current, photo },
    "modules": modules[]{
      _key,
      title,
      "lessons": lessons[]->{
        _id,
        duration
      }
    }
  }
`)

/** Minimal slug list for generateStaticParams on the catalog. */
export const COURSE_SLUGS_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`)

// ─── Course Detail ────────────────────────────────────────────────────────────

/**
 * Full course document with expanded modules and lesson stubs.
 * Used by /courses/[slug].
 */
export const COURSE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    "isPopular": coalesce(popular, false),
    studentCount,
    learningOutcomes,
    "category": category->{ title, "slug": slug.current },
    "instructor": instructor->{
      _id,
      name,
      "slug": slug.current,
      photo,
      expertise
    },
    "modules": modules[]{
      _key,
      title,
      summary,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        duration,
        freePreview,
        "isFreePreview": coalesce(freePreview, false),
        thumbnail,
        "poster": thumbnail
      }
    }
  }
`)

// ─── Lesson ───────────────────────────────────────────────────────────────────

/**
 * Full lesson document including Portable Text notes, key points, and resources.
 * Used by /lessons/[slug].
 */
export const LESSON_BY_SLUG_QUERY = defineQuery(`
  *[_type == "lesson" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    videoUrl,
    thumbnail,
    "poster": thumbnail,
    duration,
    freePreview,
    "isFreePreview": coalesce(freePreview, false),
    studentCount,
    notes,
    keyPoints,
    proTip,
    resources
  }
`)

/** Minimal slug list for generateStaticParams on lesson pages. */
export const LESSON_SLUGS_QUERY = defineQuery(`
  *[_type == "lesson" && defined(slug.current)]{ "slug": slug.current }
`)

/**
 * Reverse-reference: find the course that contains this lesson.
 * Used to build breadcrumbs and derive module/lesson position numbers.
 * $lessonId — the lesson document _id.
 */
export const LESSON_COURSE_QUERY = defineQuery(`
  *[_type == "course" && references($lessonId)][0]{
    _id,
    title,
    "slug": slug.current,
    "modules": modules[]{
      _key,
      title,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        freePreview,
        "isFreePreview": coalesce(freePreview, false)
      }
    }
  }
`)

// ─── Instructor ───────────────────────────────────────────────────────────────

/**
 * Full instructor profile with their courses.
 * Used by /instructors/[slug].
 */
export const INSTRUCTOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "instructor" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    photo,
    expertise,
    bio,
    "courses": *[_type == "course" && instructor._ref == ^._id]{
      _id,
      title,
      "slug": slug.current,
      coverImage,
      level,
      studentCount
    }
  }
`)

/** Minimal slug list for generateStaticParams on instructor pages. */
export const INSTRUCTOR_SLUGS_QUERY = defineQuery(`
  *[_type == "instructor" && defined(slug.current)]{ "slug": slug.current }
`)

// ─── Category ─────────────────────────────────────────────────────────────────

/**
 * Catalog filtered by category slug.
 * Used by /categories/[slug].
 */
export const COURSES_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "course" && defined(slug.current) && category->slug.current == $categorySlug]
    | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    coverImage,
    level,
    price,
    popular,
    "isPopular": coalesce(popular, false),
    studentCount,
    "instructor": instructor->{ name, photo }
  }
`)
