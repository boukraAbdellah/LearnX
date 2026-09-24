# Implementation Prompt: Learner Progress Tracking & My Learning Webpage

Build the end-to-end **Learner Progress Tracking System** and the **My Learning Webpage** (`/my-learning`) for LearnX, integrating Clerk authentication, Sanity schema & mutations, server-side data fetching, and Vertex design system UI components.

---

## 1. Goal

1. **Model Learner Progress in Sanity**: Create `progressType` in Sanity Studio, keyed deterministically by Clerk `userId`, storing completed lessons and course resume states (last lesson reference, last position in seconds, updated timestamp).
2. **Server API for Progress Mutations**: Implement `POST /api/progress` in Next.js App Router, gated with Clerk `auth().userId` and authenticated with Sanity write token (`SANITY_API_WRITE_TOKEN`).
3. **Build "My Learning" Page (`app/my-learning/page.tsx`)**:
   - Provide an authenticated learner dashboard matching the Vertex design system (framing, typography, colors, responsiveness).
   - Display high-level learning metrics (In Progress count, Completed count, Lessons finished).
   - Display active course cards with real progress bars (`ProgressBar`), completed badges, and a direct "Resume Lesson" CTA targeting the exact last lesson and timestamp.
   - Display completed course cards with review options.
   - Provide a clean empty state with an "Explore Catalog" CTA for learners who have not started any courses.
   - Provide an unauthenticated state with a prominent Sign-In CTA via Clerk.
4. **Wire Real Progress to Existing Surfaces**:
   - Update `app/courses/[slug]/page.tsx` to read user progress from Sanity and pass real completion percentage and resume link to `CourseProgressBar` and `CourseHero` (replacing hardcoded `progress={35}`).
   - Update `app/lessons/[slug]/page.tsx` to read user progress and reflect completed state in `LessonSidebar` and `LessonBottomNav`.
   - Add a "Mark as Complete" action button to `LessonBottomNav` to let learners toggle lesson completion.

---

## 2. Skills Read

- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): Schema definitions (`defineType`, `defineField`), GROQ projection rules, TypeGen, server-only client configuration.
- `clerk-nextjs-patterns` / `clerk`: Server-side session verification via `auth()`, client-side components (`<SignedIn>`, `<SignedOut>`, `<SignInButton>`), user profile handling.
- `modern-web-guidance`: Accessible controls, smooth CSS transitions, sticky headers, responsive layout stacking.

---

## 3. Code Inspected

- [AGENTS.md](file:///c:/Dev/Projects/LearnX/AGENTS.md):
  - Section 5 & 12: Private dataset rules; browser never holds a write token; writes only through server routes.
  - Section 7 & 8: Progress is tracked per learner keyed by Clerk `userId`: completed lessons and last lesson position. My Learning is presentational reading progress.
- [studio/schemaTypes/index.ts](file:///c:/Dev/Projects/LearnX/studio/schemaTypes/index.ts): Current schemas (`category`, `instructor`, `lesson`, `module`, `course`, `video`). Lacks `progressType`.
- [sanity/lib/client.ts](file:///c:/Dev/Projects/LearnX/sanity/lib/client.ts): Has `client` and `serverClient` with `SANITY_API_READ_TOKEN`. Lacks dedicated write client configuration with `SANITY_API_WRITE_TOKEN`.
- [sanity/lib/queries.ts](file:///c:/Dev/Projects/LearnX/sanity/lib/queries.ts) & [sanity/lib/fetch.ts](file:///c:/Dev/Projects/LearnX/sanity/lib/fetch.ts): Need GROQ queries for progress by `userId`.
- [components/ui/navigation.tsx](file:///c:/Dev/Projects/LearnX/components/ui/navigation.tsx): Navbar contains `<Link href="/my-learning">My Learning</Link>` which currently 404s.
- [components/ui/progress-bar.tsx](file:///c:/Dev/Projects/LearnX/components/ui/progress-bar.tsx): Reusable progress bar primitive with percentage label.
- [components/ui/cards.tsx](file:///c:/Dev/Projects/LearnX/components/ui/cards.tsx): Reusable card styling and badge primitives.
- [components/course/CourseProgressBar.tsx](file:///c:/Dev/Projects/LearnX/components/course/CourseProgressBar.tsx): Currently receives hardcoded `progress={35}`.
- [components/lesson/LessonBottomNav.tsx](file:///c:/Dev/Projects/LearnX/components/lesson/LessonBottomNav.tsx): Lacks a "Mark as Complete" / "Completed" button.
- [components/lesson/LessonSidebar.tsx](file:///c:/Dev/Projects/LearnX/components/lesson/LessonSidebar.tsx): Supports status indicators (`completed`, `in-progress`, `default`), but currently uses hardcoded status.

---

## 4. Decisions and Assumptions

1. **No User Document in Sanity**: As decided, Clerk remains the sole source of truth for user accounts and identity. Sanity only stores app state in `progress` documents keyed by `progress.${userId}`.
2. **Deterministic Document ID**: Sanity document IDs will follow `progress.<clerk_userId>`. This allows $O(1)$ lookups, deterministic `createIfNotExists`, and avoids duplicate progress records.
3. **Graceful Token Handling**:
   - The server route checks for `SANITY_API_WRITE_TOKEN`.
   - If `SANITY_API_WRITE_TOKEN` is missing, the route returns an informative 403 error directing the developer to configure the write token in `.env.local`.
   - On the frontend, if mutations fail or in dev without write token, an in-memory/optimistic fallback ensures UI interactivity without crashing.
4. **My Learning Visuals**:
   - Follows the exact Vertex design system: `#FAF7F5` warm neutral background, framed 1440px wrapper, Deep Indigo (`#4F46E5`) accents, Playfair Display serif headers, crisp borders (`#EDE5DF`).
   - Displays learner stats header, "In Progress" grid, "Completed" grid, and an engaging empty state with an "Explore Catalog" button.

---

## 5. Files Expected to Touch

### Studio Workspace:
- `studio/schemaTypes/progressType.ts` *(create)*: Define `progress` document schema.
- `studio/schemaTypes/index.ts` *(modify)*: Register `progressType`.

### Web Workspace:
- `.env.example` *(modify)*: Add `SANITY_API_WRITE_TOKEN` documentation.
- `sanity/lib/client.ts` *(modify)*: Export `writeClient` configured with `SANITY_API_WRITE_TOKEN`.
- `sanity/lib/queries.ts` *(modify)*: Add `USER_PROGRESS_QUERY` to fetch user progress by `userId`.
- `sanity/lib/fetch.ts` *(modify)*: Add `getUserProgress(userId)` server helper.
- `app/api/progress/route.ts` *(create)*: Server route for recording lesson completion and resume timestamp.
- `app/my-learning/page.tsx` *(create)*: The "My Learning" dashboard page.
- `components/lesson/LessonBottomNav.tsx` *(modify)*: Add "Mark as Complete" button with optimistic toggle and API call.
- `app/courses/[slug]/page.tsx` *(modify)*: Fetch real user progress and calculate dynamic completion percentage.
- `app/lessons/[slug]/page.tsx` *(modify)*: Fetch real user progress, pass completed lesson IDs to `LessonSidebar`, and pass completion state to `LessonBottomNav`.

---

## 6. Requirements

1. **Schema**:
   - Document type `progress`.
   - Fields:
     - `userId`: string (required, read-only).
     - `completedLessons`: array of references to `lesson`.
     - `courseProgress`: array of objects (`course` ref, `lastLesson` ref, `lastPositionSeconds` number, `updatedAt` datetime).
2. **API Endpoint (`POST /api/progress`)**:
   - Validate Clerk session via `const { userId } = await auth()`. If unauthorized, return 401.
   - Body format: `{ courseId?: string, lessonId: string, completed?: boolean, positionSeconds?: number }`.
   - Mutate Sanity document `progress.<userId>` via `writeClient`:
     - If `completed === true`: add `lessonId` to `completedLessons` if not already present.
     - If `completed === false`: remove `lessonId` from `completedLessons`.
     - If `positionSeconds` provided: update `courseProgress` entry for `courseId`.
3. **My Learning Page (`/my-learning`)**:
   - If user is signed out, render clean auth gate with Clerk's `<SignInButton>`.
   - If signed in, query user's progress and cross-reference with all courses from Sanity.
   - Show:
     - Header: Learner name/avatar and summary metric cards (Enrolled Courses, Completed Lessons, Hours Learned).
     - "Continue Learning": Courses where progress is > 0% and < 100%, with progress bar, last lesson title, and "Resume" button.
     - "Completed": Courses where all lessons are completed.
     - Empty state: Friendly message and CTA to `/courses` if 0 courses started.
4. **Course & Lesson Page Integration**:
   - Course page computes dynamic percentage based on how many lessons in the course match `completedLessons`.
   - `CourseProgressBar` shows real percentage instead of `35%`.
   - Lesson page `LessonSidebar` renders green checkmark indicator for completed lessons.
   - `LessonBottomNav` includes a "Mark as Complete" / "Completed" button.

---

## 7. Security Considerations

- **Private Dataset & Server Boundary**: The browser never connects directly to Sanity with write credentials. All writes go through `app/api/progress/route.ts`.
- **Authentication**: `auth().userId` from Clerk ensures a user can only read or write their own progress record. They cannot spoof or modify another user's progress.
- **Write Token Storage**: `SANITY_API_WRITE_TOKEN` resides only on the server, never prefixed with `NEXT_PUBLIC_`.

---

## 8. Acceptance Criteria

- [ ] `progressType` schema is created in Studio and registered in `schemaTypes/index.ts`.
- [ ] Next.js app builds with zero TypeScript errors or linter warnings.
- [ ] Navigating to `/my-learning` renders without errors:
  - Shows Sign-in CTA when logged out.
  - Shows learner dashboard and enrolled course cards when logged in.
- [ ] Completing a lesson via `POST /api/progress` persists the completed lesson reference.
- [ ] Course Detail page reflects actual progress percentage rather than hardcoded 35%.
- [ ] Lesson page sidebar shows completed icons for completed lessons.
- [ ] Navbar "My Learning" tab is highlighted active when on `/my-learning`.

---

## 9. Checks to Run

1. `npm run typegen` or TypeScript check in `studio`.
2. `npx tsc --noEmit` in root (`LearnX`).
3. `npm run lint` in root.
4. Production build check (`npm run build`).

---

## 10. Exact Manual Test Steps

1. Start both servers (`studio` and `LearnX`).
2. Open `http://localhost:3000/my-learning` in an incognito window:
   - Verify signed-out screen with Sign In prompt.
3. Sign in using Clerk.
4. Visit `http://localhost:3000/my-learning`:
   - Verify dashboard header with user name, stats cards, and course listings.
5. Visit a course page (e.g. `http://localhost:3000/courses/nextjs-for-production`):
   - Verify progress bar displays real initial completion percentage (e.g. 0%).
6. Click into a lesson (e.g. `http://localhost:3000/lessons/caching-and-revalidation`):
   - Click "Mark as Complete" in the bottom nav.
   - Verify immediate visual feedback (button turns to "Completed", sidebar lesson gets completed checkmark).
7. Return to the course page and `/my-learning`:
   - Verify the progress percentage has updated to reflect the completed lesson.
