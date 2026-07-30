import Link from "next/link";
import { modules, TOTAL_DAYS, HOURS_PER_DAY } from "@/lib/curriculum";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* hero */}
      <section className="pt-10 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-neon">
          Interactive coding bootcamp
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          From <span className="text-slate-500">Zero</span> to{" "}
          <span className="bg-gradient-to-r from-neon to-neon-purple bg-clip-text text-transparent">
            Hero
          </span>{" "}
          in {TOTAL_DAYS} days
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-slate-400">
          No walls of abstract text. Every concept is a real-world analogy you can{" "}
          <em>see</em> — sorting bars that actually swap, linked lists that wire
          themselves together, and a global switch between{" "}
          <strong className="text-neon-green">🧸 ELI5</strong> and{" "}
          <strong className="text-neon">⚙️ Tech</strong> explanations.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
            🚀 Start Day 1
          </Link>
          <Link
            href={`/learn/${modules[2].id}/bubble-sort`}
            className="btn-ghost px-6 py-3 text-base"
          >
            👀 Watch Bubble Sort live
          </Link>
        </div>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3">
          {[
            { big: `${HOURS_PER_DAY} hrs`, small: "per day" },
            { big: "80%", small: "strength by day 30" },
            { big: "90%", small: "strength by day 60" },
          ].map((s) => (
            <div key={s.small} className="card px-4 py-5">
              <div className="text-2xl font-extrabold text-neon">{s.big}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">{s.small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* philosophy */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            emoji: "🧸",
            title: "ELI5 first",
            text: "Classes are blueprints. Stacks are cafeteria plates. Big O is a pizza shop. Flip to Tech mode the second you're ready for the real jargon.",
          },
          {
            emoji: "🎬",
            title: "Watch it happen",
            text: "Play, pause, and step through algorithms frame-by-frame. You'll see the tallest bar bubble to the end before you ever read the code.",
          },
          {
            emoji: "📈",
            title: "A plan, not a pile",
            text: "A 60-day roadmap paced at 2 hours a day, with milestones at Day 30 and Day 60 and modules that unlock as you master the ones before.",
          },
        ].map((f) => (
          <div key={f.title} className="card p-6">
            <div className="mb-2 text-3xl">{f.emoji}</div>
            <h3 className="mb-2 font-extrabold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{f.text}</p>
          </div>
        ))}
      </section>

      {/* curriculum */}
      <section>
        <h2 className="mb-6 text-center text-2xl font-extrabold">The curriculum</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <Link
              key={m.id}
              href={`/learn/${m.id}/${m.lessons[0].id}`}
              className="card group p-6 transition-colors hover:border-neon/50"
            >
              <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${m.color}`}>
                Module {m.order} · days {m.lessons[0].days[0]}–{m.lessons[m.lessons.length - 1].days[1]}
              </div>
              <h3 className="mb-1 text-lg font-extrabold group-hover:text-neon">
                {m.emoji} {m.title}
              </h3>
              <p className="text-sm text-slate-400">{m.tagline}</p>
              <p className="mt-3 font-mono text-xs text-slate-500">
                {m.lessons.length} lessons →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
