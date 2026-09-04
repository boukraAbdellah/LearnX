# Implementation Prompt: Vertex Design System

## Goal
Implement the complete Vertex Design System as specified in [`design/vertex-designsystem.png`](file:///c:/Dev/Projects/LearnX/design/vertex-designsystem.png) for the LearnX platform. This entails establishing the design tokens (colors, typography, spacing, shadows, border radii) in Tailwind CSS v4, loading the Google Fonts (`Playfair Display` and `Inter`), creating reusable design system components (buttons, inputs, select, badges, status indicators, progress bar, cards, navigation, breadcrumbs, pagination, icons), and providing an interactive showcase view to inspect and verify every design system token and component against the specification.

---

## Skills Consulted & Read
- **`AGENTS.md`**: Section 2 (Loop & workflow rules), Section 3 (UI reproduction standards: exact layout, spacing, typography, colors, responsive down to mobile, no mobile reference so adapt layout sensibly), Section 5 & 6 (Tech stack: Next.js App Router, Tailwind CSS, TypeScript).
- **`modern-web-guidance`**: Modern styling and component best practices.
- **`sanity-best-practices`**: Design system tokens alignment for content-driven UI.

---

## Code & Configuration Inspected
- **`package.json`**:
  - Framework: Next.js `16.3.4` (App Router)
  - React: `19.2.8`
  - Styling: Tailwind CSS `^4.0` with `@tailwindcss/postcss`
- **`app/layout.tsx`**: Uses `next/font/google` for `Geist` (to be replaced/augmented with `Inter` and `Playfair Display`).
- **`app/globals.css`**: Tailwind v4 configuration using `@import "tailwindcss";` and `@theme inline`.
- **`design/vertex-designsystem.png`**: The visual ground truth containing:
  - `01 COLORS`: Primary (500 `#F97316`, 400 `#FB923C`, 300 `#FDBA74`, 200 `#FED7AA`, 100 `#FFEEE5`), Neutral (900 `#0F172A`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, 50 `#FAFAFC`, White `#FFFFFF`).
  - `02 TYPOGRAPHY`: Playfair Display (Serif, Elegant/Readable), Inter (Sans, Clean/Modern).
  - `03 TYPE SCALE`: Display 1 (48/56 Bold), Display 2 (36/44 Bold), Heading 1 (28/36 SemiBold), Heading 2 (22/30 SemiBold), Heading 3 (18/26 Medium), Body Large (16/24 Regular), Body (14/20 Regular), Small (12/16 Regular).
  - `04 SPACING SYSTEM`: 4px base (4, 8, 12, 16, 24, 32, 40, 48, 64px).
  - `05 RADIUS & SHADOWS`: Radius xs (4px), sm (8px), md (12px), lg (16px), xl (24px), full (9999px). Shadows sm, md, lg, xl with calibrated rgba alphas.
  - `06 ICONS`: 24x24 grid, 2px stroke width outline & filled versions (Bell, Search, Play, FileText, Bookmark, BarChart, Clock, User, ChevronRight, ChevronDown, ExternalLink, Lock, CheckCircle).
  - `07 BUTTONS`: Primary, Secondary, Tertiary, Text variants across Default, Hover, and Disabled states. Specs: 44px height, 12px radius, Inter Medium font.
  - `08 INPUTS`: Search/Text Input (with Search icon & ⌘K badge), Select dropdown ("Most Relevant"). Height: 44px, Radius: 12px, Border: `#E2E8F0`, Focus: `#FB923C`.
  - `09 BADGES / TAGS`: Video, Lesson, Popular badges with exact pill styling.
  - `10 STATUS / INDICATORS`: In Progress, Completed, Now Playing, Locked.
  - `11 PROGRESS BAR`: Track `#F1F5F9`, Fill `#F97316`, label `35% complete`.
  - `12 CARDS`: Course Card, Lesson Card (Video), Lesson Card (Lesson), Resource Card.
  - `13 NAVIGATION`: Header (Logo + Vertex mark + links "Courses", "My Learning"), Breadcrumbs, Pagination.
  - `14 PRINCIPLES`: Clarity First, Consistency, Focus & Calm, Accessible.

---

## Decisions & Assumptions
1. **Tailwind CSS v4 Token Architecture**:
   - We will define the custom colors, fonts, shadows, and radii inside `@theme` in `app/globals.css`.
   - Primary colors will be configured as `primary-500`, `primary-400`, `primary-300`, `primary-200`, `primary-100`.
   - Neutral colors will be mapped as `neutral-900`, `neutral-700`, `neutral-500`, `neutral-300`, `neutral-200`, `neutral-100`, `neutral-50`, `white`.
2. **Typography Setup**:
   - Configure `Inter` and `Playfair_Display` using `next/font/google` in `app/layout.tsx` with CSS variables `--font-inter` and `--font-playfair`.
   - Provide helper utility classes for type scale (`display-1`, `display-2`, `heading-1`, `heading-2`, `heading-3`, `body-lg`, `body-base`, `text-caption-sm`).
3. **Component Modularity**:
   - Create modular, reusable components in `components/ui/` or `components/design-system/`:
     - `Button.tsx`
     - `Input.tsx` / `Select.tsx`
     - `Badge.tsx`
     - `StatusIndicator.tsx`
     - `ProgressBar.tsx`
     - `Card.tsx` (and specific card variants: CourseCard, LessonVideoCard, LessonTopicCard, ResourceCard)
     - `Navigation.tsx` / `Breadcrumbs.tsx` / `Pagination.tsx`
     - `Icons.tsx` (SVG icon set matching the 24x24 2px stroke optical spec)
4. **Verification & Showcase Surface**:
   - Replace the default Next.js starter page on `app/page.tsx` with a live visual Design System Showcase matching the layout of `vertex-designsystem.png` section by section. This allows visual comparison against `design/vertex-designsystem.png`.

---

## Files Expected to Touch
- `app/layout.tsx` (Configure Inter & Playfair Display fonts, metadata)
- `app/globals.css` (Tailwind v4 `@theme` configuration, color tokens, font variables, shadows, radii, base typography)
- `components/ui/button.tsx` (Button component with Primary, Secondary, Tertiary, Text variants & states)
- `components/ui/input.tsx` (Search input with icon & shortcut badge)
- `components/ui/select.tsx` (Select dropdown component)
- `components/ui/badge.tsx` (Video, Lesson, Popular badge pills)
- `components/ui/status-indicator.tsx` (In Progress, Completed, Now Playing, Locked)
- `components/ui/progress-bar.tsx` (Progress bar component with percentage label)
- `components/ui/cards.tsx` (Course Card, Video Lesson Card, Topic Lesson Card, Resource Card)
- `components/ui/navigation.tsx` (Headerp nav with Vertex logo and links)
- `components/ui/breadcrumbs.tsx` (Breadcrumb component)
- `components/ui/pagination.tsx` (Pagination control)
- `components/ui/icons.tsx` (Vector SVG icons adhering to 24x24 2px stroke specs)
- `app/page.tsx` (Interactive Design System showcase page displaying sections 01 to 14)

---

## Requirements
1. **Design Precision**: Strict adherence to hex codes, typography weights, line heights, border radii, shadows, and spacing from `vertex-designsystem.png`.
2. **Interactive States**: Proper hover, focus, and disabled states on buttons, inputs, cards, and links.
3. **Accessibility (a11y)**: Proper ARIA roles, labels, focus rings, semantic markup (`nav`, `main`, `header`, `button`, `input`).
4. **Responsiveness**: Clean responsive layout that scales down to mobile viewports cleanly.

---

## Security Considerations
- Pure client-side styling and presentational UI components; no tokens or external script injection.
- Built-in Next.js font optimization without external unsafe CDN links.

---

## Acceptance Criteria
- [ ] Tailwind v4 tokens (colors, fonts, shadows, radii) defined and working via utility classes.
- [ ] Playfair Display and Inter fonts loaded and applied to headings and body text.
- [ ] All 4 button variants (Primary, Secondary, Tertiary, Text) render correctly in Default, Hover, and Disabled states.
- [ ] Input and Select components render with exact 44px height, 12px radius, and `#FB923C` focus styles.
- [ ] Badges (Video, Lesson, Popular) render with appropriate colors and paddings.
- [ ] Status indicators (In Progress, Completed, Now Playing, Locked) render cleanly.
- [ ] Progress bar displays track, fill, and percentage text.
- [ ] Cards (Course, Video Lesson, Lesson, Resource) faithfully reproduce layout, typography, tags, and action buttons.
- [ ] Navigation header, Breadcrumbs, and Pagination components render accurately.
- [ ] Running `npm run lint` and `npm run build` succeeds with zero errors.

---

## Checks to Run
- `npm run lint`
- `npm run build`
- Browser inspection and visual comparison against `design/vertex-designsystem.png`

---

## Manual Test Steps
1. Start dev server (`npm run dev`) or test production build.
2. Open `http://localhost:3000` in the browser.
3. Visually cross-check each numbered section (01 to 14) against `design/vertex-designsystem.png`.
4. Test button hover and disabled states.
5. Focus the search input and verify focus ring color (`#FB923C`).
6. Resize viewport to test responsive wrapping on smaller screens.
