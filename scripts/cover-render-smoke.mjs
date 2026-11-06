#!/usr/bin/env node
// Explicit browser smoke; keep out of the default test runner.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = path.join(root, '.agents/skills/three-aimigo-cover');
const renderer = path.join(skill, 'scripts/render.mjs');
const scratch = mkdtempSync(path.join(os.tmpdir(), '3aimigo-cover-render-'));
function run(recipe, prefix) {
  return spawnSync(process.execPath, [renderer, recipe, path.join(scratch, prefix)], { cwd: scratch, encoding: 'utf8', timeout: 60000 });
}
async function checkImage(prefix, width, height, plate, sceneTop) {
  for (const extension of ['png', 'jpg']) {
    const image = await sharp(path.join(scratch, `${prefix}.${extension}`)).metadata();
    assert.deepEqual([image.width, image.height], [width, height], `${prefix}.${extension} dimensions`);
  }
  // The hosts' scene is part of the fixed artwork and must remain pixel-identical.
  const rect = { left: 0, top: sceneTop, width, height: height - sceneTop };
  const actual = await sharp(path.join(scratch, `${prefix}.png`)).extract(rect).removeAlpha().raw().toBuffer();
  const original = await sharp(path.join(skill, 'template', plate)).extract(rect).removeAlpha().raw().toBuffer();
  assert.ok(actual.equals(original), `${prefix}: fixed artwork was changed`);
}
try {
  for (const [recipe, prefix] of [['s1e13.json', 'ru'], ['s1e8-en.json', 'en']]) {
    const result = run(path.join(skill, 'archive/episodes', recipe), prefix);
    assert.equal(result.status, 0, result.error?.message ?? result.stderr);
    process.stdout.write(result.stdout);
  }
  await checkImage('ru', 1280, 720, 'plate.png', 360);
  await checkImage('ru-square', 1400, 1400, 'sq/plate.png', 630);
  await checkImage('en', 1280, 720, 'plate.png', 360);
  assert.ok(!existsSync(path.join(scratch, 'en-square.png')), 'English recipe must not create a square export');
  const overflowRecipe = path.join(scratch, 'overflow.json');
  writeFileSync(overflowRecipe, JSON.stringify({ badge: 'S99E99', title: 'W'.repeat(1000), locale: 'en' }));
  const overflow = run(overflowRecipe, 'overflow');
  assert.equal(overflow.status, 1, overflow.error?.message ?? overflow.stderr);
  assert.match(overflow.stderr, /OVERFLOW/);
  assert.ok(!existsSync(path.join(scratch, 'overflow.png')), 'Overflow must not create a publication image');
  console.log('Cover smoke passed: RU landscape/square, EN landscape, dimensions, preserved artwork and overflow rejection.');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
