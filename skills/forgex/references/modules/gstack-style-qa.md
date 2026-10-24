# Browser and functional QA

This original ForgeX workflow is inspired by public QA practices. It is not a copy of gstack and does not provide its browser runtime.

## Choose the right depth

- **Smoke:** check the route loads, primary navigation works, and the main changed action succeeds.
- **Regression:** test the changed flow and adjacent behavior likely to be affected.
- **Full:** systematically explore the relevant application area, including failure states, permissions, and responsive behavior.

Use the smallest depth that satisfies the request, but do not label a smoke test as a full QA pass.

## QA process

1. Inspect `git diff`, the user request, routes, API contracts, and existing test setup.
2. Choose test cases based on changed behavior and risk.
3. Start the application using repository instructions; confirm it is actually ready.
4. Test through the real UI or the documented API/CLI/worker surface. Prefer isolated test data.
5. Reproduce failures before fixing them. Record steps, expected/actual results, and relevant console/network evidence.
6. For browser checks, inspect mobile, tablet, and desktop layouts where viewport control is available.
7. Capture screenshots only when the browser tool actually supports and returns them. Do not invent screenshot paths.
8. Fix root causes, then rerun the failed test and nearby regression cases.
9. Check whether docs, tests, and expected error behavior need updates.
10. Report PASS, FAIL, BLOCKED, and NOT RUN distinctly.

## Browser and session safety

- Use the least-privileged browser session appropriate for the task.
- Do not copy or expose cookies, tokens, private data, or credentials in reports.
- Avoid destructive production actions. Use staging/local environments and disposable test data.
- Never claim to have clicked, navigated, or captured a screenshot unless the tool performed that action.

## Final report

Include scope, tested routes/contracts, test depth, evidence, defects fixed, retest results, and limitations. If no browser tool exists, perform available automated tests and clearly mark browser QA as BLOCKED.
