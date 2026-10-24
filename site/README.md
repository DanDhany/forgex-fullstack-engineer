# ForgeX Full-Stack Engineer — Landing Page Site

This directory (`site/`) contains the complete, production-ready landing page for **ForgeX Full-Stack Engineer**, built with zero external build dependencies, ready to be deployed directly via **GitHub Pages**.

## 🎨 Design System & Architecture

The landing page follows the **ForgeX UI/UX Craft Protocol**:

1. **Product-Specific Typography Art Direction:**
   - Display & Section Headings: `Plus Jakarta Sans` (weights 400–800) with optical tracking, balanced line wrapping, and deliberate line measures (`max-width: 24ch`).
   - Technical Labels, Metrics, & Code: `JetBrains Mono` for terminal commands, workflow steps, and badges.
   - Robust native system fallbacks for instant offline rendering without layout shifts.
2. **Dual-Theme Tonal Depth (Dark / Light):**
   - **Dark Mode (Default):** Deep obsidian/carbon canvas (`#080C14`), charcoal slate cards (`#0F1624`), elevated surfaces (`#162032`), with tactical cyan/sky/indigo accents. Not a muddy single-navy slab.
   - **Light Mode:** Architectural off-white canvas (`#F8FAFC`), crisp white cards (`#FFFFFF`), slate grey typography, and high-contrast dark code blocks for developer comfort.
   - Automatic sync with user OS system preference (`prefers-color-scheme`) and persistent manual toggle via `localStorage`.
3. **Interactive Components:**
   - **Interactive Contract Tracer:** Click-through 5-layer pipeline inspector showcasing UI Event &rarr; Route/Auth &rarr; Validation &rarr; Persistence &rarr; Reactive UI.
   - **Interactive Installation Studio:** Multi-tab command switcher for Skills CLI, Bundled Node Installer, Global install, and OpenAI Codex explicit syntax with 1-click copy feedback.
   - **Session Handoff Comparator:** Visual side-by-side comparison between standard AI amnesia and ForgeX `WORK-STATE.md` continuity.
   - **Mobile Drawer Navigation:** Accessible mobile navigation with focus management and escape-key listener.
4. **Zero-Build & GitHub Pages Compatibility:**
   - Pure modern HTML5 semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).
   - CSS3 Custom Properties and clamp-based fluid responsiveness.
   - Strict relative asset paths (`./css/style.css`, `./js/app.js`, `./assets/...`) ensuring immediate compatibility on `https://<username>.github.io/<repo>/` without broken root links.
   - Includes `.nojekyll` to bypass Jekyll file filtering.

## 🚀 Running Locally

You can preview the site locally using any static web server:

### Option A: Using Node.js (Built-in or npx)

```bash
# Using npx serve
npx serve site

# Or using http-server
npx http-server site -p 8080
```

### Option B: Using Python

```bash
# From within the site/ directory
cd site
python -m http.server 8080
```

### Option C: Direct File Opening

You can also open `site/index.html` directly in any modern browser:
- Windows: `start site/index.html`
- macOS: `open site/index.html`
- Linux: `xdg-open site/index.html`

## 🧪 Testing & Verification

Automated validation checks are located in `test/site.test.js`:
- Semantic HTML tags and SEO/OpenGraph metadata validation.
- Relative asset path verification (preventing absolute path regressions).
- Responsive viewport declaration and theme token completeness.
- Real headless browser tests (Chrome DevTools Protocol) verifying no horizontal overflow (`scrollWidth <= clientWidth + 1`) at 390×844 (mobile), 768×1024 (tablet), and 1440×900 (desktop) across both light and dark themes.

Run tests with:

```bash
npm test
```
