# Changelog

## 1.1.1 — Independent naming and metadata cleanup

- Removed third-party skill/tool names from the active skill instructions and user-facing README.
- Replaced named integration references with capability-based wording for documentation lookup and framework-specific tooling.
- Kept optional integrations conditional: ForgeX uses them only when already available and relevant; it does not bundle them.
- Aligned package and skill metadata to version 1.1.1.
## 1.1.0 — 2026-10-24

- Clarified explicit skill invocation per host: `$forgex` for Codex; slash invocation only where the host supports it.
- Configured Codex skill metadata to disable implicit invocation, making ForgeX intentionally explicit when many skills are installed.
- Updated installer help and post-install instructions to state the correct invocation syntax and avoid promising a universal `/forgex` command.
- Kept the bundled installer GitHub-only: it fetches `skills/forgex` from the repository default branch, validates `name: forgex`, and does not fall back to local files.
- Added regression coverage for explicit invocation metadata.

## 1.0.9 — 2026-10-24

- Renamed the installable skill to `forgex` for clearer explicit invocation.
- Added Codex UI metadata in `agents/openai.yaml` and documented `$forgex`; slash syntax varies by host agent.
- Updated the bundled installer to fetch only the canonical skill and references from the public GitHub repository, validating the skill name and bounding downloaded files.
- Added tests for remote source filtering and fail-closed behavior.
- Updated README installation examples to use the GitHub repository source.


## 1.0.8 — 2026-10-24

- Removed third-party skill/repository name-drops from user-facing guidance and the public README to keep ForgeX's positioning independent and avoid implying affiliation.
- Rewrote UI/UX and copywriting attribution passages as original, actionable ForgeX procedures.
- Removed the external-source catalogue; retained only factual mentions of optional integrations that users may install separately.
- Synchronized package and skill metadata to version 1.0.8.

## 1.0.7 — 2026-10-24

- Added direct install instructions for the Vercel Skills CLI using the GitHub source `DanDhany/forgex-fullstack-engineer`.
- Documented project-local, global, agent-specific, and list-only install commands, plus update/list/check troubleshooting commands.
- Clarified that GitHub-based Skills CLI installation does not require publishing a separate npm package and that commands become usable after the repository is publicly available at the documented URL.
- Synchronized the skill frontmatter, npm package metadata, repository URLs, and changelog version to 1.0.7.

## 1.0.6 — 2026-10-24

- Rebuilt the README with a custom SVG hero, clearer value proposition, scannable feature sections, stack and agent compatibility tables, installation steps, workflow diagram, project-memory guide, and contribution/security links.
- Improved GitHub discovery copy with natural search terms around AI coding-agent skills, full-stack development, UI/UX, project documentation, and session handoff without keyword stuffing or unverified popularity claims.
- Added a visual asset that renders directly in the repository README.

## 1.0.5 — 2026-10-24

- Added token-efficient session handoff rules so replacement agents can resume from a single in-place `WORK-STATE.md` or existing equivalent.
- Required Git initialization detection and safe inspection of uncommitted changes before editing; skip Git commands when the repository is not initialized.
- Added a user-documentation requirement for every new user-facing module, favoring updates to the existing manual/help structure over scattered files.
- Added explicit end-of-task state persistence: progress, files/modules, decisions, actual verification, blockers, dirty Git state, and the next concrete action.
- Updated the README, main skill, documentation guidance, and quality gates.

## 1.0.4 — 2026-10-24

- Added a project source-of-truth and change-tracking workflow for `product.md`, `system.md`, `design.md`, `stack.md`, `database.md`, and `agent.md`.
- Clarified that these documents are a purposeful baseline for tracked prototypes, not files to generate automatically for every task.
- Added rules to inspect and reuse existing documentation, update only affected docs, resolve conflicts against code/tests/schemas, and avoid redundant Markdown artifacts.
- Updated README, main skill instructions, documentation guidance, and quality gates.

## 1.0.3 — 2026-10-24

- Reworked the UI/UX reference into a concrete anti-slop workflow: inspect product context, state a design thesis, deliberately choose variance/density/motion, implement, then audit, critique, polish, distill, and harden.
- Added specific warning signs for generic AI-generated interfaces and required product-specific rationale for visual choices.
- Expanded motion guidance to cover purpose, properties, duration/easing, interruption, exit behavior, and reduced-motion preferences.
- Strengthened responsive, light/dark, reusable-component, interaction-state, and evidence-based visual QA acceptance gates.
- Updated the main skill and quality-gate documents to require fixing high-impact critique findings instead of producing unused checklists.
- Clarified that external tools and browser runtimes are not bundled and must not be claimed as executed unless actually used.

## 1.0.2 — Documentation and writing style

- Reworked the README and contributor guidance to make setup, scope, stack support, and tool limits easier to understand.
- Added a documentation style guide focused on plain language, accuracy, and reader-oriented editing.
- Strengthened the copywriting reference: preserve meaning and technical details, remove filler and formulaic phrasing, and never invent claims.
- Kept the project as one all-in-one skill with locally maintained writing guidance.

## 1.0.1 — Responsive UI and themes

- Made mobile, tablet, and desktop responsiveness a requirement for UI components and pages.
- Required light and dark theme support for new or modified components.
- Added guidance to reuse shared components and semantic design tokens.
- Expanded UI quality gates and reporting to include themes, viewports, and component reuse.

## 1.0.0 — Initial all-in-one release

- Added one `fullstack-engineer` orchestrator skill with conditional reference files.
- Added UI/UX guidance and explicit frontend/backend contract checks.
- Added planning/TDD, browser QA, documentation/versioning, security, and framework-specific tooling guidance.
- Added a multi-agent terminal installer with preview, conservative conflict handling, and manifest-based uninstall.
