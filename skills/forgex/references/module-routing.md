# ForgeX Modular Routing Matrix

This file is the routing index for the single ForgeX skill. These are internal reference modules, not independently installed skills. Load only the modules relevant to the task.

## Global invariants

Always apply the core skill's Git safety, evidence-first reporting, project-context recovery, and security constraints. The core skill wins if a module conflicts with it. Security, privacy, data integrity, and user-owned work are hard constraints. Do not invoke a workflow simply because it exists.

## Task routing

| Request / detected work | Required reference modules | Add when relevant |
|---|---|---|
| Any non-trivial engineering task | `evidence-first-engineering.md`, `quality-gates.md` | `session-handoff.md` |
| New feature spanning UI/API/data | `modules/fullstack-feature.md`, `cross-stack-contracts.md`, `modules/spec-planning-tdd.md` | `modules/docs-freshness.md`, `modules/visual-qa.md`, `modules/skill-security.md` |
| UI, landing page, dashboard, interaction, visual polish | `ui-ux-craft.md`, `modules/impeccable-design-critique.md`, `modules/taste-art-direction.md`, `modules/design-review.md` | `copywriting.md`, `modules/humanizer.md`, `modules/interaction-motion-craft.md`, `modules/visual-qa.md`, `modules/gstack-style-qa.md` |
| User-facing copy, docs prose, onboarding, errors | `copywriting.md`, `modules/humanizer.md` | `project-documentation.md` |
| Laravel/PHP implementation | `docs-and-laravel.md`, `modules/docs-freshness.md` | `modules/laravel-boost-integration.md` only if Boost is actually installed/configured |
| Framework/API changes or version-sensitive behavior | `modules/docs-freshness.md` | `modules/context7-docs.md` only if Context7 is configured; otherwise use official docs |
| Bug, regression, unexplained behavior | `modules/spec-planning-tdd.md`, `modules/fullstack-feature.md` | `modules/visual-qa.md`, `modules/gstack-style-qa.md`, `testing-and-browser-qa.md` |
| Security, auth, permissions, secrets, payments, personal data | `security.md`, `modules/skill-security.md`, `quality-gates.md` | `modules/spec-planning-tdd.md`, `testing-and-browser-qa.md` |
| Browser/responsive/interaction QA | `testing-and-browser-qa.md`, `modules/visual-qa.md` | `modules/gstack-style-qa.md` if its runtime is available |
| Recent community/trend research | `modules/last30days-research.md` | Official documentation for correctness; social research is not a substitute |
| Inspect or install a third-party skill | `modules/skill-security.md`, `evidence-first-engineering.md` | External scanner such as SkillSpector only if installed |
| Video generation/editing project | First identify the actual video requirement | `upstream-references.md` for Remotion/HyperFrames; do not load for ordinary app work |
| Resume work in a new session | `session-handoff.md` | Validate WORK-STATE.md against repository state |

## Selection algorithm

1. Identify task outcome and risk from the user's request and repository evidence.
2. Inspect the stack and versions before selecting framework-specific guidance.
3. Select the smallest sufficient module set; load dependencies only when they change the solution or verification.
4. For cross-stack changes, ensure UI, API, authorization, validation, domain logic, database, tests, and docs remain consistent.
5. For substantial UI changes, run product-aware art direction, implementation, rendered critique, correction, and re-verification when tools allow.
6. For risky changes, add security and failure-path checks proportionate to impact.
7. If a referenced tool is not installed or available, do not pretend to have used it; follow the best available fallback and report the limitation.
8. Stop loading modules when additional guidance no longer changes implementation, risk handling, or verification.

## Conflict resolution

1. User intent and explicit constraints, subject to safety and platform policy.
2. Repository facts, architecture, contracts, and project-specific instructions.
3. ForgeX core safety/evidence invariants.
4. Domain module guidance.
5. Optional third-party tool recommendations.

If two modules genuinely conflict, follow this order, document the conflict if material, and avoid combining incompatible workflows (for example, two competing browser drivers) without a reason.
