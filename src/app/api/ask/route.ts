import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Free models can be slow (they emit reasoning tokens) — give the function room.
export const maxDuration = 60;

const FALLBACK_MODEL = "openai/gpt-oss-20b:free";

/**
 * AI tutor proxy. The API key lives ONLY in server env vars — it is never
 * shipped to the browser and never committed to git.
 * Configure in Vercel: AI_API_KEY (required); AI_API_URL / AI_MODEL optional.
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

  const callModel = async (m: string) => {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: m,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: `You are the AI tutor inside "ELI5Code", an interactive coding bootcamp covering OOP, data structures, algorithms, and Big O. ${style} Keep answers under 250 words. The learner is currently on page: ${body.page ?? "/"}.`,
          },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(40_000),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`upstream ${res.status}: ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    const answer: string | undefined = data?.choices?.[0]?.message?.content;
    if (!answer) throw new Error("empty answer");
    return answer;
  };

  try {
    return NextResponse.json({ answer: await callModel(model) });
  } catch (e) {
    console.error(`AI model ${model} failed:`, e);
    // free tiers rate-limit and hiccup — try one alternate free model before giving up
    if (model !== FALLBACK_MODEL) {
      try {
        return NextResponse.json({ answer: await callModel(FALLBACK_MODEL) });
      } catch (e2) {
        console.error(`AI fallback ${FALLBACK_MODEL} failed:`, e2);
      }
    }
    return NextResponse.json(
      { error: "The AI tutor is briefly unavailable (busy or rate-limited). Try again in a minute." },
      { status: 502 }
    );
  }
}
