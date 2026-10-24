# Laravel Boost integration

This is an original ForgeX integration workflow. It does not bundle or replace Laravel Boost's code or skills.

## 1. Detect the actual project

1. Inspect `composer.json`, `composer.lock`, `artisan`, Laravel version, PHP version, and installed packages.
2. Identify whether the project uses Blade, Livewire, Inertia React/Vue/Svelte, Tailwind CSS, Pest, Flux UI, or other relevant packages.
3. Read repository instructions and existing conventions before changing architecture.
4. Do not assume a Laravel major version or install Boost blindly.

## 2. Check official Boost guidance

- Consult the official Laravel Boost documentation matching the project's Laravel version.
- Official starting points:
  - https://github.com/laravel/boost
  - https://laravel.com/docs/12.x/boost
  - https://laravel.com/docs/13.x/boost
- Confirm compatibility and installation instructions against the project's exact version before executing commands.
- If Boost is installed, inspect its current status and use its available tools/resources as documented.
- If it is not installed and is appropriate, explain the benefit and proposed installation command first. Do not silently modify dependencies.

## 3. Prefer Boost's package-aware skills

When Boost is configured, use the skills and conventions it provides for the packages actually present. Do not duplicate its package-specific advice in a second broad Laravel skill unless a project-specific gap remains.

Potential areas include inferred conventions, Livewire, Inertia, Tailwind CSS, Pest, Wayfinder, Pennant, and other supported packages. The exact set depends on the Boost release and project dependencies.

## 4. Combine with ForgeX workflows

- Use `fullstack-feature` for end-to-end implementation and contract consistency.
- Use `ui-ux-craft` and `design-review` for product design decisions.
- Use `visual-qa` for rendered browser verification when available.
- Use `docs-freshness` to check version-specific APIs and official documentation.
- Use `humanizer` for accurate, natural interface copy.

## 5. Verify

Run project-defined formatting, static analysis, tests, and build commands where available. Report what was actually executed. Never claim Boost or browser tools were used if they were unavailable.

## Safety and boundaries

- Do not run commands copied from an unverified page without reviewing them.
- Do not upgrade Laravel or packages solely to make an example work.
- Do not override project conventions without a clear reason.
- Treat Boost as a complementary Laravel-specific toolset, not a replacement for tests, code review, or security controls.
