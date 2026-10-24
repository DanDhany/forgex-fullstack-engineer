import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SITE_DIR = path.resolve('site');
const HTML_PATH = path.join(SITE_DIR, 'index.html');
const CSS_PATH = path.join(SITE_DIR, 'css', 'style.css');
const JS_PATH = path.join(SITE_DIR, 'js', 'app.js');
const NOJEKYLL_PATH = path.join(SITE_DIR, '.nojekyll');

test('site landing page files exist and are readable', () => {
  assert.ok(fs.existsSync(HTML_PATH), 'index.html must exist');
  assert.ok(fs.existsSync(CSS_PATH), 'css/style.css must exist');
  assert.ok(fs.existsSync(JS_PATH), 'js/app.js must exist');
  assert.ok(fs.existsSync(NOJEKYLL_PATH), '.nojekyll must exist for GitHub Pages');
});

test('site index.html contains essential semantic landmarks and accessibility tags', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Semantic elements
  assert.match(html, /<header[^>]*>/, 'Must contain <header>');
  assert.match(html, /<main[^>]*id="main-content"[^>]*>/, 'Must contain <main id="main-content">');
  assert.match(html, /<footer[^>]*>/, 'Must contain <footer>');
  assert.match(html, /<nav[^>]*>/, 'Must contain <nav>');
  assert.match(html, /<h1[^>]*>/, 'Must contain <h1>');
  assert.match(html, /<h2[^>]*>/, 'Must contain <h2>');

  // Skip link
  assert.match(html, /href="#main-content"/, 'Must contain skip link targeting #main-content');

  // Viewport & SEO
  assert.match(html, /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0">/, 'Must have standard responsive viewport meta');
  assert.match(html, /<meta\s+property="og:title"/, 'Must have OpenGraph title');
  assert.match(html, /<meta\s+name="twitter:card"/, 'Must have Twitter Card meta');
});

test('site index.html uses relative paths for GitHub Pages compatibility', () => {
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // No absolute root paths like href="/..." or src="/..."
  const absoluteHrefMatches = html.match(/href="\/[a-zA-Z0-9]/g);
  const absoluteSrcMatches = html.match(/src="\/[a-zA-Z0-9]/g);

  assert.equal(absoluteHrefMatches, null, `Found absolute root href paths: ${absoluteHrefMatches}`);
  assert.equal(absoluteSrcMatches, null, `Found absolute root src paths: ${absoluteSrcMatches}`);

  // Relative links to css, js, assets
  assert.match(html, /href="\.\/css\/style\.css"/, 'CSS link must be relative');
  assert.match(html, /src="\.\/js\/app\.js"/, 'JS script must be relative');
  assert.match(html, /href="\.\/assets\/favicon\.svg"/, 'Favicon link must be relative');
});

test('site css defines cohesive tokens for dark and light themes and responsive breakpoints', () => {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  // Tokens in root
  assert.match(css, /--bg-canvas:/, 'Must define --bg-canvas token');
  assert.match(css, /--bg-surface:/, 'Must define --bg-surface token');
  assert.match(css, /--text-primary:/, 'Must define --text-primary token');
  assert.match(css, /--accent-cyan:/, 'Must define --accent-cyan token');

  // Light theme overrides
  assert.match(css, /\[data-theme="light"\]/, 'Must define [data-theme="light"] overrides');

  // Responsive breakpoints
  assert.match(css, /@media\s*\(\s*max-width:\s*1024px\s*\)/, 'Must have 1024px breakpoint');
  assert.match(css, /@media\s*\(\s*max-width:\s*768px\s*\)/, 'Must have 768px breakpoint');
  assert.match(css, /@media\s*\(\s*max-width:\s*480px\s*\)/, 'Must have 480px breakpoint');

  // Accessibility & reduced motion
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/, 'Must support prefers-reduced-motion');
});

test('site js implements theme toggle, interactive tracer, and copy features', () => {
  const js = fs.readFileSync(JS_PATH, 'utf8');

  assert.match(js, /forgex-theme/, 'Must persist theme in localStorage');
  assert.match(js, /prefers-color-scheme/, 'Must support prefers-color-scheme');
  assert.match(js, /initContractTracer/, 'Must have contract tracer initializer');
  assert.match(js, /initInstallStudio/, 'Must have installation studio initializer');
  assert.match(js, /initCopyButtons/, 'Must have copy buttons initializer');
});
