import assert from 'node:assert/strict';
import { stat, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = process.env.BASE_PATH || '/';
const origin = new URL(process.env.SITE_ORIGIN || 'https://3aimigo.space').origin;
const files = (await readdir('dist', { recursive: true })).filter((file) => file.endsWith('/index.html') || file === 'index.html');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const canonicals = new Set();
const checkedPaths = new Set();
for (const file of files) {
  const html = await readFile(join('dist', file), 'utf8');
  const route = file.slice(0, -'index.html'.length);
  const ru = route.startsWith('ru/');
  const enRoute = ru ? route.slice(3) : route;
  const canonical = origin + base + route;
  assert.match(html, new RegExp('<html lang="' + (ru ? 'ru' : 'en') + '"'), file);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`), file);
  assert.ok(html.includes(`hrefLang="x-default" href="${origin + base + enRoute}"`), file);
  assert.ok(html.includes(`hrefLang="ru" href="${origin + base + 'ru/' + enRoute}"`), file);
  assert.ok(html.includes('<h1>'), file);
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), file);
  canonicals.add(canonical);
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    assert.ok(url.startsWith(base), `${file}: ${url} escapes the site base`);
    const path = url.slice(base.length).split(/[?#]/)[0];
    if (checkedPaths.has(path)) continue;
    checkedPaths.add(path);
    const target = path === '' || path.endsWith('/') ? path + 'index.html' : path;
    assert.ok((await stat(join('dist', target))).isFile(), `${file}: missing ${url}`);
  }
}
assert.ok(canonicals.has(origin + base));
assert.ok(canonicals.has(origin + base + 'ru/'));
assert.equal((sitemap.match(/<loc>/g) ?? []).length, canonicals.size);
console.log(`Verified ${canonicals.size} prerendered pages and ${checkedPaths.size} internal URLs.`);
