import fs from "node:fs/promises";
import path from "node:path";

export const MANIFEST_NAME = ".forgex-fullstack-engineer-manifest.json";

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

export async function buildPlan({ source, agents, scope, projectRoot, skillName = "forgex", targetRoot }) {
  const plan = [];
  for (const agent of agents) {
    const root = targetRoot(agent, scope, projectRoot);
    plan.push({
      agentId: agent.id, agentLabel: agent.label, skillName,
      source, root, destination: path.join(root, skillName),
      conflict: await exists(path.join(root, skillName)),
    });
  }
  return plan;
}

export async function applyPlan(plan, { dryRun = false, confirm = false } = {}) {
  if (!dryRun && !confirm) throw new Error("Refusing to write without explicit confirmation.");
  const results = [];
  const manifests = new Map();
  for (const item of plan) {
    if (item.conflict) {
      results.push({ ...item, status: "skipped-existing" });
      continue;
    }
    if (dryRun) {
      results.push({ ...item, status: "dry-run" });
      continue;
    }
    const skillFile = path.join(item.source, "SKILL.md");
    const stat = await fs.stat(skillFile);
    if (!stat.isFile()) {
      results.push({ ...item, status: "invalid-source" });
      continue;
    }
    await fs.mkdir(path.dirname(item.destination), { recursive: true });
    await fs.cp(item.source, item.destination, { recursive: true, errorOnExist: true, force: false });
    if (!manifests.has(item.root)) manifests.set(item.root, []);
    manifests.get(item.root).push(path.relative(item.root, item.destination));
    results.push({ ...item, status: "installed" });
  }
  for (const [root, installed] of manifests) {
    const manifestPath = path.join(root, MANIFEST_NAME);
    let previous = { installed: [] };
    if (await exists(manifestPath)) {
      try { previous = JSON.parse(await fs.readFile(manifestPath, "utf8")); } catch { /* preserve user data; fresh manifest below */ }
    }
    const all = [...new Set([...(Array.isArray(previous.installed) ? previous.installed : []), ...installed])];
    await fs.writeFile(manifestPath, JSON.stringify({
      version: 1, toolkit: "forgex-fullstack-engineer",
      updatedAt: new Date().toISOString(), installed: all,
    }, null, 2) + "\n");
  }
  return results;
}

export async function uninstallFromRoot(root, { confirm = false } = {}) {
  if (!confirm) throw new Error("Refusing to uninstall without explicit confirmation.");
  const manifestPath = path.join(root, MANIFEST_NAME);
  let manifest;
  try { manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")); }
  catch { return { removed: [], skipped: [], error: "No valid ForgeX manifest found." }; }
  if (!Array.isArray(manifest.installed)) return { removed: [], skipped: [], error: "Invalid manifest schema." };
  const removed = [], skipped = [];
  for (const relative of manifest.installed) {
    if (typeof relative !== "string" || path.isAbsolute(relative) || relative.includes("\0")) {
      skipped.push(relative); continue;
    }
    const target = path.resolve(root, relative);
    const rel = path.relative(root, target);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) { skipped.push(relative); continue; }
    try {
      const stat = await fs.stat(path.join(target, "SKILL.md"));
      if (!stat.isFile()) { skipped.push(relative); continue; }
      await fs.rm(target, { recursive: true, force: false });
      removed.push(relative);
    } catch { skipped.push(relative); }
  }
  await fs.writeFile(manifestPath, JSON.stringify({
    version: 1, toolkit: "forgex-fullstack-engineer",
    updatedAt: new Date().toISOString(), installed: [],
    lastUninstall: { removed, skipped },
  }, null, 2) + "\n");
  return { removed, skipped };
}
