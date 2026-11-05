import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = async (name) => JSON.parse(await readFile(new URL(name, import.meta.url), 'utf8'));
const { episodes, map, source } = await read('../content/podcast.json');
const langs = ['en', 'ru'];

test('episode dates, slugs and recordings describe unique, published episodes', () => {
  assert.ok(episodes.length > 0);
  assert.equal(new Set(episodes.map((e) => e.slug)).size, episodes.length);
  assert.equal(new Set(episodes.map((e) => `${e.season}.${e.number}`)).size, episodes.length);
  for (const e of episodes) {
    assert.match(e.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.date <= source.through, e.slug);
    assert.ok(e.media.length > 0, e.slug);
    for (const link of e.media) assert.equal(new URL(link.url).protocol, 'https:');
    for (const lang of langs) {
      assert.ok(e.title[lang]?.trim() && e.intro[lang]?.[0]?.trim(), `${e.slug} ${lang}`);
      if (e.summary) {
        const copy = e.summary[lang];
        assert.ok(copy.title && copy.lead && copy.sections.length && copy.takeaways.length, `${e.slug} ${lang}`);
      }
    }
  }
});

test('topic map covers each episode once and has valid connections', () => {
  const ids = new Set(map.nodes.map((n) => n.id));
  assert.equal(ids.size, map.nodes.length);
  assert.deepEqual(map.nodes.flatMap((n) => n.episodeId ?? []).sort(), episodes.map((e) => e.id).sort());
  const clusterIds = new Set(map.clusters.map((c) => c.id));
  for (const node of map.nodes) {
    assert.match(node.id, /^[a-z0-9-]+$/);
    assert.ok(clusterIds.has(node.cluster));
    assert.ok(node.episodeId || (node.title?.en && node.title?.ru && node.summary?.en && node.summary?.ru));
  }
  for (const edge of map.edges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to) && edge.from !== edge.to, JSON.stringify(edge));
  }
  assert.equal(new Set(map.edges.map((e) => [e.from, e.to].sort().join(':'))).size, map.edges.length);
});

test('public prep briefs have a map topic and questions in both languages', async () => {
  const files = await readdir(new URL('../content/prep/', import.meta.url));
  const slugs = new Set();
  for (const file of files.filter((file) => file.endsWith('.json'))) {
    const p = await read('../content/prep/' + file);
    assert.equal(file, p.slug + '.json');
    assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!slugs.has(p.slug));
    slugs.add(p.slug);
    assert.ok(map.nodes.some((n) => n.id === p.topic), p.slug);
    assert.match(p.source, /^\/[a-z0-9-]+$/);
    for (const lang of langs) {
      assert.ok(p[lang].title && p[lang].description && p[lang].intro && p[lang].questions.length);
    }
    assert.equal(p.en.questions.length, p.ru.questions.length, p.slug);
  }
});
