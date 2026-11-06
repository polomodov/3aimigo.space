import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const [checkout, day = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/London' }).format(new Date()), output] = process.argv.slice(2);
if (!checkout || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
  throw new Error('Usage: npm run import:polomodov -- /path/to/polomodov [YYYY-MM-DD] [candidate.json]');
}
const upstream = resolve(checkout);
const root = fileURLToPath(new URL('../', import.meta.url));
const candidate = resolve(root, output || `.private/imports/polomodov-${day}.json`);
if (candidate === resolve(root, 'content/podcast.json')) throw new Error('Import creates a review candidate; it cannot replace the public registry.');
const load = (file) => import(pathToFileURL(resolve(upstream, file)).href);
const json = async (file) => JSON.parse(await readFile(resolve(upstream, file), 'utf8'));
const { getPodcastSeriesById } = await load('src/data/podcastSeriesEpisodes.ts');
const { THREE_AIMIGO_HOSTS } = await load('src/data/threeAimigoSeriesMeta.ts');
const { TOPIC_MAP_NODES, TOPIC_MAP_EDGES, TOPIC_MAP_CLUSTERS, THREE_AIMIGO_TOPIC_MAP_AS_OF } =
  await load('src/data/threeAimigoTopicMap.ts');

const series = getPodcastSeriesById('3-aimigo');
const pair = (en, ru) => ({ en, ru });
const material = (copy) => ({
  title: copy.title, description: copy.description, lead: copy.lead, sourceNote: copy.sourceNote,
  sections: copy.sections, takeaways: copy.takeaways,
  sources: copy.sources?.filter(({ url }) => url?.startsWith('https://')).map(({ label, url }) => ({ label, url })) ?? [],
});
const visible = series.episodes.filter((e) => e.status !== 'scheduled' && e.publishedAt <= day);
const episodes = await Promise.all(visible.map(async (e) => {
  let summary;
  const file = e.number === 1 ? '2026-08-14-ai-in-software-development-now' : `3-aimigo/${e.slug}`;
  try {
    const source = await json(`src/content/summaries/${file}.json`);
    if (source.publishedAt <= day && source.en) summary = pair(material(source.en), material(source));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return {
    id: e.id, slug: e.slug, season: e.seasonNumber, number: e.number, date: e.publishedAt,
    duration: e.duration, durationIso: e.durationIso, title: pair(e.titleEn, e.titleRu),
    intro: pair(e.summaryEn, e.summaryRu), topics: pair(e.topicsEn, e.topicsRu),
    media: e.media.map(({ platform, url }) => ({ platform, url })),
    originalPath: e.path ?? `/3-aimigo/${e.slug}`,
    longreadPath: e.longreadPath, deckPath: e.digest?.deckPath, summary,
  };
}));

const episodeIds = new Set(episodes.map(({ id }) => id));
// Export only the published map. Do not read internal research or raw transcripts.
const nodes = TOPIC_MAP_NODES
  .filter((node) => node.kind === 'planned' || episodeIds.has(node.episodeId))
  .map(({ episodeId, ...node }) => episodeId && episodeIds.has(episodeId) ? { ...node, episodeId } : node);
const nodeIds = new Set(nodes.map(({ id }) => id));
const result = {
  source: { repository: 'https://github.com/polomodov/polomodov', revision: execFileSync('git', ['-C', upstream, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), through: day },
  series: {
    description: pair(series.descriptionEn, series.descriptionRu),
    hosts: THREE_AIMIGO_HOSTS.map((p) => ({ name: pair(p.nameEn, p.nameRu), role: pair(p.jobTitleEn, p.jobTitleRu), url: p.profileUrl })),
    media: series.media.map(({ platform, url }) => ({ platform, url })),
  },
  episodes,
  map: {
    asOf: THREE_AIMIGO_TOPIC_MAP_AS_OF, clusters: TOPIC_MAP_CLUSTERS, nodes,
    edges: TOPIC_MAP_EDGES.filter(({ from, to }) => nodeIds.has(from) && nodeIds.has(to)),
  },
};
await mkdir(dirname(candidate), { recursive: true });
await writeFile(candidate, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(`Wrote review candidate ${candidate}: ${episodes.length} episodes and ${nodes.length} topics from ${result.source.revision.slice(0, 8)}.`);
