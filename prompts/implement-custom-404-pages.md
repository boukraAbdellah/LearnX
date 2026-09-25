# Implementation Prompt: Custom 404 Pages for Courses, Lessons, and General Routes

Build dedicated, polished 404 Not Found pages in LearnX:
1. **General Not Found Page** (`app/not-found.tsx`): Catch-all for invalid paths (e.g. `/foo`, `/unknown-path`).
2. **Course Not Found Page** (`app/courses/[slug]/not-found.tsx`): Triggered when a course slug does not exist in Sanity.
3. **Lesson Not Found Page** (`app/lessons/[slug]/not-found.tsx`): Triggered when a lesson slug does not exist in Sanity.

---

## 1. Goal

1. **Provide a Unified, Premium 404 Experience**:
   - Adhere strictly to the LearnX / Vertex design system: `#FAF7F5` warm neutral background, Deep Indigo (`#4F46E5`) accents, Playfair Display serif typography, structured containers (`max-w-[1440px]`), and responsive layouts.
   - Every 404 page includes the site `Navigation` header so users never hit a dead end and can immediately navigate back to Home, Courses, or My Learning.
2. **Context-Specific Messaging & CTAs**:
   - **General 404 (`app/not-found.tsx`)**:
     - Large decorative 404 badge / numeral, "Page Not Found" heading.
     - Helpful copy explaining the page might have been moved, deleted, or mistyped.
     - CTAs: "Back to Home" (primary) and "Browse Courses" (secondary).
   - **Course 404 (`app/courses/[slug]/not-found.tsx`)**:
     - Course/curriculum-themed icon, "Course Not Found" heading.
     - Copy clarifying that the requested course is unavailable or unpublished.
     - CTAs: "Explore All Courses" (primary) and "Go to Home" (secondary).
   - **Lesson 404 (`app/lessons/[slug]/not-found.tsx`)**:
     - Video/lesson-themed icon, "Lesson Not Found" heading.
     - Copy explaining that the requested lesson or video clip could not be located.
     - CTAs: "Browse Courses" (primary) and "Go to Home" (secondary).

---

## 2. Skills Read

- `AGENTS.md` (Sections 2, 3, 5, 13):
  - Follow the loop: prompt -> approval -> implementation -> checks.
  - UI work: Maintain responsive layouts, Vertex design system, exact typography and colors.
  - Checks: Type check, lint, and production build must pass.
- `modern-web-guidance`: Accessible semantic structure (`main`, `h1`, `p`, proper button/link roles), responsive container layout.

---

## 3. Code Inspected

- [app/layout.tsx](file:///c:/Dev/Projects/LearnX/app/layout.tsx): Root layout with font configurations (Inter & Playfair Display) and ClerkProvider.
- [app/courses/[slug]/page.tsx](file:///c:/Dev/Projects/LearnX/app/courses/[slug]/page.tsx): Lines 126-130 invoke `notFound()` when `getCourseBySlug(slug)` returns null.
- [app/lessons/[slug]/page.tsx](file:///c:/Dev/Projects/LearnX/app/lessons/[slug]/page.tsx): Lines 119-122 invoke `notFound()` when `getLessonBySlug(slug)` returns null.
- [components/ui/navigation.tsx](file:///c:/Dev/Projects/LearnX/components/ui/navigation.tsx): Header with logo, Courses, My Learning, and Clerk auth state.
- [components/ui/button.tsx](file:///c:/Dev/Projects/LearnX/components/ui/button.tsx): Button component with primary, secondary, and tertiary variants.
- [app/globals.css](file:///c:/Dev/Projects/LearnX/app/globals.css): Typography utilities (`display-1`, `display-2`, `heading-1`, `body-large`) and color tokens.

---

## 4. Decisions and Assumptions

1. **Next.js App Router Route Segments**:
   - `app/not-found.tsx` serves as the global root fallback for unmatched routes.
   - `app/courses/[slug]/not-found.tsx` intercepts `notFound()` calls specifically thrown from `app/courses/[slug]/page.tsx`.
   - `app/lessons/[slug]/not-found.tsx` intercepts `notFound()` calls specifically thrown from `app/lessons/[slug]/page.tsx`.
2. **Component Reusability**:
   - Build a clean, reusable `NotFoundLayout` component or shared not-found card structure in `components/ui/not-found-card.tsx` so visual hierarchy, animations, and container paddings are identical while permitting customized titles, subtitles, icons, and buttons.
3. **No External Assets Required**:
   - Use clean, polished SVG icons (compass / search / book / play / alert) styled with Deep Indigo and slate tints.

---

## 5. Files Expected to Touch

- `components/ui/not-found-view.tsx` *(create)*: Reusable, responsive not-found view adhering to the Vertex design system.
- `app/not-found.tsx` *(create)*: General 404 page for unmatched routes.
- `app/courses/[slug]/not-found.tsx` *(create)*: Course-specific 404 page.
- `app/lessons/[slug]/not-found.tsx` *(create)*: Lesson-specific 404 page.

---

## 6. Security Considerations

- Pages are read-only public surfaces; no tokens or sensitive user data are displayed or fetched.
- Input URLs/slugs are not reflected insecurely into raw HTML, preventing XSS.

---

## 7. Acceptance Criteria

1. Navigating to an arbitrary route (e.g. `/this-page-does-not-exist`) renders `app/not-found.tsx` with "Page Not Found", site navigation, and Home/Courses buttons.
2. Navigating to `/courses/non-existent-course-slug-12345` triggers `app/courses/[slug]/not-found.tsx` with "Course Not Found" and "Explore All Courses" button.
3. Navigating to `/lessons/non-existent-lesson-slug-12345` triggers `app/lessons/[slug]/not-found.tsx` with "Lesson Not Found" and "Browse Courses" button.
4. All three pages are responsive across mobile and desktop, retaining the `#FAF7F5` aesthetic and working navigation.
5. `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass with 0 errors.

---

## 8. Checks to Run

- Web workspace:
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`

---

## 9. Manual Test Steps

1. Start dev server or visit production build.
2. Open `http://localhost:3000/some-random-broken-path` -> confirm General 404 page displays properly.
3. Open `http://localhost:3000/courses/not-a-real-course` -> confirm Course 404 page displays properly.
4. Open `http://localhost:3000/lessons/not-a-real-lesson` -> confirm Lesson 404 page displays properly.
5. Click the navigation links and action buttons on each page to confirm they return the user to active catalog routes.
