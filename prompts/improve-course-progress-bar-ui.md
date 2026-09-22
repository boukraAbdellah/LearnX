# Implementation Prompt: Improve Course Progress Bar UI

## Goal
Elevate the UI styling, layout, and visual feedback of the Course Detail page's sticky progress bar (`components/course/CourseProgressBar.tsx`), modernizing it into an aesthetic floating frosted-glass dock with rich progress details (percentage badge, lesson completion count, vibrant gradient fill bar, and polished action CTA) while ensuring responsiveness across mobile and desktop.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1 & 7: "Learner progress tracking... Surface it as completion marks and a resume affordance on the catalog, course, and lesson pages."
  - Section 3: "UI work... Reproduce them exactly: layout, spacing, typography, color, and states... make each page responsive down to mobile, adapting the layout sensibly while keeping the desktop exact."
  - Section 5 & 12: Maintain server and client boundaries, keep secrets server-only.
- **`modern-web-guidance`**: Glassmorphism, backdrop filters, responsive layout, CSS gradient fills, micro-interactions, and accessibility.

---

## Code & Configuration Inspected
- **`components/course/CourseProgressBar.tsx`**:
  - Currently a basic full-width bottom strip with `sticky bottom-0 border-t border-[#EDE5DF] bg-white/95`.
  - Embeds a basic `ProgressBar` constrained to `min-w-[160px] max-w-[240px]` with plain typography.
- **`app/courses/[slug]/page.tsx`**:
  - Computes `totalLessons` and `continuePath`.
  - Passes `progress={35}` and `continuePath={continuePath}` to `<CourseProgressBar />`.
  - Uses `pb-20` on the main container which can be expanded to `pb-28 sm:pb-24` to prevent any content overlap with a floating dock.

---

## Decisions & Assumptions
1. **Floating Frosted-Glass Dock Layout**:
   - Instead of a heavy full-bleed footer strip attached to the bottom edge, design a floating dock with `sticky bottom-4 sm:bottom-6 z-40 px-4 sm:px-6 w-full max-w-[1024px] mx-auto pointer-events-none`.
   - The card container uses `pointer-events-auto`, rounded pill geometry (`rounded-2xl sm:rounded-full`), and multi-layered glassmorphism:
     - Background: `bg-white/85 backdrop-blur-xl`
     - Border & Ring: `border border-white/70 shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12),0_4px_12px_-2px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04]`
2. **Rich Visual Progress & Metrics**:
   - **Visual Icon/Badge**: An indigo-tinted circular icon container (`bg-indigo-50 border border-indigo-100/80 text-indigo-600`) with an animated/pulsing progress ring or graduation/play icon.
   - **Context Labels**:
     - Upper row: "Your Progress" title paired with a pill badge displaying `{progress}% Complete` in deep indigo styling (`bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full text-xs`).
     - Sub-label / Counter: Display lesson completion (e.g. `X of Y lessons completed` when `totalLessons` is provided).
   - **Progress Track & Bar**:
     - Height of `h-2.5`, smooth slate background track `bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden`.
     - Fill: Premium gradient `bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600` with smooth transition (`transition-all duration-500 ease-out`) and subtle shine/glow.
3. **Refined CTA Button**:
   - "Continue Learning" button featuring:
     - Gradient background: `bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98]`
     - Crisp text and smooth arrow icon with a rightward translation micro-interaction on group hover.
     - Shadow: `shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30`.
4. **Mobile Adaptability**:
   - On small screens (<640px), the dock smoothly adapts into a compact 2-column or stacked layout with full-width progress track and tactile action button.

---

## Files to Touch
- `components/course/CourseProgressBar.tsx` - Reimplement with floating glassmorphism, gradient bar, progress badge, and lesson count.
- `app/courses/[slug]/page.tsx` - Pass `totalLessons={totalLessons}` to `CourseProgressBar` and ensure adequate container padding (`pb-28 sm:pb-24`).

---

## Security Considerations
- Purely presentation and navigation logic.
- No tokens or sensitive data are passed or exposed to the client.
- Links safely using Next.js `Link`.

---

## Acceptance Criteria
- [ ] Sticky progress bar floats gracefully above the bottom of the viewport inside the 1024px framed container.
- [ ] Frosted glass effect (`backdrop-blur-xl` + translucent background + soft shadow) renders cleanly.
- [ ] Progress bar features an indigo/violet gradient fill with smooth width transition.
- [ ] Displays percentage badge (`35% Complete`) and lesson completion counter (`X of Y lessons completed`).
- [ ] "Continue Learning" button has polished gradient styling and hover micro-interaction.
- [ ] Fully responsive on mobile without layout overflow.
- [ ] Zero TypeScript or lint errors.

---

## Checks to Run
- TypeScript check: `npx tsc --noEmit`
- Next.js build check: `npm run build` (or verify clean compile)

---

## Manual Test Steps
1. Navigate to `/courses/python-for-data-work` in the browser.
2. Scroll down the page and verify the floating progress dock anchors smoothly above the bottom.
3. Verify the glassmorphic backdrop blur, progress percentage badge, lesson count, and gradient bar.
4. Hover over the "Continue Learning" button and verify the hover effect.
5. Resize the viewport to mobile width (~375px) and verify layout adjusts gracefully.
