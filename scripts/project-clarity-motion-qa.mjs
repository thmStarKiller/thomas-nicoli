import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8793";
const outputDir = resolve(process.env.QA_OUTPUT_DIR || "docs/evidence/project-clarity/screenshots/activation-local");
const executablePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const results = { baseUrl, order: {}, motion: {}, reducedMotion: {}, noJavaScript: {}, mobile: {} };

async function waitForHydration(page) {
  await page.waitForFunction(() => {
    const button = document.querySelector('button[type="button"]');
    if (!button) return false;
    const key = Object.keys(button).find((name) => name.startsWith("__reactProps"));
    return Boolean(key && button[key]?.onClick);
  });
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
  const homeOrder = await page.evaluate(() => {
    const ids = ["home-black-hero", "home-blue-banderole", "home-buyer-paths"];
    return ids.map((id) => {
      const element = document.querySelector(`[data-testid="${id}"]`);
      if (!element) throw new Error(`missing_${id}`);
      const rect = element.getBoundingClientRect();
      return { id, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
    });
  });
  assert.equal(homeOrder[0].bottom <= homeOrder[1].top + 1, true);
  assert.equal(homeOrder[1].bottom <= homeOrder[2].top + 1, true);
  results.order = { home: homeOrder };
  await page.evaluate(() => {
    const hero = document.querySelector('[data-testid="home-black-hero"]');
    window.scrollTo(0, Math.max(0, (hero?.getBoundingClientRect().height || 0) - 320));
  });
  await page.screenshot({ path: join(outputDir, "home-black-to-cobalt-to-paths.png") });

  await page.goto(`${baseUrl}/es/project-clarity/independent`, { waitUntil: "domcontentloaded" });
  await waitForHydration(page);
  const clarityOrder = await page.evaluate(() => {
    const band = document.querySelector('[data-testid="clarity-signal-band"]');
    const hero = band?.previousElementSibling;
    const formSection = band?.nextElementSibling;
    if (!band || !hero || !formSection) throw new Error("clarity_sections_missing");
    return [hero, band, formSection].map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY };
    });
  });
  assert.equal(clarityOrder[0].bottom <= clarityOrder[1].top + 1, true);
  assert.equal(clarityOrder[1].bottom <= clarityOrder[2].top + 1, true);
  results.order.clarity = clarityOrder;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: join(outputDir, "clarity-hero-signal-band.png") });

  const form = page.locator("form");
  await form.scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(outputDir, "clarity-question-1.png") });
  const firstHeading = await page.locator('[data-testid="clarity-step-panel"] h2').innerText();
  await form.locator('button[type="button"]').last().click();
  await page.waitForTimeout(70);
  const movingPanels = await page.locator('[data-testid="clarity-step-panel"]').evaluateAll((panels) => panels.map((panel) => {
    const style = getComputedStyle(panel);
    return { opacity: style.opacity, transform: style.transform, filter: style.filter };
  }));
  assert.equal(movingPanels.some((style) => style.transform !== "none" || style.filter !== "none" || Number(style.opacity) < 0.99), true);
  await page.waitForTimeout(650);
  const secondHeading = await page.locator('[data-testid="clarity-step-panel"] h2').innerText();
  assert.notEqual(secondHeading, firstHeading);
  assert.equal(await page.locator('[data-testid="clarity-step-panel"]').count(), 1);
  await page.screenshot({ path: join(outputDir, "clarity-question-2.png") });
  await form.locator('button[type="button"]').first().click();
  await page.waitForTimeout(650);
  assert.equal(await page.locator('[data-testid="clarity-step-panel"] h2').innerText(), firstHeading);
  results.motion = { firstHeading, secondHeading, movingPanels, consoleErrors: errors };
  assert.deepEqual(errors, []);
  await context.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseUrl}/en/project-clarity/independent`, { waitUntil: "domcontentloaded" });
  await waitForHydration(reducedPage);
  await reducedPage.locator('form button[type="button"]').last().click();
  await reducedPage.waitForTimeout(40);
  const reducedPanels = await reducedPage.locator('[data-testid="clarity-step-panel"]').evaluateAll((panels) => panels.map((panel) => {
    const style = getComputedStyle(panel);
    return { opacity: style.opacity, transform: style.transform, filter: style.filter };
  }));
  assert.equal(reducedPanels.length, 1);
  assert.equal(reducedPanels[0].opacity, "1");
  assert.equal(reducedPanels[0].transform, "none");
  assert.equal(reducedPanels[0].filter, "none");
  results.reducedMotion = { panels: reducedPanels };
  await reducedContext.close();

  const noJsContext = await browser.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  const noJsResponse = await noJsPage.goto(`${baseUrl}/fr/project-clarity/independent`, { waitUntil: "load" });
  assert.equal(noJsResponse?.status(), 200);
  assert.equal(await noJsPage.locator('[data-testid="clarity-step-panel"] h2').isVisible(), true);
  assert.equal(await noJsPage.locator('[data-testid="clarity-signal-band"]').isVisible(), true);
  assert.equal(await noJsPage.locator('[data-testid="clarity-step-panel"]').evaluate((panel) => getComputedStyle(panel).opacity), "1");
  results.noJavaScript = { status: noJsResponse?.status(), firstQuestionVisible: true };
  await noJsContext.close();

  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${baseUrl}/es/project-clarity/independent`, { waitUntil: "domcontentloaded" });
  await mobilePage.locator("form").waitFor({ state: "visible" });
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  assert.equal(overflow, false);
  await mobilePage.screenshot({ path: join(outputDir, "clarity-mobile.png"), fullPage: true });
  results.mobile = { width: 375, overflow };
  await mobileContext.close();

  await writeFile(join(outputDir, "motion-results.json"), JSON.stringify(results, null, 2), "utf8");
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} finally {
  await browser.close();
}
