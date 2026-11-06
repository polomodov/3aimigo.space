import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));

test('native releases render bilingual materials and retain the completed preparation brief', async (t) => {
  const cache = await mkdtemp(join(tmpdir(), '3aimigo-rendering-'));
  const server = await createServer({
    root, configFile: false, base: '/preview/', cacheDir: cache,
    server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom',
  });
  try {
    // Vite's module graph is isolated to this server. No source JSON or dist files change.
    const data = await server.ssrLoadModule('/src/data.ts');
    const prep = {
      slug: 'native-rendering-fixture', topic: 'native-rendering-fixture',
      sources: [{ label: { en: 'Fixture source', ru: 'Источник' }, url: { en: '/materials/', ru: '/ru/materials/' } }],
      en: { title: 'Native prep fixture', description: 'Fixture description', intro: 'Fixture introduction', sections: [{ title: 'Native section', paragraphs: ['Native paragraph'] }], questions: ['Fixture question?'] },
      ru: { title: 'Подготовка тестового выпуска', description: 'Описание', intro: 'Введение', sections: [{ title: 'Раздел', paragraphs: ['Абзац'] }], questions: ['Вопрос?'] },
    };
    const summary = (lang) => ({
      title: 'Native summary', description: 'Summary description', lead: 'Summary lead', sourceNote: 'Summary source note',
      sections: [{ title: 'Summary section', paragraphs: ['Summary paragraph'] }], takeaways: ['Takeaway'],
      sources: [{ label: 'Summary material', url: lang === 'en' ? '/materials/' : '/ru/materials/' }],
    });
    const episode = {
      id: '3-aimigo-native-rendering-fixture', slug: prep.slug, season: 2, number: 1, date: '2026-11-06', duration: '1:00', durationIso: 'PT1M',
      title: { en: 'Native fixture episode', ru: 'Тестовый выпуск' }, intro: { en: ['Intro'], ru: ['Введение'] }, topics: { en: ['Fixture'], ru: ['Тест'] },
      media: [{ platform: 'youtube', url: 'https://youtube.com/watch?v=abcdefghijk' }],
      materials: [{ label: { en: 'Fixture material', ru: 'Материал' }, url: { en: '/materials/', ru: '/ru/materials/' } }],
      covers: { en: '/covers/fixture-en.webp', ru: '/covers/fixture-ru.webp' },
      participants: [{ name: { en: 'Fixture participant', ru: 'Участник' }, role: { en: 'Fixture role', ru: 'Роль' } }],
      summary: { en: summary('en'), ru: summary('ru') },
    };
    const topic = { id: prep.topic, cluster: 'delivery', kind: 'planned', status: 'next', title: episode.title, summary: { en: 'Fixture topic', ru: 'Тема' }, label: { en: ['Native fixture'], ru: ['Тест'] } };
    data.map.nodes.push(topic);
    data.preps.unshift(prep);
    const { page } = await server.ssrLoadModule('/src/app.tsx');
    const html = (lang, route) => renderToStaticMarkup(page(lang, route).element);

    await t.test('unreleased prep appears on the homepage and renders its own sections and sources', () => {
      assert.match(html('en', ''), /Native prep fixture/);
      const brief = html('en', `prep/${prep.slug}`);
      assert.match(brief, /In preparation/);
      assert.match(brief, /Native paragraph/);
      assert.match(brief, /href="\/preview\/materials\/">Fixture source/);
      assert.doesNotMatch(brief, /Episode published/);
    });

    data.episodes.unshift(episode);
    data.episodesById.set(episode.id, episode);
    topic.episodeId = episode.id;
    topic.kind = 'episode';
    delete topic.status;

    await t.test('published prep remains linked while the homepage moves to the next unpublished topic', () => {
      const brief = html('en', `prep/${prep.slug}`);
      assert.match(brief, /Episode published/);
      assert.match(brief, /href="\/preview\/episodes\/native-rendering-fixture\/"/);
      assert.doesNotMatch(brief, /In preparation/);
      assert.match(html('en', 'prep'), /Episode published/);
      assert.doesNotMatch(html('en', ''), /Native prep fixture/);
    });

    await t.test('native materials, participants and covers render in both languages without legacy provenance', () => {
      for (const lang of ['en', 'ru']) {
        const prefix = '/preview/' + (lang === 'ru' ? 'ru/' : '');
        const released = html(lang, `episodes/${episode.slug}`);
        assert.ok(released.includes(`src="/preview/covers/fixture-${lang}.webp"`));
        assert.ok(released.includes(episode.participants[0].name[lang]));
        assert.ok(released.includes(`href="${prefix}materials/"`));
        assert.ok(released.includes(`href="${prefix}prep/${prep.slug}/"`));
        assert.ok(html(lang, 'materials').includes(episode.materials[0].label[lang]));
        assert.doesNotMatch(released, /Originally published on|Впервые опубликовано на/);
        const summaryHtml = html(lang, `episodes/${episode.slug}/summary`);
        assert.ok(summaryHtml.includes(`href="${prefix}materials/">Summary material`));
        assert.doesNotMatch(summaryHtml, /Originally published on|Впервые опубликовано на/);
      }
    });

    await t.test('imported episodes keep their original attribution', () => {
      const imported = data.episodes.find((entry) => entry.originalPath);
      assert.match(html('en', `episodes/${imported.slug}`), /Originally published on polomodov.tech/);
    });
  } finally {
    await server.close();
    await rm(cache, { recursive: true, force: true });
  }
});
