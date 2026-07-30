"use client";

import { motion } from "framer-motion";
import { useBootcamp } from "@/lib/store";

/**
 * Global ELI5 / Tech switch. Lives in the navbar and inside lessons; both
 * render from the same zustand store, so flipping one flips every explanation
 * on the site instantly.
 */
export default function ModeToggle({ compact = false }: { compact?: boolean }) {
  const mode = useBootcamp((s) => s.mode);
  const setMode = useBootcamp((s) => s.setMode);
  const hydrated = useBootcamp((s) => s.hasHydrated);

  // Render a stable default until localStorage rehydrates (avoids SSR mismatch)
  const active = hydrated ? mode : "eli5";

  return (
    <div
      role="tablist"
      aria-label="Explanation mode"
      className="relative flex rounded-full border border-ink-600 bg-ink-800 p-1 text-xs font-bold"
    >
      {(["eli5", "tech"] as const).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={active === m}
          onClick={() => setMode(m)}
          className={`relative z-10 rounded-full transition-colors ${
            compact ? "px-2.5 py-1" : "px-4 py-1.5"
          } ${active === m ? "text-ink-950" : "text-slate-400 hover:text-slate-200"}`}
        >
          {active === m && (
            <motion.span
              layoutId={compact ? "mode-pill-compact" : "mode-pill"}
              className={`absolute inset-0 -z-10 rounded-full ${
                m === "eli5" ? "bg-neon-green" : "bg-neon"
              }`}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          {m === "eli5" ? "🧸 ELI5" : "⚙️ Tech"}
        </button>
      ))}
    </div>
  );
}
