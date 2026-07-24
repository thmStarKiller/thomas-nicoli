import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import assert from "node:assert/strict";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8793";
const outputDir = resolve(process.env.QA_OUTPUT_DIR || "docs/evidence/project-clarity/screenshots/local");
const executablePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

async function advance(page) {
  const next = page.locator('button[type="button"]').last();
  await next.focus();
  await page.keyboard.press("Enter");
}

async function waitForHydration(page) {
  await page.waitForFunction(() => {
    const button = document.querySelector('button[type="button"]');
    if (!button) return false;
    const key = Object.keys(button).find((name) => name.startsWith("__reactProps"));
    return Boolean(key && button[key]?.onClick);
  });
}

try {
  for (const locale of ["es", "en", "fr"]) {
    for (const width of [375, 768, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: width === 375 ? 812 : 900 }, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      const missingResources = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() === 404) missingResources.push(response.url());
      });
      const response = await page.goto(`${baseUrl}/${locale}/project-clarity/independent`, { waitUntil: "domcontentloaded" });
      await page.locator('form').waitFor({ state: "visible" });
      await waitForHydration(page);
      assert.equal(response?.status(), 200);
      assert.equal(await page.locator('input[name="buyerType"][value="independent"]').isChecked(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      assert.equal(await page.locator('[role="status"]').count() > 0, true);

      await advance(page);
      for (const [name, value] of [
        ["stuck", "Release ownership is unclear and QA begins too late."],
        ["assets", "Commerce platform, CRM, analytics and an existing backlog."],
        ["outcome", "A release path with observable ownership and fewer preventable defects."],
        ["timingConstraints", "A decision is needed within the next quarter."],
      ]) {
        const field = page.locator(`textarea[name="${name}"]`);
        await field.focus();
        await page.keyboard.type(value);
        assert.equal(await field.getAttribute("aria-invalid"), "false");
        await advance(page);
      }
      assert.equal(await page.locator(`input[name="responseLanguage"][value="${locale}"]`).isChecked(), true);
      await advance(page);
      await page.locator('input[name="name"]').focus();
      await page.keyboard.type("QA Example");
      await page.locator('input[name="email"]').focus();
      await page.keyboard.type("qa@example.com");
      assert.equal(await page.locator('input[name="clarityConsent"]').isDisabled(), true);
      assert.equal(await page.locator('button[type="submit"]').isDisabled(), true);
      assert.equal(await page.locator('a[href$="/privacy"]').count() > 0, true);
      assert.equal(await page.locator('a[href$="/contact"]').count() > 0, true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      await page.evaluate(() => window.scrollTo(0, 0));
      const screenshot = join(outputDir, `${locale}-${width}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      results.push({ locale, width, status: response?.status(), overflow: false, consoleErrors: errors, missingResources: [...new Set(missingResources)], screenshot: relative(process.cwd(), screenshot).replaceAll("\\", "/") });
      await context.close();
    }
  }

  const validationContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const validationPage = await validationContext.newPage();
  await validationPage.goto(`${baseUrl}/es/project-clarity/unsure`, { waitUntil: "domcontentloaded" });
  await validationPage.locator('form').waitFor({ state: "visible" });
  await waitForHydration(validationPage);
  await advance(validationPage);
  const invalid = validationPage.locator('textarea[name="stuck"]');
  await invalid.waitFor({ state: "visible" });
  await advance(validationPage);
  assert.equal(await invalid.getAttribute("aria-invalid"), "true");
  assert.equal(await validationPage.locator('[role="alert"]').count() > 0, true);
  await validationContext.close();

  for (const locale of ["es", "en", "fr"]) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
    const page = await context.newPage();
    const services = await page.goto(`${baseUrl}/${locale}/services`, { waitUntil: "load" });
    assert.equal(services?.status(), 200);
    assert.equal(await page.locator("h1").isVisible(), true);
    assert.equal(await page.locator("article").first().isVisible(), true);
    assert.equal(await page.evaluate(() => document.body.innerHTML.includes("opacity:0")), false);
    const contact = await page.goto(`${baseUrl}/${locale}/contact`, { waitUntil: "load" });
    assert.equal(contact?.status(), 200);
    assert.equal(await page.locator('a[href="mailto:bonjour@thomas-nicoli.com"]').first().isVisible(), true);
    await page.evaluate(() => window.scrollTo(0, 0));
    const screenshot = join(outputDir, `${locale}-375-no-js.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ locale, width: 375, noJavaScript: true, screenshot: relative(process.cwd(), screenshot).replaceAll("\\", "/") });
    await context.close();
  }

  await writeFile(join(outputDir, "browser-results.json"), JSON.stringify({ baseUrl, results }, null, 2), "utf8");
  const consoleErrors = results.flatMap((result) => result.consoleErrors || []);
  const missingResources = [...new Set(results.flatMap((result) => result.missingResources || []))];
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(missingResources, []);
  console.log(JSON.stringify({ ok: true, pages: results.length, screenshots: results.map((result) => result.screenshot) }, null, 2));
} finally {
  await browser.close();
}
