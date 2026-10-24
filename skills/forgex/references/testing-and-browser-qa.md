# Testing and browser QA

## Test depth

- Smoke: route loads and primary changed action works.
- Regression: changed flow plus adjacent behavior likely to break.
- Full: relevant area explored across roles, error states, and responsive behavior.

Do not label smoke tests as full QA.

## Test-first loop

For behavior changes where practical:
1. Add a test that fails for the intended reason.
2. Run and inspect the failure.
3. Implement the smallest fix.
4. Rerun the focused test.
5. Run nearby regressions and broader checks.

## Browser loop

When browser automation/control is available:
1. Start the app with the repository's real command.
2. Test the actual rendered UI and real API behavior.
3. Exercise success, invalid input, empty, loading, permission, and server-error states as relevant.
4. Inspect console and network failures.
5. Check mobile/tablet/desktop.
6. Capture actual screenshots only when the tool returns them.
7. Reproduce → fix root cause → retest → check adjacent regressions.

Never use production destructive actions as test cases. Never copy tokens/cookies or sensitive data into QA reports.

If browser tooling is unavailable, say so and provide manual test steps; do not pretend a screenshot or browser session exists.
