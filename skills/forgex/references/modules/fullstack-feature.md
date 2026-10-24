# Full-stack feature workflow

## Goal

Deliver a coherent, tested feature across all affected layers. Do not stop after producing a plausible UI or a mocked API response.

## Workflow

1. **Map the repository.** Read project instructions, package manifests, lockfiles, existing architecture, routes, schemas, and tests before editing.
2. **Clarify behavior from context.** Identify user-visible states, roles/permissions, validation, loading, empty, success, and failure cases. Ask a focused question only if a critical product decision is missing.
3. **Trace the contract.** Follow the request from UI event through API/controller/service to database and back. Record endpoint, method, payload, response, error shape, auth, and side effects.
4. **Plan the smallest coherent change.** Identify files, migrations, backward compatibility, security implications, and acceptance tests before coding.
5. **Implement real behavior.** Connect UI to the actual backend contract. Never leave production code using hardcoded demo arrays, fake success responses, or TODO placeholders unless explicitly requested.
6. **Validate inputs and permissions.** Enforce critical rules server-side; do not rely only on client validation. Check authorization, ownership, mass assignment, injection, and secret handling.
7. **Test layers.** Add or update unit, integration, API, and UI tests as appropriate. Include failure cases and regression coverage.
8. **Run checks.** Execute relevant formatter, linter, type checker, test suite, and build. Report checks that could not be run.
9. **Inspect the actual UI.** For UI changes, use the `visual-qa` skill if a browser tool is available. Verify real data and interactions, not just a static screenshot.
10. **Update docs.** Keep user-facing documentation, API examples, configuration examples, and release notes aligned with behavior changes.
11. **Review the diff.** Look for unrelated edits, stale mocks, incomplete error states, missing migration rollback, and accidental secrets.

## Completion criteria

Do not claim completion until:
- The UI and backend contract agree.
- The feature has a meaningful success and error path.
- Relevant tests/builds have been run or explicitly marked not run.
- Documentation reflects changed behavior.
- Remaining limitations are stated plainly.

## Final report

Summarize behavior changed, key files, tests run and results, UI verification performed, documentation updated, and known risks. Never claim a test passed if it was not executed.
