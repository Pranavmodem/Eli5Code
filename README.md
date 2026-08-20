# 🧸 ELI5Code — Zero / Hero Coding Bootcamp

**Live at [eli5code.com](https://www.eli5code.com)**

Data structures & algorithms, explained like you're five — then flipped, with one
switch, into precise technical language. 60 days, 2 hours a day, 0 → 100% DSA
mastery, with an interactive visualizer in **every single lesson**.

## Why it exists

Most people don't fail DSA because it's hard — they fail because it's taught as
walls of abstract text. ELI5Code anchors every concept to something you already
understand (arrays are bookshelves, stacks are tray piles, Big O is two chefs
cooking for a wedding), lets you *watch* the algorithm run step by step, and
only then shows you the formal definition and the code.

## Features

### 🧸 ⇄ ⚙ The ELI5 / Tech toggle
Every lesson is written twice: a vivid real-world analogy, and the precise
technical version (invariants, complexity, edge cases). One switch — inside the
lesson, right where the definition lives — flips between them. The AI tutor
honors the same toggle.

### ▶ A visualizer in all 80 lessons
Every lesson ships a step-script rendered by one of 11 visual engines:

| Engine | Used for |
| --- | --- |
| bars | bubble/selection/insertion/merge/quick sort, linear search, heaps |
| cells | array indexing, binary search, two pointers, sliding window, bit tricks, DP rows |
| nodes | linked lists (singly/doubly), LRU cache |
| vstack / hqueue | stacks, call stacks, queues |
| buckets | hash tables & collisions |
| graph | BSTs, tries, BFS/DFS, Dijkstra, MSTs, topological sort, union-find |
| matrix | polymorphism grids, O(n²) pair counting, Floyd–Warshall, knapsack/LCS/edit-distance DP tables |
| panels / objects | OOP: classes vs instances, encapsulation, constructors |
| chart | growth curves — O(1) vs O(log n) vs O(n) vs O(n²), amortized costs |

Controls: play / pause / step forward / step back / speed. Frames pause on
**predict challenges** ("will these two swap?") that make you commit before the
reveal.

### 📅 The 60-day dashboard
- **DAY X / 60** hero with today's scheduled lesson
- **DSA mastery bar** — one core lesson moves it 2.5 points; 80% by day 30, 100% by day 60
- Clickable 60-day grid, streak, XP, and levels
- Modules unlock at 70% completion of the previous one
- An **advanced track** (modules 5–8: advanced data structures, graph
  algorithms, algorithmic patterns, dynamic programming) continues to day 90

### 📚 The curriculum — 9 modules, 89 lessons, research-backed order
0. **Programming Foundations** *(new)* — variables & types, casting, I/O, operators, conditionals, loops, functions & scope, program tracing, and a step-counting preview of Big O
1. **OOP via Analogies** — classes as blueprints, inheritance as genetics, polymorphism as one message/many answers
2. **Data Structures** — arrays, dynamic arrays, linked lists, stacks, queues, hash maps, BSTs, graphs
3. **Algorithms in Motion** — searches first, then the iterative sorts, then **recursion before merge/quick sort and DFS** (the order they depend on)
4. **Big O** — growth shapes, the handshake problem, space vs time, amortized analysis
5. **Advanced Data Structures** — heaps, tries, union-find, segment/Fenwick trees, AVL, LRU, Bloom filters
6. **Graph Algorithms** — Dijkstra, Bellman-Ford, Floyd–Warshall, toposort, Kruskal/Prim, A*, SCC, max-flow
7. **Algorithmic Patterns** — two pointers, sliding window, prefix sums, backtracking, greedy, KMP, sweep line
8. **Dynamic Programming** — memoization, knapsack, coins, LCS, edit distance, LIS, grid/tree/bitmask DP

Each lesson also carries **Python and JavaScript implementations**, "how devs
think" approach notes, "where it's used" real-world applications, and a quiz
whose answers are **saved to your account**.

### ⌨️ Practice — write real code
Core lessons include a **built-in code editor with an instant test runner**:
starter code, a task, and unit tests executed in a sandboxed Web Worker in your
browser (infinite loops are killed after 3s). Passing earns XP and is recorded.

### 📝 Notes, bookmarks, cheatsheets
A notes box on every lesson (synced per account; local for guests), star-to-
bookmark, a **Notes page** collecting everything, and a **printable cheatsheet
per module**.

### 🏗 Capstone & 🎓 certificate
Three guided capstone projects (task scheduler, autocomplete, grid pathfinder)
with milestone checklists — and a printable **certificate** that unlocks when
all 49 core lessons are complete.

### ⚑ Feedback
A feedback form on every lesson and in the footer (mistake / bug / typo /
suggestion), readable and resolvable in the Admin console. Guests may submit.

### 🤖 AI tutor
A floating ask-anything tutor on every page, answering in ELI5 or Tech style to
match your toggle. Proxied server-side through an OpenAI-compatible endpoint
(OpenRouter by default, free-tier model with automatic fallback) — the API key
never reaches the browser.

### 🎨 Two designed themes
- **Light — "Industry"**: blueprint wireframe, steel accents, Barlow Condensed, registration marks
- **Dark — "Nocturne"**: quiet compact dark, blurple accent, Inter

Same design tokens, swapped per theme from the 🌙 toggle in the nav.

### 🔐 Accounts, progress sync & admin
- Email **or username** + password login (Supabase Auth)
- Signup collects role, university, experience, and goal
- Guests can try sample lessons; progress lives in localStorage and merges into
  the account on first login
- Per-user progress sync guarded by row-level security (own row only)
- **Admin console** for administrators: every learner's profile, progress,
  mastery, and provisioning credentials
- Account page for changing email and password

## Tech stack

Next.js 14 (App Router) · TypeScript · Supabase (Auth + Postgres + RLS) ·
Zustand · design-system CSS (no UI framework) · deployed on Vercel ·
domain via IONOS DNS

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client | publishable key (public, RLS-guarded) |
| `AI_API_KEY` | **server only** | key for the AI tutor — set in Vercel, never commit |
| `AI_API_URL` | server | OpenAI-compatible base URL (default: OpenRouter) |
| `AI_MODEL` | server | model id (default: a free-tier model) |

## Database

Migrations live in `supabase/migrations/`:
- `0001` guest progress table
- `0002` profiles + per-user progress + signup trigger (RLS throughout)
- `0003` admin flag, username→email login RPC
- `0004` admin roster RPC + provisioning credentials (admin-only RLS)
- `0005` security hardening (locked-down policies, revoked definer grants)

## Security posture

- All tables run with **row-level security**; users read/write only their own rows, admins read via a checked security-definer RPC
- Passwords are bcrypt-hashed by Supabase Auth (never readable)
- The AI key exists only as a server-side env var; the tutor endpoint is rate-limited per IP
- Security headers (HSTS, nosniff, frame-deny, referrer & permissions policies) on every response
- HTTPS everywhere via Vercel-managed certificates
