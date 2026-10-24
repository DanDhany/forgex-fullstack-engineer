# Quality gates

ForgeX scales verification to the risk of the change. Use the checks below as acceptance criteria, not as a report template to fill with unverified claims.

## UI/UX acceptance

For substantial UI work, write a short design thesis before coding: audience/task, visual character, hierarchy, layout, density, motion, and mobile behavior. Inspect the current product and design system before proposing a new one.

- [ ] The visual direction fits this product rather than a generic AI-generated template.
- [ ] Mobile, tablet, and desktop behavior has been checked, or unverified sizes are named.
- [ ] Light and dark themes have been checked, or the limitation is named.
- [ ] Existing reusable components and semantic design tokens were reused/extended where appropriate.
- [ ] Applicable loading, empty, error, success, disabled, focus, selected, and permission states work.
- [ ] Keyboard, touch, contrast, reduced motion, long content, and overflow were considered.
- [ ] Motion has a clear purpose; decorative animation was removed.
- [ ] Real backend data and errors are represented accurately.
- [ ] A focused audit/critique/polish pass was performed and high-impact findings were fixed.
- [ ] Browser/screenshot claims are backed by actual tool output; otherwise visual QA is marked not verified.

Suggested viewport samples: 390×844, 768×1024, and 1440×900. These do not guarantee every device works.

## Cross-stack acceptance

- [ ] UI → request/client → API → validation → service/domain → database → response → UI states were traced.
- [ ] Request/response/error contracts and types are aligned.
- [ ] Server-side validation and authorization are enforced.
- [ ] Stale mocks, fake success, hardcoded production data, and swallowed errors are absent.
- [ ] Relevant contract/integration tests and failure-path checks were run where available.

## Security and data integrity

- [ ] Permissions, ownership, validation, and sensitive logging were reviewed.
- [ ] Transactions, retries, idempotency, and concurrency were addressed where relevant.
- [ ] Tests avoid destructive actions against production data.

## Documentation and report

- [ ] Every new user-facing module/substantial feature has a practical user guide or a clearly updated section in the existing manual.
- [ ] User documentation reflects behavior/setup/API changes, access/permissions, steps, errors/recovery, and limitations where relevant.
- [ ] Writing is direct, natural, and factual; technical details and caveats remain intact.
- [ ] Final report lists actual tests, build/lint/type checks, browser evidence, blocked checks, and remaining risks.

## Project context and change tracking

- [ ] For a new prototype that needs tracked decisions, a canonical documentation baseline exists or the existing equivalent files are mapped.
- [ ] `product.md`, `system.md`, `design.md`, `stack.md`, `database.md`, and `agent.md` are created only when useful and not already represented by existing project docs/conventions.
- [ ] Each non-trivial change updates only the documents affected by changed behavior, architecture, design, stack, data, or agent workflow.
- [ ] Markdown agrees with code, migrations, tests, lockfiles, and API schemas; conflicts are called out rather than hidden.
- [ ] No redundant plans/notes/implementation docs were created merely to make the task look documented.
- [ ] The final report names changed documents and why, or explicitly says no documentation change was needed.
- [ ] If Git is initialized, the initial dirty/uncommitted state and relevant diffs were inspected safely; no existing user changes were overwritten. If Git is not initialized, Git commands were skipped.
- [ ] The existing project handoff/state file was read and updated in place for meaningful work; the next agent has exact status, verification, blockers, Git state, and a prioritized next action.
- [ ] No duplicate handoff or session-specific Markdown files were created when an established handoff file already exists.
