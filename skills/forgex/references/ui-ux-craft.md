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

## 4. Typography and color are structural design decisions

Typography and palette strongly affect perceived craft. Do not treat them as decoration chosen after layout.

### Typography system
- Inspect existing brand/type assets first. If none exist, choose a deliberate, legible type system that fits the product rather than defaulting to the most common geometric startup font.
- Use at most two font families by default: one display/text family and an optional mono family for code or technical labels. Avoid mixing several unrelated typefaces or using monospace for ordinary prose.
- Define a compact type scale with explicit roles for display, section heading, body, supporting text, labels, and code. Keep line-height, weight, letter spacing, and measure intentional.
- Avoid excessive bolding, all-caps micro-labels, tracking-heavy text, and oversized headings used to create visual interest without improving hierarchy.
- Headlines must wrap deliberately. Do not force awkward one-word lines with narrow fixed widths or hardcoded line breaks unless the art direction requires them and responsive behavior is verified.
- Use comfortable body text and line lengths. Do not shrink text just to fit a dense layout; change the composition or content hierarchy instead.
- Review actual rendered glyphs, heading wraps, line-height, and contrast at each target viewport. Font loading failure must degrade gracefully. Inspect headings at mobile width for truncated words, clipped final letters, awkward isolated words, and unintentional line breaks; fix the layout or type scale instead of hiding overflow.

### Typography art direction gate — six required decisions

Treat these as one connected design pass, not six disconnected checklist items. Apply the depth appropriate to the task; a major page or redesign must address all six, while a small bug fix should verify the affected parts and avoid unnecessary redesign.

1. **Choose type by product character.** Inspect existing brand assets and constraints first. Define the product's intended voice (for example: editorial, technical, civic/service-oriented, playful, or operational) and explain briefly why the selected typeface supports it. Do not select a font just because it is fashionable or familiar. Verify licensing, availability, language/glyph coverage, loading behavior, and sensible system fallbacks. Never claim a font is loaded without checking the actual render or network/computed style when tools allow.
2. **Build a coherent typographic system.** Specify roles for display, page/section headings, body, supporting copy, labels, data/table text, and code where relevant. Set responsive size ranges, line-height, weight, letter spacing, and maximum line measure intentionally; use tokens or shared styles instead of scattered one-off values. Keep families limited unless a documented brand reason warrants more. Avoid using bold, uppercase, or scale alone as a substitute for hierarchy.
3. **Art-direct headline composition.** Review the words as shapes: line length, line breaks, rhythm, punctuation, adjacent copy, and relationship to surrounding whitespace. Prefer natural wrapping and fluid sizing; use explicit line breaks only when the intended composition remains good across breakpoints and localization. Never force a dramatic headline at the cost of awkward orphan words, clipped glyphs, or a tiny mobile text size.
4. **Match typography to the full visual direction.** Typography must work with layout, content density, color, surfaces, imagery, iconography, and motion as one coherent system. The same default font pair and hero pattern should not be reused across unrelated products without a reason. Do not copy a recognizable designer's or product's signature style; translate general principles into a product-specific direction.
5. **Verify rendered output, not just declarations.** Inspect the actual page at target viewports and themes. Check font loading/computed font family when browser tools permit; inspect glyph shape, clipping, line-height, contrast, zoom/reflow, long words, localization, and content variation. Compare screenshot appearance with DOM measurements. If the browser or font environment cannot be verified, label that part of QA blocked rather than passed.
6. **Polish typography through interaction and states.** Check text during navigation changes, responsive reflow, validation errors, loading/empty/success states, dialogs, tabs, expanded/collapsed content, and hover/focus/pressed states where applicable. Transitions must not cause layout jumps, text clipping, unreadable intermediate states, or delayed access to controls. Respect reduced-motion preferences; motion should clarify a state change rather than decorate every text element.

#### Required acceptance gate for substantial UI work

Before calling a substantial UI implementation done, record a concise typography rationale and verify:
- Typeface choice is product-specific and has a fallback strategy.
- Type roles and responsive sizes are consistent and reusable.
- Hero and section headings wrap naturally at mobile, tablet, and desktop widths.
- Body copy remains comfortably readable; dense layouts are reorganized instead of shrinking text excessively.
- Rendered screenshots show no clipped glyphs, awkward orphan lines, accidental truncation, or theme contrast failures.
- Dynamic UI states and reduced-motion behavior do not break text layout or comprehension.

If any check fails, revise the composition/type scale and inspect again. Do not declare the gate passed based only on source-code inspection, a design description, or an unverified screenshot. For small scoped changes, report only the relevant checks and any unverified limitations.

### Color and surfaces
- Choose a palette with a clear role for background, raised surface, border, primary text, muted text, accent, and semantic states. Prefer tokens over scattered literal colors.
- Dark mode should have intentional tonal depth: distinguish page background, section surfaces, cards, inputs, borders, and overlays. Avoid making every section/card the same blue-black, using pure black everywhere, or applying a strong blue tint to every surface without brand rationale. Check the page as a whole at normal brightness: if the whole site reads as one uniform navy slab, revise tonal hierarchy before adding more accent colors.
- Light mode needs equally deliberate contrast and surface hierarchy; do not simply invert the dark palette.
- Limit accent colors and reserve high saturation for actions, focus, active states, or meaningful data. Avoid using gradients as a substitute for art direction.
- Check text, muted text, borders, focus rings, buttons, code blocks, status colors, and hover states for accessible contrast in both themes. Never rely on color alone to communicate status.

### Visual QA must validate the viewport, not just the screenshot
- Before trusting a mobile screenshot, verify that the browser's actual CSS viewport is the intended width (`window.innerWidth` and the active CSS media query must agree with the target). A narrow screenshot crop of a desktop viewport is not mobile QA. When using Chromium tooling, configure device metrics/mobile emulation correctly and confirm the resulting viewport dimensions before capture.
- At each mobile viewport, assert `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1` unless a specific, intentional horizontal scroller is the only overflowing region. Also inspect important elements' bounding boxes against the viewport. A passing page-wide width check alone does not prove that clipped text or controls are usable.
- Inspect the rendered screenshot for cut-off text and controls, then pair visual inspection with DOM measurements. If the screenshot and measurements disagree, diagnose the capture/emulation setup before claiming a pass.
- If browser automation repeatedly fails to establish the requested viewport, do not report mobile QA as passed. Report it as blocked and use a second available browser/viewport method or ask for a reliable test environment.

## 5. Responsive, themes, and reusable components are release requirements

- **Responsive:** mobile-first; test mobile, tablet, and desktop. Reflow intentionally, avoid horizontal overflow, keep text readable and controls touch-friendly. Tables, navigation, dialogs, charts, filters, and dense forms need an explicit narrow-screen strategy.
- **Light and dark:** use semantic tokens and the project's theme system. Check backgrounds, text, borders, shadows, focus rings, overlays, charts, and status colors in both themes. Do not rely on automatic color inversion or scattered one-off hex values.
- **Reusable components:** inspect existing components first. Reuse or extend shared buttons, inputs, dialogs, tables, feedback patterns, and design tokens. Extract a component when semantics and repeated usage are stable; avoid speculative abstraction for a one-off case.
- **States:** implement the applicable default, hover, focus-visible, pressed, selected, disabled, loading, success, validation, empty, error, and permission states. Keyboard and touch interactions must both work.
- **Real content:** test long labels, long names, empty data, realistic record counts, localization, and zoom. Do not use invented production data to make the UI appear complete.

Recommended viewport checks when browser tooling supports them: narrow mobile 320×740 or 360×800, typical mobile 390×844, tablet 768×1024, laptop 1024×768, and desktop 1440×900. These are useful samples, not proof of universal compatibility.

### Mobile overflow gate
- Inspect the page at the actual viewport width, not just a responsive preview that scales the whole desktop page.
- Verify that document width does not exceed viewport width. Check `scrollWidth` versus `clientWidth` when browser evaluation is available; otherwise inspect likely overflow sources in CSS and rendered screenshots.
- Specifically test navigation, hero columns, long headings, code/install commands, tables, tabs, cards, dialogs, footer columns, images, and interactive widgets.
- Use `min-width: 0` for shrinkable flex/grid children where needed; apply `max-width: 100%` to media; use `overflow-wrap: anywhere` or an intentional scroll container for long code/URLs; collapse columns and reposition or hide secondary decoration at narrow widths.
- Do not solve page-wide overflow by setting `overflow-x: hidden` on the body; find and fix the overflowing child so content is not clipped or controls made unreachable.
- At narrow widths, remove nonessential metadata, simplify navigation, stack layout intentionally, and make buttons and copy controls fit the viewport. Avoid fixed pixel widths for primary content.
- A mobile screenshot where headings, navigation, buttons, body copy, or code are cut off is a failed acceptance check, even if desktop looks polished. Do not mark mobile QA passed until both the screenshot and viewport/overflow measurements agree.

## 6. Motion and interaction decisions

For each animation, decide in this order:

1. Does motion help the user understand state, hierarchy, spatial continuity, or feedback? If not, omit it.
2. Which element/property should move? Prefer transform and opacity when appropriate; avoid unnecessary layout work.
3. What duration and easing fit the distance, weight, and importance of the transition? Keep routine feedback brief; do not apply one curve to every interaction.
4. What happens if the action is interrupted, repeated, reversed, or the component unmounts?
5. Does the exit state remain clear? Can the user still act without waiting for animation?
6. Is `prefers-reduced-motion` respected?

Do not add an animation library for a tiny effect without a clear reason. Check motion in the running UI when tooling is available; source inspection alone does not prove it feels right.

## 7. Critique, then fix the highest-impact issues

After implementation, perform a focused review rather than declaring the first render done:

- **Audit:** inspect responsive behavior, contrast, accessibility, states, overflow, performance, and consistency with existing tokens/components.
- **Critique:** check task clarity, hierarchy, information architecture, cognitive load, brand fit, and whether the primary action is obvious.
- **Polish:** fix spacing, alignment, type hierarchy, control sizes, transitions, content wrapping, and subtle inconsistencies.
- **Distill:** remove decorative elements and choices that do not help the task.
- **Harden:** test empty/error/loading/permission cases, long content, keyboard flow, small screens, and both themes.

Prioritize findings by user impact and fix them; do not generate a long critique that is never applied. For a new page or substantial redesign, do at least one meaningful critique → refinement → reinspection cycle when browser tooling permits. Refinement should address structural issues first (composition, hierarchy, density, product fit), then styling details; do not spend the pass only tweaking shadows or border radii. Do not invent a numeric design score or claim a detector/browser ran unless it actually ran.

## 8. Verification and evidence

When browser tools or project Playwright tests are available, inspect representative flows at the viewport sizes above, in light and dark themes. Check overflow, navigation, dialogs, focus, keyboard/touch behavior, console/network failures, actual API data, and error states. Capture screenshots only with a real screenshot tool.

If visual tools are unavailable, inspect source and tests, then report visual QA as **not verified** with manual steps. Do not equate successful build or unit tests with visual quality.
