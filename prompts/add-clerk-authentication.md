# Implementation Prompt: Add Clerk Authentication

## Goal
Set up authentication in LearnX using Clerk and the Clerk CLI, linking to Clerk application `app_3IprwhcBk9u2WaIboH5omz9pI59`. Integrate `@clerk/nextjs` with Next.js 16 (App Router), configure proxy middleware, wrap the application with `ClerkProvider`, update navigation components to provide clear sign-in, sign-up, and user profile buttons (`UserButton`), and verify the installation using `clerk doctor`.

---

## Skills Consulted & Read
- **`AGENTS.md`**:
  - Section 2 (Workflow loop: inspect code, write prompt, get approval, execute, verify, report).
  - Section 5 & 7 (Auth architecture: Clerk authentication via Next.js middleware; browsing stays public; private routes gated; user progress keyed off Clerk user ID; browser never holds secret key).
  - Section 12 (Critical security: `CLERK_SECRET_KEY` is server only; only publishable key reaches browser; `auth()` is async; Next.js 16 proxy matcher).
  - Section 13 (Verification checks: typecheck, lint, build, dev server).
- **`clerk` & `clerk-setup` (`.agents/skills/clerk/SKILL.md`, `clerk-setup/SKILL.md`)**:
  - CLI operations: `clerk auth login`, `clerk init --app <app_id>`, `clerk doctor`.
  - Package detection: `@clerk/nextjs` latest version for Next.js App Router.
- **`clerk-nextjs-patterns` (`.agents/skills/clerk-nextjs-patterns/SKILL.md`)**:
  - Next.js 16 uses `proxy.ts` (Next.js <=15 used `middleware.ts`).
  - Matcher configuration with `'/__clerk/:path*'` following `/(api|trpc)(.*)`.
  - Server components use `await auth()` from `@clerk/nextjs/server`.
  - Client components use `@clerk/nextjs` components (`SignInButton`, `SignUpButton`, `UserButton`, `Show`).
  - `ClerkProvider` placement inside `<body>`, not wrapping `<html>`.

---

## Code & Configuration Inspected
- **`package.json`**:
  - Next.js: `16.3.4`
  - React: `19.2.8`
  - React DOM: `19.2.8`
  - Tailwind CSS: `v4`
  - Package manager: `npm` (`package-lock.json` present)
- **`app/layout.tsx`**:
  - Root layout with font definitions (`--font-inter`, `--font-playfair`).
  - Needs `<ClerkProvider>` wrapping `{children}` directly inside `<body>`.
- **`components/ui/navigation.tsx`**:
  - Navigation bar rendering brand, links ("Courses", "My Learning"), notifications bell, and a static mock avatar.
  - Needs integration with Clerk: `SignInButton` and `SignUpButton` wrapped with `<Show when="signed-out">`, and `<UserButton />` wrapped with `<Show when="signed-in">`.
- **`components/ui/index.ts`**:
  - Central export file for UI components.
- **`components.json`**:
  - Checked: Not present (vanilla Tailwind v4 custom components used, `@clerk/ui` not required).
- **Existing middleware / proxy**:
  - No `proxy.ts` or `middleware.ts` currently exists. `proxy.ts` will be created for Next.js 16.

---

## Decisions & Assumptions
1. **Clerk Application ID**:
   - Explicitly link to target app: `app_3IprwhcBk9u2WaIboH5omz9pI59`.
2. **CLI Installation & Auth**:
   - Check if `clerk` is available via `where.exe clerk`. If missing, install globally via `npm install -g clerk`.
   - Run `clerk auth login` to authenticate before running init/link commands.
   - Run `clerk init --app app_3IprwhcBk9u2WaIboH5omz9pI59` to scaffold Clerk integration into the existing Next.js app.
3. **Middleware / Proxy Strategy**:
   - In Next.js 16, use `proxy.ts` with `clerkMiddleware`.
   - Implement public-first strategy per `AGENTS.md` (keep browsing public, gate protected routes like `/my-learning` or user progress APIs).
   - Matcher will include Clerk's auto-proxy path:
     ```ts
     export const config = {
       matcher: [
         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
         '/(api|trpc)(.*)',
         '/__clerk/:path*',
       ],
     };
     ```
4. **Layout & Provider**:
   - Wrap children inside `<body>` with `<ClerkProvider>` in `app/layout.tsx`.
5. **Navigation Auth Controls**:
   - Enhance `components/ui/navigation.tsx` using `@clerk/nextjs` controls:
     - When signed out: Render polished "Sign in" and "Sign up" buttons matching Vertex's warm brand styling.
     - When signed in: Render notification bell and `<UserButton />` with custom avatar props matching the 36px circular avatar in the design.
6. **No Leaked Secrets**:
   - Never print or log secret keys. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is client-safe, `CLERK_SECRET_KEY` is kept server-only in `.env.local`.

---

## Files Expected to Touch / Create
- **`proxy.ts`** [NEW]: Next.js 16 Clerk middleware with public-first configuration and `'/__clerk/:path*'` matcher.
- **`app/layout.tsx`** [MODIFY]: Wrap `{children}` in `<body>` with `<ClerkProvider>`.
- **`components/ui/navigation.tsx`** [MODIFY]: Add interactive Clerk auth buttons (`SignInButton`, `SignUpButton`, `UserButton`, `Show`).
- **`package.json`** [MODIFY]: Add `@clerk/nextjs` dependency via CLI / npm install.
- **`.env.local`** [MODIFY/NEW]: Environment variables populated via `clerk init`.

---

## Requirements & Step-by-Step Execution Plan

### Step 1: Install or Update the Clerk CLI
- Verify if `clerk` exists. If not, install via `npm install -g clerk`.
- If available, update via `clerk update --yes`.

### Step 2: Sign In to Clerk
- Run `clerk auth login` to ensure authenticated session in the CLI.

### Step 3: Initialize Clerk in LearnX
- Run `clerk init --app app_3IprwhcBk9u2WaIboH5omz9pI59`.
- Verify `@clerk/nextjs` is installed in `package.json`.

### Step 4: Configure Next.js Proxy & Middleware
- Create/verify `proxy.ts` (Next.js 16) with `clerkMiddleware` and verify matcher has `'/__clerk/:path*'`.

### Step 5: Wrap Root Layout with ClerkProvider
- In `app/layout.tsx`, import `ClerkProvider` from `@clerk/nextjs` and place inside `<body>`.

### Step 6: Integrate Auth Controls in Navigation
- Update `components/ui/navigation.tsx` with `<Show when="signed-out">` (Sign In, Sign Up) and `<Show when="signed-in">` (`<UserButton />`).
- Style the buttons cleanly with existing design tokens (`bg-[#0F172A]` / warm orange accents).

### Step 7: Verify with Clerk Doctor & Build
- Run `clerk doctor` to validate setup.
- Run `npm run lint` and `npm run build` to verify type safety and Next.js App Router compatibility.

---

## Security Considerations
- `CLERK_SECRET_KEY` stays on the server; only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` reaches the browser.
- `.env.local` must remain in `.gitignore`.
- Next.js 15+ async `auth()` requirement respected for any server calls.

---

## Acceptance Criteria
- [ ] Clerk CLI installed and authenticated.
- [ ] `@clerk/nextjs` installed in project.
- [ ] Next.js 16 `proxy.ts` configured with `clerkMiddleware` and required matcher including `'/__clerk/:path*'`.
- [ ] `<ClerkProvider>` wraps application in `app/layout.tsx` inside `<body>`.
- [ ] Navigation displays "Sign In" and "Sign Up" buttons when logged out, and `<UserButton />` when logged in.
- [ ] `clerk doctor` reports healthy integration.
- [ ] `npm run build` succeeds without type or lint errors.

---

## Checks to Run
- `clerk doctor`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

---

## Exact Manual Test Steps
1. Start dev server: `npm run dev`.
2. Open `http://localhost:3000`.
3. Verify top navigation displays "Sign In" and "Sign Up" buttons.
4. Click "Sign Up", create a test user or authenticate.
5. Confirm redirect back to LearnX with the user avatar `<UserButton />` visible in the top navigation.
6. Click `<UserButton />` to ensure profile modal opens and functions properly.
