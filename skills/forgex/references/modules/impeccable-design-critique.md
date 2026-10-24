# Impeccable-Inspired Design Critique (ForgeX-authored)

This is an original ForgeX checklist inspired by public design-craft practices associated with Impeccable. It is not a copy of the upstream skill. Consult the upstream project and its current license before importing its files: https://github.com/pbakaus/impeccable

## Use when

A user requests a new UI, redesign, visual critique, design-system improvement, or a UI that looks generic despite being technically correct.

## Critique order

1. **Purpose:** Can the user identify the product, audience, and primary action immediately?
2. **Hierarchy:** Is there one dominant message/action per region, with secondary content visibly subordinate?
3. **Typography:** Do font choice, size, weight, line length, line height, and line breaks create deliberate hierarchy?
4. **Composition:** Does the page use a product-appropriate layout rather than repeating a generic hero-plus-cards template?
5. **Surface and color:** Are canvas, surfaces, borders, text, brand accents, and semantic states intentionally differentiated?
6. **Density and rhythm:** Are whitespace and content density appropriate to the information, with meaningful variation between sections?
7. **Interaction:** Are controls recognizable, states complete, and feedback immediate and accessible?
8. **Responsive behavior:** Does the layout adapt at actual target viewports, not merely shrink?
9. **Accessibility:** Check semantic structure, keyboard use, focus, contrast, reduced motion, and non-color status cues.
10. **Rendered evidence:** Inspect the running interface, identify the highest-impact defects, fix them, and re-inspect.

## Output

For substantial changes, state the chosen art direction briefly in the working notes, then implement it. Avoid a long design questionnaire. Report the most meaningful observed defects and the fixes that were actually verified. A critique without a corresponding improvement pass is incomplete when implementation is possible.
