# Interaction and Motion Craft (ForgeX-authored synthesis)

Inspired by public design-engineering and animation practices associated with Emil Kowalski: https://github.com/emilkowalski/skills. This file is independently authored and does not vendor upstream code or skills.

## Use when

A task changes interaction feedback, transitions, menus, dialogs, loading states, gesture-like behavior, or motion-heavy UI. Skip for backend-only tasks and avoid adding animation to a UI that does not benefit from it.

## Rules

- Motion should communicate cause/effect, hierarchy, continuity, or state—not fill empty space.
- Prefer short, coherent transitions and consistent easing over many competing animations.
- Animate properties that remain performant; avoid expensive layout/repaint effects when practical.
- Keep hover, focus, active, disabled, loading, success, and error states coherent.
- Respect `prefers-reduced-motion`; essential information must not depend on animation.
- Do not block user input with decorative transitions.
- Check motion on lower-powered/mobile contexts and ensure it does not cause layout shift or accessibility issues.
- Use CSS or existing project tooling first. Do not add animation libraries unless they materially help the requirement.

## Verification

Inspect the interaction in a real browser where possible. Test keyboard navigation and reduced-motion behavior. If browser tooling is unavailable, report that limitation instead of claiming motion QA passed.
