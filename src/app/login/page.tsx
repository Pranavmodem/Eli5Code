"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // email OR username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabase();
    if (!sb) return setError("Login isn't available right now.");
    setLoading(true);
    try {
      let email = identifier.trim();
      if (!email.includes("@")) {
        // username login — resolve to the account's email server-side
        const { data, error: rpcErr } = await sb.rpc("get_login_email", { name: email });
        if (rpcErr || !data) {
          setError("No account found with that username.");
          return;
        }
        email = data as string;
      }
      const { error: err } = await sb.auth.signInWithPassword({ email, password });
      if (err) return setError(err.message);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 440 }}>
      <div className="kicker" style={{ marginBottom: 4 }}>Welcome back</div>
      <h1 style={{ marginBottom: "var(--space-6)" }}>Log in</h1>
      <form onSubmit={submit} className="blueprint" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
        <div className="field">
          <label>Email or username</label>
          <input className="input" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@example.com — or just your username" autoComplete="username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input className="input" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        {error && <p style={{ color: "var(--color-accent-700)", fontSize: 13, margin: 0 }}>{error}</p>}
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="text-muted" style={{ fontSize: 12.5, textAlign: "center", margin: 0 }}>
          New here? <Link href="/signup">Create a free account</Link>
        </p>
      </form>
    </div>
  );
}
