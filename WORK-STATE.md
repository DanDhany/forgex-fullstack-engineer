# WORK-STATE — ForgeX Website v1.2.1

## Objective
Expose the public sources and design references informing ForgeX directly on the landing page, not only in the README.

## Changes
- Added a visible `#references` section to `site/index.html`.
- Added direct links and short descriptions for Impeccable, Taste-Skill, Emil Kowalski skills, Linear, Stripe Design, Vercel Geist, Jeffallan/claude-skills, Superpowers, gstack, Humanizer, Laravel Boost, Context7, and NVIDIA SkillSpector.
- Added desktop, mobile, and footer navigation links to the reference section.
- Added responsive, theme-aware styles in `site/css/style.css`.
- Added tests for source links, attribution disclaimer, navigation, and responsive styles.
- Documented the visible reference library in `site/README.md`.
- Bumped the website package version to 1.2.1. The ForgeX skill itself remains v1.2.0.

## Verification
- `npm test`: 13 tests passed, 0 failed.
- Attempted browser QA with Chromium, but the environment intercepted localhost with an organization-blocked page; resulting screenshots were discarded. The browser run is not valid visual verification. Static tests passed, but a clean browser QA run is still required in the user environment.

## Important scope notes
- This ZIP is the website package only; it does not replace the root ForgeX skill package.
- References inform selected principles and are not claimed to be bundled dependencies or endorsements. Optional integrations require their own installation and availability.
- No Git commit or push performed.

## Next step
Extract or merge the website changes into the repository's `site/` directory and publish via GitHub Pages.
