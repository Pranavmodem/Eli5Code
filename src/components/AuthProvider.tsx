"use client";

import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { useBootcamp } from "@/lib/store";
import { getSupabase, fetchProfile } from "@/lib/supabase";

/** Bridges Supabase auth state into the zustand store. */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useBootcamp((s) => s.setAuth);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setAuth(null);
      return;
    }
    let cancelled = false;

    const apply = async (session: Session | null) => {
      if (!session?.user) {
        if (!cancelled) setAuth(null);
        return;
      }
      const profile = await fetchProfile(session.user.id);
      if (!cancelled) {
        setAuth({
          id: session.user.id,
          email: session.user.email ?? "",
          username:
            profile?.username ??
            (session.user.user_metadata?.username as string | undefined) ??
            null,
          isAdmin: profile?.is_admin ?? false,
        });
      }
    };

    sb.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [setAuth]);

  return <>{children}</>;
}
