# Implementation Prompt: Align Course Page Container and Ground Data

## Goal
Restore the exact 1024px framed container and diagonal hatched background matching the Homepage (`app/page.tsx`), while retaining the elevated UI styling, typography, and interactive components. Completely remove all fabricated/mock fields (such as star ratings, 4.9 score, review counts, and synthetic feature claims), strictly grounding all displayed content in real Sanity course data.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1 & 7: "Search is grounded. Say only what the data returns. Never invent a course, lesson, price, duration, or timestamp."
  - Section 5 & 7: "The central framed layout matching vertex-home.png desktop view (`max-w-[1024px]`, border-x `#EDE5DF`, hatched repeating gradient background)."
  - Section 8: Sanity data model fields (title, slug, summary, coverImage, level, price, popular, studentCount, learningOutcomes, instructor, category, modules).
- **`sanity-best-practices`**: Working with Sanity image URLs, GROQ projections, and safe optional property chaining.

---

## Code & Configuration Inspected
- **`app/page.tsx`**:
  - Outer background:
    ```tsx
    style={{
      backgroundColor: "#FAF7F5",
      backgroundImage: `repeating-linear-gradient(45deg, #F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px)`,
    }}
    ```
  - Framed container:
    ```tsx
    className="w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col justify-between relative"
    ```
- **`app/courses/[slug]/page.tsx`**:
  - Currently uses a wide `max-w-7xl` two-column layout which deviates from the homepage framed container.
- **`components/course/CourseHero.tsx`**:
  - Currently contains fabricated star ratings, 4.9 rating score, and mock review counts.
- **`components/course/CourseSidebarCard.tsx`**:
  - Added redundant sidebar inside what should be a cohesive 1024px framed page layout.

---

## Decisions & Assumptions
1. **Container Alignment**:
   - Revert the main page layout in `app/courses/[slug]/page.tsx` to the exact homepage framed container:
     - Outer wrapper: `min-h-screen w-full flex flex-col items-center justify-start relative` with `#FAF7F5` and repeating 45deg linear gradient (`#F3ECE7 0, #F3ECE7 1px, transparent 0, transparent 9px`).
     - Central frame: `w-full max-w-[1024px] min-h-screen bg-[#FAF7F5] border-x border-[#EDE5DF] shadow-xs flex flex-col relative pb-24`.
2. **Grounding Content (Eliminate Fabricated Data)**:
   - Remove star rating icons, score (`4.9`), and review counts (`120+ reviews`) completely from `CourseHero.tsx`.
   - Strictly display real fields from Sanity:
     - `title`, `summary`, `coverImage`
     - `category` (real category title from reference)
     - `isPopular` (from Sanity `popular`)
     - `level` (from Sanity `level`)
     - `totalDuration` (computed from real lesson durations)
     - `modules.length` and lesson count (from real modules array)
     - `studentCount` (only if present in Sanity, formatted as `${studentCount} students`)
     - `price` (if present in Sanity)
     - `instructor` (name, photo, expertise from Sanity reference)
3. **Harmonious Single-Frame Component Architecture**:
   - In the 1024px frame, merge the hero and preview image into a balanced, elegant hero section:
     - Left: Course cover image with aspect ratio and rounded corners.
     - Right: Category badge, popular tag, title, summary, instructor byline, real metadata pills, price tag, and primary/secondary CTAs.
   - Flow downward into:
     - "What You'll Learn" outcomes grid (`CourseOutcomes`).
     - "Course Curriculum" with interactive accordion and "Expand All / Collapse All" toggle (`CourseModuleList`).
     - "Your Instructor" spotlight card (`CourseInstructor`).
   - Sticky bottom progress bar (`CourseProgressBar`) pinned within the layout.

---

## Files Expected to Touch
- `app/courses/[slug]/page.tsx` (Restore 1024px framed container and hatched background pattern)
- `components/course/CourseHero.tsx` (Remove mock ratings/reviews, integrate cover image and real Sanity price/actions)
- `components/course/CourseSidebarCard.tsx` (Remove or deprecate in favor of integrated hero in the 1024px frame)
- `components/course/CourseInstructor.tsx` (Ensure styling fits seamlessly within the 1024px framed container)
- `components/course/CourseProgressBar.tsx` (Adjust width to fit the 1024px container)

---

## Requirements
1. **Container Consistency**: Must match the exact container styling and background pattern of `app/page.tsx`.
2. **Data Grounding**: No invented fields (no fake ratings, no fake reviews, no fake enrolled claims). Only render real data from Sanity.
3. **Preserve UI Quality**: Maintain the elevated typography, rounded corners, polished borders, and interactive accordion features.

---

## Security Considerations
- Pure presentational update; all data remains read-only from Sanity serverClient.
- No client-side tokens or untrusted data sources.

---

## Acceptance Criteria
- [ ] Outer page background has the exact repeating diagonal hatched pattern as the homepage.
- [ ] Central container has `max-w-[1024px]`, `border-x border-[#EDE5DF]`, and `bg-[#FAF7F5]`.
- [ ] Star ratings, 4.9 rating score, and mock review counts are completely removed.
- [ ] Real Sanity data fields (`title`, `coverImage`, `summary`, `category`, `instructor`, `level`, `duration`, `studentCount`, `price`) are rendered accurately.
- [ ] "What You'll Learn", "Course Curriculum" with accordion, and "Your Instructor" sections render cleanly inside the 1024px framed column.
- [ ] Sticky progress bar aligns cleanly with the 1024px layout.
- [ ] `npx tsc --noEmit` and `npm run lint` pass with 0 errors.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- Build check: `npm run build`
