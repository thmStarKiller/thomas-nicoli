import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import assert from "node:assert/strict";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:8793";
const outputDirectory = resolve(
  process.env.QA_OUTPUT_DIR ?? "docs/evidence/project-clarity/screenshots/turnstile",
);
const executablePath =
  process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const knownHeadlessProbe = "%c%d font-size:0;color:transparent NaN";

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

for (const locale of ["es", "en", "fr"]) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const thirdPartyDiagnostics = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text() === knownHeadlessProbe) thirdPartyDiagnostics.push(message.text());
    else consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const response = await page.goto(`${baseUrl}/${locale}/contact`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("form").waitFor({ state: "visible" });
  const responseInput = page.locator('input[name="cf-turnstile-response"]');
  await responseInput.waitFor({ state: "attached", timeout: 20_000 });
  await page.waitForTimeout(1_000);

  const widgetId = await responseInput.getAttribute("id");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  const screenshot = resolve(outputDirectory, `${locale}-contact-turnstile-1280.png`);
  await page.screenshot({ path: screenshot, fullPage: true });

  results.push({
    locale,
    status: response?.status(),
    widgetId: widgetId?.replace(/-\w+_response$/, "-[redacted]_response") ?? null,
    overflow,
    consoleErrors,
    thirdPartyDiagnosticCount: thirdPartyDiagnostics.length,
    screenshot: relative(process.cwd(), screenshot).replaceAll("\\", "/"),
  });
  await context.close();
}

await browser.close();
assert.equal(results.every((row) => row.status === 200), true);
assert.equal(results.every((row) => row.widgetId?.startsWith("cf-chl-widget-")), true);
assert.equal(results.every((row) => !row.overflow), true);
assert.deepEqual(results.flatMap((row) => row.consoleErrors), []);

const evidence = {
  baseUrl,
  note: "Cloudflare Turnstile emits an invisible console probe under headless automation; only that exact third-party diagnostic is counted separately.",
  results,
};
await writeFile(
  resolve(outputDirectory, "turnstile-results.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify({ ok: true, results }, null, 2));
