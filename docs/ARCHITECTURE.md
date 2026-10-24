# ForgeX Architecture (v1.2.0)

## Product contract

ForgeX is one user-facing skill and one installer target. `skills/forgex/SKILL.md` is the only installable skill entry point in this package. The files under `skills/forgex/references/` are conditional internal modules, not separate skills to install or invoke manually.

## Layers

1. **Entry point** — task triage, project inspection, execution policy, quality gates, truthful reporting.
2. **Routing index** — `skills/forgex/references/module-routing.md` maps task types to the smallest sufficient modules.
3. **Core references** — cross-stack contracts, UI/UX craft, testing/browser QA, security, handoff, documentation, evidence and quality gates.
4. **Specialist modules** — `skills/forgex/references/modules/` holds focused workflows synthesized and authored for ForgeX.
5. **Workflow recipes** — `skills/forgex/references/workflows/` defines high-quality one/two-shot execution patterns.
6. **Agent adapters and installer** — existing installer handles target paths; agent-specific invocation and capability differences remain documented in `docs/AGENT-COMPATIBILITY.md`.

## Routing lifecycle

Intent and constraints → repository evidence and versions → module selection → plan proportional to risk → implementation → relevant verification → diff/documentation review → handoff.

## Module precedence

Explicit user constraints and safety → repository/project instructions and actual contracts → ForgeX core invariants → specialized module → optional external-tool suggestion. If a tool is absent, use a documented fallback and report the limitation.

## Why not bundle every upstream skill?

Vendoring dozens of external skills creates licensing, stale-content, agent compatibility, prompt conflict, context cost, and maintenance risks. ForgeX keeps one coherent entry point and original focused modules. It may recommend optional upstream specialists when the task genuinely benefits and the user can choose to install them.
