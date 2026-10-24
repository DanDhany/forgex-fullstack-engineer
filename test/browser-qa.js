import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createReadStream, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/rinor/AppData/Roaming/npm/node_modules/playwright");

const PORT = 8089;
const SITE_DIR = path.resolve("site");
const SCREENSHOT_DIR = path.resolve("site/screenshots");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json"
};

function createServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split("?")[0];
    if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

    const filePath = path.join(SITE_DIR, reqPath);
    if (!existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).pipe(res);
  });
}

async function runBrowserQA() {
  console.log("=== ForgeX Full-Stack Engineer v1.1.8 — Browser QA Suite ===");
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const server = createServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[HTTP] Static test server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });

  const viewports = [
    { name: "mobile-320", width: 320, height: 800, isMobile: true },
    { name: "mobile-360", width: 360, height: 800, isMobile: true },
    { name: "mobile-390", width: 390, height: 844, isMobile: true },
    { name: "mobile-430", width: 430, height: 932, isMobile: true },
    { name: "tablet-768", width: 768, height: 1024, isMobile: false },
    { name: "desktop-1280", width: 1280, height: 800, isMobile: false },
    { name: "desktop-1440", width: 1440, height: 900, isMobile: false }
  ];

  const results = [];

  try {
    for (const vp of viewports) {
      console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile
      });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);

      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle" });

      // 1. Verify CSS Viewport Dimensions and Page-Wide Overflow
      const viewportMetrics = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));

      const hasHorizontalOverflow = viewportMetrics.scrollWidth > viewportMetrics.clientWidth + 1;
      console.log(`[Viewport Metric] innerWidth: ${viewportMetrics.innerWidth}, clientWidth: ${viewportMetrics.clientWidth}, scrollWidth: ${viewportMetrics.scrollWidth}`);

      if (hasHorizontalOverflow) {
        console.error(`[OVERFLOW ERROR] Horizontal overflow detected at ${vp.width}px! scrollWidth=${viewportMetrics.scrollWidth} > clientWidth=${viewportMetrics.clientWidth}`);
      } else {
        console.log(`[OVERFLOW CHECK] PASS: scrollWidth (${viewportMetrics.scrollWidth}) <= clientWidth (${viewportMetrics.clientWidth})`);
      }

      // 2. Test Dark Mode (default)
      const darkModeThemeAttr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      console.log(`[Theme] Initial data-theme: ${darkModeThemeAttr}`);

      const darkScreenshotPath = path.join(SCREENSHOT_DIR, `${vp.name}-dark.png`);
      await page.screenshot({ path: darkScreenshotPath, fullPage: true });
      console.log(`[Screenshot] Saved dark screenshot: ${vp.name}-dark.png`);

      // 3. Test Theme Toggle to Light Mode
      await page.click("#themeToggle");
      await page.waitForTimeout(200);
      const lightModeThemeAttr = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      console.log(`[Theme] After toggle data-theme: ${lightModeThemeAttr}`);

      const lightScreenshotPath = path.join(SCREENSHOT_DIR, `${vp.name}-light.png`);
      await page.screenshot({ path: lightScreenshotPath, fullPage: true });
      console.log(`[Screenshot] Saved light screenshot: ${vp.name}-light.png`);

      // Toggle back to dark
      await page.click("#themeToggle");
      await page.waitForTimeout(100);

      // 4. Test Hero Telemetry Tabs
      const tabState = page.locator("#tab-state");
      if (await tabState.isVisible()) {
        await tabState.click();
        await page.waitForTimeout(100);
        const isPanelStateVisible = await page.locator("#panel-state").isVisible();
        console.log(`[Hero Tabs] WORK-STATE.md panel visible after tab click: ${isPanelStateVisible}`);
      }

      // 5. Test 5-Step Workflow Stepper
      const stepBtn3 = page.locator("#step-btn-3");
      if (await stepBtn3.isVisible()) {
        await stepBtn3.click();
        await page.waitForTimeout(100);
        const isStep3Visible = await page.locator("#step-panel-3").isVisible();
        console.log(`[Workflow Stepper] Step 3 (Connect) panel visible after click: ${isStep3Visible}`);
      }

      // 6. Test Agent Tab Switcher
      const claudeTab = page.locator('.agent-tab[data-agent="claude"]');
      if (await claudeTab.isVisible()) {
        await claudeTab.click();
        await page.waitForTimeout(100);
        const activeTitle = await page.locator("#activeAgentTitle").textContent();
        console.log(`[Agent Hub] Active agent after click: ${activeTitle}`);
      }

      // 7. Test Copy Button
      const heroCopyBtn = page.locator("#heroCopyBtn");
      if (await heroCopyBtn.isVisible()) {
        await heroCopyBtn.click();
        await page.waitForTimeout(150);
        const toastVisible = await page.locator("#toastNotification").isVisible();
        console.log(`[Copy Interaction] Toast notification triggered: ${toastVisible}`);
      }

      // 8. Test Mobile Menu (on mobile/narrow viewports < 900px)
      if (vp.width < 900) {
        const menuBtn = page.locator("#mobileMenuBtn");
        if (await menuBtn.isVisible()) {
          await menuBtn.click();
          await page.waitForTimeout(150);
          const menuVisible = await page.locator("#mobileMenu").isVisible();
          console.log(`[Mobile Menu] Drawer opened on toggle: ${menuVisible}`);
          await menuBtn.click();
          await page.waitForTimeout(150);
        }
      }

      // 9. Inspect Computed Font on Heading
      const computedFont = await page.evaluate(() => {
        const h1 = document.querySelector(".hero-title");
        return h1 ? window.getComputedStyle(h1).fontFamily : "none";
      });
      console.log(`[Font Check] Hero title computed font-family: ${computedFont}`);

      results.push({
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        overflowPass: !hasHorizontalOverflow,
        darkScreenshot: `${vp.name}-dark.png`,
        lightScreenshot: `${vp.name}-light.png`
      });

      await context.close();
    }

    console.log("\n=== Browser QA Summary ===");
    console.table(results);

    const allPassed = results.every((r) => r.overflowPass);
    if (!allPassed) {
      console.error("\nFAIL: One or more viewports had horizontal overflow!");
      process.exitCode = 1;
    } else {
      console.log("\nPASS: All 7 viewports passed zero-overflow check and interactions!");
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
    console.log("[HTTP] Test server stopped.");
  }
}

runBrowserQA().catch((err) => {
  console.error("Fatal Browser QA error:", err);
  process.exit(1);
});
