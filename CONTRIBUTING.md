# Contributing

Keep ForgeX centered on one all-in-one skill. Add detailed procedures to `skills/forgex/references/` and load them only when relevant; do not add another skill unless the project's direction changes.

When contributing:

- Preserve the UI/UX-first workflow and cross-stack contract checks.
- Keep mobile, tablet, desktop, light theme, and dark theme in scope for affected UI.
- Prefer existing shared components and tokens over near-duplicate implementations.
- Keep user documentation aligned with the code and supported behavior.
- Write plainly. Remove filler and repeated claims, but keep prerequisites, limitations, commands, and important technical details.
- Do not claim a tool was used when it was unavailable.
- Check upstream licenses before copying third-party skills, scripts, or text. Link to upstream work when a reference is enough.
- Add or update tests for installer behavior and update the README and changelog when behavior changes.

Run the tests from the repository root before submitting a pull request:

```bash
npm test
```
