# UI/UX craft — anti-slop design and implementation protocol

Use this protocol automatically for new pages, redesigns, and meaningful UI changes; users should not need to repeat the checklist in their prompts. The goal is a product-specific interface with coherent behavior, not a generic “modern SaaS” look. Keep this as one workflow; do not load every external skill or run every possible review for a tiny change.

## Default contract: decide, build, inspect, refine

For a substantial UI task, do not jump from a vague request directly into JSX/CSS. First form a concrete art direction from repository evidence and user intent, then implement it, inspect the real render if browser tools exist, and refine the highest-impact problems. Keep the user-facing plan brief; do not ask for approval for every ordinary design decision. Ask only when a missing decision would materially change product identity, user behavior, or scope.

The design direction must name actual choices—not adjectives—including composition/layout, typography, content density, color/surface treatment, imagery, and motion. For a new landing page or major redesign, consider at least two meaningfully different composition directions (not merely palette swaps), then choose one based on the product's actual content and brand. Do not turn this into a long user interview: infer low-risk choices and proceed. Ask only about decisions that materially change identity, user behavior, scope, or costly reversals. Choose one direction and execute it consistently rather than mixing several visual trends.

**Low-prompt contract:** users should not need to say “make it beautiful,” “avoid slop,” “use good UX,” “be responsive,” or “inspect the browser.” Apply the relevant workflow automatically from the task. Keep design reasoning concise and internal unless the user requests a rationale; do not stop at a plan when implementation is requested.

## 1. Read the product before choosing its look

Inspect existing pages, routes, components, styles/tokens, screenshots, product copy, and any `PRODUCT.md`, `DESIGN.md`, or equivalent. Preserve established identity unless redesign is explicitly requested. Identify:

- Audience, context of use, and the primary task.
- The most important action and information hierarchy.
- Product personality, brand constraints, and emotional tone.
- Existing component library, icon set, typography, spacing, color, theme, and motion conventions.
- Technical constraints and the project's actual framework/version.

If key product facts are missing, infer only low-risk details from the repo. Ask one focused question when a missing fact would materially change the design. Do not invent brand facts or user research.

## 2. Write a compact design thesis before implementation

For substantial UI work, state 3–6 concrete decisions before coding. Example: “Dense operations console for trained staff; compact table-first layout; strong typographic hierarchy; neutral surfaces with one restrained status palette; mobile converts rows to readable stacked records; motion is minimal and confirms state changes.”

Choose the layout and visual language for the product's actual job. Do not start from a favorite template and retrofit the content.

### Three design dials

Choose deliberately and record the choice briefly when useful:

- **Variance (low / medium / high):** how conventional or experimental the composition should be. Keep it low for familiar enterprise workflows; raise it for a brand-led landing page or creative tool when appropriate.
- **Density (low / medium / high):** how much useful information fits in a viewport. Match real task frequency and user expertise; do not make every interface spacious or every dashboard cramped.
- **Motion (none / subtle / expressive):** use none for static/low-power contexts, subtle for most products, expressive only when it reinforces the product's character and remains usable.

These are decision aids, not numeric scores or a universal style preset.

## 3. Prevent generic AI-generated UI

Treat these as warning signs, not absolute bans. Use a pattern only when there is a product-specific reason:

- Defaulting to a centered hero plus three feature cards for unrelated products.
- Repeating rounded cards inside rounded cards, with a small icon tile above every heading.
- Purple/blue gradients, glass effects, glows, and oversized headings without brand rationale.
- Using the same font, spacing, corner radius, and layout for every product.
- Filling empty space with decorative stats, fake testimonials, invented logos, or meaningless illustrations.
- Adding charts, badges, animations, or icons that do not improve comprehension or action.
- Treating a responsive layout as desktop UI merely squeezed into a narrow viewport.
- Replacing existing product identity with a trend-driven redesign without a request.

Before accepting the UI, name the specific choices that make it fit this product: composition, hierarchy, type, density, surface treatment, interaction, content, or navigation. “Looks modern” is not a sufficient rationale. For a new landing page, explicitly check whether its silhouette and section rhythm could be mistaken for dozens of unrelated AI SaaS pages. If yes, revisit composition, content hierarchy, and product-specific visuals before adding more decorative effects.

## 4. Responsive, themes, and reusable components are release requirements

- **Responsive:** mobile-first; test mobile, tablet, and desktop. Reflow intentionally, avoid horizontal overflow, keep text readable and controls touch-friendly. Tables, navigation, dialogs, charts, filters, and dense forms need an explicit narrow-screen strategy.
- **Light and dark:** use semantic tokens and the project's theme system. Check backgrounds, text, borders, shadows, focus rings, overlays, charts, and status colors in both themes. Do not rely on automatic color inversion or scattered one-off hex values.
- **Reusable components:** inspect existing components first. Reuse or extend shared buttons, inputs, dialogs, tables, feedback patterns, and design tokens. Extract a component when semantics and repeated usage are stable; avoid speculative abstraction for a one-off case.
- **States:** implement the applicable default, hover, focus-visible, pressed, selected, disabled, loading, success, validation, empty, error, and permission states. Keyboard and touch interactions must both work.
- **Real content:** test long labels, long names, empty data, realistic record counts, localization, and zoom. Do not use invented production data to make the UI appear complete.

Recommended viewport checks when browser tooling supports them: mobile 390×844, tablet 768×1024, desktop 1440×900. These are useful samples, not proof of universal compatibility.

## 5. Motion and interaction decisions

For each animation, decide in this order:

1. Does motion help the user understand state, hierarchy, spatial continuity, or feedback? If not, omit it.
2. Which element/property should move? Prefer transform and opacity when appropriate; avoid unnecessary layout work.
3. What duration and easing fit the distance, weight, and importance of the transition? Keep routine feedback brief; do not apply one curve to every interaction.
4. What happens if the action is interrupted, repeated, reversed, or the component unmounts?
5. Does the exit state remain clear? Can the user still act without waiting for animation?
6. Is `prefers-reduced-motion` respected?

Do not add an animation library for a tiny effect without a clear reason. Check motion in the running UI when tooling is available; source inspection alone does not prove it feels right.

## 6. Critique, then fix the highest-impact issues

After implementation, perform a focused review rather than declaring the first render done:

- **Audit:** inspect responsive behavior, contrast, accessibility, states, overflow, performance, and consistency with existing tokens/components.
- **Critique:** check task clarity, hierarchy, information architecture, cognitive load, brand fit, and whether the primary action is obvious.
- **Polish:** fix spacing, alignment, type hierarchy, control sizes, transitions, content wrapping, and subtle inconsistencies.
- **Distill:** remove decorative elements and choices that do not help the task.
- **Harden:** test empty/error/loading/permission cases, long content, keyboard flow, small screens, and both themes.

Prioritize findings by user impact and fix them; do not generate a long critique that is never applied. For a new page or substantial redesign, do at least one meaningful critique → refinement → reinspection cycle when browser tooling permits. Refinement should address structural issues first (composition, hierarchy, density, product fit), then styling details; do not spend the pass only tweaking shadows or border radii. Do not invent a numeric design score or claim a detector/browser ran unless it actually ran.

## 7. Verification and evidence

When browser tools or project Playwright tests are available, inspect representative flows at the viewport sizes above, in light and dark themes. Check overflow, navigation, dialogs, focus, keyboard/touch behavior, console/network failures, actual API data, and error states. Capture screenshots only with a real screenshot tool.

If visual tools are unavailable, inspect source and tests, then report visual QA as **not verified** with manual steps. Do not equate successful build or unit tests with visual quality.
