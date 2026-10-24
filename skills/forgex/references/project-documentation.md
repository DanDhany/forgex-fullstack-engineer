# Project source of truth and change tracking

Use this reference when bootstrapping a prototype, starting a new product, changing architecture/data contracts, or when the user asks to keep project decisions tracked. For cross-session transfer, also follow `references/session-handoff.md`. The goal is durable shared context—not Markdown for its own sake.

## Canonical project documents

For a new prototype or project that needs an explicit documentation baseline, use these six documents unless the repository already has an equivalent structure:

| File | Owns | Keep out of it |
|---|---|---|
| `product.md` | Problem, audience, value proposition, goals/non-goals, core user journeys, scope, acceptance criteria, current product decisions | Low-level implementation details and duplicated API schemas |
| `system.md` | System boundaries, architecture, major components, data/control flows, integrations, deployment topology, key trade-offs | Full stack inventory or exhaustive table definitions |
| `design.md` | Design principles, product visual direction, design tokens, typography, spacing, responsive behavior, light/dark themes, component patterns, accessibility and motion rules | A duplicate of every page/component implementation |
| `stack.md` | Languages, frameworks, runtime versions, package managers, key dependencies, environments, commands, conventions and version constraints | Architecture narrative that belongs in `system.md` |
| `database.md` | Entities, relationships, constraints, indexes, migrations, ownership/tenant boundaries, retention and data integrity rules | A stale manually copied schema when migrations/models can be referenced as the implementation source of truth |
| `agent.md` | Instructions for coding agents: repo conventions, workflow, test commands, documentation update policy, security constraints, definition of done | Product facts that should live in the canonical docs above |

Respect existing naming and conventions. If the project uses `AGENTS.md`, `README.md`, ADRs, OpenAPI, schema files, or framework-specific conventions, integrate with those instead of creating competing sources of truth. `agent.md` and `AGENTS.md` are not automatically interchangeable across tools; follow the repository's actual agent discovery rules.

## When to create the set

- **New prototype/new repository:** inspect first. If there is no equivalent documentation, create the six-file baseline when the user asks for a tracked prototype workflow or when durable product/system context is necessary to implement the request reliably.
- **Existing project:** never generate the six files blindly. Search for equivalent docs and established sources first. Propose a small mapping when the structure differs.
- **Small isolated fix/copy tweak:** do not create planning docs or rewrite the documentation set. Update only a relevant existing document if behavior or instructions changed.
- **Feature or architecture change:** update the specific documents whose facts or decisions changed, not all six by default.
- **Unclear or unapproved product decision:** record it as an open question or assumption; do not silently turn it into a confirmed requirement.

## Source-of-truth and conflict rules

1. Inspect current code, migrations, schemas, tests, manifests, and docs before editing.
2. Separate **intended behavior** (often `product.md`/`design.md`) from **implemented behavior** (code, tests, migrations, API schema). If they disagree, do not pretend they match: determine whether the implementation or the documentation is stale and report unresolved decisions.
3. Prefer executable/authoritative sources for facts that can drift: lockfiles for installed versions, migrations/schema for database structure, OpenAPI or code for API contracts, tests for asserted behavior. Document rationale and stable rules in Markdown and link to the authoritative source instead of copying volatile detail unnecessarily.
4. Keep each fact owned by one canonical document. Cross-link rather than duplicating long sections.
5. Preserve user edits and existing decisions. Do not replace whole documents when a targeted edit will do.

## Change-tracking workflow

For each non-trivial feature or decision:

1. Identify the user problem and acceptance criteria; update `product.md` if scope or user behavior changes.
2. Update `system.md` for boundaries, flows, integrations, or architectural trade-offs.
3. Update `design.md` when interaction patterns, visual language, responsive behavior, themes, or shared components change.
4. Update `stack.md` only when stack, versions, dependencies, runtime, commands, or conventions change.
5. Update `database.md` when entities, relationships, constraints, migrations, retention, or integrity rules change.
6. Update `agent.md` when repository instructions, quality gates, test commands, or agent workflows change.
7. Every new user-facing module or substantial feature must be documented with a practical usage guide. Prefer adding a section to the existing user manual/help docs and updating its index; create a separate guide only if it fits the project structure. Explain purpose, access/permissions, configuration, step-by-step workflows, important fields/validation, success/error states, limitations, and troubleshooting.
8. Update user-facing docs and API examples when users, operators, or integrators experience changed behavior.
9. Add/update an ADR or a concise decision log only when a meaningful decision needs its rationale and alternatives preserved. Do not create a new log file for every routine change.
10. Verify documentation against the actual implementation and tests. Mark planned/not implemented items explicitly.
11. In the final report, list the documents changed and why; say “no documentation change needed” when appropriate.

## Change history without document sprawl

Prefer the repository's existing Git history, pull requests, changelog, and ADR convention. Use `CHANGELOG.md` for meaningful user-visible/release changes, not every refactor. Use an ADR for durable architectural decisions with material trade-offs. Do not create `PLAN.md`, `NOTES.md`, `IMPLEMENTATION.md`, or timestamped Markdown files for every task unless the user or project convention explicitly requires them.

## Starter skeleton guidance

When asked to bootstrap the six files, create concise but useful documents with clear headings. Include:

- Status: `Draft`, `Current`, `Superseded`, or `Needs decision` where useful.
- Last verified date only if it can be set accurately.
- Open questions and assumptions, separated from confirmed facts.
- Links to related docs and authoritative code/schema/tests.
- Concrete acceptance criteria and verification commands where relevant.

Do not fill unknown sections with invented details. Use `TBD` or an explicit open question sparingly, and explain what evidence is needed to resolve it.
