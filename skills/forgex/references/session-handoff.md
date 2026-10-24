# Session handoff and token-efficient continuity

Use this workflow when work may continue across sessions, agents, model providers, or token limits. The goal is to transfer a compact, trustworthy working memory so the next agent can continue rather than re-discover the whole codebase.

## 1. Recover before exploring

At the start of a session/task, in this order:

1. Detect whether Git is initialized (`git rev-parse --is-inside-work-tree`). If yes, immediately inspect `git status --short --branch`, then staged/unstaged diff summaries and relevant diffs. If no, skip all Git commands and do not attempt to initialize Git unless explicitly asked.
2. Read the existing handoff file if present. Preferred lookup order: `WORK-STATE.md`, `HANDOFF.md`, `CURRENT-STATE.md`, then an established project-specific equivalent. If more than one exists, identify the authoritative one from `agent.md`/`AGENTS.md`/README and do not silently create another.
3. Read `agent.md`/`AGENTS.md` and only the canonical docs relevant to the active task.
4. Verify the handoff's claimed current state against the relevant code, tests, migrations/schema, API contracts, and Git diff. Treat the handoff as a navigation aid, not unquestionable truth.
5. Explore broader code only if the handoff is missing, stale, contradicted, or the task crosses boundaries it does not cover.

Do not dump or summarize the whole repository merely to appear thorough. Use filenames, symbols, routes, tests, schemas, and commands identified in the handoff to focus inspection. Never skip necessary verification for security-sensitive, data-destructive, payment, auth, concurrency, or cross-stack changes.

## 2. Git and uncommitted work safety

When Git is initialized, capture at least:

- branch and concise status (`git status --short --branch`);
- whether there are staged, unstaged, and untracked changes;
- relevant changed paths and `git diff --stat` / `git diff --cached --stat`;
- whether a relevant change was already present before this task or made during this task, when known.

Inspect the actual diff before touching a file that already has local modifications. Preserve user work. Never automatically commit, stash, reset, clean, discard, or overwrite changes unless explicitly requested. Do not claim a change is committed unless Git proves it. If Git is absent, say that Git-state tracking was skipped and rely on file/doc state.

## 3. Keep one concise project handoff

Default to one root file named `WORK-STATE.md` if the project has no existing equivalent. Do not create a fresh timestamped handoff every session. Keep it short enough to scan quickly and update it in place. Suggested structure:

```markdown
# Work State / Agent Handoff

> Updated: YYYY-MM-DD (only if known accurately)
> Status: In progress | Blocked | Ready for verification

## Current goal
One or two sentences describing the active feature/outcome.

## Current state
- Done: verified outcomes only.
- In progress: exact unfinished behavior/files.
- Not started: agreed scope still remaining.

## Important decisions
- Decision — reason and any constraints. Link to canonical docs/ADR when applicable.

## Files and modules
- `path`: what it owns and what changed/needs changing.

## Verification
- Commands actually run and results; include failures.
- Browser/visual checks only if actually performed.

## Git state (if initialized)
- Branch, pre-existing dirty/untracked changes, relevant diff summary; no secrets or full diff dump.

## Blockers and risks
- Concrete issue, evidence, and what is needed to resolve it.

## Next actions (ordered)
1. The single best next action, with target files/commands and expected result.
2. Follow-up action.

## Resume prompt
A short copy-pastable instruction telling the next agent where to start, what to read, what not to redo, and what must be verified.
```

Do not fill sections with invented information. Omit irrelevant sections or write `None known`. Never include credentials, tokens, private keys, personal data, or large logs. Prefer links and short evidence over copied code.

## 4. Update it at the end of a task

After a meaningful coding/prototyping task, update the same handoff file with:

- what actually changed and the module/paths touched;
- the current implementation status, not just the original plan;
- decisions made and assumptions still open;
- tests/build/lint/browser checks actually run and their outcomes;
- known failures, missing pieces, and risks;
- docs/user guides updated;
- current uncommitted Git state, including changes that were already present when the task started when known;
- a prioritized next action that another agent can execute without asking the user to restate context.

If token exhaustion is likely, update the handoff before long explorations or large changes as well as at the end. Keep progress incremental so a forced session switch does not lose the last useful state. Do not write secrets or dump entire diffs.

## 5. User documentation for every new module

Every newly developed user-facing module or substantial feature must have usable documentation explaining:

- what the module does and who it is for;
- prerequisites, permissions/roles, and configuration;
- how to reach or enable it;
- step-by-step usage for primary workflows;
- field/input explanations and validation rules users need to know;
- success, error, empty, loading, and recovery behavior where relevant;
- screenshots or diagrams only when genuinely captured/maintained and useful;
- limitations, permissions, and troubleshooting;
- a small example of a complete workflow where helpful.

First locate the project's existing user manual/help center/README/docs convention and add the module section there. Create a separate module guide only when the project's information architecture warrants it. Do not scatter a new `HOW-TO-*.md` file for every small subfeature. Update the index/navigation and relevant screenshots when needed. Document actual implemented behavior; label planned behavior clearly.

After each change, decide which docs are impacted: project source-of-truth docs (`product.md`, `system.md`, `design.md`, `stack.md`, `database.md`, `agent.md` or equivalents), module/user guide, API/operations docs, and changelog when the change is release-significant. Update only those affected.

## 6. Final response for easy transfer

Finish with a concise status summary: completed, not completed, checks run, files/docs changed, Git dirty state if applicable, blockers, and the exact next action. Ensure the handoff file says the same thing. Avoid vague endings such as “continue development” or “test more”; name the module, behavior, files, and command/scenario.
