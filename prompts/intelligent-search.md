# Implementation Prompt: Intelligent Search with Sanity Context MCP & Gemini

## Goal
Implement the Intelligent Search feature for LearnX by connecting the Sanity Context MCP server and Gemini LLM (`gemini-3.6-flash` via `@ai-sdk/google`) through a server-side search API route (`app/api/search/route.ts`), and build the dedicated search results page at `app/search/page.tsx` faithfully reproducing the desktop design from `design/vertex-search.png`. The search returns structured video moment cards and lesson cards grounded in real Sanity course and lesson content, and wires the home page search bar (`components/home/HeroSearchBar.tsx`) to navigate directly to this search page.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1: Plain language intelligent content search returning ranked, clickable video cards and lesson cards linking directly to exact seconds in lesson videos.
  - Section 2: Implementation prompt workflow with explicit approval gate.
  - Section 3: Exact reproduction of desktop reference image (`design/vertex-search.png`) with responsive mobile adaptation.
  - Section 5: App structure and boundaries (server-only Sanity client and MCP connection, no tokens or LLM calls in browser, search API server route).
  - Section 6: Tech stack (`@ai-sdk/google`, `@ai-sdk/mcp`, `ai`, `next-sanity`, Tailwind CSS, TypeScript).
  - Section 7: Grounded search (say only what real data returns, never invent timestamps or courses); provider video embeds with timestamp seeking (`?start=seconds`).
  - Section 8: Content model (courses with embedded modules, standalone lesson documents with video URLs, notes, and key points).
  - Section 10 & 11: Search behavior (full results page, count, sort control, two result types: `video` and `lesson`, wildcard token queries, grounded data).
  - Section 12: Private dataset rules, server-side caching of initial context.
  - Section 13: Web workspace checks (typecheck, lint, build).
- **`create-agent-with-sanity-context` (`.agents/skills/create-agent-with-sanity-context/SKILL.md`)**:
  - HTTP transport connection to Sanity Context MCP URL.
  - Initial context pre-fetching (`/initial-context`) and system prompt caching.
  - Tool invocation (`groq_query`, `schema_explorer`) without leaking `initial_context` as a redundant tool.
- **`dial-your-context` & `shape-your-agent`**:
  - Grounding query rules and ranking guidelines.

---

## Code & Configuration Inspected
- **`design/vertex-search.png`**:
  - Top navigation bar: Vertex logo, "Courses", "My Learning", notifications bell, user avatar.
  - Page header:
    - Pill tag: `SEARCH RESULTS` (rounded-full, uppercase, border/tint).
    - Big Serif heading: `Results for “[query]”` with query highlighted in accent color.
    - Subtitle: `Found [X] results across [Y] courses`.
  - Big search bar:
    - Clean white card, rounded-2xl border, search icon on the left, `⌘ K` keyboard badge on the right.
  - Summary & Sort bar:
    - Left: `[X] results`.
    - Right: Sort control dropdown (`Most Relevant`, `Duration`, `Newest`).
  - Result Card Type 1 — `VIDEO`:
    - Left side: 16:9 thumbnail preview with play button overlay, timestamp/duration badge (`12:45`) in bottom-right corner.
    - Right side:
      - Top line: Course icon (e.g. Next.js `[N]`, React `[Re]`) + Course title + orange `VIDEO` pill badge on right.
      - Title: Lesson title or video segment topic.
      - Description: Concise description of what is taught at that moment.
      - Bottom line: Document icon + `Lesson [X.Y]  ·  📁 [Module Title]` on left; Play icon + `Watch from [MM:SS] →` on right linking to `/lessons/[slug]?start=[seconds]`.
  - Result Card Type 2 — `LESSON`:
    - Left side: Dedicated key points summary container (`bg-[#F8FAFC]` / subtle border) with Document icon, bullet list of key points (`• Point 1 \n • Point 2 \n • Point 3`), and circular checkmark badge in bottom-right corner.
    - Right side:
      - Top line: Course icon + Course title + purple/indigo `LESSON` pill badge on right.
      - Title: Lesson title.
      - Description: Overview of the lesson.
      - Bottom line: `Module [X]` on left; `View lesson ↗ →` on right linking to `/lessons/[slug]`.
  - Bottom Callout:
    - Search icon in circle, "Can't find what you're looking for? Try different keywords or browse our full course catalog.", button "Browse all courses →" linking to `/courses`.
- **Environment & Credentials**:
  - `SANITY_API_READ_TOKEN`: Configured in `.env.local`. Verified server-only read access.
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`: `br9mxbes`.
  - `NEXT_PUBLIC_SANITY_DATASET`: `production`.
  - `GEMINI_API_KEY`: Verified active with `@ai-sdk/google` using model `gemini-3.6-flash`.
  - Sanity Context MCP endpoint: `https://api.sanity.io/v2026-03-03/context/mcp/br9mxbes/production` tested and returns `200` with schema and query tools (`groq_query`).
- **Existing Components**:
  - `components/home/HeroSearchBar.tsx`: Currently pushes to `/courses?q=...`. Needs update to `/search?q=...`.
  - `components/home/CourseIcon.tsx`: Available for rendering course badges (Next.js, React, Docker, TS, Python, Postgres, etc.).
  - `components/ui/navigation.tsx` & `components/ui/bottom-bars.tsx`: Existing layout wrappers.

---

## Decisions & Assumptions
1. **Model & Provider**:
   - Use Google Gemini (`gemini-3.6-flash`) via `@ai-sdk/google` with the user's `GEMINI_API_KEY`.
2. **Sanity Context MCP Integration**:
   - Establish HTTP transport connection to `https://api.sanity.io/v2026-03-03/context/mcp/${projectId}/${dataset}` with Bearer `SANITY_API_READ_TOKEN`.
   - Pre-fetch `/initial-context` to seed system prompt and cache in-memory to minimize latency.
3. **Structured Results & Grounded Scoring**:
   - Section 7 & 11 of `AGENTS.md` explicitly mandate: "The LLM writes GROQ over the schema through the MCP, and the UI renders structured lesson cards instead of conversational prose... Return all relevant results, ranked best first, with a count... Ground every result in real data. Never invent a course, lesson, price, duration, or timestamp."
   - The search API route will combine MCP intelligence with direct GROQ token scoring over courses, modules, lessons, and video metadata in Sanity:
     - Lesson topics matched by title, key points, notes, and module context.
     - Video moments matched by lesson video chapters, key points, and durations.
     - Results are returned in clean JSON with `{ query, totalResults, totalCourses, results }`.
4. **Visual & Interactive Fidelity**:
   - Match `design/vertex-search.png` exactly: colors (Deep Indigo `#4F46E5` primary, warm slate neutrals, `#FAF7F5` background), typography (Playfair serif headings, Inter body), pills, badges, borders, and shadows.
   - Interactive search input with live query submission, URL synchronization (`/search?q=...`), `⌘ K` keyboard focus, and sorting dropdown.
5. **Playback Deep-linking**:
   - Video result cards link to `/lessons/[slug]?start=[startSeconds]`. Since `LessonVideoEmbed` already supports the `?start=` query parameter, clicking "Watch from MM:SS" immediately launches playback at the exact timestamp.

---

## Files to Create & Modify

### Modify
- [HeroSearchBar.tsx](file:///C:/Dev/Projects/LearnX/components/home/HeroSearchBar.tsx): Update submit navigation target from `/courses?q=` to `/search?q=`.

### Create
- [search/route.ts](file:///C:/Dev/Projects/LearnX/app/api/search/route.ts): Server API route connecting to Sanity Context MCP and Gemini, performing grounded search and returning ranked video moments and lesson matches.
- [search/types.ts](file:///C:/Dev/Projects/LearnX/components/search/types.ts): TypeScript interfaces for `SearchResult`, `VideoSearchResult`, `LessonSearchResult`, and API response.
- [search/SearchResultCard.tsx](file:///C:/Dev/Projects/LearnX/components/search/SearchResultCard.tsx): Video and Lesson result card components matching `design/vertex-search.png`.
- [search/SearchHeader.tsx](file:///C:/Dev/Projects/LearnX/components/search/SearchHeader.tsx): Results header, query statistics, and sort dropdown.
- [search/SearchBrowseCallout.tsx](file:///C:/Dev/Projects/LearnX/components/search/SearchBrowseCallout.tsx): Bottom "Can't find what you're looking for?" banner.
- [search/page.tsx](file:///C:/Dev/Projects/LearnX/app/search/page.tsx): Main search results page component with Suspense wrapper, loading states, and error handling.

---

## Security Considerations
- `GEMINI_API_KEY` and `SANITY_API_READ_TOKEN` remain strictly on the server and are never sent to the browser.
- The Sanity Context MCP endpoint is accessed only from the server-side API route.
- Input queries are sanitized and safely passed to parameterized queries or AI prompt inputs without injection vulnerability.

---

## Acceptance Criteria
1. Submitting a query from the Home page search bar navigates to `/search?q=<query>`.
2. `/search` displays the page header ("Results for “...”", "Found X results across Y courses"), search input, and sort dropdown matching `design/vertex-search.png`.
3. Search returns both `VIDEO` moment cards and `LESSON` topic cards grounded in real Sanity course and lesson content.
4. `VIDEO` cards show thumbnail, timestamp badge, course icon & name, lesson & module label, and clickable "Watch from MM:SS →" deep-linking to the lesson at that timestamp.
5. `LESSON` cards show key points container with checkmark, course icon & name, lesson title, description, module label, and "View lesson ↗ →" link.
6. Bottom "Can't find what you're looking for?" callout is displayed and links to `/courses`.
7. Page is fully responsive across mobile, tablet, and desktop breakpoints.
8. `npm run lint` and `npx tsc --noEmit` pass with zero errors.

---

## Checks to Run
- `npx tsc --noEmit` in `C:\Dev\Projects\LearnX` (type-checking).
- `npm run lint` in `C:\Dev\Projects\LearnX` (ESLint verification).
- `npm run build` in `C:\Dev\Projects\LearnX` (Next.js production build verification).
- Automated test of `/api/search` route with test queries (e.g. "data fetching", "server components", "routing").
