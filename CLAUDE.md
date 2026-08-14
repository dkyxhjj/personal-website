@AGENTS.md

# richardli.space

Personal site. Next.js 16.3 App Router, TypeScript, Tailwind, Turbopack.
Deployed to Cloudflare Pages.

## Commands

- Dev: [npm run dev]
- Build: [npm run build] — MUST pass before anything is considered done
- Test: [fill in your runner]

## Routes

- `/` — portfolio. Sidebar nav, terminal component, mesh gradient background.
- `/rank` — Drake album ranker. 18 albums, rate 0–10, binary-search
  comparisons within each rating, poster export.
- `/map` — Toronto geolocated lyrics map. [status]

## Decisions already made — do not relitigate

- Ranking ties break by release order. Deterministic, never arbitrary.
- Comparisons replaced drag-to-break-ties. The phase-2 drag list stays as
  optional fine-tuning, not as the ordering mechanic.
- The poster shows top 5 only, plus a Kendall's tau-b against AOTY critic
  scores. No average-rating stat, no distribution chart, no half-point ratings.
- Rating scale is 0–10 integers.

## Traps — these have already cost me hours

- html-to-image renders blank covers if images aren't decoded first. The fix
  in ResultsCard is: pre-decode all images, call toPng twice, no lazy loading
  inside the poster node. It looks redundant. It isn't. Leave it.
- `touch-action: none` belongs on individual draggable rows, never the
  scroll container — putting it on the container kills scroll on iOS.
- Unbounded flex containers need `min-h-0` or pinned bottom buttons vanish
  on mobile.
- iOS share sheet fails if the user-gesture context is lost across an await.
- Album covers are preloaded once at the top of the /rank session. If a
  component that holds the preload starts unmounting, move the preload up
  rather than letting it re-fire.

## Working style

- Only make changes directly requested. Do not refactor, rename, or improve
  things noticed in passing.
- Multi-step work: read the relevant files, report the plan, STOP for
  confirmation before writing.
- Algorithm changes get tested and shown before any UI is built on them.
- Output ✅ [what was completed] after each step.

## Ask before

- Installing any dependency
- Editing package.json, tsconfig.json, next.config.ts, globals.css, or the
  Tailwind config
- Modifying app/rank/lib/insertion.ts or its test
- Touching the sidebar, terminal component, or root layout

## Conventions

- Transitions 150–200ms, opacity plus small y offset. No scale, no spring,
  no spinners.
- Mobile is primary. Verify at 390px before desktop.
- Serif headings, mono for metadata. Don't introduce a third family.