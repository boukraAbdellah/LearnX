# Implementation Prompt: Deep Indigo Color Palette Transition

## Goal
Update the entire visual identity and design system tokens of LearnX from the previous warm orange theme to the newly specified **Deep Indigo** palette across Tailwind CSS tokens, UI components, pages (Design System Showcase & Home page), and brand elements.

---

## Color Palette Specification

### Primary (Deep Indigo)
- **Primary 500**: `#4F46E5` (Main brand color, primary buttons, active indicators, progress fill)
- **Primary 400**: `#6366F1` (Borders, focus rings, secondary badges, logo secondary accent)
- **Primary 300**: `#818CF8` (Disabled text, soft accents)
- **Primary 200**: `#A5B4FC` (Focus ring halos, borders, subtle highlights)
- **Primary 100**: `#E0E7FF` (Badge backgrounds, active tints, now-playing background)
- **Primary Hover/Active Shades**: `#4338CA` (Indigo 700 for hover), `#3730A3` (Indigo 800 for active)
- **Primary Light Tint**: `#EEF2FF` (Indigo 50 for button hover backgrounds & light card highlights)

### Neutral
- **Neutral 900**: `#0F172A` (Headings, primary text)
- **Neutral 700**: `#334155` (Secondary text, subtitles)
- **Neutral 500**: `#64748B` (Muted labels, placeholders, icons)
- **Neutral 300**: `#CBD5E1` (Dividers, borders)
- **Neutral 200**: `#E2E8F0` (Card borders, input borders)
- **Neutral 100**: `#F1F5F9` (Background fills, tags, track bars)
- **Neutral 50**: `#FAFAFC` / `#F8FAFC` (Page surface background)

---

## Skills Consulted & Read
- **`AGENTS.md`**: Section 2 (Loop & workflow rules), Section 3 (UI reproduction standards: exact layout, spacing, typography, colors, no mobile reference so adapt layout sensibly), Section 5 & 6 (Tech stack: Next.js App Router, Tailwind CSS, TypeScript), Section 13 (Checks to run).
- **`modern-web-guidance`**: Modern CSS token practices, Tailwind v4 theme variables, accessible contrast checks.

---

## Code & Configuration Inspected
- **`app/globals.css`**: Tailwind v4 `@theme` block containing `--color-primary-*` and `--color-neutral-*`.
- **`components/ui/button.tsx`**: Button variant styles (primary, secondary, text) and interactive states.
- **`components/ui/badge.tsx`**: Pill badge variants (`video`, `popular`, `lesson`).
- **`components/ui/cards.tsx`**: `CourseCard`, `LessonVideoCard`, `LessonTopicCard`, `ResourceCard` interaction styles.
- **`components/ui/icons.tsx`**: `VertexLogo` brand SVG path fills.
- **`components/ui/input.tsx` & `components/ui/select.tsx`**: Form control focus rings and borders.
- **`components/ui/navigation.tsx`**: Brand header link and logo hover state.
- **`components/ui/pagination.tsx`**: Active page indicator border and text.
- **`components/ui/progress-bar.tsx`**: Fill bar background color.
- **`components/ui/status-indicator.tsx`**: "In Progress" and "Now Playing" SVG fills and strokes.
- **`app/page.tsx`**: Home hero CTA button gradient, search focus ring, "View all courses" link, star icon.
- **`app/design-system/page.tsx`**: Color swatches, section headers (`01 Colors`, `02 Typography`, etc.), interactive sliders, and principle icons.

---

## Decisions & Assumptions
1. **Tailwind CSS v4 `@theme` as Single Source of Truth**:
   - Update `--color-primary-500` through `--color-primary-100` in `app/globals.css` with exact hex values provided by the user.
   - Neutral scale in `app/globals.css` already aligns with the user's neutral specs (`#0F172A`, `#334155`, `#64748B`, `#CBD5E1`, `#F1F5F9`).
2. **Harmonious Interactive States**:
   - For primary hover/active states where darker shades are required: use `#4338CA` (Indigo 700) for hover and `#3730A3` (Indigo 800) for active/pressed.
   - For light tints (secondary button hover, soft pill tags): use `#EEF2FF` (Indigo 50) and `#E0E7FF` (Indigo 100).
3. **Comprehensive Component Updates**:
   - All components in `components/ui/` with hardcoded orange values (`#F97316`, `#FB923C`, `#EA580C`, `#FED7AA`, `#FFEEE5`) will be consistently updated to the corresponding Deep Indigo scale.
4. **Showcase Consistency**:
   - Update `app/design-system/page.tsx` color swatch definitions, hex labels, and numbered section headers so the live design system preview reflects Deep Indigo accurately.

---

## Files to Modify
1. `app/globals.css`: Update `@theme` CSS custom properties for `primary-*`.
2. `components/ui/button.tsx`: Update primary, secondary, text variant states.
3. `components/ui/badge.tsx`: Update `video` and `popular` badge color pairings.
4. `components/ui/cards.tsx`: Update hover colors and action button link colors.
5. `components/ui/icons.tsx`: Update `VertexLogo` SVG path fills to `#4F46E5` and `#6366F1`.
6. `components/ui/input.tsx`: Update focus border and focus ring classes.
7. `components/ui/select.tsx`: Update focus border and focus ring classes.
8. `components/ui/navigation.tsx`: Update brand logo hover color.
9. `components/ui/pagination.tsx`: Update active page indicator styling.
10. `components/ui/progress-bar.tsx`: Update progress bar fill to `#4F46E5`.
11. `components/ui/status-indicator.tsx`: Update `in-progress` spinner stroke and `now-playing` icon colors.
12. `app/page.tsx`: Update hero CTA gradient, search container focus ring, link colors, and star divider.
13. `app/design-system/page.tsx`: Update primary swatches array, accent colors, and section header text classes.

---

## Requirements
- Primary 500 must be `#4F46E5`.
- Primary 400 must be `#6366F1`.
- Primary 300 must be `#818CF8`.
- Primary 200 must be `#A5B4FC`.
- Primary 100 must be `#E0E7FF`.
- Neutral scale must match `#0F172A`, `#334155`, `#64748B`, `#CBD5E1`, `#F1F5F9`.
- No lingering orange artifacts or broken styles in buttons, inputs, cards, logos, or pages.
- TypeScript types and Tailwind compilation must pass without errors.

---

## Security Considerations
- Pure visual and styling changes; no API keys, auth credentials, or client/server boundary changes.

---

## Acceptance Criteria
- [ ] `app/globals.css` declares the 5 Deep Indigo primary tokens in `@theme`.
- [ ] All buttons (primary, secondary, tertiary, text) reflect the Deep Indigo palette across default, hover, active, and disabled states.
- [ ] `VertexLogo` displays in Deep Indigo (#4F46E5 and #6366F1).
- [ ] Search input and Select inputs show Deep Indigo focus rings (`#6366F1` / `#A5B4FC`).
- [ ] Progress bar fills in `#4F46E5`.
- [ ] Status indicators (In Progress, Now Playing) use `#4F46E5` and `#E0E7FF`.
- [ ] Home page hero CTA uses Deep Indigo gradient (`from-[#4F46E5] to-[#4338CA]`).
- [ ] Design System page (`/design-system`) displays the updated Deep Indigo swatches and metadata.
- [ ] `npm run lint` and `npm run build` pass cleanly without errors.

---

## Checks to Run
- TypeScript type check: `npx tsc --noEmit`
- Next.js build: `npm run build`
- Lint check: `npm run lint`

---

## Exact Manual Test Steps
1. Navigate to `/design-system` in the browser:
   - Check `01 COLORS`: Verify the 5 primary swatches display `#4F46E5`, `#6366F1`, `#818CF8`, `#A5B4FC`, and `#E0E7FF`.
   - Check `06 ICONS`: Verify `VertexLogo` renders with Deep Indigo geometry.
   - Check `07 BUTTONS`: Verify Primary buttons are Deep Indigo, hover states darken to `#4338CA`, and secondary/text buttons use indigo borders/text.
   - Check `08 INPUTS`: Click into the search input and verify the indigo focus ring.
   - Check `09 BADGES`: Verify video and popular tags use indigo tints.
   - Check `10 STATUS`: Verify In Progress spinner and Now Playing indicator are Deep Indigo.
   - Check `11 PROGRESS BAR`: Move the slider and verify the fill bar is `#4F46E5`.
   - Check `12 CARDS`: Hover course card title and action links; verify indigo hover transitions.
   - Check `13 NAVIGATION`: Verify active page in pagination is `#4F46E5` with `#6366F1` border.
2. Navigate to `/` (Home page):
   - Verify the "Explore Courses ->" hero CTA has an indigo gradient.
   - Click into the search bar and verify the indigo focus ring.
   - Verify "View all courses" link is indigo.
