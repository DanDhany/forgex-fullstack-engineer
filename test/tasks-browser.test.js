import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { createApplicationServer } from "../src/server.js";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/rinor/AppData/Roaming/npm/node_modules/playwright");

test("Browser QA: Task Creation Workbench full-stack flow & responsive UI", async () => {
  const { server, repository } = createApplicationServer({
    dbPath: ":memory:",
    staticDir: path.resolve("site")
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/tasks.html`;

  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });

  const screenshotDir = path.resolve("site/screenshots");
  await fs.mkdir(screenshotDir, { recursive: true });

  try {
    // 1. Desktop Test (1440x900)
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(baseUrl, { waitUntil: "networkidle" });

      // Zero-overflow check
      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      assert.ok(
        metrics.scrollWidth <= metrics.clientWidth,
        `Desktop overflow detected: ${metrics.scrollWidth} > ${metrics.clientWidth}`
      );

      // Verify title and initial state
      await assert.doesNotReject(page.waitForSelector(".workbench-title"));
      const emptyStateVisible = await page.isVisible("#emptyLedger");
      assert.equal(emptyStateVisible, true, "Empty ledger should be visible initially");

      // Test client-side validation on empty submit
      await page.click("#submitBtn");
      const titleErrorVisible = await page.isVisible("#titleError");
      const priorityErrorVisible = await page.isVisible("#priorityError");
      assert.equal(titleErrorVisible, true, "Title error should appear on empty submit");
      assert.equal(priorityErrorVisible, true, "Priority error should appear on empty submit");

      // Capture desktop dark screenshot with validation errors
      await page.screenshot({ path: path.join(screenshotDir, "tasks-workbench-desktop-dark.png"), fullPage: true });

      // Theme toggle check
      const initialTheme = await page.getAttribute("html", "data-theme");
      await page.click("#themeToggle");
      const toggledTheme = await page.getAttribute("html", "data-theme");
      assert.notEqual(toggledTheme, initialTheme, "Theme should toggle on click");

      // Fill valid task
      await page.fill("#taskTitle", "Enforce webhook idempotency in SQLite");
      await page.selectOption("#taskPriority", "high");
      await page.fill("#taskDescription", "Dual validation across client and server with zero drift.");

      // Submit valid task
      await page.click("#submitBtn");

      // Await success banner
      await page.waitForSelector("#successBanner", { state: "visible", timeout: 5000 });
      const successText = await page.textContent("#successMessage");
      assert.match(successText, /Enforce webhook idempotency in SQLite/);
      assert.match(successText, /HIGH/);

      // Verify task in ledger stream
      await page.waitForSelector(".task-card", { state: "visible", timeout: 5000 });
      const taskCardTitle = await page.textContent(".task-card-title");
      assert.equal(taskCardTitle.trim(), "Enforce webhook idempotency in SQLite");

      // Capture desktop light screenshot with created task
      await page.screenshot({ path: path.join(screenshotDir, "tasks-workbench-desktop-light.png"), fullPage: true });

      await context.close();
    }

    // 2. Mobile Test (390x844)
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
      const page = await context.newPage();
      await page.goto(baseUrl, { waitUntil: "networkidle" });

      // Zero-overflow check on mobile
      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      assert.ok(
        metrics.scrollWidth <= metrics.clientWidth,
        `Mobile overflow detected: ${metrics.scrollWidth} > ${metrics.clientWidth}`
      );

      // Fill a second task on mobile
      await page.fill("#taskTitle", "Mobile responsive touch target verification");
      await page.selectOption("#taskPriority", "urgent");
      await page.fill("#taskDescription", "Assert 48px tap targets on all form controls.");
      await page.click("#submitBtn");

      await page.waitForSelector("#successBanner", { state: "visible", timeout: 5000 });
      const countText = await page.textContent("#taskCountBadge");
      assert.match(countText, /2 tasks/);

      // Capture mobile dark screenshot
      await page.screenshot({ path: path.join(screenshotDir, "tasks-workbench-mobile-dark.png"), fullPage: true });

      // Toggle to Light mode on mobile
      await page.click("#themeToggle");
      await page.screenshot({ path: path.join(screenshotDir, "tasks-workbench-mobile-light.png"), fullPage: true });

      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
    repository.close();
  }
});
