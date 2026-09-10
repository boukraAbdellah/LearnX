# Implementation Prompt: Align Studio Schema & Queries with Seeded Dataset

## Goal
Resolve all schema conflicts between the imported Sanity dataset and the Studio schema definitions in `studio/schemaTypes/` and frontend queries in `sanity/lib/queries.ts`. This ensures Sanity Studio exhibits zero "unknown field" or type-mismatch validation errors when editing documents, and Next.js frontend queries receive populated data instead of `null`s.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 8 (Data modeling: instructor expertise, course popular flag, learning outcomes, lesson video URL, thumbnail, free preview flag, key points, and resources).
  - Section 13 (Checks to run: TypeScript typecheck in web and studio, eslint, Studio verification).
- **`sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)**:
  - Topics: schema design, field definitions (`defineField`, `defineArrayMember`), GROQ queries with `defineQuery`.

---

## Code & Configuration Inspected
- **`studio/schemaTypes/instructorType.ts`**:
  - `expertise` is defined as `type: 'string'`, but dataset holds `string[]`.
- **`studio/schemaTypes/lessonType.ts`**:
  - `poster` defined instead of `thumbnail`.
  - `isFreePreview` defined instead of `freePreview`.
  - `keyPoints` defined as `object[]` with `{ icon, title, description }`, but dataset holds `string[]`.
  - `resources[].resourceType` defined, but dataset holds `resources[].type`.
  - `duration` labeled "Duration (minutes)", but dataset holds seconds.
- **`studio/schemaTypes/courseType.ts`**:
  - `isPopular` defined instead of `popular`.
  - `learningOutcomes` array member named `outcome`, but dataset holds `_type: "learningOutcome"`.
- **`sanity/lib/queries.ts`**:
  - Queries `isPopular`, `poster`, and `isFreePreview` directly, resulting in `null` values.

---

## Decisions & Assumptions
1. **Preserve Dataset**: The 141 live documents in the Sanity dataset and the original `seed.ndjson` and `videos.json` files will remain unchanged.
2. **Schema Alignment**: Update the schemas in `studio/schemaTypes/` to match the exact field names and types of the dataset.
3. **Query Compatibility**: Update GROQ projections in `sanity/lib/queries.ts` to query the correct fields, providing aliases (e.g. `"isPopular": popular`, `"poster": thumbnail`, `"isFreePreview": freePreview`) where helpful to keep downstream frontend code intuitive.
4. **Studio Preview**: Update preview selectors and `prepare()` handlers in Studio schemas to reflect the corrected field names.

---

## Files Expected to Touch
- `studio/schemaTypes/instructorType.ts` (Update `expertise` to string array + preview)
- `studio/schemaTypes/lessonType.ts` (Update `thumbnail`, `freePreview`, `duration`, `keyPoints`, `resources[].type`, and preview)
- `studio/schemaTypes/courseType.ts` (Update `popular` and `learningOutcome` object name)
- `sanity/lib/queries.ts` (Update GROQ projections for catalog, course detail, and lesson queries)

---

## Requirements
1. `instructor.expertise` must accept an array of strings in Studio.
2. `lesson` schema must recognize `thumbnail` (image), `freePreview` (boolean), `duration` (number, seconds), `keyPoints` (array of strings), and `resources[].type` (string).
3. `course` schema must recognize `popular` (boolean) and `learningOutcome` array objects.
4. GROQ queries in `sanity/lib/queries.ts` must return non-null values for all seeded fields.
5. Both `studio` and web app must pass TypeScript check (`tsc --noEmit`).

---

## Security Considerations
- No authentication tokens or secrets modified.
- No changes to client/server data isolation boundaries.

---

## Acceptance Criteria
- [ ] `npx sanity documents query` validates that all fields in `lesson`, `course`, and `instructor` match the schema without missing/null values.
- [ ] Studio loads without schema warnings or "Unknown field" notices.
- [ ] `npm run build` or `tsc --noEmit` passes with 0 errors in both root and `studio/`.

---

## Checks to Run
1. `npm run --prefix studio tsc --noEmit`
2. `npx tsc --noEmit`
3. GROQ query against live Sanity dataset verifying populated fields.
4. `npm run lint`

---

## Exact Manual Test Steps
1. Open Studio at `http://localhost:3333`.
2. Click **Instructors** -> open "Mira Kovac" -> verify `expertise` displays tag list with 4 tags, with no schema errors.
3. Click **Lessons** -> open "File-system routing and the app directory" -> verify thumbnail image, free preview switch, key points list, and resources display cleanly.
4. Click **Courses** -> open "Next.js App Router in Depth" -> verify "Mark as Popular" toggle and all 4 Learning Outcomes load without "Unknown type" error.
