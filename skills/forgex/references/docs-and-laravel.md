# Version-aware documentation and framework tooling

## General documentation

- Inspect manifests and lockfiles before choosing APIs.
- Prefer official docs for the exact installed version.
- Use a configured documentation lookup integration if available, resolving the exact library/version first.
- If no documentation lookup integration is available, use official versioned docs and state the limitation.
- Do not upgrade dependencies only to match a newer tutorial.


## Laravel

- Read `composer.json`, `composer.lock`, PHP version, Laravel version, and installed packages.
- Identify Blade, Livewire, Inertia, Tailwind, Pest, or other packages actually in use.
- Check the compatibility of installed Laravel-specific development tools against this project’s versions.
- If compatible tooling is already installed, use its package-aware guidance as documented.
- If no such tooling is installed, propose it only when it helps; do not silently change Composer dependencies.
- Avoid duplicating project-specific tooling guidance unnecessarily.


## Verification

Run the project's actual formatter, static analysis, tests, and build commands where available. Report commands that could not be run. Avoid assuming that a version-specific API exists based on a newer documentation page.

## Project documentation and change tracking

When the user is prototyping a new product or explicitly wants decisions tracked, follow `references/project-documentation.md`. Establish or map the project source of truth (`product.md`, `system.md`, `design.md`, `stack.md`, `database.md`, `agent.md`) after inspecting the repository. These are a purposeful baseline for product context, architecture, design, stack, data, and agent workflow—not mandatory new files for every change. Update only what changed; prefer existing equivalent docs and authoritative schemas/code over duplicate Markdown.


## Session continuity and module guides

Follow `references/session-handoff.md` for token-efficient agent handoffs, Git dirty-state checks, and the single in-place `WORK-STATE.md` (or existing equivalent). For every new user-facing module or substantial feature, update the existing user manual/help docs with practical usage steps, permissions/configuration, expected states, and troubleshooting. Prefer extending existing docs over scattering files.
