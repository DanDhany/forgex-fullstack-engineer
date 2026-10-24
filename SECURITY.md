# Security Policy

The installer uses Node.js built-ins and does not execute shell commands or copied skill scripts. It skips existing skill directories instead of silently overwriting them.

Skill files are instructions read by AI agents and may influence agents with access to source code, tools, and secrets. Review skill content before use. For third-party skills, inspect provenance, license, scripts, network access, secret handling, and destructive actions. An optional scanner such as NVIDIA SkillSpector can provide additional signal, but no scanner proves a skill safe.

Report security issues privately to repository maintainers after a security contact is configured.
