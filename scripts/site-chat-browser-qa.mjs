import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:8795";
const outputDir = resolve(process.env.QA_OUTPUT_DIR || ".wrangler/chat-local");
const executablePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = {};

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await desktop.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
  const homeOrder = await page.locator("main > *").evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getAttribute("data-testid")),
  );
  assert.deepEqual(homeOrder, ["home-black-hero", "home-blue-banderole", "home-buyer-paths"]);
  const launcher = page.getByTestId("site-chat-launcher");
  await launcher.waitFor({ state: "visible" });
  const orbit = page.getByTestId("site-chat-orbit");
  await page.waitForFunction(() => {
    const element = document.querySelector('[data-testid="site-chat-orbit"]');
    return element && getComputedStyle(element).transform !== "none";
  });
  const transformA = await orbit.evaluate((element) => getComputedStyle(element).transform);
  await page.waitForTimeout(320);
  const transformB = await orbit.evaluate((element) => getComputedStyle(element).transform);
  assert.notEqual(transformA, transformB);
  await launcher.click();
  const panel = page.getByTestId("site-chat-panel");
  await panel.waitFor({ state: "visible" });
  assert.equal(await panel.getAttribute("role"), "dialog");
  assert.equal(await panel.getByText("IA local · humano al final").isVisible(), true);
  assert.equal(await page.getByTestId("site-chat-loop").isVisible(), true);
  assert.equal(await panel.getByText(/Cada mensaje se resume/).isVisible(), true);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: join(outputDir, "chat-es-desktop.png"), fullPage: false });
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden" });
  assert.equal(await launcher.evaluate((element) => document.activeElement === element), true);
  results.desktop = { orbitMoves: true, dialog: true, escapeFocus: true, homeOrder, errors };
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${baseUrl}/en/project-clarity`, { waitUntil: "domcontentloaded" });
  await mobilePage.getByTestId("site-chat-launcher").click();
  await mobilePage.getByTestId("site-chat-panel").waitFor({ state: "visible" });
  assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const box = await mobilePage.getByTestId("site-chat-panel").boundingBox();
  assert.ok(box && box.x >= 0 && box.x + box.width <= 375 && box.y >= 0 && box.y + box.height <= 812);
  await mobilePage.screenshot({ path: join(outputDir, "chat-en-mobile.png"), fullPage: false });
  results.mobile = { box, overflow: false };
  await mobile.close();

  const reducedContext = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseUrl}/fr`, { waitUntil: "domcontentloaded" });
  await reducedPage.getByTestId("site-chat-launcher").waitFor({ state: "visible" });
  await reducedPage.waitForFunction(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.querySelector('[data-testid="site-chat-orbit"]'));
  assert.equal(await reducedPage.getByTestId("site-chat-orbit").count(), 0);
  await reducedPage.getByTestId("site-chat-launcher").click();
  const reducedPanel = reducedPage.getByTestId("site-chat-panel");
  await reducedPanel.waitFor({ state: "visible" });
  const style = await reducedPanel.evaluate((element) => ({ transform: getComputedStyle(element).transform, opacity: getComputedStyle(element).opacity }));
  assert.deepEqual(style, { transform: "none", opacity: "1" });
  results.reducedMotion = style;
  await reducedContext.close();

  const pendingContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const pendingRecord = {
    interactionId: "33333333-3333-4333-8333-333333333333",
    sessionId: "11111111-1111-4111-8111-111111111111",
    sessionToken: "pending-test-token-that-is-long-enough-for-validation",
    turnIndex: 1,
    message: "Necesito ordenar un proyecto digital",
  };
  await pendingContext.addInitScript(({ record }) => {
    sessionStorage.setItem("site-chat-pending:es", JSON.stringify(record));
  }, { record: pendingRecord });
  await pendingContext.route("**/api/chat/status", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        status: "completed",
        reply: "Respuesta local recuperada después de recargar.",
        suggestions: ["Siguiente paso"],
        emailed: true,
      }),
    });
  });
  const pendingPage = await pendingContext.newPage();
  await pendingPage.goto(`${baseUrl}/es`, { waitUntil: "domcontentloaded" });
  await pendingPage.getByTestId("site-chat-launcher").click();
  await pendingPage.getByText("Respuesta local recuperada después de recargar.").waitFor({ state: "visible" });
  assert.equal(await pendingPage.getByText("Necesito ordenar un proyecto digital").isVisible(), true);
  assert.equal(await pendingPage.evaluate(() => sessionStorage.getItem("site-chat-pending:es")), null);
  assert.equal(await pendingPage.locator('[data-message-role="assistant"]').filter({ hasText: "Respuesta local recuperada" }).count(), 1);
  results.pendingResume = { restored: true, storageCleared: true, duplicateReplies: false };
  await pendingContext.close();

  const noJsContext = await browser.newContext({ viewport: { width: 375, height: 812 }, javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  const noJsResponse = await noJsPage.goto(`${baseUrl}/es`, { waitUntil: "load" });
  assert.equal(noJsResponse?.status(), 200);
  assert.equal(await noJsPage.locator("h1").isVisible(), true);
  assert.equal(await noJsPage.getByTestId("site-chat-launcher").isVisible(), true);
  results.noJavaScript = { status: noJsResponse?.status(), pageContentVisible: true };
  await noJsContext.close();

  await writeFile(join(outputDir, "results.json"), JSON.stringify({ baseUrl, results }, null, 2));
  console.log(JSON.stringify({ ok: true, baseUrl, results }, null, 2));
} finally {
  await browser.close();
}
