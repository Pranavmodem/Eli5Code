"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabase();
    if (!sb) {
      setError("Login isn't available right now (backend not configured).");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (err) {
        setError(err.message);
        return;
      }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md"
    >
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-400">Pick up right where you left off.</p>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon/60"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">Password</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-neon/60"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-xs text-neon-rose">{error}</p>}
        <button className="btn-primary w-full py-3" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
        <p className="text-center text-xs text-slate-500">
          New here?{" "}
          <Link href="/signup" className="text-neon hover:underline">Create a free account</Link>
        </p>
      </form>
    </motion.div>
  );
}
