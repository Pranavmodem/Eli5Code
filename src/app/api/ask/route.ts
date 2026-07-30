import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * AI tutor proxy. The API key lives ONLY in server env vars — it is never
 * shipped to the browser and never committed to git.
 * Configure in Vercel: AI_API_URL, AI_API_KEY, AI_MODEL.
 */
export async function POST(req: Request) {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = (process.env.AI_API_URL ?? "https://openrouter.ai/api").replace(/\/$/, "");
  const model = process.env.AI_MODEL ?? "nvidia/nemotron-3-super-120b-a12b:free";

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI tutor isn't configured yet. Set AI_API_KEY in Vercel env vars." },
      { status: 503 }
    );
  }

  let body: { question?: string; mode?: string; page?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const question = (body.question ?? "").slice(0, 2000).trim();
  if (!question) {
    return NextResponse.json({ error: "Ask a question first!" }, { status: 400 });
  }

  const style =
    body.mode === "tech"
      ? "Answer precisely with correct technical terminology, like a senior engineer mentoring a junior. Include short code snippets when helpful."
      : "Explain like the learner is 5 years old: one vivid real-world analogy first, then connect it to the code idea. No jargon without immediately translating it.";

  try {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: `You are the AI tutor inside "Zero to Hero", an interactive coding bootcamp covering OOP, data structures, algorithms, and Big O. ${style} Keep answers under 250 words. The learner is currently on page: ${body.page ?? "/"}.`,
          },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("AI upstream error:", res.status, text.slice(0, 300));
      return NextResponse.json(
        { error: `The AI tutor is having trouble right now (upstream ${res.status}). Try again in a moment.` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const answer: string | undefined = data?.choices?.[0]?.message?.content;
    if (!answer) {
      return NextResponse.json({ error: "The AI returned an empty answer. Try rephrasing." }, { status: 502 });
    }
    return NextResponse.json({ answer });
  } catch (e) {
    console.error("AI request failed:", e);
    return NextResponse.json(
      { error: "Couldn't reach the AI service. Check your connection and try again." },
      { status: 502 }
    );
  }
}
