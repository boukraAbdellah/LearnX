# Implementation Prompt: Fetch Homepage Courses from Sanity

## Goal
Replace the hardcoded placeholder course cards on the homepage (`app/page.tsx`) with dynamic course data fetched server-side from Sanity. Convert `app/page.tsx` into an async Server Component, extract the interactive search bar into a client component, update `COURSES_QUERY` to project module counts and lesson durations, render all available courses in the 3-column grid with appropriate icons, and link each card to its corresponding `/courses/[slug]` route.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1 (Platform scope: courses, modules, lessons, instructors).
  - Section 2 (Loop & workflow rules: prompt approval before coding, checks, reporting format).
  - Section 5 (App structure: pages are read-only Server Components displaying stored data; data access is server-only Sanity client/fetch helper; no client-side tokens).
  - Section 6 (Tech stack: Next.js App Router, Sanity Studio with `next-sanity`, Tailwind CSS, TypeScript).
  - Section 7 (Content is coherent and grounded in real Sanity documents).
  - Section 13 (Checks: type check, lint, dev/build validation).
- **`sanity-best-practices`**:
  - Explicit GROQ projections wrapped in `defineQuery`.
  - Fetching via `sanityFetch` inside Server Components.
  - Reverse references and nested array expansions for modules and lessons.

---

## Code & Configuration Inspected
- **`app/page.tsx`**:
  - Currently marked `"use client"` due to search input focus (`useRef`), `searchQuery` state, and `⌘ K` keyboard shortcut listener.
  - Contains hardcoded placeholder cards for "Next.js for Production", "Docker Essentials", and "TypeScript Deep Dive".
- **`sanity/lib/queries.ts`**:
  - Contains `COURSES_QUERY` which fetches published courses, but currently lacks `modulesCount` and nested module lesson durations needed to compute card duration.
- **`sanity/lib/fetch.ts`**:
  - Contains server-only `getCourses()` wrapping `COURSES_QUERY` via `sanityFetch`.
- **`components/ui/cards.tsx`**:
  - `CourseCard` accepts `title`, `description`, `level`, `duration`, `modulesCount`, `icon`, `onClick`, and `className`.
- **`components/course/CourseHero.tsx` & `app/courses/[slug]/page.tsx`**:
  - Already implement duration computation (`computeTotalDuration` summing lesson seconds to `Xh Ym`).
- **Sanity Dataset (`production`)**:
  - Verified 10 published courses present in Sanity with full modules, lessons, summaries, and cover images.

---

## Decisions & Assumptions
1. **Server/Client Boundary Separation**:
   - `app/page.tsx` will become an `async` React Server Component, directly invoking `getCourses()` from `@/sanity/lib/fetch`.
   - The interactive search form and `⌘ K` keyboard listener in the Hero will be extracted into a new client component: `components/home/HeroSearchBar.tsx`.
2. **Display All Courses**:
   - As requested by the user, all courses fetched from Sanity (currently 10) will be rendered in the responsive 3-column grid (`grid grid-cols-1 md:grid-cols-3 gap-5`).
   - The "View all courses →" header button linking to `/courses` will be preserved so the user can curate/filter the homepage selection later.
3. **GROQ Query Enhancement**:
   - Update `COURSES_QUERY` in `sanity/lib/queries.ts` to include:
     - `"modulesCount": count(modules)`
     - `"modules": modules[]{ "lessons": lessons[]->{ duration } }`
   - This ensures cards have accurate module counts and aggregated durations computed in seconds.
4. **Course Card Visuals & Technology Badges**:
   - Provide clean, branded technology icons/badges for courses:
     - Next.js (`nextjs-app-router-in-depth`): Black squircle with white "N".
     - Docker (`devops-with-docker-and-kubernetes`): Docker whale icon (`/docker-icon.png`).
     - TypeScript (`typescript-for-application-developers`): Blue squircle (`#3178C6`) with white "TS".
     - Python (`python-for-data-work`): Indigo squircle with white "Py".
     - React (`react-performance-engineering`): Cyan/slate squircle with white "Re".
     - PostgreSQL (`postgresql-for-developers`): Deep blue squircle with white "PG".
     - AI / LLMs (`building-ai-apps-with-llms`): Violet squircle with white "AI".
     - RAG (`retrieval-augmented-generation-from-scratch`): Emerald squircle with white "RAG".
     - System Design (`system-design-foundations`): Amber squircle with white "SD".
     - Security (`practical-web-security`): Rose/crimson squircle with white "SEC".
     - Fallback: Course cover image thumbnail or 2-letter uppercase initials.
5. **Card Navigation**:
   - Each `CourseCard` will link directly to `/courses/${course.slug}` using Next.js `<Link>`.

---

## Files Expected to Touch
- `sanity/lib/queries.ts` [MODIFY - Expand `COURSES_QUERY` with module count & lesson durations]
- `components/home/HeroSearchBar.tsx` [NEW - Client component for hero search input and `⌘ K` shortcut]
- `components/home/CourseIcon.tsx` [NEW - Tech badge / icon component for course cards]
- `app/page.tsx` [MODIFY - Convert to Server Component, fetch courses from Sanity, render all cards dynamically]

---

## Requirements
1. **Dynamic Data Fetching**: Fetch course documents from Sanity dataset `production` server-side via `getCourses()`.
2. **Accurate Metadata**: For each course card, display:
   - Title: from `course.title`
   - Description: from `course.summary`
   - Level: capitalized `course.level` (e.g., "Intermediate", "Beginner", "Advanced")
   - Duration: formatted sum of lesson seconds across all modules (e.g., "2h 27m")
   - Module count: derived from `course.modulesCount` (e.g., "4 modules")
   - Icon: custom technology badge or cover image
3. **Complete Navigation**: Clicking any card navigates to `/courses/${course.slug}`.
4. **Header CTA Preserved**: "View all courses →" link remains functional and directs to `/courses`.
5. **Interactive Search Preserved**: Hero search input remains functional with keyboard shortcut `⌘ K` (and `Ctrl+K`).
6. **Responsive Layout**: 3-column grid on desktop, gracefully collapsing to single column on mobile.

---

## Security Considerations
- Data fetching occurs strictly server-side using the viewer token via `sanityFetch`.
- No Sanity tokens or sensitive keys are exposed to the browser client bundle.

---

## Acceptance Criteria
- [ ] `app/page.tsx` is a Server Component fetching real course data from Sanity.
- [ ] All 10 courses from Sanity are rendered in the "All Courses" grid.
- [ ] Each course card displays real title, summary, capitalized level, module count, and computed duration.
- [ ] Each course card displays a distinct, high-fidelity technology icon/badge.
- [ ] Clicking any course card opens the real `/courses/[slug]` detail page.
- [ ] The Hero search input and `⌘ K` shortcut function correctly via `HeroSearchBar`.
- [ ] "View all courses →" link points to `/courses`.
- [ ] `npm run lint` and `npm run build` succeed with zero errors.

---

## Checks to Run
1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. Dev server check at `http://localhost:3000` verifying all courses render with real Sanity data.

---

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000`.
2. Scroll to "All Courses" section:
   - Verify all 10 courses from Sanity are displayed in rows of 3.
   - Verify "Next.js App Router in Depth", "DevOps with Docker and Kubernetes", "TypeScript for Application Developers", etc. are shown instead of hardcoded placeholders.
   - Verify each card shows its calculated duration (e.g. "1h 59m"), module count ("4 modules"), and capitalized level ("Intermediate", "Advanced", etc.).
3. Click on "Next.js App Router in Depth" card:
   - Verify browser navigates to `/courses/nextjs-app-router-in-depth`.
   - Verify course detail page loads with real modules, outcomes, and hero data.
4. Return to homepage and test pressing `⌘ K` (or `Ctrl+K` on Windows):
   - Verify the search input gains focus.
5. Type a search query (e.g. "caching") and press Enter:
   - Verify it routes to `/courses?q=caching`.
6. Test responsive viewport down to mobile width:
   - Verify cards stack cleanly into a single column.
