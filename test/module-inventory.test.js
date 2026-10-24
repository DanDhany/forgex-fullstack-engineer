import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('site/index.html', 'utf8');
const css = fs.readFileSync('site/css/style.css', 'utf8');
const readme = fs.readFileSync('site/README.md', 'utf8');

const modules = [
  'fullstack-feature',
  'gstack-style-qa',
  'interaction-motion-craft',
  'impeccable-design-critique',
  'taste-art-direction',
  'spec-planning-tdd',
  'contract-checklist',
  'visual-qa',
  'design-review',
  'skill-security',
  'laravel-boost-integration',
  'visual-test-case-template',
  'context7-docs',
  'humanizer',
  'docs-freshness',
  'last30days-research',
];

test('website announces the current v1.2.0 package version', () => {
  assert.ok(html.includes('v1.2.0'));
  assert.ok(!html.includes('v1.1.8'));
});

test('all 16 v1.2.0 internal module names are documented on the page', () => {
  assert.match(html, /16 internal modules/i);
  for (const name of modules) {
    assert.ok(html.includes(name), `Landing page is missing module: ${name}`);
    assert.ok(readme.includes(name), `Site README is missing module: ${name}`);
  }
  assert.equal(modules.length, 16);
});

test('website explains modules are internal, not separately installed skills', () => {
  assert.ok(/not separate skills you need to install or orchestrate/i.test(html));
  assert.ok(/not 16 separately installed skills/i.test(readme));
});

test('module inventory layout has responsive rules and theme-aware tokens', () => {
  assert.ok(css.includes('.module-groups {'));
  assert.ok(css.includes('@media (max-width: 1024px)'));
  assert.ok(css.includes('@media (max-width: 768px)'));
  assert.ok(css.includes('@media (max-width: 480px)'));
  assert.ok(css.includes('var(--bg-surface)'));
  assert.ok(css.includes('var(--text-secondary)'));
});

test('modules section is linked from desktop and mobile navigation', () => {
  assert.ok(html.includes('href="#modules">Modules</a>'));
  assert.ok(html.includes('href="#modules" class="mobile-drawer-link">Modules</a>'));
  assert.ok(html.includes('<section id="modules"'));
});
