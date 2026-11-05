import data from '../content/podcast.json';

export type Lang = 'en' | 'ru';
export type Localized<T> = Record<Lang, T>;
export type Episode = (typeof data.episodes)[number];
export type TopicMapClusterId = string;
export type Topic = (typeof data.map.nodes)[number];
export type Status = 'covered' | 'next' | 'planned' | 'reserve';
export type Prep = {
  slug: string; topic: string; source: string;
} & Localized<{ title: string; description: string; intro: string; questions: string[] }>;

export const { series, episodes, map } = data;
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

export const BASE = import.meta.env.BASE_URL;
export const pathFor = (lang: Lang, route = '') =>
  BASE + (lang === 'ru' ? 'ru/' : '') + (route ? `${route}/` : '');
export const asset = (name: string) => BASE + name;
export const original = (path: string, lang: Lang) =>
  'https://polomodov.tech' + (lang === 'en' ? '/en' : '') + path.replace(/\/$/, '') + '/';
export const formatDate = (date: string, lang: Lang, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', { timeZone: 'UTC', ...options })
    .format(new Date(date.length === 7 ? date + '-01T12:00:00Z' : date + 'T12:00:00Z'));
