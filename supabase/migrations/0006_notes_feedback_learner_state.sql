-- Per-lesson private notes
create table if not exists public.notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.notes enable row level security;
drop policy if exists "notes_own" on public.notes;
create policy "notes_own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Feedback: per lesson (lesson_id set) or overall (lesson_id null).
-- Guests may submit too; only admins read/resolve.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  username text,
  lesson_id text,
  category text not null default 'other',
  body text not null,
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);
alter table public.feedback enable row level security;
drop policy if exists "feedback_insert_any" on public.feedback;
create policy "feedback_insert_any" on public.feedback
  for insert to anon, authenticated
  with check (char_length(body) between 3 and 4000);
drop policy if exists "feedback_admin_read" on public.feedback;
create policy "feedback_admin_read" on public.feedback
  for select using (public.is_admin());
drop policy if exists "feedback_admin_update" on public.feedback;
create policy "feedback_admin_update" on public.feedback
  for update using (public.is_admin()) with check (public.is_admin());

-- Richer learner state on the progress row
alter table public.user_progress add column if not exists quiz_results jsonb not null default '{}'::jsonb;
alter table public.user_progress add column if not exists passed_exercises jsonb not null default '[]'::jsonb;
alter table public.user_progress add column if not exists bookmarks jsonb not null default '[]'::jsonb;
