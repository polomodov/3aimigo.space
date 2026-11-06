import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, open, readFile, readdir, realpath, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { episodeHash, hash, readJson, today, validSlug, validateContent, validateCoverFiles, validateEpisode, validatePrep, validateRegistry } from './content-validation.mjs';

const json = (data) => JSON.stringify(data, null, 2) + '\n';
const optionalJson = async (path) => { try { return await readJson(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
export async function atomicJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  const temp = `${path}.${randomUUID()}.tmp`;
  try { await writeFile(temp, json(data), { flag: 'wx' }); await rename(temp, path); }
  finally { await rm(temp, { force: true }); }
}
export async function withLock(root, action) {
  await mkdir(join(root, '.private'), { recursive: true });
  const path = join(root, '.private/episode-workflow.lock');
  let lock;
  try { lock = await open(path, 'wx'); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Another episode command holds .private/episode-workflow.lock. If it crashed, verify no command is running before removing that file.'); throw error; }
  try { await lock.writeFile(json({ pid: process.pid, startedAt: new Date().toISOString() })); return await action(); }
  finally { await lock.close(); await rm(path, { force: true }); }
}
const workDir = (root, slug) => { validSlug(slug); return join(root, 'production/episodes', slug); };
function checkIdentity(draft, registry) {
  assert.equal(draft.schemaVersion, 1, 'Unsupported draft schema');
  const episode = draft.episode;
  validSlug(episode.slug);
  const topic = registry.map.nodes.find((node) => node.id === draft.topic);
  assert.ok(topic, `Unknown topic: ${draft.topic}`);
  const existing = registry.episodes.find((e) => e.slug === episode.slug);
  for (const other of registry.episodes) {
    if (other === existing) continue;
    assert.ok(other.id !== episode.id && !(other.season === episode.season && other.number === episode.number), 'Episode ID or season/number already belongs to another release');
  }
  if (existing) assert.ok(existing.id === episode.id && existing.season === episode.season && existing.number === episode.number, 'Published episode identity is immutable');
  assert.ok(!topic.episodeId || topic.episodeId === episode.id, `Topic ${draft.topic} already belongs to another episode`);
  const linked = registry.map.nodes.find((node) => node.episodeId === episode.id);
  assert.ok(!linked || linked.id === draft.topic, 'Keep the original map topic when updating a release');
  return existing;
}
async function sourceEvidence(root, draft) {
  const source = draft.recordingSource;
  assert.ok(['transcript', 'subtitles'].includes(source?.kind), 'recordingSource.kind must be transcript or subtitles');
  assert.ok(typeof source.path === 'string' && /^\.private\//.test(source.path), 'Keep the recording source under .private/');
  const privateRoot = await realpath(join(root, '.private'));
  const path = await realpath(resolve(root, source.path));
  assert.ok(path.startsWith(privateRoot + sep), 'Recording source must stay inside .private/');
  const info = await stat(path);
  assert.ok(info.isFile() && info.size > 0 && info.size < 64 * 1024 * 1024, 'Recording source must be a nonempty text file below 64 MB');
  const bytes = await readFile(path);
  assert.ok(bytes.toString('utf8').trim() && !bytes.includes(0), 'Recording source must be text');
  return { sourceKind: source.kind, sourceSha256: hash(bytes) };
}
async function saveDraft(path, draft, published) {
  try { await atomicJson(path, { ...draft, baseEpisodeHash: hash(published), episode: published }); }
  catch (error) { throw new Error(`Release is saved, but the working draft could not be synchronized. Rerun publish to recover: ${error.message}`); }
}
export async function prepare(root, { slug, topic: topicId, number, season = 1 }) {
  return withLock(root, async () => {
    const registry = await validateContent(root);
    const path = workDir(root, slug);
    assert.ok(Number.isInteger(number) && number > 0 && Number.isInteger(season) && season > 0, 'Use a positive episode --number and --season');
    const topic = registry.map.nodes.find((node) => node.id === topicId);
    assert.ok(topic, `Unknown topic: ${topicId}`);
    const existing = registry.episodes.find((episode) => episode.slug === slug);
    const episode = existing ? structuredClone(existing) : {
      id: `3-aimigo-s${season}e${number}-${slug}`, slug, season, number, date: '', duration: '', durationIso: '',
      title: structuredClone(topic.title ?? { en: '', ru: '' }), intro: { en: [], ru: [] }, topics: { en: [], ru: [] }, media: [],
    };
    assert.ok(episode.number === number && episode.season === season, 'The supplied season/number must match the existing release');
    const publishedPrep = (await Promise.all((await readdir(join(root, 'content/prep'))).filter((file) => file.endsWith('.json')).map((file) => readJson(join(root, 'content/prep', file))))).find((prep) => prep.topic === topicId);
    assert.ok(!publishedPrep || publishedPrep.slug === slug, `Use the existing prep slug ${publishedPrep?.slug} for this topic`);
    const draft = { schemaVersion: 1, topic: topicId, baseEpisodeHash: existing ? hash(existing) : null, basePrepHash: publishedPrep ? hash(publishedPrep) : null, episode, recordingSource: { kind: 'transcript', path: `.private/transcripts/${slug}.txt` } };
    checkIdentity(draft, registry);
    const prep = publishedPrep ?? { slug, topic: topicId, en: { title: topic.title?.en ?? '', description: topic.summary?.en ?? '', intro: '', questions: [], sections: [] }, ru: { title: topic.title?.ru ?? '', description: topic.summary?.ru ?? '', intro: '', questions: [], sections: [] }, sources: [] };
    await mkdir(dirname(path), { recursive: true });
    try { await stat(path); throw new Error(`Draft already exists: production/episodes/${slug}. Edit it in place; prepare never overwrites work.`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const stage = `${path}.${randomUUID()}.tmp`;
    await mkdir(stage);
    try {
      const files = {
        'episode.json': json(draft), 'prep.json': json(prep),
        'research.md': '# Research / Исследование\n\nWorking notes are public in this repository. Keep raw recordings, transcripts and private guest details under `.private/`.\n\n## Question and hypothesis\n\n## Primary sources and checked dates\n\n## Evidence, disagreements and open questions\n',
        'script.md': '# Recording outline / План записи\n\n## Opening case\n\n## Discussion blocks and questions\n\n## Counterarguments\n\n## Closing takeaways\n',
        'announcement.en.md': '# Announcement draft\n\nWrite the reviewed English announcement here. Add a time and recording URL only after confirmation.\n',
        'announcement.ru.md': '# Черновик анонса\n\nПодготовьте русский анонс. Дату, время и ссылку добавляйте только после подтверждения.\n',
      };
      for (const [name, value] of Object.entries(files)) await writeFile(join(stage, name), value, { flag: 'wx' });
      await rename(stage, path);
    } finally { await rm(stage, { recursive: true, force: true }); }
    return `Prepared production/episodes/${slug}/. Nothing was published.`;
  });
}
export async function publishPrep(root, { slug }) {
  return withLock(root, async () => {
    const registry = await validateContent(root);
    const path = workDir(root, slug);
    const draft = await readJson(join(path, 'episode.json'));
    assert.equal(draft.episode.slug, slug, 'Draft folder and slug differ');
    checkIdentity(draft, registry);
    const prep = await readJson(join(path, 'prep.json'));
    assert.equal(prep.slug, slug, 'Prep slug must match its draft'); assert.equal(prep.topic, draft.topic, 'Prep topic must match its draft');
    validatePrep(prep, registry);
    const output = join(root, 'content/prep', `${slug}.json`);
    for (const file of (await readdir(join(root, 'content/prep'))).filter((name) => name.endsWith('.json') && name !== `${slug}.json`)) {
      assert.notEqual((await readJson(join(root, 'content/prep', file))).topic, prep.topic, 'Another prep brief already owns this topic');
    }
    const current = await optionalJson(output);
    const unchanged = current && hash(current) === hash(prep);
    assert.ok(unchanged || (current ? hash(current) : null) === draft.basePrepHash, 'Public prep changed after this draft was prepared. Reconcile it before publishing.');
    if (!unchanged) await atomicJson(output, prep);
    await atomicJson(join(path, 'episode.json'), { ...draft, basePrepHash: hash(prep) });
    return `${unchanged ? 'Verified' : 'Published'} prep: /prep/${slug}/ and /ru/prep/${slug}/. No recording was released.`;
  });
}
async function releaseCandidate(root, { slug, date, day = today() }) {
  const registry = await validateContent(root);
  const path = join(workDir(root, slug), 'episode.json');
  const draft = await readJson(path);
  assert.equal(draft.episode.slug, slug, 'Draft folder and slug differ');
  const existing = checkIdentity(draft, registry);
  const { publication: ignored, ...episode } = draft.episode;
  if (date) episode.date = date;
  validateEpisode(episode, { day, release: false });
  assert.ok(episode.summary?.en && episode.summary?.ru, 'Publication requires a reviewed summary in English and Russian');
  await validateCoverFiles(episode, root);
  const evidence = await sourceEvidence(root, draft);
  const unchanged = existing && episodeHash(existing) === episodeHash(episode) && existing.publication?.sourceSha256 === evidence.sourceSha256 && existing.publication?.sourceKind === evidence.sourceKind;
  assert.ok(unchanged || (existing ? hash(existing) : null) === draft.baseEpisodeHash, 'Published episode changed after this draft was prepared. Reconcile the latest release before publishing.');
  return { registry, path, draft, episode, existing, evidence, unchanged };
}
export async function check(root, options) {
  return withLock(root, async () => {
    const result = await releaseCandidate(root, options);
    return result.unchanged ? 'This reviewed release is already published.' : 'Release checks passed. Review copy, source fidelity, covers and recording links before publish --reviewed.';
  });
}
export async function publish(root, options) {
  assert.equal(options.reviewed, true, 'publish requires --reviewed after editorial review of both languages, recording and source fidelity');
  return withLock(root, async () => {
    const { registry, path, draft, episode, existing, evidence, unchanged } = await releaseCandidate(root, options);
    if (unchanged) { await saveDraft(path, draft, existing); return 'Already published; public registry unchanged.'; }
    const published = { ...episode, publication: { reviewedAt: new Date().toISOString(), contentSha256: episodeHash(episode), ...evidence } };
    const next = structuredClone(registry);
    const index = next.episodes.findIndex((item) => item.id === episode.id);
    if (index < 0) next.episodes.push(published); else next.episodes[index] = published;
    next.episodes.sort((a, b) => b.date.localeCompare(a.date) || b.season - a.season || b.number - a.number);
    const topic = next.map.nodes.find((node) => node.id === draft.topic);
    topic.episodeId = episode.id; topic.kind = 'episode'; delete topic.status;
    next.map.asOf = [next.map.asOf, episode.date].sort().at(-1);
    validateRegistry(next, { day: options.day ?? today() });
    await atomicJson(join(root, 'content/podcast.json'), next);
    await saveDraft(path, draft, published);
    return `Published S${episode.season}E${episode.number} in the local registry. Run npm test and npm run build, review the diff, then commit and push to deploy.`;
  });
}
