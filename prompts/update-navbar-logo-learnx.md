# Implementation Prompt: LearnX Navbar Logo & Brand Identity

## Goal
Update the app's brand identity in the navigation bar and across relevant UI surfaces from "Vertex" to **LearnX**, designing a modern, premium, geometric vector logo for LearnX that matches and elevates the visual quality of the Deep Indigo design system.

---

## Skills Consulted & Read
- **`AGENTS.md`**: Section 2 (Workflow loop and prompts creation), Section 3 (UI standards, exact spacing, typography, colors, responsive behavior), Section 5 & 6 (Tech stack: Next.js App Router, Tailwind CSS, TypeScript), Section 13 (Checks: type check, lint, build).
- **`modern-web-guidance`**: SVG vector optimization, responsive scaling, accessible labeling, and contrast standards.

---

## Code & Configuration Inspected
- **`components/ui/icons.tsx`**: Contains the current `VertexLogo` implementation (32x32 SVG mark with two paths in `#4F46E5` and `#6366F1`).
- **`components/ui/navigation.tsx`**: Renders `VertexLogo` and the brand title `"Vertex"` in a Link pointing to `/`.
- **`app/design-system/page.tsx`**: Imports and showcases `VertexLogo` and displays the brand name in the design system header.
- **`app/page.tsx`**: References the brand name in the hero description paragraph ("Vertex understands what you want to learn...").
- **`app/layout.tsx`**: Contains the document title and metadata referencing "Vertex".

---

## Decisions & Assumptions

1. **Logo Geometry & Aesthetics for LearnX**:
   - The new `LearnXLogo` will be an ultra-crisp, scalable SVG mark (default `size = 32`, viewBox `0 0 32 32`) crafted with geometric precision.
   - It incorporates two interlocking, layered faceted ribbons forming a dynamic **"X"** with an implicit **"L"** (Learn) foundation:
     - **Primary Stroke** (from top-left to bottom-right): Bold, forward-leaning ribbon in Deep Indigo (`#4F46E5`), symbolizing continuous learning progress.
     - **Secondary Crossing Stroke** (from top-right to bottom-left): Segmented with an elegant visual overlap/depth fold in Bright Indigo (`#6366F1`) and soft accent (`#818CF8`), giving the mark a dimensional, premium tech-forward appearance.
   - Maintains full backward compatibility by exporting `LearnXLogo` and aliasing `VertexLogo = LearnXLogo` so any legacy references continue to render cleanly.

2. **Navbar Typography & Branding**:
   - In `components/ui/navigation.tsx`:
     - Replace `<VertexLogo size={28} />` with `<LearnXLogo size={28} />`.
     - Replace brand label with `Learn<span className="text-[#4F46E5]">X</span>` (or `LearnX`), styled with `font-serif font-bold text-[22px] tracking-tight text-[#0F172A] group-hover:text-[#4F46E5] transition-colors`.

3. **Design System & Metadata Consistency**:
   - Update `app/design-system/page.tsx` header to showcase `LearnXLogo` and "LearnX" brand title.
   - Update `app/page.tsx` hero paragraph text from "Vertex understands..." to "LearnX understands...".
   - Update `app/layout.tsx` title and metadata description to reflect "LearnX - AI-Powered Learning Platform".

---

## Files to Touch
1. **`components/ui/icons.tsx`**: Implement `LearnXLogo` SVG component with elegant faceted geometric paths; alias `VertexLogo` to `LearnXLogo`.
2. **`components/ui/navigation.tsx`**: Update navbar brand icon to `LearnXLogo` and text to `LearnX`.
3. **`app/design-system/page.tsx`**: Update brand showcase header to `LearnXLogo` and "LearnX".
4. **`app/page.tsx`**: Update hero subtitle text to reference "LearnX".
5. **`app/layout.tsx`**: Update metadata title and description to "LearnX".

---

## Security & Performance Considerations
- Pure client-side SVG rendering with zero external network requests or dependencies.
- Vector paths are lightweight (< 1KB), sharp at all resolutions (HiDPI / Retina), and respect color contrast against light `#FAFAFC` and `#FFFFFF` backgrounds.
- No client/server auth boundaries or secrets are affected.

---

## Acceptance Criteria
- [ ] `LearnXLogo` component exists in `components/ui/icons.tsx`, rendering a sleek, modern geometric "X" mark in Deep Indigo (`#4F46E5`) and Bright Indigo (`#6366F1`).
- [ ] Navbar in `components/ui/navigation.tsx` displays the new `LearnXLogo` and the text `LearnX`.
- [ ] Clicking the logo/brand in the navbar navigates cleanly to `/`.
- [ ] Design system showcase (`/design-system`) displays the new `LearnXLogo` and `LearnX` brand name.
- [ ] Home page hero description and page metadata reflect `LearnX`.
- [ ] All TypeScript types, lint rules, and Next.js build pass cleanly without errors.

---

## Checks to Run
- `npm run typecheck` or `npx tsc --noEmit`
- `npm run lint`
- `npm run build` (or verify pages compile cleanly)

---

## Manual Test Steps
1. Open the home page (`http://localhost:3000`) and inspect the top navigation bar:
   - Confirm the new LearnX geometric logo is displayed crisply alongside the brand name "LearnX".
   - Hover over the brand lockup to confirm smooth hover color transition.
2. Navigate to `/courses`, `/lessons/...`, and `/search`:
   - Confirm the navbar displays the new LearnX logo consistently across all routes.
3. Open `/design-system`:
   - Verify the brand section displays the new `LearnXLogo` at 36px with "LearnX" heading.
