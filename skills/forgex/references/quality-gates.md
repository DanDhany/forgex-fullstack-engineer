# Quality gates

Use evidence appropriate to the risk. A small copy edit does not need a release ceremony; a new cross-stack feature or security-sensitive change does.

## Always

- Understand the request, repository conventions, installed dependencies, and versions.
- Inspect the diff and preserve unrelated user changes.
- Run relevant checks and report exact results honestly.
- Update user documentation when behavior, setup, configuration, or API contracts change.
- Keep writing clear, natural, factual, and suited to the reader. Preserve commands, identifiers, caveats, and source facts.

## UI changes

- Record a product-specific design thesis for substantial UI work; avoid generic template defaults without rationale.
- Verify mobile, tablet, and desktop, or state what remains unverified.
- Verify light and dark themes, or state what remains unverified.
- Reuse/extend existing components and semantic design tokens; avoid near-duplicates.
- Check relevant interaction states, keyboard/touch accessibility, real content, and natural copy.
- For motion, explain the purpose and verify reduced-motion behavior where applicable.
- Review the rendered result in a browser when tooling is available. A successful build alone is not visual QA.
- Remove decorative elements that do not improve comprehension, task completion, or product identity.

## Cross-stack changes

- Trace UI → request/client → API route → validation → service/domain → persistence → response → UI state.
- Keep request, response, error, and shared business rules aligned.
- Enforce validation and authorization on the server.
- Check stale mocks, hardcoded production data, mismatched types/schemas, and swallowed errors.
- Run integration/contract/build checks where available; test failure and duplicate/race cases when relevant.

## Security and data integrity

- Check permissions, ownership, and server-side validation.
- Review transactions, retries, idempotency, and concurrency where relevant.
- Protect secrets and sensitive data in logs and test artifacts.
- Avoid destructive tests against production data.

## Completion report

- **Implemented:** what changed and why.
- **Design decisions:** product-specific direction and key trade-offs.
- **UI verification:** responsive sizes, light/dark states, component reuse, and browser evidence—or what was blocked.
- **Contracts:** how frontend/backend consistency was checked.
- **Checks:** tests, build, lint, type checks actually run.
- **Documentation:** files updated.
- **Not verified:** skipped checks and remaining risks.
