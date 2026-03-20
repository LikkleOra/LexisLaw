# ⚽ THE FOOTBALL CODEBASE SYSTEM
### Build · Read · Debug · Ship
*Next.js · React · Tailwind · Convex · Clerk*

---

## PART 1 — THE SQUAD: YOUR FULL STACK

Every tool has a position. Know the position and you always know where to look.

| Emoji | Role | Tool | What It Does |
|-------|------|------|-------------|
| 🏟️ | THE CLUB | Next.js Project | The entire organisation. Governs routing, rendering strategy (SSR/SSG/CSR), and how the whole team operates. |
| 🎨 | THE KIT | Tailwind CSS | What the fans see. Colours, spacing, layout. Zero effect on the game — only affects how it feels to be there. |
| 🟩 | THE PITCH | React Components | The playing surface and formation. Every component is a zone. Pages are full matches. Components are positions. |
| ⚽ | THE BALL | Data (Props/State) | What the game is actually about. Data moves between components and across the network. Follow the ball when something breaks. |
| 🏢 | BACK OFFICE | Convex (Backend) | Operations the fans never see. Database, real-time sync, server functions, mutations, queries. |
| 🔐 | STADIUM SECURITY | Clerk (Auth) | Controls who enters which area. Authentication, sessions, roles, access. |
| 📋 | TACTICS BOARD | Hooks / Business Logic | Decisions the team makes on the field. Custom hooks and utility functions. They decide things — don't display, don't store. |
| 🧳 | TRANSFERS | npm Packages | Players recruited from outside. Every dependency is a specialist brought in. They have their own quirks. |

---

## THE DRESSING ROOMS — FILE STRUCTURE

| Folder / File | Football Role | What It Does |
|--------------|--------------|-------------|
| `/app` or `/pages` | Match Schedule | Every page the user visits. Each file is a fixture. |
| `/components` | The Squad | Reusable players. Used across multiple matches. |
| `/convex` | Club Operations HQ | All backend functions, schema, queries, mutations. |
| `/lib` or `/utils` | Training Drills | Helper functions. Logic that gets reused everywhere. |
| `/hooks` | Tactics Sheet | Custom React hooks. Decisions and behaviour. |
| `/public` | The Trophy Cabinet | Static assets — images, icons, fonts. Always on display. |
| `middleware.ts` | Stadium Steward | Runs before every request. Guards routes. |
| `.env.local` | Club Secrets | Private keys and credentials. Never shared publicly. |
| `next.config.js` | Club Constitution | Rules the whole project follows. Rarely touched. |

---

## PART 2 — THE MATCH DAY PIPELINE: HOW YOU BUILD

Your complete workflow from idea to shipped product. Every phase has a tool, a purpose, and an output. Follow the sequence.

### 1 — IDEATION & ARCHITECTURE · Claude (claude.ai)
Flesh out the idea fully. Understand what you are building, why, who it is for, and how the system should work. Get the architecture clear before writing a single line.
> **Output:** A clear brief — what the app does, the data model, the main flows, the tech decisions.

### 2 — DESIGN REFERENCE · Dribbble · Behance · Pinterest
Scout the aesthetic. Find interfaces, colour palettes, layouts, and interactions that match the vibe. Build a mood board before touching any design tool.
> **Output:** A collection of visual references that define the aesthetic direction.

### 3 — UI GENERATION · Google Stitch
Generate the UI from your references and brief. Stitch turns your direction into actual component designs and screen layouts.
> **Output:** Generated UI screens and components ready to implement.

### 4 — RAPID PROTOTYPE · Google AI Studio
Build the basic working demo fast. Proves the core idea before committing to a full build. De-risks the concept.
> **Output:** A working demo that proves the concept and exposes problems early.

### 5 — FULL BUILD · Google Antigravity
Take the prototype and design into full production-quality code. Antigravity's agent and manager views let you build complex features while delegating routine work in parallel.
> **Output:** A production-ready codebase with all features implemented.

### 6 — BACKGROUND TASKS · Google Jules
While you build in Antigravity, Jules works asynchronously on your GitHub repo — fixing bugs, writing tests, updating dependencies. Delegate and review, do not babysit.
> **Output:** Clean PRs for bug fixes, test coverage, and maintenance tasks.

### 7 — DEBUGGING · Antigravity + Claude
When something breaks, use the VAR system (Part 4). Antigravity for in-file tracing and fixes, Claude for understanding why something broke at a logic level.
> **Output:** Root cause identified and fixed, not just the symptom.

### 8 — DEPLOYMENT · Vercel
Push to production. Vercel handles CI/CD, preview deployments, and environment variables. Every push to main is a potential live deployment.
> **Output:** Live application on a real URL.

### 9 — ANALYTICS · Vercel Analytics / PostHog / Google Analytics
- **Vercel Analytics** — lightweight, built-in, zero config. Good for traffic.
- **PostHog** — product analytics, session recording, user behaviour. Good for understanding how people use the app.
- **Google Analytics** — when you need SEO and marketing attribution data.
> **Output:** Visibility into how the app is performing and how users behave.

---

## PART 3 — THE SCOUTING REPORT: HOW TO READ CODE

Reading code is a skill separate from writing it. Whether it is your own project from three months ago or someone else's repo entirely — the approach is the same. You are a scout, not a player. Your job is to understand the system before you touch it.

> *The mistake most people make is diving into a single file and trying to understand it in isolation. That is like watching one player warm up and trying to predict the team's formation. Start from the outside and zoom in.*

### The 7-Step Scouting Report

**Step 1 — READ THE BADGE: What Is This App?**
Read the README first. If there is no README, read the `package.json` name and dependencies. In 60 seconds you should know: what the app does, what stack it uses, and roughly how complex it is.

**Step 2 — STUDY THE FORMATION: What Is The Structure?**
Look at the top-level folder structure. Identify the main zones: pages/app, components, lib, API routes, config. You are not reading files yet — you are reading the map. Apply the Football File Structure from Part 1.

**Step 3 — FIND THE BALL: Where Does Data Come From?**
Find the data source. Is it Convex? A REST API? A database? Then trace one piece of data from its source all the way to where it renders on screen. Follow the ball from back office to pitch.

**Step 4 — WATCH THE FIRST MATCH: Trace One Full User Flow**
Pick the core action — sign up, create something, view something. Trace the code for that one flow end to end: Page loads → data fetches → component renders → user acts → mutation fires. This single trace teaches you more than reading 20 random files.

**Step 5 — IDENTIFY THE KEY PLAYERS: Which Files Matter Most?**
In every codebase there are 5-10 files that carry most of the weight — the ones imported by many other files. Find them. These are your star players. Understand them and the rest becomes easier.

**Step 6 — READ THE TACTICS: Understand The Decisions**
Now you can read individual files with context. For each significant function or component, ask: what does it receive, what does it decide, what does it return? Do not ask what every line does — ask what the function's job is. One job, one function.

**Step 7 — WRITE YOUR MATCH REPORT: Document What You Found**
Write 3-5 bullet points summarising what you now know: what the app does, how data flows, where the main logic lives, and any patterns that stand out. This forces clarity and gives you a reference if you step away and return.

---

### Code Patterns Translated

| Code Pattern | Football Translation | What To Know |
|-------------|---------------------|-------------|
| `useState` / `useReducer` | Player's current position on pitch | Local data that belongs to one component. Changes cause re-render. |
| `useEffect` | Player reacting to match events | Runs after render. Used for side effects like fetching data or subscriptions. |
| Props drilling | Manager passing instructions through 4 coaches | Data passed down many levels. Sign of a structure that needs rethinking. |
| Context API | Club-wide announcement system | Data available to any component without passing it down manually. |
| `Convex useQuery` | Live score feed from back office | Reactive query — auto-updates when data changes. No manual fetching. |
| `Convex useMutation` | Sending instruction to back office | Triggers a server-side function that writes to the database. |
| `Clerk useUser` | Checking player's access badge | Returns the currently authenticated user and their session. |
| `middleware.ts` | Gate check before entering the stadium | Runs before every request. Redirects unauthenticated users. |
| `async/await` | Waiting for the ball to arrive before passing | Pauses execution until a promise resolves. Prevents acting on missing data. |
| Loading states | Waiting for VAR decision | UI shown while data is fetching. Always handle or the UI looks broken. |

---

## PART 4 — THE VAR SYSTEM: HOW TO DEBUG

A bug is not random. It has a cause, a chain of events, and a moment of origin. VAR stops play and traces back to that exact moment.

**Step 1 — STOP PLAY: Read The Error Exactly**
Do not guess. Read the complete error. The file name and line number are always there. Write it down before doing anything else.

**Step 2 — IDENTIFY THE FOUL: What Type Of Error Is This?**
- `TypeError` = wrong data type passed (ball changed shape mid-pass)
- `404` = route or resource not found (player not on pitch)
- Auth error = Clerk blocked entry
- Hydration error = server and client rendered differently

**Step 3 — TRACE THE BALL: Where Was The Data Last Correct?**
Follow the ball backwards: Convex query → hook → component → render. `console.log` at each stage until you find where data changed or disappeared.

**Step 4 — IDENTIFY THE PLAYER: Which File Or Function Caused It?**
Now you know where on the pitch the foul happened. Which component, function, or module made the wrong call?

**Step 5 — CHECK THE TACTICS: Was The Logic Wrong?**
Sometimes the code is working perfectly — you told it to do the wrong thing. Re-read your own logic as if someone else wrote it. Ask: what does this code *actually* do, not what did I *want* it to do?

**Step 6 — MAKE THE CALL: Fix, Test, Document**
Fix the actual cause, not just the error message. Test it. Write one comment line explaining what broke and why — your match report.

---

### Common Fouls By Position

| Position | Common Foul | What It Looks Like |
|---------|------------|-------------------|
| Tailwind (Kit) | Class not applying | Style looks right in code but renders wrong — usually a typo or purge config issue |
| React (Pitch) | Infinite re-render | Component keeps looping — `useEffect` with wrong or missing dependency array |
| Convex (Back Office) | Stale or missing data | UI shows old data or nothing — query not reactive or mutation not invalidating |
| Clerk (Security) | Redirect loop | User bounced between pages — middleware protecting a route it should not |
| Next.js (Manager) | Hydration mismatch | Server and client HTML differ — conditional logic using browser-only values on server |
| Data (Ball) | Cannot read undefined | Accessing a property on something that does not exist yet — missing loading state |

---

## PART 5 — THE COACHING STAFF: YOUR AI TOOLS

Your AI tools are not interchangeable. Each one is a specialist. Use the right staff member for the job.

### 🧠 HEAD COACH — Claude (claude.ai)
Fleshing out ideas, designing architecture, understanding why something works, debugging complex logic, planning before building. Use Claude when you need to **think**, not just execute.

### 🎨 KIT DESIGNER — Google Stitch
Generating UI screens and components from your brief and visual references. Use after you have scouted references on Dribbble/Behance/Pinterest. Stitch turns direction into design.

### ⚡ RAPID PROTOTYPE — Google AI Studio
Building a working demo fast to prove the concept. Use before committing to a full build. If the demo breaks the idea, you saved weeks. If it confirms it, you have a starting point.

### 🏗️ MAIN BUILDER — Google Antigravity
Primary coding environment. Use for building out the full application from prototype and design. Antigravity's Manager view lets you run multiple agents in parallel across the codebase.

### 🔄 BACKGROUND WORKER — Google Jules
Delegate routine tasks while you focus on main features. Bug fixes, writing tests, dependency updates, GitHub issue resolution. Always review the diff before merging — it is a capable junior, not a senior.

### 🚀 MATCH DAY — Vercel
Shipping to production. CI/CD, preview URLs for every branch, environment variables. Push to main = live. Every PR gets its own preview URL to test before merging.

### 📊 MATCH ANALYST — Analytics
- **Vercel Analytics** — traffic and performance, zero config
- **PostHog** — user behaviour, session recordings, product decisions
- **Google Analytics** — SEO and marketing attribution data

Pick based on what question you are trying to answer.

---

## THE CLUB RULES

1. **Understand the role before writing the code.** Know which position you are playing.
2. **Follow the ball when something breaks.** Data always leaves a trail. Trace it backwards.
3. **Read the full error message before doing anything.** The file and line number are always there.
4. **One change at a time when debugging.** Multiple changes means you will never know what fixed it.
5. **Start from the outside when reading unfamiliar code.** Structure first, then data flow, then individual files.
6. **If you do not understand what the code does, do not ship it.** Ask until you do.
7. **Use Claude to understand. Use documentation to verify. Use your own judgment to decide.**
8. **De-risk before you build.** Prototype in AI Studio before committing to a full Antigravity build.

---

*The game only makes sense once you know the positions.*
*Learn the positions. Everything else follows.*
