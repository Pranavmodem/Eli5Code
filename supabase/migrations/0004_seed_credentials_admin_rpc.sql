-- Assigned (seed) credentials, readable by admins only. Rows are inserted
-- operationally (never committed to the repo). If a user changes their
-- password, the assigned value here no longer matches — real passwords are
-- bcrypt-hashed by Supabase Auth and cannot be read back by anyone.
CREATE TABLE IF NOT EXISTS public.seed_credentials (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_password text NOT NULL,
  note text DEFAULT 'provisioned account'
);
ALTER TABLE public.seed_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "seed_admin_read" ON public.seed_credentials;
CREATE POLICY "seed_admin_read" ON public.seed_credentials
  FOR SELECT USING (public.is_admin());

-- One admin-only RPC returning the full roster incl. login email
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  id uuid, username text, email text, assigned_password text,
  role text, university text, experience text, goal text,
  is_admin boolean, created_at timestamptz,
  completed_lessons jsonb, progress_updated_at timestamptz
)
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT p.id, p.username, u.email::text,
         sc.assigned_password,
         p.role, p.university, p.experience, p.goal,
         p.is_admin, p.created_at,
         coalesce(up.completed_lessons, '[]'::jsonb),
         up.updated_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN public.seed_credentials sc ON sc.user_id = p.id
  LEFT JOIN public.user_progress up ON up.user_id = p.id
  WHERE public.is_admin()
  ORDER BY p.created_at;
$$;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
