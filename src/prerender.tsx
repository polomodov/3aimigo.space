import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { BASE, asset, pathFor, type Lang } from './data';
import { page, routes } from './app';

const languages = ['en', 'ru'] as const;
const origin = new URL(process.env.SITE_ORIGIN || 'https://3aimigo.space').origin;
const absolute = (path: string) => new URL(path, origin).href;
const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!-- page-head -->') || !template.includes('<div id="app"></div>')) {
  throw new Error('Missing prerender placeholders in index.html');
}
const href = (lang: Lang, route: string) => absolute(pathFor(lang, route));
const write = async (file: string, content: string) => {
  const target = join('dist', file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content);
};
for (const lang of languages) {
  for (const route of [...routes, '404']) {
    const current = page(lang, route);
    const schema = current.episode ? {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: current.episode.title[lang],
      description: current.description,
      url: href(lang, route),
      datePublished: current.episode.date,
      duration: current.episode.durationIso,
      episodeNumber: current.episode.number,
      inLanguage: 'ru',
      partOfSeries: { '@type': 'PodcastSeries', name: '3 AImigo', url: href(lang, '') },
      sameAs: current.episode.media.map(({ url }) => url),
    } : undefined;
    const head = renderToStaticMarkup(<>
      <title>{current.title}</title>
      <meta name="description" content={current.description} />
      {route === '404' ? <meta name="robots" content="noindex" /> : <>
        <link rel="canonical" href={href(lang, route)} />
        {languages.map((alternate) => <link key={alternate} rel="alternate" hrefLang={alternate} href={href(alternate, route)} />)}
        <link rel="alternate" hrefLang="x-default" href={href('en', route)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={current.title} />
        <meta property="og:description" content={current.description} />
        <meta property="og:url" content={href(lang, route)} />
        <meta property="og:image" content={absolute(asset('cover.webp'))} />
        <meta property="og:locale" content={lang === 'ru' ? 'ru_RU' : 'en_GB'} />
        <meta name="twitter:card" content="summary" />
        {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}
      </>}
    </>);
    const file = (lang === 'ru' ? 'ru/' : '') + (route === '404' ? '404.html' : (route ? route + '/' : '') + 'index.html');
    await write(file, template.replace('lang="en"', `lang="${lang}"`)
      .replace('<!-- page-head -->', () => head)
      .replace('<div id="app"></div>', () => `<div id="app">${renderToStaticMarkup(current.element)}</div>`));
  }
}

const urls = languages.flatMap((lang) => routes.map((route) =>
  `<url><loc>${href(lang, route)}</loc>${languages.map((l) =>
    `<xhtml:link rel="alternate" hreflang="${l}" href="${href(l, route)}" />`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${href('en', route)}" /></url>`));
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${absolute(BASE + 'sitemap.xml')}\n`);
await write('.nojekyll', '');
console.log(`Prerendered ${routes.length * languages.length} pages and locale alternates at ${absolute(BASE)}.`);
