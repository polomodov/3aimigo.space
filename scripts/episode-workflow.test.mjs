import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { promisify } from 'node:util';
import { check, prepare, publish, publishPrep, withLock } from './episode-workflow.mjs';
import { episodeHash, readJson, validateContent, validateRegistry } from './content-validation.mjs';

const execute = promisify(execFile);
const slug = 'agent-development-infrastructure';
const params = { slug, topic: 't1', number: 13 };
const rootUrl = new URL('../', import.meta.url);
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'aimigo-workflow-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(new URL('content', rootUrl), join(root, 'content'), { recursive: true });
  await mkdir(join(root, 'public/covers'), { recursive: true });
  return root;
}
const draftPath = (root) => join(root, 'production/episodes', slug, 'episode.json');
const registryPath = (root) => join(root, 'content/podcast.json');
const save = (file, data) => writeFile(file, JSON.stringify(data, null, 2) + '\n');
async function ready(root) {
  await prepare(root, params);
  const draft = await readJson(draftPath(root));
  const sample = (await readJson(registryPath(root))).episodes[0];
  Object.assign(draft.episode, { date: '2026-11-05', duration: '1:02:03', durationIso: 'PT1H2M3S', intro: { en: ['Fixture introduction'], ru: ['Тестовое вступление'] }, topics: { en: ['Testing'], ru: ['Проверка'] }, media: [sample.media[0]], summary: structuredClone(sample.summary) });
  await mkdir(join(root, '.private/transcripts'), { recursive: true });
  await writeFile(join(root, draft.recordingSource.path), 'Local transcript fixture; never enters the public payload.');
  await save(draftPath(root), draft);
  return draft;
}

test('prepare reuses real prep, keeps release unpublished and never overwrites work', async (t) => {
  const root = await fixture(t); const before = await readFile(registryPath(root), 'utf8');
  await prepare(root, params);
  const draft = await readJson(draftPath(root));
  assert.equal(draft.episode.date, ''); assert.deepEqual(draft.episode.media, []); assert.equal(draft.baseEpisodeHash, null);
  assert.equal((await readJson(join(root, 'production/episodes', slug, 'prep.json'))).en.questions.length, 5);
  await assert.rejects(prepare(root, params), /already exists/);
  await assert.rejects(check(root, { slug }), /YYYY-MM-DD/);
  assert.equal(await readFile(registryPath(root), 'utf8'), before);
});

test('public prep supports native sources and sections without a polomodov dependency', async (t) => {
  const root = await fixture(t); await prepare(root, params);
  const file = join(root, 'production/episodes', slug, 'prep.json');
  const prep = await readJson(file); delete prep.source;
  prep.sources = [{ label: { en: 'Primary reference', ru: 'Первоисточник' }, url: { en: 'https://example.org/research', ru: 'https://example.org/research' } }];
  prep.en.sections = [{ title: 'Background', paragraphs: ['Reviewed background.'] }];
  prep.ru.sections = [{ title: 'Контекст', paragraphs: ['Проверенный контекст.'] }];
  await save(file, prep); await publishPrep(root, { slug });
  await validateContent(root);
  assert.deepEqual(await readJson(join(root, 'content/prep', slug + '.json')), prep);
  assert.equal((await readJson(registryPath(root))).episodes.length, 12);
  await publishPrep(root, { slug });
});

test('a stale public prep cannot be overwritten by an old draft', async (t) => {
  const root = await fixture(t); await prepare(root, params);
  const file = join(root, 'content/prep', slug + '.json');
  const prep = await readJson(file); prep.en.intro += ' New approved copy.'; await save(file, prep);
  await assert.rejects(publishPrep(root, { slug }), /Public prep changed/);
  assert.equal((await readJson(file)).en.intro, prep.en.intro);
});

test('release atomically registers episode and topic; repeat and reviewed update preserve identity', async (t) => {
  const root = await fixture(t); await ready(root);
  await check(root, { slug });
  await assert.rejects(publish(root, { slug }), /--reviewed/);
  await publish(root, { slug, reviewed: true });
  const result = await validateContent(root); const episode = result.episodes.find((e) => e.slug === slug);
  assert.equal(result.episodes.length, 13); assert.equal(result.map.nodes.find((n) => n.id === 't1').episodeId, episode.id);
  assert.equal(result.map.nodes.filter((n) => n.episodeId === episode.id).length, 1);
  assert.equal(episode.publication.contentSha256, episodeHash(episode));
  assert.match(episode.publication.sourceSha256, /^[a-f0-9]{64}$/);
  assert.ok(!JSON.stringify(episode).includes('.private')); assert.ok(!JSON.stringify(episode).includes('Local transcript fixture'));
  const bytes = await readFile(registryPath(root), 'utf8');
  await publish(root, { slug, reviewed: true }); assert.equal(await readFile(registryPath(root), 'utf8'), bytes);
  const draft = await readJson(draftPath(root)); draft.episode.title.en += ' — updated'; await save(draftPath(root), draft);
  await publish(root, { slug, reviewed: true });
  const updated = await validateContent(root); assert.equal(updated.episodes.length, 13);
  assert.equal(updated.episodes.find((e) => e.slug === slug).title.en, draft.episode.title.en);
});

test('failed or fabricated releases leave registry unchanged', async (t) => {
  const mutations = [
    ['missing Russian summary', (d) => { delete d.episode.summary.ru; }, /summary.ru/],
    ['future release', (d) => { d.episode.date = '2999-01-01'; }, /future/],
    ['channel link', (d) => { d.episode.media[0].url = 'https://www.youtube.com/@3aimigo'; }, /exact episode/],
    ['wrong duration', (d) => { d.episode.durationIso = 'PT1S'; }, /durationIso/],
    ['missing local source', (d) => { d.recordingSource.path = '.private/transcripts/missing.txt'; }, /ENOENT/],
    ['public source path', (d) => { d.recordingSource.path = 'README.md'; }, /\.private/],
    ['duplicate number', (d) => { d.episode.number = 12; }, /already belongs/],
    ['wrong topic', (d) => { d.topic = 'e1'; }, /another episode/],
    ['missing cover', (d) => { d.episode.covers = { en: '/covers/missing.jpg', ru: '/covers/missing.jpg' }; }, /ENOENT/],
  ];
  for (const [name, mutate, error] of mutations) await t.test(name, async (t) => {
    const root = await fixture(t); const draft = await ready(root); const before = await readFile(registryPath(root), 'utf8');
    mutate(draft); await save(draftPath(root), draft);
    await assert.rejects(publish(root, { slug, reviewed: true }), error);
    assert.equal(await readFile(registryPath(root), 'utf8'), before);
  });
});

test('stale release drafts and unreviewed direct edits are rejected', async (t) => {
  const root = await fixture(t); const stale = await ready(root);
  await publish(root, { slug, reviewed: true });
  const draft = await readJson(draftPath(root)); draft.episode.title.en += ' New review.'; await save(draftPath(root), draft);
  await publish(root, { slug, reviewed: true });
  stale.episode.title.en += ' Old draft.'; await save(draftPath(root), stale);
  const before = await readFile(registryPath(root), 'utf8');
  await assert.rejects(publish(root, { slug, reviewed: true }), /changed after/);
  assert.equal(await readFile(registryPath(root), 'utf8'), before);
  const registry = JSON.parse(before); registry.episodes.find((e) => e.slug === slug).intro.en.push('Unreviewed addition');
  assert.throws(() => validateRegistry(registry), /changed after review/);
});

test('parallel commands fail clearly and the lock is released after errors', async (t) => {
  const root = await fixture(t);
  await withLock(root, async () => { await assert.rejects(prepare(root, params), /Another episode command/); });
  await assert.rejects(prepare(root, { ...params, topic: 'missing' }), /Unknown topic/);
  await prepare(root, params);
});

test('CLI exercises prepare and check in an isolated checkout', async (t) => {
  const root = await fixture(t); await mkdir(join(root, 'scripts'));
  for (const file of ['episode.mjs', 'episode-workflow.mjs', 'content-validation.mjs']) await cp(new URL(`scripts/${file}`, rootUrl), join(root, 'scripts', file));
  const cli = join(root, 'scripts/episode.mjs');
  const result = await execute(process.execPath, [cli, 'prepare', '--slug', slug, '--topic', 't1', '--number', '13'], { cwd: tmpdir() });
  assert.match(result.stdout, /Nothing was published/);
  await assert.rejects(execute(process.execPath, [cli, 'check', '--slug', slug]), (error) => error.code === 1 && /YYYY-MM-DD/.test(error.stderr));
  await assert.rejects(execute(process.execPath, [cli, 'publish', '--slug', slug, '--typo']), (error) => error.code === 1 && /Unknown/.test(error.stderr));
});

test('invalid image bytes cannot be published as an episode cover', async (t) => {
  const root = await fixture(t); const draft = await ready(root);
  await writeFile(join(root, 'public/covers/broken.jpg'), 'This is not an image. '.repeat(100));
  draft.episode.covers = { en: '/covers/broken.jpg', ru: '/covers/broken.jpg' }; await save(draftPath(root), draft);
  const before = await readFile(registryPath(root), 'utf8');
  await assert.rejects(publish(root, { slug, reviewed: true }), /unsupported image format/);
  assert.equal(await readFile(registryPath(root), 'utf8'), before);
});

test('recording sources cannot escape .private through a symlink', async (t) => {
  const { symlink } = await import('node:fs/promises');
  const root = await fixture(t); const draft = await ready(root);
  await writeFile(join(root, 'outside.txt'), 'Text outside private source storage.');
  await symlink(join(root, 'outside.txt'), join(root, '.private/escaped.txt'));
  draft.recordingSource.path = '.private/escaped.txt'; await save(draftPath(root), draft);
  await assert.rejects(check(root, { slug }), /inside \.private/);
});

test('legacy import refuses to replace the canonical episode registry', async () => {
  const { fileURLToPath } = await import('node:url');
  const before = await readFile(new URL('content/podcast.json', rootUrl), 'utf8');
  await assert.rejects(execute(process.execPath, [fileURLToPath(new URL('scripts/import-polomodov.mjs', rootUrl)), '/nonexistent-upstream', '2026-11-06', 'content/podcast.json']), (error) => error.code === 1 && /cannot replace the public registry/.test(error.stderr));
  assert.equal(await readFile(new URL('content/podcast.json', rootUrl), 'utf8'), before);
});
