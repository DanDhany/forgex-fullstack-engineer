import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const read = (file) => fs.readFile(path.resolve(file), 'utf8');

test('ForgeX remains one installable skill with internal reference modules', async () => {
  const skill = await read('skills/forgex/SKILL.md');
  const routing = await read('skills/forgex/references/module-routing.md');
  assert.match(skill, /one user-facing skill with modular internal expertise/i);
  assert.match(skill, /module-routing\.md/);
  assert.match(routing, /These are internal reference modules, not independently installed skills/);
  const files = await fs.readdir(path.resolve('skills'));
  assert.deepEqual(files, ['forgex']);
});

test('routing matrix references only existing internal modules', async () => {
  const routing = await read('skills/forgex/references/module-routing.md');
  const moduleNames = [...routing.matchAll(/modules\/([a-z0-9-]+\.md)/g)].map((m) => m[1]);
  for (const name of new Set(moduleNames)) {
    await fs.access(path.resolve(`skills/forgex/references/modules/${name}`));
  }
});

test('one/two-shot workflow prioritizes evidence and never promises model-independent perfection', async () => {
  const workflow = await read('skills/forgex/references/workflows/one-two-shot-quality.md');
  assert.match(workflow, /reduce avoidable follow-up prompts/);
  assert.match(workflow, /not to promise perfection/);
  assert.match(workflow, /Never fabricate screenshots, tool availability, tests/);
});

test('upstream reference policy distinguishes inspirations from bundled code', async () => {
  const refs = await read('skills/forgex/references/upstream-references.md');
  assert.match(refs, /does not vendor complete third-party skill repositories/i);
  assert.match(refs, /verify the exact license/i);
  assert.match(refs, /Jeffallan\/claude-skills/);
  assert.match(refs, /pbakaus\/impeccable/);
  assert.match(refs, /emilkowalski\/skills/);
  assert.match(refs, /Leonxlnx\/taste-skill/);
});
