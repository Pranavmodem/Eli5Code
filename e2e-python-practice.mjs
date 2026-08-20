// Browser E2E: the Python practice runner on /learn/m0l1.
// The sandbox cannot reach jsdelivr, so CDN requests are routed to the local
// pyodide npm distribution — the worker plumbing (blob worker, importScripts,
// phase messages, harness, results) is exercised for real.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PYODIDE_DIR = "/workspace/eli5code/node_modules/pyodide";
const MIME = { js: "text/javascript", mjs: "text/javascript", wasm: "application/wasm", zip: "application/zip", json: "application/json" };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox", "--no-proxy-server", "--ignore-certificate-errors", "--host-resolver-rules=MAP cdn.jsdelivr.net 127.0.0.1"] });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });

// CDN served by fake-cdn on :443 via --host-resolver-rules (worker importScripts bypasses Playwright routing).

const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error") console.log("[console.error]", m.text().slice(0, 200)); });
await page.goto("http://localhost:3100/learn/m0l1", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500); // hydration + auth settle (guest)

// The practice panel should default to Python.
const caption = await page.locator("text=runs in your browser").first().textContent();
console.log("caption:", caption?.trim());

const editor = page.locator('textarea[aria-label="Code editor"]');
const starter = await editor.inputValue();
console.log("starter is python:", starter.includes("def next_age"), JSON.stringify(starter.slice(0, 40)));

// 1. Wrong code fails.
await editor.fill("def next_age(age):\n    return age");
await page.locator('button:has-text("Run tests")').click();
await page.waitForSelector("text=/passing|All tests pass|✗/", { timeout: 180000 });
await page.waitForTimeout(500);
let panel = await page.locator("section", { hasText: "Practice — write it yourself" }).first().textContent();
console.log("wrong-code verdict:", /0\/3 passing/.test(panel) ? "0/3 passing ✓" : "UNEXPECTED: " + panel.slice(-260));

// 2. Right code passes.
await editor.fill("def next_age(age):\n    older = age + 1\n    return older");
await page.locator('button:has-text("Run tests")').click();
await page.waitForSelector("text=All tests pass", { timeout: 60000 });
console.log("right-code verdict: All tests pass ✓");

// 3. Infinite loop is killed.
await editor.fill("def next_age(age):\n    while True:\n        pass");
await page.locator('button:has-text("Run tests")').click();
await page.waitForSelector("text=/Timed out/", { timeout: 60000 });
console.log("infinite-loop verdict: timed out & killed ✓");

// 4. Switch to JavaScript still works.
await page.locator('label:has-text("JS JavaScript")').first().click();
await page.waitForTimeout(400);
const jsStarter = await editor.inputValue();
console.log("js starter:", jsStarter.includes("function nextAge") ? "swapped to JS ✓" : "UNEXPECTED: " + jsStarter.slice(0, 60));
await editor.fill("function nextAge(age) { return age + 1; }");
await page.locator('button:has-text("Run tests")').click();
await page.waitForSelector("text=All tests pass", { timeout: 30000 });
console.log("js right-code verdict: All tests pass ✓");

// 5. Deep dive renders and swaps language.
await page.locator('label:has-text("🐍 Python")').first().click();
await page.waitForTimeout(400);
const dd = await page.locator("section", { hasText: "In depth — the full reference" }).first().textContent();
console.log("deepdive python table:", dd.includes("Every built-in data type in Python") ? "renders ✓" : "MISSING");
console.log("deepdive int row:", dd.includes("ARBITRARY precision") ? "content ✓" : "MISSING");

await browser.close();
console.log("E2E DONE");
