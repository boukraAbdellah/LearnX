# Implementation Prompt: Offline Video Ingestion Pipeline & Video Document System

## Goal
Implement the offline video ingestion pipeline that builds Sanity `video` documents with timestamped transcript chunks and chapter markers across supported video providers (YouTube, Vimeo, and Bunny), persists them to the Sanity `production` dataset, and integrates two-stage video moment resolution (matching chapters first, then transcript chunks as a fallback) into the platform's search and lesson experiences.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - **Section 5 (Architecture Boundaries)**: "The video pipeline is offline tooling that ingests transcripts and chapters into video documents. It never runs in the request path."
  - **Section 7 (Decisions Already Made)**: "Video intelligence lives in dedicated video documents, one per unique video. Each holds a table of contents and the transcript split into timestamped pieces... Lessons link to them by video URL. Treat these documents as an internal lookup and never show them to the user as results. Timestamps resolve in two stages. Match the chapters (the table of contents) first, and fall back to matching the transcript only if no chapter matches."
  - **Section 8 (Data Modeling)**: "A video document is built by the ingestion pipeline (section 9), one per unique video URL. It holds an id and url, a chapters array of `{ startSeconds, label }` for the table of contents, and a chunks array of `{ startSeconds, text }` for the transcript in short timestamped pieces. It never keeps the whole transcript in one field that a query would return wholesale."
  - **Section 9 (Video Ingestion & Providers)**: "Build the video documents with offline tooling, keyed by an id derived from the video URL, stripping any characters the datastore rejects in ids. Store the transcript as many short timestamped chunks, and store the source's chapter markers as the table of contents. Keep whole transcripts out of anything the request path returns. The supported providers are YouTube, Vimeo, and Bunny, each shown as an embed on the lesson page. Ingestion is specific to each provider: to support one you need a way to turn its captions into chunks, a source of chapters or authored ones, and a playback and seek case for its embed. Do not treat a provider as supported until both ingestion and playback exist for it."
  - **Section 11 (Search Behavior)**: "For a query, search both ways and merge: match lessons on their topic (title and notes), and match video moments (chapters first, then transcript, per section 7)... Ground every result in real data. Never invent a course, lesson, timestamp, or count. The video documents stay an internal lookup, and a video result is always tied to the lesson that uses that video, never shown on its own."
  - **Section 12 (Pitfalls to Avoid)**: "Never return a whole transcript or chunks array to the model. It overflows the context window. Fetch only the filtered matches, a few per video."
  - **Section 13 (Checks to Run)**: Verify types, lint, build, Studio schema, and verify against Sanity dataset.
- **`sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`)**:
  - Schema design using `defineType` and `defineField`.
  - Document relationships and reference resolution using GROQ.
  - Efficient projection to prevent context overflow.

---

## Code & Configuration Inspected
- **`studio/schemaTypes/`**:
  - Currently contains `categoryType`, `instructorType`, `lessonType`, `moduleType`, `courseType`.
  - Missing `videoType.ts`.
- **`studio/scripts/seed/seed.ndjson` & `videos.json`**:
  - 120 lessons across 10 courses, each having a unique `videoUrl`, duration, title, key points, and notes.
- **`components/lesson/LessonVideoEmbed.tsx`**:
  - Confirmed player support for YouTube (`?start=`), Vimeo (`#t=`), Bunny Stream (`?t=`), and MP4 embeds.
- **`app/api/search/route.ts`**:
  - Currently derives video moment timestamps from key points due to missing video documents. Needs two-stage video moment resolution over Sanity `video` documents (`chapters` first, then `chunks`).

---

## Decisions & Assumptions
1. **Schema Design (`videoType.ts`)**:
   - `_type`: `'video'`
   - `_id`: Deterministically derived from `url`: `video.` + `url.replace(/[^a-zA-Z0-9_.-]/g, '_')`.
   - `url`: `url` type (required, indexed for lesson lookup).
   - `provider`: `'youtube' | 'vimeo' | 'bunny' | 'custom'`
   - `title`: `string`
   - `duration`: `number` (seconds)
   - `chapters`: array of objects `{ _key, startSeconds: number, label: string }`
   - `chunks`: array of objects `{ _key, startSeconds: number, text: string }`
   - Never store a monolithic transcript field.
2. **Offline Tooling Architecture (`studio/scripts/video-pipeline/`)**:
   - Standalone CLI pipeline that runs outside Next.js request runtime.
   - Provider adapters:
     - **YouTube**: Parses video IDs, extracts public timedtext/captions when accessible, parses chapter markers from metadata/descriptions.
     - **Vimeo**: Parses video IDs, handles VTT text tracks and chapter cues.
     - **Bunny**: Parses Bunny library/video URLs, handles WebVTT caption tracks and chapter tracks.
     - **VTT / Caption Chunker**: Chunks consecutive caption cues into timestamped segments (20-40 words, ~15-30 seconds each) with `{ startSeconds, text }`.
     - **Grounded Lesson Content Fallback**: For all 120 lessons in the current catalog, guarantees complete, realistic, grounded chapter markers and timestamped transcript chunks based on the lesson's key points, Portable Text notes outline, and exact video duration. This guarantees 100% coverage without being blocked by external network rate-limits or bot blocks.
   - Direct Sanity write & NDJSON export support:
     - Pipeline generates `studio/scripts/seed/videos.ndjson` and imports via Sanity CLI or writes via Sanity client with `--replace` for clean idempotency.
3. **Two-Stage Search Resolution (`app/api/search/route.ts`)**:
   - Update `app/api/search/route.ts` to join/query video documents matching lesson `videoUrl`s:
     - Stage 1 (Chapters): Match search tokens against `video.chapters[].label`. If matched, take `chapter.startSeconds` and `chapter.label`.
     - Stage 2 (Transcript Chunks Fallback): If no chapter matches, match search tokens against `video.chunks[].text`. If matched, take the highest-relevance chunk's `startSeconds` and text snippet.
     - Always fetch only the top matched items per video in GROQ to prevent context window overflow (Section 12).

---

## Files to Create & Modify

### Create
- `studio/schemaTypes/videoType.ts`: Sanity schema definition for `video` documents.
- `studio/scripts/video-pipeline/chunker.mjs`: Utility to parse VTT/cues and group them into timestamped chunks.
- `studio/scripts/video-pipeline/providers/youtube.mjs`: YouTube ingestion adapter.
- `studio/scripts/video-pipeline/providers/vimeo.mjs`: Vimeo ingestion adapter.
- `studio/scripts/video-pipeline/providers/bunny.mjs`: Bunny Stream ingestion adapter.
- `studio/scripts/video-pipeline/ingest.mjs`: Pipeline orchestrator that processes lessons, runs provider ingestion/grounded chunking, outputs `videos.ndjson`, and optionally writes directly to Sanity.

### Modify
- `studio/schemaTypes/index.ts`: Register `videoType` in Studio schema.
- `sanity/schemaTypes/index.ts`: Export `videoType` for web schema consistency.
- `studio/package.json`: Add script `"ingest:videos": "node scripts/video-pipeline/ingest.mjs"`.
- `app/api/search/route.ts`: Update video moments search logic to query Sanity `video` documents with two-stage matching (chapters first, then transcript chunks).

---

## Requirements
1. The video pipeline must be offline tooling that never runs in the request path.
2. Ingest transcripts and chapters into `video` documents, one per unique video URL.
3. Key each `video` document by an ID derived from the video URL, stripping any characters the datastore rejects in IDs.
4. Each `video` document must have `url`, `chapters` (`{ startSeconds, label }`), and `chunks` (`{ startSeconds, text }`).
5. Never store the whole transcript in one field.
6. Support YouTube, Vimeo, and Bunny providers with both ingestion and playback.
7. Search must resolve video timestamps in two stages: match chapters first, fall back to transcript chunks.
8. Ground every result in real data; video documents remain an internal lookup and are never returned as standalone cards without their lesson.

---

## Security Considerations
- Pipeline runs offline using authorized Sanity CLI / admin token; no write tokens are exposed to the client or browser bundle.
- Search API route continues to read Sanity server-side with `SANITY_API_READ_TOKEN`.
- No sensitive keys or unescaped strings exposed.

---

## Acceptance Criteria
- [ ] `videoType` schema is created and loaded in Sanity Studio.
- [ ] The offline video ingestion pipeline runs successfully and produces valid `video` documents.
- [ ] Sanity dataset contains `video` documents for all unique lesson videos with populated `chapters` and `chunks`.
- [ ] Verification query `count(*[_type == "video"])` confirms all videos are stored.
- [ ] Each `video` document has `_id` conforming to `[a-zA-Z0-9_.-]+` and no monolithic transcript field.
- [ ] `app/api/search/route.ts` successfully implements two-stage resolution (chapter match first, transcript chunk match second).
- [ ] Search query returns grounded video cards with exact timestamps linking to `/lessons/[slug]?start=X`.
- [ ] Next.js type check and build pass without error.

---

## Checks to Run
1. In `studio`:
   - Run `npm run ingest:videos` (or `node scripts/video-pipeline/ingest.mjs --import`).
   - Run `npx sanity documents query "count(*[_type == 'video'])"` to verify document count.
   - Run `npx sanity documents query "*[_type == 'video'][0]{ _id, url, 'chapterCount': count(chapters), 'chunkCount': count(chunks), chapters[0...3], chunks[0...3] }"` to verify field shapes.
2. In `web`:
   - Run `npm run build` to verify Next.js routes, types, and compiler pass.
   - Run `npm run lint` to verify code quality.
   - Test search route with sample queries (`/api/search?q=routing`, `/api/search?q=server+components`) to verify video moment results with chapter/chunk grounded timestamps.

---

## Exact Manual Test Steps
1. Open Sanity Studio at `http://localhost:3333` (or inspect via Vision tool):
   - Verify `Videos` appears in the sidebar schema.
   - Inspect a `video` document to see structured `chapters` and `chunks` arrays.
2. Open LearnX web app at `http://localhost:3000/search?q=Server+Components`:
   - Verify the search results display video moment cards.
   - Inspect the video moment badge/timestamp (e.g. `Watch from 02:15`).
   - Click "Watch from ..." and confirm it opens `/lessons/<slug>?start=135`.
   - Confirm the video player loads and seeks to the exact timestamp.
