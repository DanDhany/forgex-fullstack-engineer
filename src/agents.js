import os from "node:os";
import path from "node:path";

const home = os.homedir();

export const AGENTS = [
  { id: "codex", label: "OpenAI Codex", project: [".agents", "skills"], global: [home, ".agents", "skills"] },
  { id: "opencode", label: "OpenCode", project: [".agents", "skills"], global: [home, ".agents", "skills"] },
  { id: "claude-code", label: "Claude Code", project: [".claude", "skills"], global: [home, ".claude", "skills"] },
  { id: "cursor", label: "Cursor", project: [".agents", "skills"], global: [home, ".cursor", "skills"] },
  { id: "github-copilot", label: "GitHub Copilot", project: [".github", "skills"], global: [home, ".copilot", "skills"] },
  { id: "gemini-cli", label: "Gemini CLI", project: [".agents", "skills"], global: [home, ".gemini", "skills"] },
  { id: "windsurf", label: "Windsurf", project: [".windsurf", "skills"], global: [home, ".codeium", "windsurf", "skills"] },
  { id: "antigravity", label: "Antigravity", project: [".agents", "skills"], global: [home, ".gemini", "config", "skills"] },
];

export function targetRoot(agent, scope, projectRoot = process.cwd()) {
  return scope === "global"
    ? path.resolve(...agent.global)
    : path.resolve(projectRoot, ...agent.project);
}
