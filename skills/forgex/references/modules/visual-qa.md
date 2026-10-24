# Visual QA workflow

## Preconditions

1. Read repository instructions and identify the actual run/build commands from manifests and docs.
2. Determine whether the browser automation tool is available. Prefer the project's existing Playwright setup; do not install packages without checking first.
3. Start the app using the repository's documented command. Wait for a real ready signal and report startup failures.

## Test the real product

Exercise the changed flow with real API responses where possible. Check:
- Navigation and direct URL entry.
- Loading, empty, populated, success, validation, permission, and server-error states as applicable.
- Forms, buttons, keyboard interaction, and focus.
- Console errors and failed network requests.
- Whether UI data matches API responses; flag mocked or hardcoded production data.

## Responsive passes

Use these viewport sizes when the tool supports viewport control:
- Mobile: 390 × 844
- Tablet: 768 × 1024
- Desktop: 1440 × 900

Inspect overflow, clipped controls, typography, spacing, sticky elements, modal fit, and touch targets. Use the exact screenshots and dimensions as evidence; do not claim screenshots exist if they were not captured.

## Fix-and-retest loop

1. Capture the failure and record reproduction steps.
2. Identify the root cause, not just the visual symptom.
3. Apply the smallest safe fix.
4. Repeat the original test and related regression tests.
5. Recheck console/network and responsive layouts.

## Reporting

Report tested URL/route, environment, viewport, scenarios, screenshots (if actually captured), console/network issues, fixes, retest result, and tests blocked by unavailable tools. If browser automation is unavailable, provide a manual QA checklist and state that no browser verification was performed.
