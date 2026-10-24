# Evidence-first engineering

Use this protocol for code, configuration, API, database, security, deployment, and non-trivial debugging tasks. Scale it down for trivial text-only edits.

## Establish what is true

- Inspect the actual files, manifests, lockfiles, schemas, tests, and relevant tool output before making repository-specific claims.
- Treat documentation as intended behavior and code/tests/runtime evidence as evidence of current behavior. Neither source is automatically complete.
- Use exact paths, identifiers, versions, and command names only when observed in the repository or verified documentation.
- Separate **observed**, **inferred**, **assumed**, and **unknown** facts when that distinction affects a decision. Do not present an inference as a verified fact.
- If a requested file or symbol cannot be found, report the search scope and broaden the search before concluding it does not exist.

## Change with a falsifiable plan

- State the intended behavior and the smallest relevant change before editing non-trivial code.
- Find the root cause and a test or observable behavior that can distinguish a fix from a guess.
- Reuse existing conventions and contracts. Do not invent an API, schema, config key, dependency, or abstraction to fill an information gap.
- If missing information materially changes correctness, ask one focused question or choose a clearly labeled reversible assumption.

## Verify, do not narrate

- Run the most targeted test/check first, then relevant regression checks.
- Capture actual exit status and meaningful output. A command being suggested, attempted, or written in a plan is not evidence that it passed.
- If a command is unavailable, blocked, times out, or fails, report that exact status and do not imply the check passed.
- Never fabricate screenshots, browser observations, logs, test counts, build results, or tool calls.
- After edits, inspect the diff for unintended changes and confirm the intended behavior with the strongest available evidence.

## Completion language

Use precise status labels:

- **Implemented:** code/config/documentation was changed.
- **Tested:** a named test/check actually ran; include its real result.
- **Verified:** the specific claim is supported by observed evidence.
- **Unverified/blocked:** evidence could not be obtained; explain why.

Do not equate “implemented” with “tested,” or “tested” with “correct in all cases.” Never report a green status if any required check failed or was not run.

## Recovery from errors

1. Preserve the original error output.
2. Identify whether it is caused by the change, environment, dependency, or an unrelated existing issue.
3. Make one reasoned correction at a time.
4. Rerun the failed check and relevant regressions.
5. If still blocked, stop and report what remains unknown instead of looping blindly.
