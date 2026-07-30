"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSupabase, isUsernameAvailable } from "@/lib/supabase";

const ROLES = ["Student", "Working professional", "Career switcher", "Educator", "Other"];
const EXPERIENCE = ["Total beginner", "Know some basics", "Returning after a break"];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: ROLES[0],
    university: "",
    experience: EXPERIENCE[0],
    goal: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const sb = getSupabase();
    if (!sb) {
      setError("Signup isn't available right now (backend not configured).");
      return;
    }
    if (form.username.trim().length < 3) {
      setError("Username needs at least 3 characters.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      if (!(await isUsernameAvailable(form.username.trim()))) {
        setError("That username is taken — try another.");
        return;
      }
      const { data, error: err } = await sb.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
          data: {
            username: form.username.trim(),
            role: form.role,
            university: form.university.trim(),
            experience: form.experience,
            goal: form.goal.trim(),
          },
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
      } else {
        setNotice("Almost there! Check your email for a confirmation link, then log in.");
      }
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
      <h1 className="mb-1 text-3xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mb-6 text-sm text-slate-400">
        Free forever. Your progress syncs across devices, and lessons unlock as you go.
      </p>

      {notice ? (
        <div className="card border-neon-green/40 p-6 text-sm text-neon-green">{notice}</div>
      ) : (
        <form onSubmit={submit} className="card space-y-4 p-6">
          <Field label="Email">
            <input required type="email" value={form.email} onChange={set("email")} className="input" placeholder="you@example.com" />
          </Field>
          <Field label="Username">
            <input required value={form.username} onChange={set("username")} className="input" placeholder="code_hero" minLength={3} maxLength={24} />
          </Field>
          <Field label="Password">
            <input required type="password" value={form.password} onChange={set("password")} className="input" placeholder="At least 8 characters" minLength={8} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="I am a…">
              <select value={form.role} onChange={set("role")} className="input">
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Experience">
              <select value={form.experience} onChange={set("experience")} className="input">
                {EXPERIENCE.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
          <Field label="University / Company (optional)">
            <input value={form.university} onChange={set("university")} className="input" placeholder="e.g. UNT" />
          </Field>
          <Field label="Your goal (optional)">
            <input value={form.goal} onChange={set("goal")} className="input" placeholder="e.g. pass coding interviews" />
          </Field>

          {error && <p className="text-xs text-neon-rose">{error}</p>}

          <button className="btn-primary w-full py-3" disabled={loading}>
            {loading ? "Creating account…" : "🚀 Start my 60 days"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-neon hover:underline">Log in</Link>
            {" · "}
            <Link href="/learn/oop/classes-blueprints" className="text-neon-green hover:underline">
              Try a sample lesson first
            </Link>
          </p>
        </form>
      )}
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #242c4a;
          background: #0b0e17;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          outline: none;
        }
        .input:focus {
          border-color: rgba(34, 211, 238, 0.6);
        }
      `}</style>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      {children}
    </label>
  );
}
