import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildPlan, applyPlan, uninstallFromRoot, MANIFEST_NAME } from "../src/installer.js";

const targetRoot = (agent, scope, projectRoot) => scope === "global"
  ? path.resolve(...agent.global)
  : path.resolve(projectRoot, ...agent.project);

test("plan finds destination conflicts", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-skill-"));
  try {
    const source = path.join(tmp, "source");
    const root = path.join(tmp, "project", ".agents", "skills");
    await fs.mkdir(source, { recursive: true });
    await fs.writeFile(path.join(source, "SKILL.md"), "skill");
    await fs.mkdir(path.join(root, "forgex"), { recursive: true });
    const plan = await buildPlan({
      source, agents: [{ id: "test", label: "Test", project: [".agents", "skills"], global: [] }],
      scope: "project", projectRoot: path.join(tmp, "project"), targetRoot,
    });
    assert.equal(plan[0].conflict, true);
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test("installer copies skill and reference files, skips conflict", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-skill-"));
  try {
    const source = path.join(tmp, "source");
    await fs.mkdir(path.join(source, "references"), { recursive: true });
    await fs.writeFile(path.join(source, "SKILL.md"), "main skill");
    await fs.writeFile(path.join(source, "references", "ui.md"), "UI guide");
    const root = path.join(tmp, "project", ".agents", "skills");
    const plan = [{ agentId: "test", agentLabel: "Test", skillName: "forgex", source, root,
      destination: path.join(root, "forgex"), conflict: false }];
    const result = await applyPlan(plan, { confirm: true });
    assert.equal(result[0].status, "installed");
    assert.equal(await fs.readFile(path.join(root, "forgex", "references", "ui.md"), "utf8"), "UI guide");
    assert.ok(JSON.parse(await fs.readFile(path.join(root, MANIFEST_NAME), "utf8")).installed.includes("forgex"));
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test("uninstall removes only manifest-recorded skill folders", async () => {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "forge-skill-"));
  try {
    await fs.mkdir(path.join(tmp, "forgex"), { recursive: true });
    await fs.writeFile(path.join(tmp, "forgex", "SKILL.md"), "skill");
    await fs.mkdir(path.join(tmp, "other"), { recursive: true });
    await fs.writeFile(path.join(tmp, "other", "SKILL.md"), "keep");
    await fs.writeFile(path.join(tmp, MANIFEST_NAME), JSON.stringify({ installed: ["forgex"] }));
    const result = await uninstallFromRoot(tmp, { confirm: true });
    assert.deepEqual(result.removed, ["forgex"]);
    await assert.rejects(fs.access(path.join(tmp, "forgex")));
    await fs.access(path.join(tmp, "other", "SKILL.md"));
  } finally { await fs.rm(tmp, { recursive: true, force: true }); }
});

test("skill prioritizes UI/UX and explicit cross-stack contracts", async () => {
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  assert.match(skill, /UI\/UX is a core product requirement/);
  assert.match(skill, /^name: forgex$/m);
  assert.match(skill, /Cross-stack consistency is a release gate/);
  assert.match(skill, /UI event → client state\/request → route\/endpoint/);
});


test("Codex metadata documents explicit-only ForgeX invocation", async () => {
  const metadata = await fs.readFile(path.resolve("skills/forgex/agents/openai.yaml"), "utf8");
  assert.match(metadata, /allow_implicit_invocation: false/);
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  assert.match(skill, /In Codex, use `\$forgex`/);
  assert.match(skill, /`\/forgex` is not a Codex skill-invocation command/);
});


test("evidence-first guardrails forbid invented facts and unverified success claims", async () => {
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  const evidence = await fs.readFile(path.resolve("skills/forgex/references/evidence-first-engineering.md"), "utf8");
  assert.match(skill, /Evidence before claims/);
  assert.match(skill, /references\/evidence-first-engineering\.md/);
  assert.match(evidence, /Never fabricate screenshots, browser observations, logs, test counts, build results, or tool calls/);
  assert.match(evidence, /Do not equate “implemented” with “tested,”/);
});

test("Antigravity installer uses current documented skill paths", async () => {
  const agents = await import("../src/agents.js");
  const antigravity = agents.AGENTS.find((agent) => agent.id === "antigravity");
  assert.deepEqual(antigravity.project, [".agents", "skills"]);
  assert.deepEqual(antigravity.global.slice(-3), [".gemini", "config", "skills"]);
});


test("UI workflow is low-prompt and requires product-specific composition for major UI work", async () => {
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  const ui = await fs.readFile(path.resolve("skills/forgex/references/ui-ux-craft.md"), "utf8");
  assert.match(skill, /do not require them to repeat design principles/);
  assert.match(skill, /Consider at least two materially different composition directions/);
  assert.match(ui, /Low-prompt contract/);
  assert.match(ui, /critique → refinement → reinspection cycle/);
  assert.match(ui, /do not spend the pass only tweaking shadows or border radii/);
});

test("package and skill versions stay aligned", async () => {
  const pkg = JSON.parse(await fs.readFile(path.resolve("package.json"), "utf8"));
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  assert.equal(pkg.version, "1.1.8");
  assert.match(skill, /version: "1.1.8"/);
});


test("UI craft explicitly gates typography, palette hierarchy, and mobile overflow", async () => {
  const ui = await fs.readFile(path.resolve("skills/forgex/references/ui-ux-craft.md"), "utf8");
  assert.match(ui, /Typography system/);
  assert.match(ui, /Color and surfaces/);
  assert.match(ui, /Mobile overflow gate/);
  assert.match(ui, /Do not solve page-wide overflow by setting `overflow-x: hidden` on the body/);
  assert.match(ui, /A mobile screenshot where headings, navigation, buttons, body copy, or code are cut off is a failed acceptance check/);
});


test("UI craft requires actual viewport validation and paired mobile overflow checks", async () => {
  const ui = await fs.readFile(path.resolve("skills/forgex/references/ui-ux-craft.md"), "utf8");
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  assert.match(ui, /actual CSS viewport is the intended width/);
  assert.match(ui, /documentElement\.scrollWidth <= document\.documentElement\.clientWidth/);
  assert.match(ui, /A narrow screenshot crop of a desktop viewport is not mobile QA/);
  assert.match(ui, /uniform navy slab/);
  assert.match(skill, /Confirm the browser actually uses each requested CSS viewport/);
});


test("UI craft enforces six-part typography art direction and acceptance gate", async () => {
  const ui = await fs.readFile(path.resolve("skills/forgex/references/ui-ux-craft.md"), "utf8");
  const skill = await fs.readFile(path.resolve("skills/forgex/SKILL.md"), "utf8");
  assert.match(ui, /Typography art direction gate — six required decisions/);
  assert.match(ui, /Choose type by product character/);
  assert.match(ui, /Build a coherent typographic system/);
  assert.match(ui, /Art-direct headline composition/);
  assert.match(ui, /Match typography to the full visual direction/);
  assert.match(ui, /Verify rendered output, not just declarations/);
  assert.match(ui, /Polish typography through interaction and states/);
  assert.match(ui, /Required acceptance gate for substantial UI work/);
  assert.match(ui, /reduced-motion behavior/);
  assert.match(skill, /six typography art-direction decisions/);
});


test("UI craft requires product-aware color, surface, effects, and motion decisions", async () => {
  const ui = await fs.readFile(path.resolve("skills/forgex/references/ui-ux-craft.md"), "utf8");
  assert.match(ui, /Product-aware art direction: brand, color, surfaces, effects, and motion/);
  assert.match(ui, /Treat light mode as a designed palette, not white mode/);
  assert.match(ui, /Separate \*\*brand colors\*\*.*\*\*semantic colors\*\*/);
  assert.match(ui, /Choose effects by purpose, not trend/);
  assert.match(ui, /Choose motion by product character and interaction need/);
  assert.match(ui, /Make the direction concrete before coding/);
});
