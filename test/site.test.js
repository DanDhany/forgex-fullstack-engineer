import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

test("landing page HTML exists and has valid semantic structure", async () => {
  const htmlPath = path.resolve("site/index.html");
  const html = await fs.readFile(htmlPath, "utf8");

  assert.match(html, /<!DOCTYPE html>/i, "Must have valid DOCTYPE");
  assert.match(html, /<html [^>]*lang="en"/i, "Must declare lang attribute");
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1.0">/i, "Must have responsive viewport");
  assert.match(html, /ForgeX Full-Stack Engineer v1\.1\.8/, "Must specify exact ForgeX version");
  assert.match(html, /DanDhany/, "Must reference author DanDhany");
  assert.match(html, /id="themeToggle"/, "Must contain theme switcher");
  assert.match(html, /id="workflow"/, "Must contain workflow section");
  assert.match(html, /id="agents"/, "Must contain agents section");
  assert.match(html, /WORK-STATE\.md/, "Must showcase WORK-STATE.md handoff pattern");
});

test("all referenced local assets in site/index.html exist on disk", async () => {
  const html = await fs.readFile(path.resolve("site/index.html"), "utf8");
  const assetRegex = /(?:src|href)="(\.\/[^"#?]+)"/g;
  let match;
  const assetsChecked = [];

  while ((match = assetRegex.exec(html)) !== null) {
    const relativeAsset = match[1];
    const assetPath = path.resolve("site", relativeAsset);
    try {
      await fs.access(assetPath);
      assetsChecked.push(relativeAsset);
    } catch {
      assert.fail(`Asset referenced in HTML does not exist: ${relativeAsset}`);
    }
  }

  assert.ok(assetsChecked.length >= 4, "Should verify at least 4 internal assets");
  assert.ok(assetsChecked.includes("./style.css"));
  assert.ok(assetsChecked.includes("./app.js"));
  assert.ok(assetsChecked.includes("./assets/logo.svg"));
  assert.ok(assetsChecked.includes("./assets/favicon.svg"));
});

test("CSS defines required art direction tokens, light/dark themes, and overflow guards", async () => {
  const css = await fs.readFile(path.resolve("site/style.css"), "utf8");

  // Palette & theme tokens
  assert.match(css, /--color-canvas:/, "Must declare --color-canvas");
  assert.match(css, /--color-surface:/, "Must declare --color-surface");
  assert.match(css, /--color-brand:/, "Must declare --color-brand");
  assert.match(css, /\[data-theme="dark"\]/, "Must declare dark mode theme scope");

  // Mobile overflow & typography safety
  assert.match(css, /text-wrap: balance/, "Must balance headline typography");
  assert.match(css, /overflow-x: hidden/, "Body should prevent unwanted horizontal bleed");
  assert.match(css, /overflow-x: auto/, "Code blocks and tab bars must scroll horizontally safely");
  assert.match(css, /prefers-reduced-motion/, "Must support reduced-motion accessibility preference");
});

test("JavaScript implements theme toggle, workflow stepper, and all 8 supported agents", async () => {
  const js = await fs.readFile(path.resolve("site/app.js"), "utf8");

  assert.match(js, /THEME_STORAGE_KEY/, "Must store theme preference");
  assert.match(js, /data-theme/, "Must toggle data-theme attribute");

  // Check all 8 agents from docs/AGENT-COMPATIBILITY.md
  const agents = ["codex", "claude", "antigravity", "cursor", "copilot", "gemini", "windsurf", "opencode"];
  for (const agent of agents) {
    assert.match(js, new RegExp(agent + ":\\s*\\{"), `Must include agent config for ${agent}`);
  }

  assert.match(js, /\$forgex/, "Codex must specify $forgex invocation");
  assert.match(js, /\/forgex/, "Claude and Antigravity must specify /forgex invocation");
});

test("Task Workbench HTML and JS exist and implement contract-verified form", async () => {
  const html = await fs.readFile(path.resolve("site/tasks.html"), "utf8");
  const js = await fs.readFile(path.resolve("site/tasks.js"), "utf8");

  // Form fields check
  assert.match(html, /id="taskTitle"/, "Must provide title field");
  assert.match(html, /id="taskPriority"/, "Must provide priority field");
  assert.match(html, /id="taskDescription"/, "Must provide description field");
  assert.match(html, /id="submitBtn"/, "Must provide submit button");
  assert.match(html, /id="successBanner"/, "Must provide success banner");
  assert.match(html, /id="globalError"/, "Must provide error alert");

  // Priority options in HTML
  assert.match(html, /value="low"/, "Must support low priority");
  assert.match(html, /value="medium"/, "Must support medium priority");
  assert.match(html, /value="high"/, "Must support high priority");
  assert.match(html, /value="urgent"/, "Must support urgent priority");

  // Client JS contract checks
  assert.match(js, /isSubmitting/, "Must implement duplicate submission guard");
  assert.match(js, /MAX_TITLE_LENGTH\s*=\s*120/, "Must enforce max title length");
  assert.match(js, /MAX_DESC_LENGTH\s*=\s*1000/, "Must enforce max description length");
  assert.match(js, /\/api\/tasks/, "Must call /api/tasks endpoint");
});
