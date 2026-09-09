# Implementation Prompt: Vertex Home Page

## Goal
Implement the production-style Vertex (LearnX) home page as specified in [`design/vertex-home.png`](file:///c:/Dev/Projects/LearnX/design/vertex-home.png). The home page serves as the entry point to the learning platform, featuring the brand navigation, intelligent learning hero with plain-English search input, featured courses grid with customized course cards, weekly additions badge/divider, and signature warm equalizer graphic footer. The existing Design System Showcase will be moved to `/design-system` so all component documentation and tokens remain fully accessible.

---

## Skills Consulted & Read
- **`AGENTS.md`**: Section 2 (Loop & workflow rules), Section 3 (UI reproduction standards: exact layout, spacing, typography, colors, responsive down to mobile, reuse existing components), Section 5 & 6 (Tech stack: Next.js App Router, Tailwind CSS, TypeScript).
- **`modern-web-guidance`**: Modern layout, semantic structure, responsive containers, accessible forms and interactions.
- **`sanity-best-practices`**: Data modeling alignment for courses, modules, levels, and durations.

---

## Code & Configuration Inspected
- **`design/vertex-home.png`**: Visual ground truth (1024x1536 desktop):
  - **Header Nav**: Vertex logo mark + "Vertex" serif wordmark, links for "Courses" and "My Learning", notification Bell icon, and rounded user avatar.
  - **Canvas Frame**: Warm canvas background (`#FAF7F5` / `#FBF7F6`) framed with subtle vertical borders (`#EDE5DF`) and hatched diagonal outer margin pattern.
  - **Hero Section**:
    - Centered tag: "INTELLIGENT LEARNING" pill in pale warm amber border and background with orange uppercase text.
    - Title: "Search your learning\nin plain English." in Playfair Display serif font, bold, dark slate (`#0F172A`).
    - Subtitle: "Vertex understands what you want to learn and\nfinds the exact lessons across all your courses." in Inter font, slate gray (`#64748B`).
    - Primary CTA: "Explore Courses ->" warm orange-red button (`#EA580C` / `#F97316`) with right arrow.
    - Search Bar: Prominent search input with search icon, placeholder "Ask anything about your learning...", and "⌘ K" shortcut badge.
  - **Section Divider**: Subtle full-width dividing line between hero and courses.
  - **All Courses Section**:
    - Header: "All Courses" (Playfair Display serif) on left, "View all courses ->" orange link on right.
    - 3 Cards Grid:
      1. Next.js for Production: Black "N" icon, Intermediate, 18h 24m, 12 modules.
      2. Docker Essentials: Blue Docker whale icon, Beginner, 10h 12m, 8 modules.
      3. TypeScript Deep Dive: Blue "TS" icon, Intermediate, 14h 36m, 10 modules.
  - **Weekly Update Divider**: Centered divider with thin horizontal lines, hollow orange star `☆`, and text: "New courses and lessons added every week."
  - **Bottom Graphic**: Warm orange and peach gradient equalizer/bars ascending from the bottom edge.
- **`app/globals.css`**: Tailwind v4 tokens, font variables (`--font-playfair`, `--font-inter`), and typography classes.
- **`components/ui/`**: Existing cards, icons, buttons, navigation, badge, and input components.
- **`app/page.tsx`**: Currently holds the design system showcase, to be preserved at `app/design-system/page.tsx`.

---

## Decisions & Assumptions
1. **Preserve Design System Showcase**:
   - Move the showcase currently in `app/page.tsx` to `app/design-system/page.tsx`.
   - Keep all tokens, component showcases, and interactive elements intact at `/design-system`.
2. **Page Architecture & Layout**:
   - Central container (`max-w-[966px]`) framed with subtle vertical border lines and diagonal hatched margin pattern on viewports wider than 1024px, faithfully matching the desktop presentation in `vertex-home.png`.
   - On smaller screens (< 1024px), seamlessly collapse margins to full-width with responsive padding.
3. **Navigation Enhancement**:
   - Update `components/ui/navigation.tsx` or provide a specialized home navigation bar with:
     - Vertex brand mark and "Vertex" serif text.
     - "Courses" (active state) and "My Learning".
     - Notification Bell button with `BellIcon`.
     - User Avatar (circular image extracted or asset).
4. **Hero & Search Interaction**:
   - Implement keyboard shortcut listener (`⌘K` / `Ctrl+K`) to focus the search input.
   - Interactive search input with hover and focus states (`ring-1 ring-[#FB923C] border-[#FB923C]`).
5. **Course Cards Alignment**:
   - Ensure the CourseCard titles use the Playfair Display serif font as depicted in `vertex-home.png`.
   - Provide custom brand icons for Next.js ("N"), Docker (whale illustration), and TypeScript ("TS").
   - Ensure metadata icons (signal bars for level, clock for duration, bookmark/module for module count) match the exact text and numbers.
6. **Decorative Visuals**:
   - Bottom equalizer bars: Implement via an SVG/CSS graphic or high-fidelity asset rendering the warm orange/peach gradient bars fading into the bottom.
   - Star divider: Clean SVG hollow star with warm orange stroke `#F97316` and muted gray text.

---

## Files Expected to Touch
- `prompts/implement-home-page.md` [NEW - This implementation prompt]
- `app/design-system/page.tsx` [NEW - Preserves design system showcase]
- `app/page.tsx` [MODIFY - Home page implementation matching `vertex-home.png`]
- `components/ui/navigation.tsx` [MODIFY - Support notification bell and user profile avatar]
- `components/ui/cards.tsx` [MODIFY - Ensure CourseCard supports serif heading and exact icon styling]
- `components/ui/icons.tsx` [MODIFY - Add Docker whale icon, TypeScript icon, and Star icon]
- `public/avatar.png` [NEW - Extracted/provided user avatar image]
- `public/bottom-bars.png` or `components/ui/bottom-graphic.tsx` [NEW - Bottom equalizer graphic]

---

## Requirements
1. **Visual Fidelity**: Pixel-perfect match of typography (Playfair Display for headings/cards, Inter for body/ui), spacing, colors, and layout from `design/vertex-home.png`.
2. **Responsive Adaptation**: Gracefully adapt from desktop (1024px+) down to tablet and mobile, stacking course cards vertically and scaling headings while preserving proportions.
3. **Interactive Polish**:
   - Focus state on search bar when clicked or via `⌘K` / `Ctrl+K`.
   - Hover effects on buttons, navigation links, and course cards.
4. **Semantic HTML & Accessibility**: Proper header, nav, main, section, h1, h2, button, and input roles with visible focus rings and accessible labels.

---

## Security Considerations
- Pure frontend presentation; no API tokens or secrets exposed in client bundles.
- Safe client-side keyboard listener with proper unmount cleanup.

---

## Acceptance Criteria
- [ ] Navigation renders Vertex logo, brand name, Courses, My Learning, notification bell, and user avatar.
- [ ] Hero section renders "INTELLIGENT LEARNING" pill, serif title, subtitle, and "Explore Courses ->" CTA button.
- [ ] Search bar renders with search icon, placeholder "Ask anything about your learning...", and "⌘ K" shortcut badge with working focus on click/shortcut.
- [ ] Divider line between hero and courses renders cleanly.
- [ ] "All Courses" section displays 3 course cards:
  - Next.js for Production (Intermediate, 18h 24m, 12 modules)
  - Docker Essentials (Beginner, 10h 12m, 8 modules)
  - TypeScript Deep Dive (Intermediate, 14h 36m, 10 modules)
- [ ] Weekly update divider with star icon and "New courses and lessons added every week."
- [ ] Warm equalizer/bars graphic renders smoothly at the bottom of the page.
- [ ] Existing design system showcase remains fully functional at `/design-system`.
- [ ] `npm run lint` and `npm run build` succeed with zero errors.

---

## Checks to Run
- `npm run lint`
- `npm run build`
- Dev server verification (`npm run dev`) and visual comparison against `design/vertex-home.png`

---

## Manual Test Steps
1. Run `npm run build` to verify type checking and page compilation.
2. Launch dev server and open `http://localhost:3000`.
3. Verify visual alignment against `design/vertex-home.png`:
   - Check navigation links and avatar.
   - Check hero badge, title, subtitle, and button.
   - Test clicking or pressing `⌘K` (or `Ctrl+K` on Windows) to focus the search bar.
   - Check the 3 course cards (icons, titles, descriptions, metadata tags).
   - Check the star divider and bottom equalizer graphic.
4. Resize viewport to test mobile layout (cards stack cleanly, header collapses gracefully).
5. Open `http://localhost:3000/design-system` to confirm the design system showcase is intact.
