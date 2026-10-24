# Product UI design review

## Review before changing

- Identify the product audience, primary task, current design system, component library, and route.
- Read existing tokens/components before adding new ones.
- Distinguish a real usability issue from personal aesthetic preference.
- Preserve the project's visual identity unless the user requested a redesign.

## Review dimensions

1. **Hierarchy:** Is the primary action obvious? Are titles, supporting text, and metadata clearly differentiated?
2. **Consistency:** Are spacing, typography, colors, radii, shadows, and interaction states reused consistently?
3. **Usability:** Are labels specific? Are destructive actions distinguishable? Are empty/error/loading states useful?
4. **Accessibility:** Check contrast, keyboard focus, semantic controls, labels, reduced motion, and touch target size.
5. **Responsive behavior:** Check mobile-first layout, wrapping, overflow, navigation, and modal fit.
6. **Content:** Use `humanizer` for unclear, generic, awkward, or overhyped product copy.
7. **Implementation quality:** Prefer existing components and tokens; avoid one-off CSS patches that create inconsistent behavior.

## Output

List the highest-impact issues first with evidence, user impact, and proposed fix. Then implement only changes that fit the request and existing architecture. Verify visually when tools are available; otherwise state that review was code-only.
