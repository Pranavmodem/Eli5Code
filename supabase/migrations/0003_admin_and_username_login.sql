-- Admin flag + username-based login support
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- security definer avoids recursive RLS when policies on profiles consult profiles
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Admins can read every profile and every progress row
drop policy if exists "profiles_admin_read" on public.profiles;
create policy "profiles_admin_read" on public.profiles
  for select using (public.is_admin());

drop policy if exists "user_progress_admin_read" on public.user_progress;
create policy "user_progress_admin_read" on public.user_progress
  for select using (public.is_admin());

-- Resolve a username to its login email (for username+password sign-in).
-- Definer so anon can call it; returns only the email, nothing else.
create or replace function public.get_login_email(name text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select u.email::text
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(p.username) = lower(name)
  limit 1;
$$;

grant execute on function public.get_login_email(text) to anon, authenticated;

-- NOTE: seed accounts (Pranav [admin], shreeshu, sahith, arshika) were created
-- directly in auth.users with placeholder emails <username>@eli5code.app.
-- Passwords are intentionally NOT stored in this repo. Users set their real
-- email on the /account page when changing their password.
