-- User accounts: profile info collected at signup (role, university, etc.)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text,
  university text,
  experience text,
  goal text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Per-user progress, guarded so users only touch their own row
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_lessons jsonb not null default '[]'::jsonb,
  start_date timestamptz,
  mode text not null default 'eli5',
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "user_progress_own" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Username availability check callable pre-signup (definer bypasses RLS,
-- returns only a boolean so no profile data leaks)
create or replace function public.username_available(name text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select not exists (
    select 1 from public.profiles where lower(username) = lower(name)
  );
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- Auto-create the profile row from signup metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, username, role, university, experience, goal)
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
      new.raw_user_meta_data->>'role',
      new.raw_user_meta_data->>'university',
      new.raw_user_meta_data->>'experience',
      new.raw_user_meta_data->>'goal'
    );
  exception when unique_violation then
    -- username race: fall back to a suffixed variant so signup never breaks
    insert into public.profiles (id, username, role, university, experience, goal)
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1))
        || '_' || substr(new.id::text, 1, 4),
      new.raw_user_meta_data->>'role',
      new.raw_user_meta_data->>'university',
      new.raw_user_meta_data->>'experience',
      new.raw_user_meta_data->>'goal'
    );
  end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
