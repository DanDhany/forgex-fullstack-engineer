#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { AGENTS, targetRoot } from "../src/agents.js";
import { fetchCanonicalSkill } from "../src/github-source.js";
import { buildPlan, applyPlan, uninstallFromRoot } from "../src/installer.js";
import { ask, chooseOne, chooseMany, confirm, banner, showPlan, paint } from "../src/tui.js";


function help() {
  console.log(`ForgeX Full-Stack Engineer installer

Usage:
  npm start
  node ./bin/install.js --help
  node ./bin/install.js --dry-run
  node ./bin/install.js --list-agents

Invocation after installation:
  Codex: type $forgex in the prompt; use /skills to list available skills.
  Other agents: use the host-supported skill picker or slash syntax, if available.

Requires Node.js 20+ and an internet connection.
Always downloads the canonical skill from https://github.com/DanDhany/forgex-fullstack-engineer.
No npm install required.
`);
}
async function main() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--help") || args.has("-h")) return help();
  if (args.has("--list-agents")) { AGENTS.forEach(a => console.log(`${a.id}\t${a.label}`)); return; }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    banner();
    console.log("This installer fetches the canonical ForgeX skill from GitHub. It does not install external tools.");
    const action = await chooseOne(rl, "Action", [
      { id: "install", label: "Install ForgeX (forgex) from GitHub" },
      { id: "uninstall", label: "Uninstall ForgeX-installed skill" },
      { id: "exit", label: "Exit" },
    ]);
    if (action.id === "exit") return;
    if (action.id === "uninstall") {
      const scope = await chooseOne(rl, "Scope", [
        { id: "global", label: "Global" }, { id: "project", label: "Project-local" },
      ]);
      const projectRoot = scope.id === "project" ? path.resolve(await ask(rl, "Project path", process.cwd())) : process.cwd();
      const agents = await chooseMany(rl, "Select agent target(s)", AGENTS.map(a => ({ ...a, label: `${a.label} (${a.id})` })));
      const roots = [...new Set(agents.map(a => targetRoot(a, scope.id, projectRoot)))];
      if (!await confirm(rl, `Uninstall manifest-recorded skill directories from ${roots.length} target root(s)?`)) return;
      for (const root of roots) {
        const result = await uninstallFromRoot(root, { confirm: true });
        console.log(`${root}: removed ${result.removed.length}, skipped ${result.skipped.length}${result.error ? ` — ${result.error}` : ""}`);
      }
      return;
    }
    const agents = await chooseMany(rl, "Select agent target(s)", AGENTS.map(a => ({ ...a, label: `${a.label} (${a.id})` })));
    const scope = await chooseOne(rl, "Install scope", [
      { id: "global", label: "Global", note: "for your user account" },
      { id: "project", label: "Project-local", note: "inside a selected repository" },
    ]);
    const projectRoot = scope.id === "project" ? path.resolve(await ask(rl, "Project path", process.cwd())) : process.cwd();
    console.log("\nFetching the canonical ForgeX skill from GitHub...");
    const remote = await fetchCanonicalSkill();
    try {
      console.log(`Source: ${remote.repository} (branch: ${remote.branch})`);
      const plan = await buildPlan({ source: remote.source, agents, scope: scope.id, projectRoot, skillName: "forgex", targetRoot });
      showPlan(plan);
      if (args.has("--dry-run")) {
        await applyPlan(plan, { dryRun: true });
        console.log("\nDry run complete. No files were written.");
        return;
      }
      if (!await confirm(rl, "Apply installation? Existing directories will be skipped.")) {
        console.log("Cancelled. No changes made."); return;
      }
      const results = await applyPlan(plan, { confirm: true });
      const installed = results.filter(x => x.status === "installed").length;
      const skipped = results.filter(x => x.status === "skipped-existing").length;
      console.log(paint(`\nDone. Installed: ${installed}; skipped: ${skipped}.`, "\x1b[32m"));
      console.log("Invoke explicitly in Codex with $forgex (use /skills to list skills). /forgex is not a Codex skill command.");
      console.log("Other agents may expose /forgex or a skill picker; invocation syntax depends on the host. Restart the agent if the skill is not detected.");
    } finally {
      await remote.cleanup();
    }
  } finally { rl.close(); }
}
main().catch(error => {
  console.error(`Installer error: ${error.message}`);
  process.exitCode = 1;
});
