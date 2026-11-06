import data from '../content/podcast.json';

export type Lang = 'en' | 'ru';
export type Localized<T> = Record<Lang, T>;
export type Section = { title: string; paragraphs: string[] };
export type MaterialLink = { label: Localized<string>; url: Localized<string> };
export type Participant = { name: Localized<string>; role: Localized<string>; url?: string };
export type Summary = {
  title: string; description: string; lead: string; sourceNote: string;
  sections: Section[]; takeaways: string[]; sources: { label: string; url: string }[];
};
export type Publication = {
  reviewedAt: string; contentSha256: string; sourceSha256: string; sourceKind: 'transcript' | 'subtitles';
};
export type Episode = {
  id: string; slug: string; season: number; number: number; date: string;
  duration: string; durationIso: string;
  title: Localized<string>; intro: Localized<string[]>; topics: Localized<string[]>;
  media: { platform: string; url: string }[];
  originalPath?: string; longreadPath?: string; deckPath?: string;
  summary?: Localized<Summary>;
  materials?: MaterialLink[];
  covers?: Localized<string>;
  participants?: Participant[];
  publication?: Publication;
};
export type TopicMapClusterId = string;
export type Status = 'covered' | 'next' | 'planned' | 'reserve';
export type Topic = {
  id: string; cluster: TopicMapClusterId; kind: 'episode' | 'planned'; label: Localized<string[]>;
  episodeId?: string; status?: Exclude<Status, 'covered'>; month?: string;
  title?: Localized<string>; summary?: Localized<string>; prepPath?: string;
};
export type TopicMapData = {
  asOf: string;
  clusters: { id: TopicMapClusterId; title: Localized<string> }[];
  nodes: Topic[];
  edges: { from: string; to: string; kind: 'continues' | 'related' }[];
};
export type Prep = {
  slug: string; topic: string; source?: string; sources?: MaterialLink[];
} & Localized<{
  title: string; description: string; intro: string; questions: string[]; sections?: Section[];
}>;

// Runtime validation owns the JSON boundary; optional types must survive publishing
// the last planned topic or adding the first native episode.
export const { series } = data;
export const map = data.map as TopicMapData;
export const episodes = data.episodes as Episode[];
export const TOPIC_MAP_CLUSTERS = map.clusters;
export const TOPIC_MAP_NODES = map.nodes;
export const episodesById = new Map(episodes.map((e) => [e.id, e]));
export const topicEpisode = (topic: Topic) => topic.episodeId ? episodesById.get(topic.episodeId) : undefined;
export const topicTitle = (topic: Topic, lang: Lang) =>
  topicEpisode(topic)?.title[lang] ?? topic.title?.[lang] ?? topic.label[lang].join(' ');
export const topicStatus = (topic: Topic): Status => {
  if (topicEpisode(topic)) return 'covered';
  if (topic.status === 'next' || topic.status === 'planned' || topic.status === 'reserve') return topic.status;
  throw new Error(`Unknown status on ${topic.id}`);
};

export const preps = Object.values(import.meta.glob<Prep>('../content/prep/*.json', {
  eager: true, import: 'default',
}));

export const prepEpisode = (prep: Prep) => {
  const topic = map.nodes.find((node) => node.id === prep.topic);
  return topic ? topicEpisode(topic) : undefined;
};
export const episodePrep = (episode: Episode) =>
  preps.find((prep) => prepEpisode(prep)?.id === episode.id);

export const BASE = import.meta.env.BASE_URL;
export const pathFor = (lang: Lang, route = '') =>
  BASE + (lang === 'ru' ? 'ru/' : '') + (route ? `${route}/` : '');
export const asset = (name: string) => BASE + name.replace(/^\//, '');
// Localized links contain their complete site path, including /ru/ for Russian.
export const materialHref = (url: string) => url.startsWith('/') ? asset(url) : url;
export const original = (path: string, lang: Lang) =>
  'https://polomodov.tech' + (lang === 'en' ? '/en' : '') + path.replace(/\/$/, '') + '/';
export const formatDate = (date: string, lang: Lang, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { timeZone: 'UTC', ...options })
    .format(new Date(date.length === 7 ? date + '-01T12:00:00Z' : date + 'T12:00:00Z'));
