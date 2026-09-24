# Implementation Prompt: Align My Learning Page Container Design with Home and All Courses

## 1. Goal
Update `app/my-learning/page.tsx` so that its container layout, framing, max-width, padding, breadcrumbs, and bottom visual elements match the established LearnX desktop container design seen on the Home (`app/page.tsx`) and All Courses (`app/courses/page.tsx`) pages.

## 2. Skills & References Read
- `AGENTS.md` (Workflow rules, UI replication, and container conventions)
- Code inspected:
  - `app/page.tsx` (Central framed layout: `max-w-[1024px]`, `border-x border-[#EDE5DF]`, `BottomBars`)
  - `app/courses/page.tsx` (Framed layout: `max-w-[1024px]`, `Breadcrumbs`, `px-6 lg:px-8`, `BottomBars`)
  - `app/courses/[slug]/page.tsx` (Framed layout: `max-w-[1024px]`, `Breadcrumbs`)
  - `app/my-learning/page.tsx` (Currently oversized at `max-w-[1440px]`, missing `Breadcrumbs`, missing `BottomBars`)

## 3. Code Inspected & Problem Analysis
1. `app/my-learning/page.tsx` currently wraps its unauthenticated and authenticated views in `<div className="w-full max-w-[1440px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col relative">`.
2. Both `app/page.tsx` and `app/courses/page.tsx` use the standard LearnX framed container:
   - Container max width: `max-w-[1024px]`
   - Flex structure: `flex flex-col justify-between relative`
   - Top breadcrumbs navigation: `Breadcrumbs` with `Home > My Learning`
   - Content horizontal padding: `px-6 lg:px-8`
   - Bottom decoration: `<BottomBars />` anchored at the bottom of the central framed container.

## 4. Decisions and Assumptions
- Use `max-w-[1024px]` for both authenticated and unauthenticated states in `app/my-learning/page.tsx` instead of `max-w-[1440px]`.
- Add `<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Learning" }]} />` at the top of both authenticated and unauthenticated states.
- Adjust main content container padding to `px-6 lg:px-8` so it aligns with the catalog header and course cards in `app/courses/page.tsx`.
- Include `<BottomBars />` from `@/components/ui` at the bottom of the framed container for both authenticated and unauthenticated states.

## 5. Files to Touch
- `app/my-learning/page.tsx` [MODIFY]:
  - Import `Breadcrumbs` and `BottomBars` from `@/components/ui`.
  - Update unauthenticated state: container `max-w-[1024px]`, add breadcrumbs, add `<BottomBars />`.
  - Update authenticated state: container `max-w-[1024px]`, add breadcrumbs, set padding `px-6 lg:px-8`, add `<BottomBars />`.

## 6. Security Considerations
- No authentication or authorization boundaries altered. Clerk user session and Sanity fetch logic remain untouched and secure.

## 7. Acceptance Criteria
- [ ] My Learning page uses the exact same `max-w-[1024px]` framed layout with `border-x border-[#EDE5DF]` as Home and All Courses.
- [ ] Breadcrumbs (`Home > My Learning`) are present at the top of the content area.
- [ ] The signature `<BottomBars />` graphic is rendered at the bottom of the framed container.
- [ ] Layout is fully responsive across mobile, tablet, and desktop viewports.
- [ ] Production build (`npm run build`) and lint (`npm run lint`) pass with 0 errors.

## 8. Manual Test Steps
1. Navigate to `http://localhost:3000/my-learning`.
2. Verify the page container width matches `http://localhost:3000` and `http://localhost:3000/courses` (1024px maximum width, centered with borders).
3. Verify the breadcrumb navigation `Home > My Learning` is displayed below the navigation bar.
4. Verify the equalizer `<BottomBars />` appears at the bottom of the page.
5. Check both signed-in and signed-out states to ensure consistency across both views.
