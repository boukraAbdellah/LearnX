# Implementation Prompt: Improve Course Page Styling and Layout

## Goal
Elevate and modernize the visual styling, layout, and responsiveness of the Course Detail page (`app/courses/[slug]/page.tsx`) and its child components in `components/course/` (`CourseHero`, `CourseOutcomes`, `CourseModuleList`, `CourseProgressBar`), adding a cohesive course sidebar card and instructor section while fully leveraging the Sanity course query data (`category`, `instructor`, `price`, `learningOutcomes`, `modules`, `lessons`).

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 2: Implementation prompt workflow and user approval before code changes.
  - Section 7: Course detail conventions (grounded in real data, preview badges, module and lesson structure, reverse refs).
  - Section 8: Content model (course title, slug, summary, coverImage, level, price, popular, studentCount, learningOutcomes, instructor, category, modules with lessons).
  - Section 13: Checks to run in `web` workspace (type check, lint, dev build).
- **`modern-web-guidance`**: Modern responsive layouts, container queries, sticky sidebars, accessible accordion patterns, and CSS glassmorphism.
- **`sanity-best-practices`**: Working with Sanity image URLs, GROQ projections, and safe optional property chaining.

---

## Code & Configuration Inspected
- **`app/courses/[slug]/page.tsx`**:
  - Currently wraps content inside a fixed-width `max-w-[1024px]` container with a repeating diagonal hatched background and basic linear stacking.
  - Ignores available data fields already returned by `COURSE_BY_SLUG_QUERY` (such as `category`, `instructor`, `price`).
  - Calls `CourseHero`, `CourseOutcomes`, `CourseModuleList`, and `CourseProgressBar`.
- **`components/course/CourseHero.tsx`**:
  - Simple flex row layout with an aspect 4:3 thumbnail and basic text. Lacks visual punch, category pills, instructor byline, and price/enrollment context.
- **`components/course/CourseOutcomes.tsx`**:
  - White card with 2-column grid of outcomes. Could use refined typography, modern icons, and better spacing.
- **`components/course/CourseModuleList.tsx`**:
  - Accordion for modules with simple list items. Missing "Expand All / Collapse All" toggle, lesson count summary, and interactive hover treatments.
- **`components/course/CourseProgressBar.tsx`**:
  - Edge-to-edge sticky footer. Can be modernized into a sleek, floating frosted-glass progress dock with refined metrics.
- **`app/globals.css`**:
  - Color palette: `primary-500 (#4F46E5)`, `primary-400 (#6366F1)`, `neutral-900 (#0F172A)`, `neutral-700 (#334155)`, `neutral-500 (#64748B)`, `neutral-100 (#F1F5F9)`, etc.
  - Typography classes: `font-serif` (Playfair Display) and `font-sans` (Inter).

---

## Decisions & Assumptions
1. **Layout Strategy (Two-Column Desktop + Clean Mobile Stacking)**:
   - On `lg` screens (1024px+): Modern 2-column layout. The left/main column (~68% width) contains breadcrumbs, course title, summary, metadata badges, outcomes, curriculum accordion, and instructor profile. The right column (~32% width) features a sticky course preview & enrollment card (cover image with preview indicator, pricing, primary CTA, course feature highlights).
   - On mobile/tablet: The layout gracefully collapses into a single column with the preview card/hero first, followed by key actions, outcomes, curriculum, and instructor.
2. **Design Tokens & Visual Language**:
   - Align with the deep indigo primary palette (`#4F46E5`, `#6366F1`, `#EEF2FF`) and warm clean background tones (`#FAF7F5` / white cards with subtle slate borders `#E2E8F0`).
   - Utilize Playfair Display for majestic course headings and Inter for crisp, scannable UI copy.
   - Add micro-animations (smooth hover transforms, chevron rotations, badge glows).
3. **Curriculum Experience**:
   - Add an "Expand All / Collapse All" button so learners can quickly inspect all modules or collapse them.
   - Show lesson count and module duration in module headers.
   - Differentiate Free Preview lessons (eye/play icon + "Free Preview" badge + indigo hover) from enrolled/locked lessons.
4. **Instructor & Metadata Integration**:
   - Render instructor info (photo, name, expertise) directly within the hero byline and in a dedicated instructor spotlight section.
   - Display category badge and "Popular" pill alongside level and duration badges.

---

## Files Expected to Touch
- `app/courses/[slug]/page.tsx` (Update data typing, two-column layout, structure, and sticky dock container)
- `components/course/CourseHero.tsx` (Update layout, typography, category badge, instructor byline, and metadata badges)
- `components/course/CourseOutcomes.tsx` (Modernize card design, grid layout, icon styling, and typography)
- `components/course/CourseModuleList.tsx` (Add "Expand All / Collapse All", refine accordion rows, lesson items, badges, and counters)
- `components/course/CourseProgressBar.tsx` (Redesign into a floating frosted-glass dock with progress percentage and continue button)
- `components/course/CourseSidebarCard.tsx` (NEW: Sticky course preview and action card for desktop sidebar)
- `components/course/CourseInstructor.tsx` (NEW: Dedicated instructor profile card)

---

## Requirements
1. **Aesthetic Excellence**: High-end, premium look and feel with clear hierarchy, polished typography, subtle shadows, and crisp borders.
2. **Responsive**: Seamless experience across 375px mobile, 768px tablet, and 1280px+ desktop viewports.
3. **No Breaking Changes to Data**: Strict adherence to existing Sanity GROQ query outputs and Next.js routing conventions.
4. **Accessibility**: Semantic HTML (`<section>`, `<article>`, `<button aria-expanded>`), clear contrast ratios, keyboard-navigable accordions, and alt attributes.

---

## Security Considerations
- Data read from Sanity remains server-side.
- No sensitive keys or tokens exposed to client components.
- Sanitized image URLs via `urlFor()`.

---

## Acceptance Criteria
- [ ] Course detail page renders a modern, responsive two-column layout on desktop and single-column layout on mobile.
- [ ] Course hero displays category, title, summary, instructor byline, student count, level, and duration with refined typography.
- [ ] Sticky sidebar card on desktop displays course media thumbnail, price/preview status, primary and secondary CTA buttons, and course highlights.
- [ ] "What you'll learn" outcomes component displays in a modern card grid with distinct iconography.
- [ ] Curriculum list features an "Expand All / Collapse All" toggle, module counters, duration badges, and polished lesson rows with free preview indicators.
- [ ] Instructor spotlight section displays instructor photo, name, and expertise.
- [ ] Floating sticky progress bar dock cleanly anchors at the bottom of the viewport with responsive padding.
- [ ] TypeScript type-checking and Next.js build pass with 0 errors.

---

## Checks to Run
- `npm run typecheck` or `npx tsc --noEmit` in root workspace.
- `npm run lint` in root workspace.
- Dev build / page rendering test.

---

## Manual Test Steps
1. Navigate to `http://localhost:3000/courses/<slug>` (e.g. any seeded course slug like `ai-agents-with-sanity-and-nextjs`).
2. Verify desktop view: Confirm two-column layout with sticky sidebar card on the right, hero header, outcomes, curriculum, and instructor spotlight on the left.
3. Verify interactive curriculum: Click individual module headers to expand/collapse; click "Expand all" / "Collapse all" button and verify all modules respond.
4. Verify responsiveness: Resize viewport to tablet (768px) and mobile (375px); ensure sidebar card flows smoothly and content does not overflow.
5. Verify floating progress bar: Scroll through the page and check that the progress dock floats cleanly without obscuring content or overlapping the footer.
