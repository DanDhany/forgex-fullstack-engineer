# Version-matched documentation workflow

1. Inspect manifests and lockfiles before searching: package.json, composer.json, lockfiles, pyproject.toml, requirements files, and framework config.
2. Record the exact installed versions and relevant runtime versions. Do not assume the newest major version is in use.
3. Prefer official documentation for the matching version. If unavailable, use official migration guides/release notes and clearly note the version gap.
4. If a docs connector such as Context7 is configured, resolve the library and request the version-matched documentation. Otherwise use official documentation directly.
5. Cross-check breaking changes and deprecations before using an API.
6. Do not invent API names, config keys, CLI flags, or package versions.
7. Cite or link the sources used in the final report when the environment supports it.
8. If sources disagree, prioritize official version-specific docs and explain uncertainty.
9. Keep implementation aligned with the repository's actual dependency versions; do not upgrade dependencies merely to follow a newer tutorial.

## Done when

The chosen API/configuration is supported by the installed version, any version uncertainty is explicit, and relevant tests are run.
