# Upstream References, Attribution, and Integration Policy

ForgeX is a single-entry-point skill. Its internal modules are original ForgeX-authored workflows and summaries. This package does not vendor complete third-party skill repositories or claim ownership of them. Check upstream repositories and licenses again before importing code or skill text; branches and licenses can change.

## Architecture and full-stack orchestration

- [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills) — inspiration for context-aware activation, specialist domains, workflows, and progressive disclosure. The upstream project is MIT-licensed; ForgeX does not copy its full skill corpus.
- [obra/superpowers](https://github.com/obra/superpowers) — workflow inspiration for brainstorming, planning, TDD, debugging, and verification. ForgeX's workflow summaries are independently authored; Superpowers itself is not bundled.
- [mattpocock/skills](https://github.com/mattpocock/skills) — optional codebase architecture and engineering guidance; not bundled as source.
- [wshobson/agents](https://github.com/wshobson/agents) — optional specialist-agent patterns; not bundled as source.

## UI/UX, design, motion, and writing

- [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — UI/design critique and design-system craft. ForgeX includes original `impeccable-design-critique.md` and product-aware UI workflow guidance, not a verbatim copy. Check current license and attribution before redistributing upstream files.
- [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — visual direction, variety, and anti-generic frontend patterns. ForgeX includes an original `taste-art-direction.md` synthesis and does not vendor its source.
- [emilkowalski/skills](https://github.com/emilkowalski/skills) — interaction/motion polish and design engineering. ForgeX includes an original `interaction-motion-craft.md` synthesis; upstream source is not bundled.
- [anthropics/skills](https://github.com/anthropics/skills) — general skill-format and task-specific examples. No complete upstream skill files bundled.
- Humanizer source: [github.com/humanizer](https://github.com/humanizer) was the supplied link, but it may not identify the intended canonical skill repository. ForgeX's `humanizer.md` is independently authored; verify the exact upstream before copying any content.

## Documentation and stack-specific integrations

- [upstash/context7](https://github.com/upstash/context7) — optional version-aware documentation retrieval. ForgeX includes guidance for using it only when configured; no service or runtime is bundled.
- [laravel/boost](https://github.com/laravel/boost) — optional Laravel-specific tooling. ForgeX includes conditional integration guidance; Boost itself is not bundled.

## QA and skill security

- [garrytan/gstack](https://github.com/garrytan/gstack) — browser QA/review workflow inspiration. ForgeX includes an original QA checklist; no gstack runtime is bundled.
- [NVIDIA/skillspector](https://github.com/NVIDIA/skillspector) — optional scanner for third-party agent skills. The scanner is not bundled, and a clean scan does not prove safety.
- [mvanhorn/last30days](https://github.com/mvanhorn/last30days) — optional recent web/social research. Not bundled; social research is not a source of truth for API behavior.

## Video-only capabilities (optional, not part of default web engineering routing)

- [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) — video creation/animation workflows.
- [remotion-dev/remotion](https://github.com/remotion-dev/remotion) — programmatic video with React.
- [Newuxtreme/watch-video-skill](https://github.com/Newuxtreme/watch-video-skill) — video understanding workflow.

These video tools should be considered only when the task explicitly involves video. They are not required dependencies for ForgeX.

## Use policy

- A link is a reference, not a dependency or claim of integration.
- Do not install or execute third-party tools automatically.
- Prefer official current setup instructions and pin versions where reproducibility matters.
- Before copying upstream code, prose, or skill files, verify the exact license at the pinned revision, preserve copyright/license notices, include required notices, and record the source revision.
- Do not strip upstream frontmatter or notices and repackage the result as original ForgeX content.
- External tools must be detected as available before their features are claimed.
