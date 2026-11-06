import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export const languages = ['en', 'ru'];
export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/London' }).format(new Date());
export const hash = (value) => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');
export const episodeHash = ({ publication, ...episode }) => hash(episode);
export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const requireText = (value, path) => assert.ok(typeof value === 'string' && value.trim(), `${path}: text is required`);
const list = (value, path, min = 1) => assert.ok(Array.isArray(value) && value.length >= min, `${path}: expected at least ${min} items`);
const texts = (value, path) => { list(value, path); value.forEach((v, i) => requireText(v, `${path}[${i}]`)); };
const localized = (value, path, validate = requireText) => languages.forEach((lang) => validate(value?.[lang], `${path}.${lang}`));
export const validSlug = (value) => assert.match(value ?? '', /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase, hyphenated slug');
export function validDate(value, path = 'date') {
  assert.match(value ?? '', /^\d{4}-\d{2}-\d{2}$/, `${path}: use YYYY-MM-DD`);
  assert.equal(new Date(value + 'T12:00:00Z').toISOString().slice(0, 10), value, `${path}: invalid calendar date`);
}
function https(value, path) {
  requireText(value, path);
  const url = new URL(value);
  assert.equal(url.protocol, 'https:', `${path}: HTTPS is required`);
  assert.ok(!url.username && !url.password, `${path}: credentials are not allowed`);
  return url;
}
function localPath(value, path) {
  assert.match(value, /^\/(?!\/)/, `${path}: expected a site-root path`);
  const decoded = decodeURIComponent(value.split(/[?#]/)[0]);
  assert.ok(!decoded.includes('\\') && !decoded.split('/').some((p) => p === '.' || p === '..') && !/[\x00-\x1f]/.test(decoded), `${path}: invalid path`);
  return decoded;
}
function link(value, path) {
  requireText(value, path);
  return value.startsWith('/') ? localPath(value, path) : https(value, path);
}
function materialLinks(items, path) {
  list(items, path, 0);
  items.forEach((item, i) => { localized(item.label, `${path}[${i}].label`); localized(item.url, `${path}[${i}].url`, link); });
}
function summary(value, path) {
  for (const key of ['title', 'description', 'lead', 'sourceNote']) requireText(value?.[key], `${path}.${key}`);
  list(value.sections, `${path}.sections`);
  value.sections.forEach((section, i) => { requireText(section.title, `${path}.sections[${i}].title`); texts(section.paragraphs, `${path}.sections[${i}].paragraphs`); });
  texts(value.takeaways, `${path}.takeaways`);
  list(value.sources, `${path}.sources`, 0);
  value.sources.forEach((source, i) => { requireText(source.label, `${path}.sources[${i}].label`); link(source.url, `${path}.sources[${i}].url`); });
}
export function recording(link) {
  const url = https(link.url, 'recording.url');
  const host = url.hostname.toLowerCase();
  const rules = {
    youtube: () => ((host === 'www.youtube.com' || host === 'youtube.com' || host === 'm.youtube.com') && ((url.pathname === '/watch' && /^[\w-]{11}$/.test(url.searchParams.get('v') ?? '')) || /^\/(live|shorts)\/[\w-]{11}\/?$/.test(url.pathname))) || (host === 'youtu.be' && /^\/[\w-]{11}\/?$/.test(url.pathname)),
    'vk-video': () => ['vkvideo.ru', 'www.vkvideo.ru', 'vk.com', 'www.vk.com'].includes(host) && /^\/video-?\d+_\d+\/?$/.test(url.pathname),
    podster: () => ['podster.fm', 'www.podster.fm'].includes(host) && /^\/podcasts\/[^/]+\/e\/\d+(?:\/|$)/.test(url.pathname),
    'yandex-music': () => ['music.yandex.ru', 'music.yandex.com'].includes(host) && /^\/album\/\d+\/track\/\d+\/?$/.test(url.pathname),
    'apple-podcasts': () => host === 'podcasts.apple.com' && /^\d+$/.test(url.searchParams.get('i') ?? ''),
  };
  assert.ok(rules[link.platform]?.(), `recording: use an exact episode URL for a supported platform (${link.platform})`);
}
export function validateEpisode(episode, { day = today(), release = true } = {}) {
  const path = episode.slug;
  validSlug(episode.slug); validSlug(episode.id);
  assert.ok(Number.isInteger(episode.season) && episode.season > 0 && Number.isInteger(episode.number) && episode.number > 0, `${path}: season and number must be positive integers`);
  validDate(episode.date, `${path}.date`);
  assert.ok(episode.date <= day, `${path}: future recordings cannot be published`);
  localized(episode.title, `${path}.title`); localized(episode.intro, `${path}.intro`, texts); localized(episode.topics, `${path}.topics`, texts);
  assert.match(episode.duration ?? '', /^(?:\d+:)?[0-5]?\d:[0-5]\d$/, `${path}: use M:SS or H:MM:SS duration`);
  const parts = episode.duration.split(':').map(Number);
  const seconds = parts.reduce((sum, part) => sum * 60 + part, 0);
  const iso = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(episode.durationIso ?? '');
  assert.ok(seconds > 0 && iso && (+iso[1] || 0) * 3600 + (+iso[2] || 0) * 60 + (+iso[3] || 0) === seconds, `${path}: durationIso must match duration`);
  list(episode.media, `${path}.media`); episode.media.forEach(recording);
  assert.equal(new Set(episode.media.map((m) => m.platform)).size, episode.media.length, `${path}: duplicate recording platform`);
  if (episode.summary) localized(episode.summary, `${path}.summary`, summary);
  else assert.ok(episode.originalPath, `${path}: a native release needs a bilingual transcript-based summary`);
  for (const field of ['originalPath', 'deckPath', 'longreadPath']) if (episode[field]) localPath(episode[field], `${path}.${field}`);
  if (episode.materials) materialLinks(episode.materials, `${path}.materials`);
  if (episode.covers) localized(episode.covers, `${path}.covers`, (value, label) => { localPath(value, label); assert.match(value, /^\/covers\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp)$/, label); });
  if (episode.participants) {
    list(episode.participants, `${path}.participants`);
    for (const person of episode.participants) { localized(person.name, 'participant.name'); localized(person.role, 'participant.role'); if (person.url) https(person.url, 'participant.url'); }
  }
  if (release && (!episode.originalPath || episode.publication)) {
    const review = episode.publication;
    assert.ok(review, `${path}: publish through the reviewed episode workflow`);
    assert.equal(review.contentSha256, episodeHash(episode), `${path}: published content changed after review; publish a reviewed update`);
    assert.match(review.sourceSha256 ?? '', /^[a-f0-9]{64}$/, `${path}: recording source hash is missing`);
    assert.ok(['transcript', 'subtitles'].includes(review.sourceKind), `${path}: recording source kind is missing`);
    assert.ok(typeof review.reviewedAt === 'string' && !Number.isNaN(Date.parse(review.reviewedAt)), `${path}: review timestamp is missing`);
  }
}
export function validateRegistry(data, options = {}) {
  list(data.episodes, 'episodes');
  const ids = new Set(); const slugs = new Set(); const numbers = new Set();
  for (const episode of data.episodes) {
    validateEpisode(episode, options);
    for (const [set, value] of [[ids, episode.id], [slugs, episode.slug], [numbers, `${episode.season}.${episode.number}`]]) {
      assert.ok(!set.has(value), `Duplicate episode identity: ${value}`); set.add(value);
    }
  }
  const { map } = data;
  validDate(map.asOf, 'map.asOf');
  list(map.clusters, 'map.clusters');
  const clusters = new Set(map.clusters.map((c) => { localized(c.title, 'cluster.title'); validSlug(c.id); return c.id; }));
  assert.equal(clusters.size, map.clusters.length, 'Duplicate cluster');
  list(map.nodes, 'map.nodes');
  const nodes = new Set(map.nodes.map((node) => node.id));
  assert.equal(nodes.size, map.nodes.length, 'Duplicate map node');
  const linked = [];
  for (const node of map.nodes) {
    validSlug(node.id); assert.ok(clusters.has(node.cluster), `${node.id}: unknown cluster`);
    localized(node.label, `${node.id}.label`, texts);
    assert.ok(['episode', 'planned'].includes(node.kind), `${node.id}: invalid map kind`);
    if (node.episodeId) { assert.ok(ids.has(node.episodeId), `${node.id}: missing episode`); linked.push(node.episodeId); }
    else { assert.equal(node.kind, 'planned'); localized(node.title, `${node.id}.title`); localized(node.summary, `${node.id}.summary`); assert.ok(['next', 'planned', 'reserve'].includes(node.status), `${node.id}: invalid planning status`); }
  }
  assert.deepEqual(linked.sort(), [...ids].sort(), 'Every episode must map to exactly one topic');
  list(map.edges, 'map.edges', 0);
  const edges = new Set();
  for (const edge of map.edges) {
    assert.ok(nodes.has(edge.from) && nodes.has(edge.to) && edge.from !== edge.to, 'Invalid map edge');
    assert.ok(['continues', 'related'].includes(edge.kind), 'Invalid map edge kind');
    const key = [edge.from, edge.to].sort().join(':'); assert.ok(!edges.has(key), 'Duplicate map edge'); edges.add(key);
  }
}
export function validatePrep(prep, data) {
  validSlug(prep.slug);
  assert.ok(data.map.nodes.some((node) => node.id === prep.topic), `${prep.slug}: unknown map topic`);
  if (prep.source) localPath(prep.source, 'prep.source');
  if (prep.sources) materialLinks(prep.sources, 'prep.sources');
  for (const lang of languages) {
    const copy = prep[lang];
    for (const field of ['title', 'description', 'intro']) requireText(copy?.[field], `${prep.slug}.${lang}.${field}`);
    texts(copy.questions, `${prep.slug}.${lang}.questions`);
    if (copy.sections) { list(copy.sections, 'prep.sections', 0); copy.sections.forEach((section) => { requireText(section.title, 'section.title'); texts(section.paragraphs, 'section.paragraphs'); }); }
  }
  assert.equal(prep.en.questions.length, prep.ru.questions.length, 'Preparation questions must correspond across languages');
  assert.equal(prep.en.sections?.length ?? 0, prep.ru.sections?.length ?? 0, 'Preparation sections must correspond across languages');
}
export async function validateCoverFiles(episode, root) {
  for (const file of Object.values(episode.covers ?? {})) {
    const path = resolve(root, 'public', file.slice(1));
    assert.ok((await stat(path)).isFile(), `Missing cover: ${file}`);
    const bytes = await readFile(path);
    assert.ok(bytes.length > 128 && !bytes.subarray(0, 100).toString().startsWith('version https://git-lfs.github.com/spec/v1'), `Cover must be hydrated: ${file}`);
    const { default: sharp } = await import('sharp');
    const metadata = await sharp(bytes).metadata();
    assert.ok(['png', 'jpeg', 'webp'].includes(metadata.format) && metadata.width > 0 && metadata.height > 0, `Invalid cover image: ${file}`);
    await sharp(bytes).stats();
  }
}
export async function validateContent(root) {
  const data = await readJson(join(root, 'content/podcast.json'));
  validateRegistry(data);
  for (const episode of data.episodes) await validateCoverFiles(episode, root);
  const topics = new Set();
  for (const file of (await readdir(join(root, 'content/prep'))).filter((name) => name.endsWith('.json'))) {
    const prep = await readJson(join(root, 'content/prep', file));
    assert.equal(file, `${prep.slug}.json`, 'Prep filename must match its slug'); validatePrep(prep, data);
    assert.ok(!topics.has(prep.topic), `Duplicate prep for topic: ${prep.topic}`); topics.add(prep.topic);
  }
  return data;
}
