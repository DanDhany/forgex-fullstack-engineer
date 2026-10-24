# Agent compatibility

For GitHub installation, the README recommends the maintained [Skills CLI](https://github.com/vercel-labs/skills), which has its own current agent registry and path mappings. The table below documents the default mappings in ForgeX's bundled TUI installer only; those mappings are not a complete or guaranteed list for the Skills CLI.

The installer maps the single skill to these common directories. Verify current official docs for the installed version of each agent. A compatible directory does not guarantee identical invocation syntax or tool access.

| Agent | Project path | Global path |
|---|---|---|
| Codex | `.agents/skills` | `~/.agents/skills` |
| OpenCode | `.agents/skills` | `~/.agents/skills` |
| Claude Code | `.claude/skills` | `~/.claude/skills` |
| Cursor | `.agents/skills` | `~/.cursor/skills` |
| GitHub Copilot | `.github/skills` | `~/.copilot/skills` |
| Gemini CLI | `.agents/skills` | `~/.gemini/skills` |
| Windsurf | `.windsurf/skills` | `~/.codeium/windsurf/skills` |
| Antigravity | `.agent/skills` | `~/.gemini/antigravity/global_skills` |

The installer only copies a portable `SKILL.md` plus its local reference files. It does not configure browser tools, MCP servers, or external frameworks.
