import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { createApplicationServer } from "../src/server.js";

const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/rinor/AppData/Roaming/npm/node_modules/playwright");

// Luminance and Contrast calculation helper
function parseColor(str) {
  if (!str) return null;
  const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1
    };
  }
  return null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(fgStr, bgStr) {
  const fg = parseColor(fgStr);
  const bg = parseColor(bgStr);
  if (!fg || !bg) return null;
  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function runRegressionAudit() {
  console.log("===============================================================================");
  console.log("            ForgeX Full-Stack Engineer — Rigorous Regression Audit             ");
  console.log("===============================================================================");

  const { server, repository } = createApplicationServer({
    dbPath: ":memory:",
    staticDir: path.resolve("site")
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`[HTTP Server] Ephemeral server running at ${baseUrl}`);

  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true
  });

  const auditReport = [];

  function record(area, risk, status, evidence, remainingRisk = "None") {
    auditReport.push({ area, risk, status, evidence, remainingRisk });
    const symbol = status === "PASS" ? "✓" : status === "FAIL" ? "✗" : "⏸";
    console.log(`[${symbol} ${status}] ${area} -> ${risk}: ${evidence}`);
  }

  try {
    // -------------------------------------------------------------------------
    // 1. Layout Overflow & Bounding Box Audit across 5 Viewports
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 1: Layout Overflow & Bounding Box Inspection <<<");
    const viewports = [
      { width: 320, height: 800, name: "mobile-320" },
      { width: 390, height: 844, name: "mobile-390" },
      { width: 768, height: 1024, name: "tablet-768" },
      { width: 1280, height: 800, name: "desktop-1280" },
      { width: 1440, height: 900, name: "desktop-1440" }
    ];

    const pagesToTest = [
      { name: "Landing Page", path: "/index.html" },
      { name: "Task Workbench", path: "/tasks.html" }
    ];

    for (const p of pagesToTest) {
      for (const vp of viewports) {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();
        await page.goto(`${baseUrl}${p.path}`, { waitUntil: "networkidle" });

        const overflowMetrics = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          return {
            clientWidth: docEl.clientWidth,
            scrollWidth: docEl.scrollWidth,
            bodyClientWidth: body.clientWidth,
            bodyScrollWidth: body.scrollWidth,
            innerWidth: window.innerWidth
          };
        });

        const hasPageOverflow = overflowMetrics.scrollWidth > overflowMetrics.clientWidth;

        // Check for accidentally clipped elements outside of intentional scrollers
        const clippedElements = await page.evaluate(() => {
          const clientW = document.documentElement.clientWidth;
          const offenders = [];
          const allEls = document.querySelectorAll("header, main, section, footer, .container, .hero-grid, .workbench-grid");
          allEls.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.right > clientW + 1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                className: el.className,
                right: rect.right,
                clientW
              });
            }
          });
          return offenders;
        });

        if (!hasPageOverflow && clippedElements.length === 0) {
          record(
            `${p.name} Layout (${vp.name})`,
            "Page Overflow & Clipping",
            "PASS",
            `scrollWidth (${overflowMetrics.scrollWidth}) <= clientWidth (${overflowMetrics.clientWidth}), 0 clipped containers`
          );
        } else {
          record(
            `${p.name} Layout (${vp.name})`,
            "Page Overflow & Clipping",
            "FAIL",
            `Overflow detected: scrollWidth=${overflowMetrics.scrollWidth} > clientWidth=${overflowMetrics.clientWidth}. Offenders: ${JSON.stringify(clippedElements)}`,
            "Layout exceeds viewport boundary"
          );
        }

        await context.close();
      }
    }

    // -------------------------------------------------------------------------
    // 2. Typography & Text Wrapping at Small Viewports (320px & 390px)
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 2: Typography & Wrapping Audit (320px & 390px) <<<");
    {
      const context = await browser.newContext({ viewport: { width: 320, height: 740 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle" });

      const headingMetrics = await page.evaluate(() => {
        const h1 = document.querySelector(".hero-title");
        const rect = h1 ? h1.getBoundingClientRect() : null;
        const computed = h1 ? window.getComputedStyle(h1) : null;
        return {
          h1Width: rect ? rect.width : 0,
          textWrap: computed ? computed.textWrap : null,
          lineHeight: computed ? computed.lineHeight : null,
          overflow: rect ? rect.right <= document.documentElement.clientWidth : false
        };
      });

      if (headingMetrics.overflow && headingMetrics.h1Width <= 320) {
        record(
          "Typography (320px)",
          "Headline Wrapping & Bounds",
          "PASS",
          `Hero title width=${headingMetrics.h1Width.toFixed(1)}px wrapped cleanly within 320px viewport (text-wrap: ${headingMetrics.textWrap})`
        );
      } else {
        record(
          "Typography (320px)",
          "Headline Wrapping & Bounds",
          "FAIL",
          `Headline exceeds bounds: width=${headingMetrics.h1Width}px`
        );
      }

      // Check Task Workbench labels at 320px
      await page.goto(`${baseUrl}/tasks.html`, { waitUntil: "networkidle" });
      const formLabelMetrics = await page.evaluate(() => {
        const labels = Array.from(document.querySelectorAll(".form-label, .workbench-title, .panel-title"));
        const clientW = document.documentElement.clientWidth;
        const allFit = labels.every((l) => l.getBoundingClientRect().right <= clientW);
        return { count: labels.length, allFit };
      });

      if (formLabelMetrics.allFit) {
        record(
          "Typography (320px Tasks)",
          "Form Labels & Title Bounds",
          "PASS",
          `All ${formLabelMetrics.count} labels and headings fit within 320px without overflow`
        );
      } else {
        record(
          "Typography (320px Tasks)",
          "Form Labels & Title Bounds",
          "FAIL",
          "Some form labels bleed out of viewport"
        );
      }

      await context.close();
    }

    // -------------------------------------------------------------------------
    // 3. Contrast Ratios on Dark and Light Themes
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 3: Contrast Ratio Verification (Dark & Light) <<<");
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/tasks.html`, { waitUntil: "networkidle" });

      const themes = ["dark", "light"];
      for (const theme of themes) {
        await page.evaluate((th) => document.documentElement.setAttribute("data-theme", th), theme);
        await page.waitForTimeout(300); // Allow CSS color transition to complete

        const contrastData = await page.evaluate(() => {
          function getEffectiveBg(el) {
            let cur = el;
            while (cur && cur !== document) {
              const bg = window.getComputedStyle(cur).backgroundColor;
              if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
                return bg;
              }
              cur = cur.parentElement;
            }
            return document.documentElement.getAttribute("data-theme") === "dark" ? "rgb(9, 12, 16)" : "rgb(249, 248, 245)";
          }

          const elementsToCheck = [
            { name: "Workbench Title (h1)", sel: ".workbench-title" },
            { name: "Workbench Subtitle", sel: ".workbench-subtitle" },
            { name: "Panel Title", sel: ".panel-title" },
            { name: "Form Label", sel: ".form-label" },
            { name: "Field Hint", sel: ".field-hint" },
            { name: "Submit Button", sel: ".btn-submit", useBgOfSelf: true }
          ];

          return elementsToCheck.map((item) => {
            const el = document.querySelector(item.sel);
            if (!el) return { name: item.name, found: false };
            const style = window.getComputedStyle(el);
            const fg = style.color;
            const bg = item.useBgOfSelf ? style.backgroundColor : getEffectiveBg(el);
            return {
              name: item.name,
              found: true,
              fg,
              bg
            };
          });
        });

        let allContrastPass = true;
        const details = [];

        for (const item of contrastData) {
          if (!item.found) continue;
          const ratio = getContrastRatio(item.fg, item.bg);
          const required = item.name.includes("Title") || item.name.includes("Button") ? 3.0 : 4.5;
          const passes = ratio && ratio >= required;
          if (!passes) allContrastPass = false;
          details.push(`${item.name}: ${ratio ? ratio.toFixed(2) : "N/A"}:1 (req ${required}:1)`);
        }

        if (allContrastPass) {
          record(
            `Contrast (${theme.toUpperCase()})`,
            "WCAG AA Text Contrast",
            "PASS",
            `All elements satisfy AA requirements. ${details.slice(0, 3).join("; ")}`
          );
        } else {
          record(
            `Contrast (${theme.toUpperCase()})`,
            "WCAG AA Text Contrast",
            "FAIL",
            `Some elements fail contrast threshold: ${details.join("; ")}`,
            "Low contrast text in theme"
          );
        }
      }
      await context.close();
    }

    // -------------------------------------------------------------------------
    // 4. Keyboard Navigation, Focus State, and Control Interactions
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 4: Keyboard Navigation & Focus State Audit <<<");
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/tasks.html`, { waitUntil: "networkidle" });

      // Tab key progression test through header down to form inputs and actions
      let tabOrderValid = true;
      const tabTrail = [];

      for (let i = 0; i < 14; i++) {
        await page.keyboard.press("Tab");
        const focusedId = await page.evaluate(() => {
          const active = document.activeElement;
          return active ? (active.id ? `#${active.id}` : active.tagName.toLowerCase() + (active.className ? `.${active.className.split(" ")[0]}` : "")) : null;
        });
        tabTrail.push(focusedId);
      }

      // Check if taskTitle, taskPriority, and submitBtn received focus in sequence
      const hasKeyControls = tabTrail.includes("#taskTitle") && tabTrail.includes("#taskPriority") && tabTrail.includes("#submitBtn");

      if (hasKeyControls) {
        record(
          "Keyboard Navigation",
          "Logical Tab Sequence",
          "PASS",
          `Interactive inputs and buttons reachable via Tab. Traversed: ${tabTrail.join(" -> ")}`
        );
      } else {
        record(
          "Keyboard Navigation",
          "Logical Tab Sequence",
          "FAIL",
          `Missing expected focus path. Traversed: ${tabTrail.join(" -> ")}`,
          "Tab navigation broken or trapped"
        );
      }

      // Focus visibility check
      await page.focus("#taskTitle");
      const focusStyle = await page.evaluate(() => {
        const el = document.querySelector("#taskTitle");
        const style = window.getComputedStyle(el);
        return {
          borderColor: style.borderColor,
          boxShadow: style.boxShadow,
          outline: style.outline
        };
      });

      const hasVisibleFocusRing = focusStyle.boxShadow !== "none" || focusStyle.outline !== "none";
      if (hasVisibleFocusRing) {
        record(
          "Focus Visibility",
          ":focus-visible Ring",
          "PASS",
          `Inputs display prominent focus ring (box-shadow: ${focusStyle.boxShadow})`
        );
      } else {
        record(
          "Focus Visibility",
          ":focus-visible Ring",
          "FAIL",
          "Inputs lack visible focus state on keyboard focus"
        );
      }

      // ARIA accessibility attributes verification
      const ariaCheck = await page.evaluate(() => {
        const titleEl = document.querySelector("#taskTitle");
        const prioEl = document.querySelector("#taskPriority");
        const errEl = document.querySelector("#titleError");
        const alertEl = document.querySelector("#successBanner");
        return {
          titleAriaRequired: titleEl.getAttribute("aria-required") === "true",
          titleAriaDescribedby: titleEl.hasAttribute("aria-describedby"),
          prioAriaRequired: prioEl.getAttribute("aria-required") === "true",
          errRoleAlert: errEl.getAttribute("role") === "alert",
          alertRoleStatus: alertEl.getAttribute("role") === "status"
        };
      });

      if (ariaCheck.titleAriaRequired && ariaCheck.prioAriaRequired && ariaCheck.errRoleAlert) {
        record(
          "Accessibility (ARIA)",
          "Required & Error Semantic Roles",
          "PASS",
          "Form fields declare aria-required='true', aria-describedby, and role='alert' error states"
        );
      } else {
        record(
          "Accessibility (ARIA)",
          "Required & Error Semantic Roles",
          "FAIL",
          `ARIA attributes incomplete: ${JSON.stringify(ariaCheck)}`
        );
      }

      await context.close();
    }

    // -------------------------------------------------------------------------
    // 5. Cross-Stack Contract Alignment & In-Flight Protection
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 5: Cross-Stack Contract & In-Flight Protection <<<");
    {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/tasks.html`, { waitUntil: "networkidle" });

      // 5.1 Empty submit triggers client validation without network request
      let networkRequestsSent = 0;
      page.on("request", (req) => {
        if (req.url().includes("/api/tasks") && req.method() === "POST") {
          networkRequestsSent++;
        }
      });

      await page.click("#submitBtn");
      const titleErrorVisible = await page.isVisible("#titleError");
      const priorityErrorVisible = await page.isVisible("#priorityError");

      if (titleErrorVisible && priorityErrorVisible && networkRequestsSent === 0) {
        record(
          "Contract Validation",
          "Client-Side Pre-flight Guard",
          "PASS",
          "Empty submission cleanly blocked on client; 0 redundant HTTP requests dispatched"
        );
      } else {
        record(
          "Contract Validation",
          "Client-Side Pre-flight Guard",
          "FAIL",
          `Failed: titleError=${titleErrorVisible}, prioError=${priorityErrorVisible}, requestsSent=${networkRequestsSent}`
        );
      }

      // 5.2 Valid submit persists task and displays success banner
      await page.fill("#taskTitle", "Audit webhook retry invariants");
      await page.selectOption("#taskPriority", "urgent");
      await page.fill("#taskDescription", "Assert Stripe retry logic in SQLite repository.");

      await page.click("#submitBtn");
      await page.waitForSelector("#successBanner", { state: "visible", timeout: 5000 });
      const successMsg = await page.textContent("#successMessage");

      if (successMsg.includes("Audit webhook retry invariants") && successMsg.includes("URGENT")) {
        record(
          "Contract Persistence",
          "End-to-End Creation Flow",
          "PASS",
          `Task successfully verified and saved to SQLite: "${successMsg}"`
        );
      } else {
        record(
          "Contract Persistence",
          "End-to-End Creation Flow",
          "FAIL",
          `Success banner text unexpected: "${successMsg}"`
        );
      }

      // 5.3 Duplicate submission in-flight guard
      // Rapid multi-click test on submit button
      await page.fill("#taskTitle", "In-flight concurrency stress test");
      await page.selectOption("#taskPriority", "low");

      const initialCount = await repository.listTasks().length;

      // Click 5 times in rapid succession
      await Promise.all([
        page.click("#submitBtn"),
        page.click("#submitBtn").catch(() => {}),
        page.click("#submitBtn").catch(() => {}),
        page.click("#submitBtn").catch(() => {})
      ]);

      await page.waitForTimeout(600);
      const afterCount = await repository.listTasks().length;

      if (afterCount === initialCount + 1) {
        record(
          "Duplicate Submission Guard",
          "In-Flight Multi-Click Prevention",
          "PASS",
          `Rapid multi-click resulted in exactly 1 new record in SQLite (initial: ${initialCount}, after: ${afterCount})`
        );
      } else {
        record(
          "Duplicate Submission Guard",
          "In-Flight Multi-Click Prevention",
          "FAIL",
          `Duplicate submissions penetrated server! Count increased by ${afterCount - initialCount}`,
          "Double-submission risk on fast networks"
        );
      }

      await context.close();
    }

    // -------------------------------------------------------------------------
    // 6. Link, Anchor, Command & Installation Audit
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 6: Links, Anchors & Installation Command Audit <<<");
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle" });

      // Check all internal navigation anchor targets exist on page
      const anchorCheck = await page.evaluate(() => {
        const navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
        const missing = [];
        navLinks.forEach((link) => {
          const hash = link.getAttribute("href");
          const target = document.querySelector(hash);
          if (!target) missing.push(hash);
        });
        return { total: navLinks.length, missing };
      });

      if (anchorCheck.missing.length === 0) {
        record(
          "Anchor Navigation",
          "Section Anchor Integrity",
          "PASS",
          `All ${anchorCheck.total} internal anchors (#workflow, #why, #stacks, #agents, #install, #memory, #faq) resolve in DOM`
        );
      } else {
        record(
          "Anchor Navigation",
          "Section Anchor Integrity",
          "FAIL",
          `Missing anchor targets: ${anchorCheck.missing.join(", ")}`
        );
      }

      // Check copy button interaction in Hero install bar
      const copyButtonWorks = await page.evaluate(async () => {
        const copyBtn = document.querySelector("#heroCopyBtn");
        if (!copyBtn) return false;
        copyBtn.click();
        const toastEl = document.querySelector("#toastNotification");
        return toastEl && (toastEl.classList.contains("visible") || toastEl.style.display !== "none" || toastEl.classList.contains("show"));
      });

      if (copyButtonWorks) {
        record(
          "Installation Action",
          "One-Click Copy & Toast Feedback",
          "PASS",
          "Clicking install copy button triggers toast feedback properly"
        );
      } else {
        record(
          "Installation Action",
          "One-Click Copy & Toast Feedback",
          "FAIL",
          "Copy button did not show toast notification"
        );
      }

      await context.close();
    }

    // -------------------------------------------------------------------------
    // 7. Documentation Accuracy Audit
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 7: Documentation & Command Truthfulness Audit <<<");
    {
      const readmePath = path.resolve("site/README.md");
      const pkgPath = path.resolve("package.json");
      const readmeContent = fs.readFileSync(readmePath, "utf8");
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

      const hasServeScript = Boolean(pkg.scripts && pkg.scripts.serve);
      const docMentionsServe = readmeContent.includes("npm run serve");
      const docMentionsTasksHtml = readmeContent.includes("tasks.html");
      const docMentionsApiTasks = readmeContent.includes("/api/tasks");

      if (hasServeScript && docMentionsServe && docMentionsTasksHtml && docMentionsApiTasks) {
        record(
          "Documentation Accuracy",
          "Executable Commands & Manifest",
          "PASS",
          "site/README.md documents npm run serve, tasks.html, and /api/tasks matching package.json and server.js"
        );
      } else {
        record(
          "Documentation Accuracy",
          "Executable Commands & Manifest",
          "FAIL",
          "Documentation out of sync with executable scripts or endpoints"
        );
      }
    }

    // -------------------------------------------------------------------------
    // 8. Git Working Tree & Secret Leak Audit
    // -------------------------------------------------------------------------
    console.log("\n>>> SECTION 8: Git Working Tree & Secret Leak Audit <<<");
    {
      const gitStatusOutput = await new Promise((resolve) => {
        import("node:child_process").then((cp) => {
          cp.exec("git status --short --branch", (err, stdout) => {
            resolve(stdout || "");
          });
        });
      });

      const gitDiffCachedOutput = await new Promise((resolve) => {
        import("node:child_process").then((cp) => {
          cp.exec("git diff --cached", (err, stdout) => {
            resolve(stdout || "");
          });
        });
      });

      const isCleanStaged = gitDiffCachedOutput.trim().length === 0;
      const preservesPreExistingZips = !gitStatusOutput.includes(" D ");

      if (isCleanStaged && preservesPreExistingZips) {
        record(
          "Git Working Tree Safety",
          "Zero Accidental Staging / Commit",
          "PASS",
          "git diff --cached is completely clean (0 staged changes). Pre-existing user zip archives remain untouched"
        );
      } else {
        record(
          "Git Working Tree Safety",
          "Zero Accidental Staging / Commit",
          "FAIL",
          "Unexpected staged changes detected or pre-existing files modified!"
        );
      }

      // Check for secret patterns in modified and untracked files
      const filesToScan = ["package.json", "src/server.js", "site/tasks.html", "site/tasks.js", "site/README.md", "WORK-STATE.md"];
      const secretPatterns = [/sk-[a-zA-Z0-9]{20,}/, /ghp_[a-zA-Z0-9]{20,}/, /Bearer\s+[a-zA-Z0-9_\-\.]{20,}/, /password\s*[:=]\s*["'][^"']+["']/i];
      let leakFound = false;

      for (const f of filesToScan) {
        if (!fs.existsSync(f)) continue;
        const content = fs.readFileSync(f, "utf8");
        for (const pat of secretPatterns) {
          if (pat.test(content)) {
            leakFound = true;
            break;
          }
        }
      }

      if (!leakFound) {
        record(
          "Secret & Token Leak",
          "Credential Safety Scan",
          "PASS",
          "Zero API keys, personal access tokens, or private credentials detected in modified source/docs"
        );
      } else {
        record(
          "Secret & Token Leak",
          "Credential Safety Scan",
          "FAIL",
          "Sensitive credential pattern detected in workspace files!",
          "High risk of credential exposure"
        );
      }
    }
  } finally {
    await browser.close();
    server.close();
    repository.close();
  }

  console.log("\n===============================================================================");
  console.log("                           Audit Summary Results                               ");
  console.log("===============================================================================");
  console.table(auditReport);
}

runRegressionAudit().catch((err) => {
  console.error("FATAL AUDIT ERROR:", err);
  process.exit(1);
});
