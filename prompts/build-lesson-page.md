# Implementation Prompt: Build Lesson Page

## Goal
Build the Lesson Detail page at `app/lessons/[slug]/page.tsx` faithfully matching the desktop layout and visual design from `design/vertex-lesson.png`, styled using the design tokens and Deep Indigo color palette defined in `app/globals.css`. The page must be fully wired to live Sanity content (`lesson` document + parent `course` reverse-lookup), support inline provider video playback (YouTube, Vimeo, Bunny) with timestamp seeking, provide interactive tabs for Lesson Content and Portable Text Notes, display course curriculum navigation with completion states, and offer bottom previous/next lesson navigation.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1: Lesson page with video plus notes.
  - Section 2: Implementation prompt workflow and user approval before code changes.
  - Section 3: Exact reproduction of desktop reference image (`design/vertex-lesson.png`) with sensible mobile responsiveness (stacking columns, collapsing sidebar).
  - Section 5: App structure (read-only Sanity server fetch, server-only Sanity client).
  - Section 7: Playback stays on site via provider embeds (YouTube, Vimeo, Bunny) using provider start parameter; no custom player; grounded data; free preview badge.
  - Section 8: Content model (course top-level, module embedded object, lesson standalone document with reverse-ref, rich text notes in Portable Text, key points, pro tip, resources).
  - Section 13: Checks to run in `web` workspace (typecheck, lint, build).
- **`sanity-best-practices`**: Portable Text rendering, GROQ projections, type safety, image URL builder.
- **`modern-web-guidance`**: Responsive flex/grid layouts, iframe embeds with aspect-ratio, accessible tabs and accordions.

---

## Code & Configuration Inspected
- **`design/vertex-lesson.png`**:
  - Top: Vertex navigation bar (logo, "Courses", "My Learning", notifications, avatar).
  - Split layout:
    - Left sidebar (fixed/sticky curriculum panel): "← Back to course" link, course badge/cover with title and completion percentage, module accordion list with module numbering ("Module 5 of 12"), completed checks, active module expanded with "Now playing" indicator on current lesson, and durations.
    - Right main content:
      - Breadcrumbs: `All Courses > [Course] > [Module] > [Lesson]`
      - Lesson badge: e.g. `LESSON 5.1`
      - Heading: Large serif title (Playfair Display) + Bookmark button
      - Subtitle / summary
      - Metadata bar: duration, level badge ("Intermediate"), student count ("3,426 students")
      - Video player: 16:9 embedded player with provider playback
      - Tabs: "Lesson Content" (active) and "Notes"
      - Tab 1 ("Lesson Content"): Overview paragraph, "In this lesson you will:" bullet list with checkmarks, "Pro Tip" highlight callout box, "Resources" card grid (docs, guide, repo).
      - Tab 2 ("Notes"): Rich text notes rendered from Sanity Portable Text.
      - Bottom bar: "← Previous Lesson" (with title and duration) and "Next Lesson →" (with title and duration).
- **`app/globals.css`**:
  - Brand colors: Primary deep indigo (`primary-500: #4F46E5`, `primary-400: #6366F1`, `primary-100: #E0E7FF`), slate neutrals (`neutral-900: #0F172A`, `neutral-700: #334155`, `neutral-500: #64748B`, `neutral-100: #F1F5F9`, `neutral-50: #FAFAFC`).
  - Typography: Serif `var(--font-playfair)` and Sans `var(--font-inter)`.
- **`sanity/lib/queries.ts` & `sanity/lib/fetch.ts`**:
  - `LESSON_BY_SLUG_QUERY`: Fetches `_id, title, slug, videoUrl, thumbnail, duration, freePreview, studentCount, notes, keyPoints, proTip, resources`.
  - `LESSON_COURSE_QUERY`: Reverse-references parent course to extract modules and sibling lessons. Needs minor projection expansion to include `coverImage`, `level`, and lesson `duration` for complete sidebar display.
  - `getLessonBySlug()`, `getLessonSlugs()`, `getLessonCourse()` are already wired in `fetch.ts`.

---

## Decisions & Assumptions
1. **Color Palette Alignment**:
   - The reference mockup uses coral/terracotta buttons, but the user explicitly requested: `"(for collors follow @[app/globals.css])"`. We will use the Deep Indigo palette (`#4F46E5`, `#6366F1`, `#EEF2FF`) for primary actions, active indicators, "Now playing" badge, and tab active states, combined with the warm slate and neutral backgrounds (`#FAF7F5`, `#EDE5DF`, `#0F172A`).
2. **Video Provider Embed**:
   - In accordance with Section 7 of `AGENTS.md`, we will render a dedicated provider embed component (`LessonVideoEmbed`) supporting YouTube, Vimeo, and Bunny Stream URLs.
   - We will support URL timestamp query params (`?start=seconds` or `?t=seconds`) to start the video at the exact second specified.
   - If no video URL is present, an elegant poster fallback with lesson thumbnail and indicator is rendered.
3. **Curriculum Position Calculation**:
   - Since module numbers and lesson numbers (e.g. "LESSON 5.1") are derived from order (not stored), we compute the active module index, lesson index within module, previous lesson, and next lesson on the server from the parent course's `modules` array.
4. **Tabs Implementation**:
   - Interactive client component for switching between "Lesson Content" (Overview, Key Points, Pro Tip, Resources) and "Notes" (PortableText renderer).
5. **Responsive Layout**:
   - Desktop (1024px+): Two-column layout with left curriculum sidebar (w-[340px]) and right lesson content area.
   - Mobile / Tablet: Left sidebar collapses into an accessible slide-out drawer or top collapsible sheet with a "View Curriculum" button, ensuring the mobile video and lesson content are front-and-center.
6. **Data Enrichment**:
   - Update `LESSON_COURSE_QUERY` in `sanity/lib/queries.ts` to also fetch `coverImage`, `level`, and lesson `duration` so the sidebar and previous/next bars have accurate data.

---

## Files Expected to Touch
- `sanity/lib/queries.ts` (Enrich `LESSON_COURSE_QUERY` with `coverImage`, `level`, and lesson `duration`)
- `app/lessons/[slug]/page.tsx` (NEW: Server component for lesson page, metadata, and static params)
- `components/lesson/LessonSidebar.tsx` (NEW: Curriculum navigation sidebar with modules, lessons, completion badges, and mobile drawer)
- `components/lesson/LessonHeader.tsx` (NEW: Breadcrumbs, badge, serif title, bookmark action, and metadata row)
- `components/lesson/LessonVideoEmbed.tsx` (NEW: Responsive 16:9 provider video embed for YouTube, Vimeo, Bunny, with timestamp seeking)
- `components/lesson/LessonTabs.tsx` (NEW: Client component managing "Lesson Content" and "Notes" tab switching)
- `components/lesson/LessonContentTab.tsx` (NEW: Overview, Key Points list, Pro Tip callout, and Resources grid)
- `components/lesson/LessonNotesTab.tsx` (NEW: Portable Text notes renderer with styled typography and code blocks)
- `components/lesson/LessonBottomNav.tsx` (NEW: Previous and Next lesson navigation buttons with titles and durations)
- `components/ui/icons.tsx` (Add any supplemental icons like `LightbulbIcon`, `GithubIcon`, `DocumentTextIcon` if needed)

---

## Requirements
1. **Visual Fidelity**: Faithful recreation of `design/vertex-lesson.png` in structure, spacing, typography, and visual hierarchy.
2. **Design Token Conformance**: Use `#4F46E5` primary indigo from `globals.css` for primary buttons, active indicators, and accents.
3. **Video Playback**: Real iframe video player playing on page without redirecting learners off-site.
4. **Live Data Integration**: Wired to Sanity CMS via existing fetchers and queries.
5. **No Regressions**: Existing course and catalog pages remain completely unaffected.

---

## Security Considerations
- Sanity fetch is server-side with private dataset client.
- Video iframe embeds use standard `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` sandbox permissions.
- External resource links include `rel="noopener noreferrer"` and `target="_blank"`.

---

## Acceptance Criteria
- [ ] Navigating to `/lessons/[slug]` loads the lesson from Sanity CMS.
- [ ] Left sidebar displays "← Back to course", course title/logo/progress, and full curriculum modules with current lesson highlighted as "Now playing".
- [ ] Breadcrumbs accurately reflect `All Courses > [Course] > [Module] > [Lesson]`.
- [ ] Lesson badge displays correct derived number (e.g. `LESSON 5.1`).
- [ ] Video player embeds YouTube/Vimeo/Bunny with correct aspect ratio and plays directly on the page.
- [ ] Tab switching between "Lesson Content" and "Notes" works smoothly.
- [ ] "Lesson Content" renders Overview, Key Points checklist, Pro Tip box, and Resource cards.
- [ ] "Notes" tab renders rich Portable Text with formatted code/quotes/headings.
- [ ] Bottom navigation displays previous and next lesson links with durations and navigates correctly.
- [ ] TypeScript type-checking and Next.js build succeed with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit` in root workspace.
- `npm run lint` in root workspace.
- `npm run build` in root workspace.
- Browser test of the live lesson page.
