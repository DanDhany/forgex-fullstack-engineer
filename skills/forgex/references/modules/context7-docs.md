# Context7 and version-aware documentation

This is an original ForgeX workflow for using documentation retrieval tools. It does not bundle the Context7 service or client.

## Workflow

1. Inspect the repository's manifests and lockfiles first. Record exact versions and runtime constraints.
2. Check whether Context7 is configured for the active agent and available in the current session.
3. Resolve the correct library/project identity before requesting docs. Avoid ambiguous package names.
4. Request documentation for the installed major/minor version when supported. Focus on the API, configuration, migration, or behavior being changed.
5. Cross-check important claims against official version-specific documentation, release notes, or source at the matching tag.
6. Apply the documented API and write tests against the project's actual dependencies.
7. If Context7 is not available, do not pretend it was used. Use official docs or clearly report the blocker.
8. Do not upgrade dependencies just because documentation for a newer version is easier to find.

## Context7 references

- Website: https://context7.com/
- Repository: https://github.com/upstash/context7

Follow the current official setup instructions for the selected agent. Setup commands and configuration formats can change, so verify them rather than copying stale commands from this skill.

## Completion criteria

The API/configuration choice is grounded in documentation matching the project's version, and the final report distinguishes retrieved evidence from assumptions.
