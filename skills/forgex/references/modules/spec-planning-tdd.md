# Specification, planning, and TDD

This is an original ForgeX workflow inspired by established agent-engineering practices. It does not reproduce Superpowers source files or commands.

## 1. Understand and specify

- Read repository instructions, existing architecture, manifests, and related code/tests.
- State the user's goal, observable behavior, constraints, out-of-scope items, and acceptance criteria.
- Identify ambiguous decisions that would materially change the implementation. Ask concise clarifying questions when needed; otherwise document reasonable assumptions.
- Include negative cases, permission boundaries, empty/error states, and backward compatibility.

## 2. Plan before changing code

For non-trivial work, write a concise plan with small, verifiable tasks. Each task should identify:
- Intended behavior and files/components likely involved.
- Dependencies and API/data contracts.
- Tests that prove the behavior.
- Documentation or migration work.
- Risks and rollback considerations.

Prefer the repository's existing plan location. Do not create excessive planning files for a tiny change.

## 3. Test-driven development

For each behavior where practical:
1. Add a test that demonstrates the missing or incorrect behavior.
2. Run it and confirm it fails for the intended reason.
3. Implement the smallest change that makes the test pass.
4. Run the focused test.
5. Refactor without changing behavior, then rerun relevant tests.

Do not fabricate a failing-test result. If the test harness is unavailable, explain the limitation and use the strongest available verification.

## 4. Keep the change controlled

- Follow local conventions and avoid unrelated refactors.
- Do not create speculative abstractions or generalize beyond the requirement.
- Preserve existing user changes and inspect `git status` before risky operations.
- Use an isolated worktree only when supported and appropriate; never overwrite or discard the user's work.

## 5. Review and finish

- Run relevant tests, linter, type checker, and build.
- Review the diff for missing error cases, security gaps, accidental secrets, stale mocks, and scope creep.
- Update docs and examples that are now inaccurate.
- Report tests run, results, skipped checks, changed files, and residual risks.

## Completion gate

A plan is not implementation. A passing unit test is not proof that all integration paths work. State separately what was implemented, what was tested, and what remains unverified.
