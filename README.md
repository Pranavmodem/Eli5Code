# 🦸 Zero to Hero — Interactive Coding Bootcamp

Master **OOP, Data Structures, Algorithms & Big O** in 60 days at 2 hours/day —
built for visual learners who need to *see* Bubble Sort happen, not read about it.

## Core features

- **🧸 ELI5 / ⚙️ Tech toggle** — a global switch (navbar + every lesson) that flips
  every explanation between a real-world analogy and proper technical jargon.
- **🎬 Interactive visualizers** — step through algorithms frame-by-frame with
  play / pause / step-forward / step-back / speed controls:
  - Bubble Sort (bars physically swap, powered by Framer Motion layout animations)
  - Linked List (nodes wire together with animated arrows on insert)
  - Stack & Queue (cafeteria plates / lunch line)
  - Binary Search (watch the search zone get chopped in half)
  - Big O growth chart (drag to probe O(1) vs O(n) vs O(n²) at any n)
- **📈 60-day dashboard** — day-by-day roadmap paced at 2 hrs/day, milestone
  markers at Day 30 (80% strength) and Day 60 (90%), and modules that unlock
  as you complete the previous one.
- **🤖 AI tutor** — floating ask-anything button that answers in ELI5 or Tech
  style to match your toggle.
- **☁️ Supabase sync** — progress persists locally (zustand + localStorage) and
  syncs to Supabase per anonymous device id. Works fully offline too.

## Tech stack

Next.js 14 (App Router) · Tailwind CSS (dark-mode-first) · Zustand · Framer Motion · Supabase

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | Supabase publishable key (public, RLS-guarded) |
| `AI_API_URL` | **server only** | OpenAI-compatible endpoint for the AI tutor |
| `AI_API_KEY` | **server only** | API key for the tutor — set in Vercel, never commit |
| `AI_MODEL` | server | Model name (default `gpt-4o-mini`) |

## Deploy to Vercel

1. Push this repo to GitHub and **Import Project** in Vercel — framework
   auto-detects as Next.js; the default build (`next build`) just works.
2. Add the environment variables above under *Settings → Environment Variables*.
3. Deploy. 🎉

## Supabase setup

Run `supabase/migrations/0001_progress.sql` against your project (SQL editor or
`supabase db push`). It creates the `progress` table with RLS enabled.

## Curriculum

| Module | Days | Content |
| --- | --- | --- |
| 1 · 🏗️ OOP via Analogies | 1–12 | Classes as blueprints, objects as houses, inheritance as genetics, polymorphism as multi-tools |
| 2 · 🗂️ Data Structures | 13–32 | Arrays as bookshelves, linked lists as treasure hunts, stacks/queues as cafeterias, trees as org charts, hash maps as dictionaries |
| 3 · ⚡ Algorithms in Motion | 33–50 | Bubble/Merge/Quick sort, binary search, BFS/DFS |
| 4 · 📈 Time & Space Complexity | 51–60 | Big O, O(1) vs O(n) vs O(n²), space trade-offs, building efficient systems |
