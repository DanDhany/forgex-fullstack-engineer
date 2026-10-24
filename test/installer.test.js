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
