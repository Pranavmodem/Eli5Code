-- Security hardening (from Supabase advisor findings)

-- 1) The anonymous guest `progress` table had USING(true) write policies.
--    Guest progress now lives in localStorage only; remove the open policies
--    so anon can no longer write or read arbitrary rows.
drop policy if exists "progress_select" on public.progress;
drop policy if exists "progress_insert" on public.progress;
drop policy if exists "progress_update" on public.progress;

-- 2) SECURITY DEFINER functions: strip default PUBLIC execute grants and
--    keep only the roles that genuinely need each function.
revoke execute on function public.admin_list_users() from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- get_login_email / username_available / is_admin stay anon-callable by
-- design (pre-login username sign-in and availability checks; is_admin
-- returns a boolean about the caller only).
