# Implementation Prompt: Seed Sanity Dataset from seed.ndjson and videos.json

## Goal
Seed the Sanity dataset (`production`) using the existing dataset files at `studio/scripts/seed/seed.ndjson` and `studio/scripts/seed/videos.json` without modifying either file or generating new synthetic content. Execute the import via the Sanity CLI (`sanity datasets import`), verify document counts across all types (categories, instructors, lessons, courses, and assets), and validate reference integrity.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 1 (Platform scope: Sanity content model, courses, modules, lessons, instructors, categories, video URLs).
  - Section 2 (Workflow loop: inspect code, write prompt in `prompts/`, get approval via interactive question panel, execute, verify, report).
  - Section 8 (Content shapes: 10 courses, embedded modules, 120 lessons with video URLs and notes, 5 instructors, 6 categories).
  - Section 9 (Video documents: built offline by ingestion pipeline; `videos.json` holds source lookup data).
  - Section 13 (Checks: import content, verify document counts).
- **`sanity-migration` (`.agents/skills/sanity-migration/SKILL.md`)**:
  - Use deterministic document IDs.
  - Use `sanity datasets import --replace` so imports converge cleanly and idempotently.
  - Upload remote assets using `_sanityAsset` asset syntax (handled natively by Sanity CLI import).
  - Verify document counts, reference integrity, and sample documents post-import.
- **`sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)**:
  - Reference resolution via GROQ.
  - Video URLs hosted on external platforms (YouTube) rather than stored as raw Sanity file assets.

---

## Code & Configuration Inspected
- **`studio/sanity.cli.ts`**:
  - Project ID: `br9mxbes`
  - Dataset: `production`
- **`studio/sanity.config.ts`**:
  - Standalone Studio configured with schemas: `categoryType`, `instructorType`, `lessonType`, `moduleType`, `courseType`.
- **Sanity CLI Session (`sanity debug`)**:
  - User: Abdellah BOUKRA (`boukra.abdellah0@gmail.com`), Role: `administrator` on project `br9mxbes`.
- **`studio/scripts/seed/seed.ndjson`**:
  - 141 newline-delimited documents:
    - 6 `category` documents
    - 5 `instructor` documents (with portrait image URLs via `_sanityAsset`)
    - 120 `lesson` documents (with YouTube video URLs, durations, thumbnails, Portable Text notes, key points, resources)
    - 10 `course` documents (with cover images, learning outcomes, instructor & category references, and embedded modules with lesson references)
  - 0 missing internal references across all documents.
- **`studio/scripts/seed/videos.json`**:
  - 120 entries mapping lesson slugs to YouTube video IDs, titles, channels, durations, and search queries.
  - All 120 video entries map 1-to-1 to the 120 lessons in `seed.ndjson`.
- **Current Sanity Dataset (`production`)**:
  - Verified empty (0 non-system documents).

---

## Decisions & Assumptions
1. **File Preservation**:
   - Neither `studio/scripts/seed/seed.ndjson` nor `studio/scripts/seed/videos.json` will be modified in any way, per user instruction.
2. **Import Mechanism**:
   - Run `npx sanity datasets import scripts/seed/seed.ndjson production --replace --allow-failing-assets` from the `studio/` directory.
   - `seed.ndjson` contains the complete Sanity document dataset.
   - `videos.json` is the offline video metadata registry (used to build video documents with transcript chunks in later pipeline stages); it is not an NDJSON document file.
3. **Asset Handling**:
   - The `--allow-failing-assets` flag ensures network timeouts on individual external image CDNs do not abort the import.
4. **Idempotency**:
   - The `--replace` flag ensures that rerunning the import cleanly overwrites existing documents with matching IDs.

---

## Files Expected to Touch
- `prompts/seed-sanity-dataset.md` (New implementation prompt)
- *No code or seed data files will be modified.*

---

## Requirements
1. Use Sanity CLI dataset import to load the seed data into dataset `production`.
2. Do not modify `seed.ndjson` or `videos.json`.
3. Do not generate synthetic or replacement content.
4. Verify document counts post-import via GROQ:
   - `category`: 6
   - `instructor`: 5
   - `lesson`: 120
   - `course`: 10
   - Total content documents: 141
5. Verify reference integrity (courses resolve instructors, categories, and module lessons).

---

## Security Considerations
- The import uses the active administrator session in the local Sanity CLI.
- No write tokens are committed or exposed to the client bundle.
- `.env.local` retains `SANITY_API_READ_TOKEN` for read-only access.

---

## Acceptance Criteria
- [ ] `sanity datasets import` completes successfully with 0 fatal errors.
- [ ] GROQ count query confirms 141 content documents (6 categories, 5 instructors, 120 lessons, 10 courses).
- [ ] Asset documents (`sanity.imageAsset`) are created for uploaded images.
- [ ] A sample course query returns resolved instructor name, category title, and module lessons.
- [ ] Neither `seed.ndjson` nor `videos.json` have any git modifications.

---

## Checks to Run
1. `cd studio && npx sanity datasets import scripts/seed/seed.ndjson production --replace --allow-failing-assets`
2. GROQ document count verification query via `@sanity/client` / Sanity CLI.
3. GROQ reference expansion query for course structure.
4. `git status` check confirming seed files are unmodified.

---

## Exact Manual Test Steps
1. Navigate to the running Studio at `http://localhost:3333`.
2. In the sidebar, inspect:
   - **Courses**: 10 courses listed.
   - **Lessons**: 120 lessons listed.
   - **Instructors**: 5 instructors listed with photos.
   - **Categories**: 6 categories listed.
3. Click any course (e.g. "Next.js App Router in Depth") and verify modules and lesson references display properly.
4. In the Studio Vision tool, run `*[_type == "course"]{ title, "moduleCount": count(modules) }` and observe all 10 courses.
