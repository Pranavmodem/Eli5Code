-- Anonymous per-device progress for the Zero to Hero bootcamp.
-- Devices identify themselves with a locally generated UUID; no accounts needed.
create table if not exists public.progress (
  device_id uuid primary key,
  completed_lessons jsonb not null default '[]'::jsonb,
  start_date timestamptz,
  mode text not null default 'eli5',
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Demo-grade policies: any client may read/write rows. Device ids are
-- unguessable UUIDs, which is adequate for anonymous progress sync.
-- Swap for auth.uid()-based policies if/when accounts are added.
create policy "progress_select" on public.progress
  for select using (true);
create policy "progress_insert" on public.progress
  for insert with check (true);
create policy "progress_update" on public.progress
  for update using (true) with check (true);
