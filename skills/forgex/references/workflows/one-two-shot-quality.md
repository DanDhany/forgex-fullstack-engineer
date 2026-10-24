# High-Quality One- or Two-Shot Execution

The goal is to reduce avoidable follow-up prompts, not to promise perfection independent of model, repository, permissions, or tools.

## Default behavior

For an actionable request, infer routine implementation choices from repository evidence and proceed. Do not ask the user to restate common quality expectations. Ask at most one focused question when a missing decision materially changes scope, product identity, data semantics, safety, or an irreversible operation.

## One-shot task loop

1. Resolve intent, constraints, expected artifact, and acceptance criteria from the request.
2. Read handoff and project instructions; inspect Git state and relevant files.
3. Detect actual stack, versions, architecture, and available tools.
4. Select the smallest sufficient modules from `module-routing.md`.
5. Plan proportionally; for major UI work, establish a concrete art direction; for risky behavior, identify invariants and failure modes.
6. Implement a coherent end-to-end change, not an isolated happy-path mock.
7. Run relevant automated checks and real browser verification where available.
8. Fix observed failures and rerun the affected checks.
9. Review the diff, docs, security, responsive behavior, contracts, and unintentional changes.
10. Update handoff and report evidence, blockers, and remaining risks.

## When two-shot is better

Use a short discovery/specification pass followed by implementation when the work has high ambiguity, irreversible trade-offs, major architecture decisions, or a broad redesign. Present the smallest useful decision set; do not force an approval gate for routine low-risk tasks.

## Acceptance gate

A task is not complete merely because code was generated. Completion requires the relevant observable behavior, tests or justified alternatives, user-facing documentation where needed, and an honest report. Production readiness is a risk-based assessment, not a phrase to attach automatically.

## Evidence discipline

- Distinguish implemented, tested, inspected, inferred, and unverified.
- Record exact test commands and actual outcomes.
- Never fabricate screenshots, tool availability, tests, benchmarks, security scans, or compatibility.
- If a required environment/tool is unavailable, finish the strongest safe subset and state the precise limitation.
