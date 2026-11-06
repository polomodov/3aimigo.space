import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { assertRenderAsset, selectLayouts, validateRecipe } from '../.agents/skills/three-aimigo-cover/scripts/cover-contract.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = path.join(repoRoot, '.agents/skills/three-aimigo-cover');
const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('historical RU S1E1–13 and EN S1E1–8 recipes keep their actual locale and episode badges', () => {
  const recipes = path.join(skill, 'archive/episodes');
  for (let episode = 1; episode <= 13; episode++) {
    const recipe = validateRecipe(json(path.join(recipes, `s1e${episode}.json`)));
    assert.equal(recipe.badge, `S1E${episode}`);
    assert.equal(recipe.locale, 'ru');
  }
  for (let episode = 1; episode <= 8; episode++) {
    const recipe = validateRecipe(json(path.join(recipes, `s1e${episode}-en.json`)));
    assert.equal(recipe.badge, `S1E${episode}`);
    assert.equal(recipe.locale, 'en');
  }
});

test('English uses landscape and Russian supports both original scene layouts', () => {
  assert.deepEqual(selectLayouts({ locale: 'en' }).map((layout) => [layout.name, layout.width, layout.height]), [['landscape', 1280, 720]]);
  assert.deepEqual(selectLayouts({ locale: 'ru' }).map((layout) => [layout.name, layout.width, layout.height]), [['landscape', 1280, 720], ['square', 1400, 1400]]);
  assert.equal(selectLayouts({ locale: 'ru' }, 'landscape').length, 1);
  assert.throws(() => selectLayouts({ locale: 'en' }, 'square'), /format must be landscape/);
});

test('invalid recipes fail before rendering', () => {
  const recipe = { badge: 'S1E13', title: 'A title', locale: 'en' };
  for (const bad of [null, [], { ...recipe, badge: '../13' }, { ...recipe, title: '' }, { ...recipe, title: 'one\ntwo\nthree' }, { ...recipe, locale: 'de' }, { ...recipe, caps: 'true' }]) {
    assert.throws(() => validateRecipe(bad));
  }
});

test('render assets reject LFS pointers and incorrect image/font bytes', () => {
  const scratch = mkdtempSync(path.join(os.tmpdir(), '3aimigo-cover-test-'));
  try {
    const pointer = path.join(scratch, 'plate.png');
    writeFileSync(pointer, 'version https://git-lfs.github.com/spec/v1\noid sha256:' + 'a'.repeat(64) + '\nsize 123\n');
    assert.throws(() => assertRenderAsset(pointer, 'png', repoRoot), /Git LFS pointer.*git lfs pull/);
    writeFileSync(pointer, 'not an image');
    assert.throws(() => assertRenderAsset(pointer, 'png', repoRoot), /not a valid PNG/);
    assert.throws(() => assertRenderAsset(pointer, 'woff2', repoRoot), /not a valid WOFF2/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

test('imported asset bytes or LFS pointers match their recorded source provenance', () => {
  const manifest = json(path.join(skill, 'archive/import-provenance.json'));
  assert.equal(manifest.source.repository, 'https://github.com/polomodov/polomodov');
  assert.match(manifest.source.revision, /^[a-f0-9]{40}$/);
  const seen = new Set();
  for (const entry of manifest.files) {
    assert.ok(!seen.has(entry.path), `Duplicate provenance path: ${entry.path}`);
    seen.add(entry.path);
    const bytes = readFileSync(path.join(skill, entry.path));
    if (bytes.subarray(0, 50).toString().startsWith('version https://git-lfs.github.com/spec/v1')) {
      const pointer = bytes.toString();
      assert.equal(pointer.match(/^oid sha256:([a-f0-9]{64})$/m)?.[1], entry.sha256, entry.path);
      assert.equal(Number(pointer.match(/^size (\d+)$/m)?.[1]), entry.bytes, entry.path);
    } else {
      assert.equal(bytes.length, entry.bytes, entry.path);
      assert.equal(hash(bytes), entry.sha256, entry.path);
    }
  }
  for (const needed of ['template/plate.png', 'template/sq/plate.png', 'template/fonts/roboto-condensed-latin.woff2', 'template/fonts/roboto-condensed-cyrillic.woff2', 'archive/episodes/s1e13.json']) {
    assert.ok(seen.has(needed), `Missing source provenance for ${needed}`);
  }
  const inventory = json(path.join(skill, 'archive/covers/inventory.json'));
  for (const exportRecord of inventory.files) {
    const imported = manifest.files.find((entry) => entry.path === `archive/covers/${exportRecord.file}`);
    assert.ok(imported, `Missing historical export: ${exportRecord.file}`);
    assert.equal(imported.sha256, exportRecord.sha256, exportRecord.file);
  }
});
