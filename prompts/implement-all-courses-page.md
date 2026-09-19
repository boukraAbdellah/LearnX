# Implementation Prompt: Implement All Courses Page

## Goal
Implement a simple, elegant All Courses catalog page at `app/courses/page.tsx` that fetches all courses from Sanity using `getCourses()`, renders them in a responsive 3-column grid within the shared 1024px framed container, and provides breadcrumbs and course metadata.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1: "The catalog, the course detail page... Build nothing beyond that. Do not overbuild."
  - Section 5: "Pages (catalog, course, lesson, instructor) are read only. They display stored data."
  - Section 13: "Checks to run: In web: type check, lint, a production build when routes, config, or server code change, and the dev server."
- **`sanity-best-practices`**: Safe data fetching via `getCourses()` and image asset rendering.

---

## Code & Configuration Inspected
- **`app/page.tsx`**:
  - Contains container styles (`max-w-[1024px]`, repeating diagonal hatched background).
  - Uses `getCourses()` from `@/sanity/lib/fetch`.
  - Maps courses into `CourseCard` with `CourseIcon`, `level`, `modulesCount`, and `duration`.
- **`sanity/lib/queries.ts`**:
  - `COURSES_QUERY`: Returns all courses with `title`, `slug`, `summary`, `coverImage`, `level`, `price`, `popular`, `modules`.
- **`components/ui/cards.tsx`**:
  - `CourseCard`: Reusable component displaying course icon, title, description, level, duration, and module count.

---

## Decisions & Assumptions
1. **Container Alignment**:
   - Use the same container as the homepage and course page:
     - Outer wrapper: `min-h-screen w-full flex flex-col items-center justify-start relative` with repeating 45° diagonal gradient.
     - Central frame: `w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col justify-between relative`.
2. **Page Content**:
   - Navigation header (`Navigation` with `activeTab="courses"`).
   - Breadcrumbs (`Home` / `All Courses`).
   - Page header with title (`All Courses`), subtitle, and count badge (`X courses available`).
   - Responsive course grid (1 column on mobile, 2 columns on small screens, 3 columns on medium/desktop).
   - Reuse existing `CourseCard` and `CourseIcon` without inventing any extra fields or overcomplicating filters.
   - Signature `BottomBars` at the base.
3. **Keep It Simple**:
   - Server-rendered page fetching real Sanity data via `getCourses()`.
   - Clean, lightweight, and fast with no unnecessary widgets.

---

## Files Expected to Touch
- `app/courses/page.tsx` (NEW: All Courses catalog page)

---

## Requirements
1. Responsive layout matching the Vertex design system and 1024px frame.
2. Grounded strictly in Sanity course catalog data.
3. Accessible links leading to `/courses/[slug]`.

---

## Security Considerations
- Pure server-side read query with existing `getCourses()` client helper.
- No write actions, no exposed tokens.

---

## Acceptance Criteria
- [ ] Navigating to `/courses` renders the All Courses catalog page with status 200.
- [ ] Page matches the 1024px framed container and repeating background.
- [ ] All courses from Sanity are displayed in a responsive grid with their real title, level, duration, and module counts.
- [ ] Clicking any course card navigates to `/courses/[slug]`.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [ ] Production build (`npm run build`) succeeds and creates the `/courses` static page.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
