# Implementation Prompt: Fix Instructor Expertise Array Type and UI Rendering

## Goal
Update `expertise` in `app/courses/[slug]/page.tsx` and `components/course/CourseInstructor.tsx` to be typed and rendered as an array of strings (`string[]`), matching the Sanity schema (`instructorType.ts`) and seeded dataset (`seed.ndjson`). Render each expertise area as a clean, styled badge tag within the instructor spotlight.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 2: Implementation prompt workflow and user approval before code changes.
  - Section 8: Data model ("An instructor has a name and slug, a photo, expertise, and a bio").
  - Section 13: Checks to run (type check, lint, build).
- **`sanity-best-practices`**: Schema alignment, typed queries, and array handling.

---

## Code & Configuration Inspected
- **`studio/schemaTypes/instructorType.ts`**:
  ```ts
  defineField({
    name: 'expertise',
    title: 'Expertise',
    type: 'array',
    of: [defineArrayMember({ type: 'string' })],
    options: { layout: 'tags' },
  })
  ```
- **`studio/scripts/seed/seed.ndjson`**:
  Contains `expertise: ["React", "Next.js", "Web performance", "Rendering"]`.
- **`app/courses/[slug]/page.tsx`**:
  Currently typed as `expertise?: string | null`.
- **`components/course/CourseInstructor.tsx`**:
  Currently typed as `expertise?: string | null` and rendered as `{instructor.expertise}` in a `<p>` tag.

---

## Decisions & Assumptions
1. **Type Definition**:
   - Update `CourseInstructorData` in `app/courses/[slug]/page.tsx` to `expertise?: string[] | null`.
   - Update `InstructorProps` in `components/course/CourseInstructor.tsx` to support `expertise?: string[] | string | null` to be resilient.
2. **UI Presentation**:
   - Instead of rendering a single string, render a flex-wrap list of elegant pill badges for each expertise tag (`bg-neutral-100 text-neutral-700 border border-neutral-200/80 px-2.5 py-0.5 rounded-lg text-xs font-medium`).
   - If `expertise` is empty or null, cleanly skip rendering without errors.

---

## Files Expected to Touch
- `app/courses/[slug]/page.tsx` (Update `CourseInstructorData` type definition)
- `components/course/CourseInstructor.tsx` (Update type definition and render expertise tags)

---

## Requirements
1. **Type Safety**: Exact alignment with the Sanity dataset (`string[]`).
2. **Design Consistency**: Match the Vertex design system tokens and badge styling.

---

## Security Considerations
- Pure display update of stored Sanity strings; no client tokens or writes involved.

---

## Acceptance Criteria
- [ ] `app/courses/[slug]/page.tsx` and `components/course/CourseInstructor.tsx` accept `string[]` for `expertise`.
- [ ] Expertise items render as individual pill tags under the instructor's name.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npm run build` succeeds.

---

## Checks to Run
- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
