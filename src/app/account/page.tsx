"use client";

import { useState } from "react";
import { useBootcamp } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";

/**
 * Account settings. Users provisioned with a placeholder address
 * (username@eli5code.app) set their real email here when changing password.
 */
export default function AccountPage() {
  const authUser = useBootcamp((s) => s.authUser);
  const authReady = useBootcamp((s) => s.authReady);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (authReady && !authUser) {
    return <p className="text-muted" style={{ padding: "var(--space-8)", textAlign: "center" }}>Log in to manage your account.</p>;
  }

  const placeholder = authUser?.email.endsWith("@eli5code.app");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(""); setError("");
    const sb = getSupabase();
    if (!sb) return;
    if (password && password.length < 8) return setError("New password needs at least 8 characters.");
    if (password && password !== confirm) return setError("Passwords don't match.");
    if (!password && !email.trim()) return setError("Enter a new email, a new password, or both.");
    setLoading(true);
    try {
      const patch: { email?: string; password?: string } = {};
      if (email.trim()) patch.email = email.trim();
      if (password) patch.password = password;
      const { error: err } = await sb.auth.updateUser(patch);
      if (err) return setError(err.message);
      setMsg(
        patch.email
          ? "Saved. If you changed your email, check the new inbox for a confirmation link."
          : "Password updated."
      );
      setPassword(""); setConfirm(""); setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "var(--space-8)", maxWidth: 460, margin: "0 auto" }}>
      <div className="kicker" style={{ marginBottom: 4 }}>@{authUser?.username ?? "account"}</div>
      <h1 style={{ marginBottom: "var(--space-2)" }}>Account settings</h1>
      <p className="text-muted" style={{ fontSize: 13.5, marginBottom: "var(--space-6)" }}>
        Signed in as <b>{authUser?.email}</b>.
        {placeholder && " That's a placeholder address — set your real email below so you can recover your account."}
      </p>
      <form onSubmit={submit} className="blueprint" style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
        <div className="field">
          <label>{placeholder ? "Your real email" : "New email (optional)"}</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label>New password (optional)</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
        </div>
        {password && (
          <div className="field">
            <label>Confirm new password</label>
            <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          </div>
        )}
        {error && <p style={{ color: "var(--color-accent-700)", fontSize: 13, margin: 0 }}>{error}</p>}
        {msg && <p style={{ color: "var(--color-accent-700)", fontSize: 13, margin: 0 }}>✓ {msg}</p>}
        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
