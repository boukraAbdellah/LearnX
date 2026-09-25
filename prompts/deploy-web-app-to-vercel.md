# Implementation Prompt: Deploy LearnX Web App to Vercel

Prepare, verify, commit, and deploy the LearnX web application to Vercel via GitHub repository integration (`boukraAbdellah/LearnX`).

---

## 1. Goal

1. **Verify Production Readiness**:
   - Ensure the Next.js App Router codebase passes TypeScript compilation (`tsc --noEmit`), ESLint (`npm run lint`), and production build (`npm run build`) without errors or warnings.
2. **Complete Environment Variable Specification**:
   - Update `.env.example` with any missing server or client environment variables (specifically documenting `GEMINI_API_KEY` used for intelligent search AI augmentation).
   - Ensure secrets remain strictly protected and excluded by `.gitignore`.
3. **Commit & Push Codebase to GitHub**:
   - Stage all verified application updates (including progress tracking, `/my-learning` dashboard, video ingestion pipeline, popular courses slider, intelligent search, and design system refinements).
   - Commit cleanly to Git and push to `origin/master`.
4. **Vercel Deployment Guide & Environment Configuration**:
   - Provide the complete, structured specification for importing `boukraAbdellah/LearnX` into Vercel.
   - Detail the exact environment variable requirements for production (Sanity, Clerk, Gemini).
   - Provide post-deployment configuration steps for Sanity CORS origins and Clerk production domains.

---

## 2. Skills Read

- `AGENTS.md` (Sections 5, 6, 7, 12, 13):
  - Architecture: Two standalone workspaces (web root and studio). Web app is Next.js App Router at repository root.
  - Boundaries: Client never holds tokens or calls MCP directly; server routes handle writes (`SANITY_API_WRITE_TOKEN`) and MCP/LLM integration.
  - Checks: Must run TypeScript check, lint, and production build before deployment.
- `sanity-best-practices` (`.agents/skills/sanity-best-practices/SKILL.md`): Environment configuration, private dataset tokens, CORS origin requirements for production deployments.
- `clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`): Production domain configuration, middleware proxy, client vs server keys.

---

## 3. Code Inspected

- [package.json](file:///c:/Dev/Projects/LearnX/package.json): Build script `next build`, Next.js 16.3.4, React 19.2.8.
- [next.config.ts](file:///c:/Dev/Projects/LearnX/next.config.ts): Image domains (`cdn.sanity.io`), unoptimized image settings.
- [.gitignore](file:///c:/Dev/Projects/LearnX/.gitignore): Confirmed `.env*` is properly ignored while `.env.example` is tracked.
- [.env.example](file:///c:/Dev/Projects/LearnX/.env.example): Currently documents Sanity and Clerk variables; needs `GEMINI_API_KEY`.
- [app/api/search/route.ts](file:///c:/Dev/Projects/LearnX/app/api/search/route.ts): Uses `GEMINI_API_KEY`, `SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.
- [app/api/progress/route.ts](file:///c:/Dev/Projects/LearnX/app/api/progress/route.ts): Uses `SANITY_API_WRITE_TOKEN` and Clerk auth.
- [proxy.ts](file:///c:/Dev/Projects/LearnX/proxy.ts): Clerk middleware router protecting private routes.
- Git Status & Remote: Remote is `https://github.com/boukraAbdellah/LearnX.git` on branch `master`.

---

## 4. Decisions and Assumptions

1. **Target Platform**: Vercel via GitHub Git integration (selected by user).
2. **Root Directory**: The web app is located at the root of the repository (`./`). In Vercel Project Settings, the Root Directory must remain `./`.
3. **Environment Security**: No private API keys or tokens are hardcoded. Only `.env.example` is committed.
4. **Build System**: Vercel will run `npm run build` using Node.js 20.x or 22.x.
5. **CORS & Domain Authorization**:
   - Sanity project (`br9mxbes`) requires the deployed Vercel domain (e.g. `https://learn-x-*.vercel.app`) to be added under API > CORS origins with credentials enabled if draft mode or client requests are made.
   - Clerk Dashboard requires the production domain added to allowed origins / redirect URIs.

---

## 5. Files Expected to Touch

- `.env.example`: Add `GEMINI_API_KEY` documentation.
- Git repository: Stage all modified and untracked files, create git commit, push to `origin/master`.

---

## 6. Security Considerations

- Verify `.env.local` is never staged or committed.
- Ensure all private tokens (`SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN`, `CLERK_SECRET_KEY`, `GEMINI_API_KEY`) are documented as server-only in `.env.example`.
- Ensure public client keys are strictly limited to `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

---

## 7. Acceptance Criteria

1. `.env.example` completely lists all required production environment variables.
2. `npx tsc --noEmit` exits with code 0 (no type errors).
3. `npm run lint` exits with code 0 (no lint errors).
4. `npm run build` exits with code 0 (all routes compile successfully).
5. All local changes are committed and pushed to `boukraAbdellah/LearnX` on branch `master`.
6. Clear, actionable step-by-step instructions for completing the deployment in Vercel are provided.

---

## 8. Checks to Run

- Run `npx tsc --noEmit` in `c:\Dev\Projects\LearnX` (web workspace).
- Run `npm run lint` in `c:\Dev\Projects\LearnX`.
- Run `npm run build` in `c:\Dev\Projects\LearnX`.
- Run `git status` to verify staged/committed files.
- Run `git push origin master` to sync with GitHub.

---

## 9. Manual Test & Deployment Steps

1. **Push verification**: Verify commits appear on GitHub at `https://github.com/boukraAbdellah/LearnX`.
2. **Vercel Project Setup**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Import the `boukraAbdellah/LearnX` repository.
   - Leave Framework Preset as `Next.js` and Root Directory as `./`.
   - Add all environment variables from `.env.local` into the Vercel Environment Variables section.
3. **Trigger Deployment**: Click Deploy and verify the build log succeeds on Vercel.
4. **Sanity CORS configuration**: Add production URL to Sanity management console (`https://www.sanity.io/manage/project/br9mxbes/api#cors`).
5. **Clerk Production keys**: In Clerk dashboard, configure production domain and redirect URLs.
