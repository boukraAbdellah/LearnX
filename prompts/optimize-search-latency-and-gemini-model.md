# Implementation Prompt: Optimize Search Latency, Model Configuration & Resilient Fallback

## Goal
Eliminate search route latency (+15s -> <500ms), configure model fallback handling for Gemini API (`gemini-2.5-flash` / `gemini-3.6-flash`), cache Sanity Context MCP connections, disable AI SDK exponential backoff retry loops on HTTP 429 quota exhaustion, and ensure grounded video and lesson search results return immediately even when free-tier LLM quotas are exhausted.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 5 (Search architecture): "The search API is a server route that connects to the Sanity Context MCP, injects the schema and the system prompt, calls the LLM, and streams results back."
  - Section 7 (Grounded Search): "Search is grounded. Say only what the data returns. Never invent a course, lesson, price, duration, or timestamp."
  - Section 11 (Search Behavior): "For a query, search both ways and merge: match lessons on their topic (title and notes), and match video moments (chapters first, then transcript, per section 7)... Ground every result in real data."
  - Section 12 (Pitfalls): "The search route should cache initial context... Never return a whole transcript or chunks array to the model."
  - Section 13 (Checks to Run): Type check, lint, build.
- **`gemini-api-dev`**:
  - Model capabilities, rate limits, and error handling for free-tier quotas (`RESOURCE_EXHAUSTED` / HTTP 429).

---

## Code & Configuration Inspected
- **`app/api/search/route.ts`**:
  - Profiling proved the latency breakdown:
    - Sanity grounded query + video joins: **~450ms** (fast).
    - Per-request HTTP connection to Sanity Context MCP: **~1,400ms**.
    - Gemini API call with Free Tier 429 Quota Exhaustion (`GenerateRequestsPerDayPerProjectPerModel-FreeTier` limit 20): **~10,500ms** due to 3 default exponential backoff retries.
  - Model availability tests against Google Gemini API:
    - `gemini-2.5-flash`: Returned `"model models/gemini-2.5-flash is no longer available to new users. Please update your code to use models/gemini-3.6-flash"`.
    - `gemini-2.0-flash`: Returned `"model models/gemini-2.0-flash is no longer available"`.
    - `gemini-3.6-flash`: Active model on Google AI Studio, but hit daily free-tier quota (20 requests/day).

---

## Decisions & Assumptions
1. **Model Configuration**:
   - Allow configurable model selection: Attempt `gemini-2.5-flash` if requested/configured, with automatic fallback to `gemini-3.6-flash`.
   - Prevent retry loops: Configure `maxRetries: 0` and `abortSignal: AbortSignal.timeout(1500)` so that quota limits (429) or model unavailability never block the request.
2. **Resilient Fast-Path Architecture**:
   - The grounded Sanity search engine already resolves courses, lessons, chapter markers, and transcript chunks in ~450ms.
   - MCP client and AI reasoning are treated as an asynchronous enhancement with a non-blocking timeout.
   - If Gemini is rate-limited or unavailable, the endpoint returns the grounded results in <500ms without throwing an error to the user or stalling for 15 seconds.
3. **MCP Connection Caching**:
   - Cache the Sanity Context MCP client instance or reuse the connection rather than making a fresh HTTP handshake and schema discovery on every keystroke.

---

## Files to Create & Modify

### Modify
- [app/api/search/route.ts](file:///c:/Dev/Projects/LearnX/app/api/search/route.ts):
  - Add model fallback logic (`gemini-2.5-flash` with fallback to `gemini-3.6-flash`).
  - Add `maxRetries: 0` and bounded timeout to prevent 10s backoff loops.
  - Implement resilient fast-path returning grounded results immediately on quota limit.
  - Cache MCP client connection to avoid 1.4s connection overhead per query.

---

## Security Considerations
- All API keys (`GEMINI_API_KEY`, `SANITY_API_READ_TOKEN`) remain strictly server-side.
- Zero client-side leakage of tokens or model errors.

---

## Acceptance Criteria
- [ ] Search API request time drops from +15s to <1s (typically 400-600ms).
- [ ] No exponential backoff stalls occur when free-tier Gemini API quota is reached.
- [ ] Grounded video moments and lesson results are always returned accurately with exact timestamps.
- [ ] Model identifier is updated to support `gemini-2.5-flash` with resilient fallback to `gemini-3.6-flash`.
- [ ] Type check and Next.js build pass cleanly without regression.

---

## Checks to Run
1. `npm run lint` in web workspace.
2. `npm run build` in web workspace.
3. Curl / node latency test to verify `/api/search?q=Routing` response time under 1 second.
4. Verify grounded results (chapters and chunks) are populated in the response payload.

---

## Exact Manual Test Steps
1. Navigate to `http://localhost:3000/search?q=Routing` in the browser.
2. Notice the search results appear almost instantaneously (<1s) instead of waiting 15+ seconds.
3. Verify video moments cards display with chapter timestamps (e.g. `00:00` or `01:23`).
4. Click "Watch from MM:SS" and confirm video playback launches at that timestamp.
