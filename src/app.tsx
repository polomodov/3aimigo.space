import type { ReactNode } from 'react';
import { asset, episodePrep, episodes, formatDate, map, materialHref, original, pathFor, prepEpisode, preps, series, type Episode, type Lang, type Prep } from './data';
import { TopicMap } from './topic-map';

const github = 'https://github.com/polomodov/3aimigo.space';
const labels = {
  en: {
    skip: 'Skip to content', episodes: 'Episodes', map: 'Topic map', materials: 'Materials', prep: 'Episode prep',
    title: 'AI in engineering, from three perspectives',
    hero: 'How does AI change the way we build software, run engineering teams, and design systems? Three hosts compare what works in practice and what still needs testing.',
    show: 'The podcast', latest: 'Latest episodes', archive: 'All episodes', browse: 'Explore the topic map',
    next: 'In preparation', released: 'Episode published', readPrep: 'Read the briefing', hosts: 'The hosts', participants: 'In this episode',
    episode: 'Episode', season: 'Season', watch: 'Watch or listen', audio: 'Original recordings in Russian',
    summary: 'Episode summary', longread: 'Read the longread', slides: 'View the slides', sources: 'Sources',
    notes: 'Key takeaways', questions: 'Questions for the discussion', reading: 'Background reading',
    details: 'Episode details', open: 'Open episode', basedOn: 'Originally published on polomodov.tech',
    materialsLead: 'Read the episode summaries and find the briefings, sources, longreads and slides that go with them.',
    prepLead: 'Read the briefings, questions and sources for upcoming discussions and published episodes.',
    episodeLead: 'Browse the archive, from engineering delivery and hiring to agent autonomy and the monthly AI digests.',
    mapLead: 'Follow the connections between questions we have discussed and topics we want to cover next.',
    mapNote: 'The order and dates of planned topics may change.',
    updated: 'Updated', onMap: 'Find this topic on the map', previous: 'Earlier episode', newer: 'Newer episode',
    notFound: 'Page not found', lost: 'This page may have moved. Start with the episode archive or the topic map.',
  },
  ru: {
    skip: 'К содержанию', episodes: 'Выпуски', map: 'Карта тем', materials: 'Материалы', prep: 'Подготовка',
    title: 'AI в инженерии: три точки зрения',
    hero: 'Как AI меняет разработку, работу инженерных команд и архитектуру систем? Три ведущих сравнивают, что уже работает на практике, а что ещё стоит проверить.',
    show: 'О подкасте', latest: 'Последние выпуски', archive: 'Все выпуски', browse: 'Открыть карту тем',
    next: 'Готовим выпуск', released: 'Выпуск опубликован', readPrep: 'К подготовке', hosts: 'Ведущие', participants: 'Участники выпуска',
    episode: 'Выпуск', season: 'Сезон', watch: 'Смотреть или слушать', audio: 'Записи на русском языке',
    summary: 'Конспект выпуска', longread: 'Читать лонгрид', slides: 'Открыть слайды', sources: 'Источники',
    notes: 'Главные выводы', questions: 'Вопросы к обсуждению', reading: 'Почитать перед выпуском',
    details: 'Страница выпуска', open: 'К выпуску', basedOn: 'Впервые опубликовано на polomodov.tech',
    materialsLead: 'Здесь собраны конспекты выпусков, подготовка, источники, лонгриды и слайды.',
    prepLead: 'Подготовка, вопросы и источники для следующих обсуждений и уже опубликованных выпусков.',
    episodeLead: 'Архив подкаста: от поставки и найма до автономности агентов и ежемесячных AI-дайджестов.',
    mapLead: 'Посмотрите, как связаны вопросы, которые мы уже обсудили, и темы, к которым хотим вернуться.',
    mapNote: 'Порядок и сроки выхода запланированных тем могут измениться.',
    updated: 'Обновлено', onMap: 'Найти тему на карте', previous: 'Предыдущий выпуск', newer: 'Следующий выпуск',
    notFound: 'Страница не найдена', lost: 'Возможно, она переехала. Начните с архива выпусков или карты тем.',
  },
} as const;

const platforms: Record<string, string> = {
  youtube: 'YouTube', podster: 'Podster', 'apple-podcasts': 'Apple Podcasts', 'yandex-music': 'Yandex Music', 'vk-video': 'VK Video',
};

const episodeRoute = (episode: Episode) => `episodes/${episode.slug}`;
const summaryRoute = (episode: Episode) => `${episodeRoute(episode)}/summary`;
const prepRoute = (prep: Prep) => `prep/${prep.slug}`;
const episodeNumber = (episode: Episode) => `S${episode.season}E${String(episode.number).padStart(2, '0')}`;

export const routes = [
  '', 'episodes', 'topic-map', 'materials', 'prep',
  ...episodes.flatMap((e) => e.summary ? [episodeRoute(e), summaryRoute(e)] : [episodeRoute(e)]),
  ...preps.map(prepRoute),
];

const Button = ({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) =>
  <a href={href} className={'button' + (primary ? ' primary' : '')}>{children}</a>;

function Heading({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: ReactNode }) {
  return <header className="page-head">
    <p className="kicker signal">{kicker}</p><h1>{title}</h1>{lead && <p className="lede">{lead}</p>}{children}
  </header>;
}

function Layout({ lang, route, children }: { lang: Lang; route: string; children: ReactNode }) {
  const t = labels[lang];
  const other = lang === 'en' ? 'ru' : 'en';
  const nav = [['episodes', t.episodes], ['topic-map', t.map], ['materials', t.materials], ['prep', t.prep]];
  return <>
    <a className="skip" href="#main">{t.skip}</a>
    <header className="masthead"><div className="wrap topbar">
      <a href={pathFor(lang)} className="brand"><span aria-hidden="true">&gt;_</span> 3 AImigo</a>
      <nav aria-label={lang === 'en' ? 'Main' : 'Основное меню'}>
        {nav.map(([key, title]) => <a key={key} href={pathFor(lang, key)}
          aria-current={route === key || route.startsWith(key + '/') ? 'page' : undefined}>{title}</a>)}
      </nav>
      <a className="lang-switch" data-language-switch href={pathFor(other, routes.includes(route) ? route : '')}
        lang={other} hrefLang={other}>{other === 'ru' ? 'Русский' : 'English'}</a>
    </div></header>
    <main id="main" className="wrap">{children}</main>
    <footer className="site-footer"><div className="wrap">
      <span className="brand"><span aria-hidden="true">&gt;_</span> 3 AImigo</span>
      <div className="footer-links"><a href={original('/3-aimigo', lang)}>polomodov.tech ↗</a><a href={github}>GitHub ↗</a></div>
    </div></footer>
  </>;
}

function MediaLinks({ media, primary = false }: { media: Episode['media']; primary?: boolean }) {
  return <div className="actions">{media.map(({ url, platform }, i) =>
    <Button key={platform} href={url} primary={primary && i === 0}>{platforms[platform] ?? platform} ↗</Button>
  )}</div>;
}

function EpisodeMeta({ episode, lang }: { episode: Episode; lang: Lang }) {
  return <p className="kicker muted episode-meta">
    <span className="signal">{episodeNumber(episode)}</span><time dateTime={episode.date}>{formatDate(episode.date, lang)}</time>
  </p>;
}

function EpisodeCard({ episode, lang, heading: Title = 'h3' }: { episode: Episode; lang: Lang; heading?: 'h2' | 'h3' }) {
  return <article className="panel episode-card">
    <EpisodeMeta episode={episode} lang={lang} />
    <Title><a href={pathFor(lang, episodeRoute(episode))}>{episode.title[lang]}</a></Title>
    <p>{episode.intro[lang][0]}</p>
    <a className="text-link" href={pathFor(lang, episodeRoute(episode))} aria-label={`${labels[lang].open}: ${episode.title[lang]}`}>
      {labels[lang].open} <span aria-hidden="true">→</span>
    </a>
  </article>;
}

function Home({ lang }: { lang: Lang }) {
  const t = labels[lang];
  const nextPrep = preps.find((prep) => !prepEpisode(prep));
  return <>
    <section className="hero">
      <div>
        <p className="kicker signal"><span className="signal-dot" /> 3 AImigo · {t.show}</p>
        <h1>{t.title}</h1>
        <p className="lede">{t.hero}</p>
        <div className="actions"><Button href={pathFor(lang, 'episodes')} primary>{t.episodes} →</Button>
          <Button href={pathFor(lang, 'topic-map')}>{t.browse} ↗</Button></div>
      </div>
      <div className="hero-art panel"><img src={asset('logo.webp')} width="879" height="424" alt="3 AImigo" /></div>
    </section>
    <section className="section">
      <div className="section-heading"><h2>{t.latest}</h2><a className="text-link" href={pathFor(lang, 'episodes')}>{t.archive} →</a></div>
      <div className="card-grid">{episodes.slice(0, 3).map((episode) => <EpisodeCard key={episode.id} episode={episode} lang={lang} />)}</div>
    </section>
    {nextPrep && <section className="section panel feature">
      <div><p className="kicker warm">{t.next}</p><h2>{nextPrep[lang].title}</h2><p>{nextPrep[lang].description}</p></div>
      <Button href={pathFor(lang, prepRoute(nextPrep))}>{t.readPrep} →</Button>
    </section>}
    <section className="section">
      <h2>{t.hosts}</h2>
      <div className="card-grid">{series.hosts.map((host) => <article className="panel host" key={host.url}>
        <h3><a href={host.url}>{host.name[lang]} ↗</a></h3><p>{host.role[lang]}</p>
      </article>)}</div>
    </section>
    <section className="section subscribe"><h2>{t.watch}</h2><p className="muted">{t.audio}</p><MediaLinks media={series.media} /></section>
  </>;
}

function Archive({ lang }: { lang: Lang }) {
  const t = labels[lang];
  return <>
    <Heading kicker="3 AImigo" title={t.episodes} lead={t.episodeLead} />
    <section aria-label={t.archive} className="card-grid archive">
      {episodes.map((episode) => <EpisodeCard key={episode.id} episode={episode} lang={lang} heading="h2" />)}
    </section>
  </>;
}

function MaterialLinks({ episode, lang, showSummary = true }: { episode: Episode; lang: Lang; showSummary?: boolean }) {
  const t = labels[lang];
  const prep = episodePrep(episode);
  return <div className="actions">
    {showSummary && episode.summary && <Button href={pathFor(lang, summaryRoute(episode))}>{t.summary} →</Button>}
    {episode.longreadPath && <Button href={original(episode.longreadPath, lang)}>{t.longread} ↗</Button>}
    {episode.deckPath && <Button href={original(episode.deckPath, lang)}>{t.slides} ↗</Button>}
    {episode.materials?.map(({ label, url }) => <Button key={url[lang] + label[lang]} href={materialHref(url[lang])}>
      {label[lang]} {url[lang].startsWith('/') ? '→' : '↗'}
    </Button>)}
    {prep && <Button href={pathFor(lang, prepRoute(prep))}>{t.readPrep} →</Button>}
  </div>;
}

function EpisodePage({ episode, lang }: { episode: Episode; lang: Lang }) {
  const t = labels[lang];
  const topic = map.nodes.find((node) => node.episodeId === episode.id);
  const index = episodes.indexOf(episode);
  const prev = episodes[index + 1];
  const next = episodes[index - 1];
  return <div className="reading">
    <a className="back text-link" href={pathFor(lang, 'episodes')}>← {t.archive}</a>
    <Heading kicker={`3 AImigo · ${episodeNumber(episode)}`} title={episode.title[lang]} lead={episode.intro[lang][0]}>
      <p className="kicker muted"><time dateTime={episode.date}>{formatDate(episode.date, lang)}</time>{episode.durationIso && <> · <time dateTime={episode.durationIso}>{episode.duration}</time></>}</p>
    </Heading>
    {episode.covers && <img className="episode-cover" src={asset(episode.covers[lang])} alt={episode.title[lang]} />}
    <section className="panel player">
      <h2>{t.watch}</h2><p className="muted">{t.audio}</p><MediaLinks media={episode.media} primary />
    </section>
    <section className="prose">{episode.intro[lang].slice(1).map((p) => <p key={p}>{p}</p>)}
      <ul className="tags">{episode.topics[lang].map((topic) => <li key={topic}>{topic}</li>)}</ul>
    </section>
    {!!episode.participants?.length && <section className="section"><h2>{t.participants}</h2>
      <ul className="participant-list">{episode.participants.map((participant) => <li key={participant.name[lang]}>
        <h3>{participant.url ? <a href={participant.url}>{participant.name[lang]} ↗</a> : participant.name[lang]}</h3>
        <p className="muted">{participant.role[lang]}</p>
      </li>)}</ul>
    </section>}
    <section className="section"><h2>{t.materials}</h2><MaterialLinks episode={episode} lang={lang} />
      <div className="actions secondary-links">
        {topic && <a className="text-link" href={pathFor(lang, 'topic-map') + '#' + topic.id}>{t.onMap} →</a>}
        {episode.originalPath && <a className="text-link" href={original(episode.originalPath, lang)}>{t.basedOn} ↗</a>}
      </div>
    </section>
    <nav className="episode-nav" aria-label={t.episodes}>
      {prev && <a href={pathFor(lang, episodeRoute(prev))}><small>← {t.previous}</small>{prev.title[lang]}</a>}
      {next && <a href={pathFor(lang, episodeRoute(next))}><small>{t.newer} →</small>{next.title[lang]}</a>}
    </nav>
  </div>;
}

function SummaryPage({ episode, lang }: { episode: Episode; lang: Lang }) {
  const t = labels[lang];
  const summary = episode.summary![lang];
  return <div className="reading">
    <a className="back text-link" href={pathFor(lang, episodeRoute(episode))}>← {t.details}</a>
    <Heading kicker={`${episodeNumber(episode)} · ${t.summary}`} title={summary.title} lead={summary.lead} />
    <article className="prose">
      {summary.sourceNote && <aside className="panel source-note">{summary.sourceNote}</aside>}
      {summary.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>
        {section.paragraphs.map((p) => <p key={p}>{p}</p>)}</section>)}
      <section><h2>{t.notes}</h2><ul>{summary.takeaways.map((p) => <li key={p}>{p}</li>)}</ul></section>
      {summary.sources.length > 0 && <section><h2>{t.sources}</h2><ul>{summary.sources.map(({ url, label }) =>
        <li key={url + label}><a href={materialHref(url)}>{label} {url.startsWith('/') ? '→' : '↗'}</a></li>)}</ul></section>}
    </article>
    {episode.originalPath && <a className="text-link" href={original(episode.originalPath + '/transcript', lang)}>{t.basedOn} ↗</a>}
  </div>;
}

function Materials({ lang }: { lang: Lang }) {
  const t = labels[lang];
  return <>
    <Heading kicker="3 AImigo" title={t.materials} lead={t.materialsLead} />
    <div className="rows">{episodes.filter((episode) => episode.summary || episode.longreadPath || episode.deckPath || episode.materials?.length || episodePrep(episode)).map((episode) =>
      <article key={episode.id} className="resource-row">
        <div><EpisodeMeta episode={episode} lang={lang} /><h2><a href={pathFor(lang, episodeRoute(episode))}>{episode.title[lang]}</a></h2></div>
        <MaterialLinks episode={episode} lang={lang} />
      </article>)}</div>
  </>;
}

function PrepIndex({ lang }: { lang: Lang }) {
  const t = labels[lang];
  return <>
    <Heading kicker="3 AImigo" title={t.prep} lead={t.prepLead} />
    <div className="card-grid">{preps.map((prep) => {
      const episode = prepEpisode(prep);
      return <article className="panel episode-card" key={prep.slug}>
        <p className={'kicker ' + (episode ? 'signal' : 'warm')}>{episode ? t.released : t.next}</p>
        <h2><a href={pathFor(lang, prepRoute(prep))}>{prep[lang].title}</a></h2>
        <p>{prep[lang].description}</p>
        <div className="actions"><a className="text-link" href={pathFor(lang, prepRoute(prep))}>{t.readPrep} →</a>
          {episode && <a className="text-link" href={pathFor(lang, episodeRoute(episode))}>{t.episode} {episodeNumber(episode)} →</a>}
        </div>
      </article>;
    })}</div>
  </>;
}

function PrepPage({ prep, lang }: { prep: Prep; lang: Lang }) {
  const t = labels[lang];
  const p = prep[lang];
  const episode = prepEpisode(prep);
  return <div className="reading">
    <a className="back text-link" href={pathFor(lang, 'prep')}>← {t.prep}</a>
    <Heading kicker={`3 AImigo · ${t.prep}`} title={p.title} lead={p.intro}>
      <p className={'kicker ' + (episode ? 'signal' : 'warm')}>{episode ? t.released : t.next}</p>
    </Heading>
    {episode && <aside className="panel source-note">
      <a className="text-link" href={pathFor(lang, episodeRoute(episode))}>{episodeNumber(episode)} · {episode.title[lang]} →</a>
    </aside>}
    <article className="prose">
      {p.sections?.map((section) => <section key={section.title}><h2>{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <section><h2>{t.questions}</h2><ol>{p.questions.map((q) => <li key={q}>{q}</li>)}</ol></section>
      {(prep.source || !!prep.sources?.length) && <section><h2>{t.reading}</h2><ul className="source-links">
        {prep.source && <li><a href={original(prep.source, lang)}>{t.longread} ↗</a></li>}
        {prep.sources?.map(({ label, url }) => <li key={url[lang] + label[lang]}>
          <a href={materialHref(url[lang])}>{label[lang]} {url[lang].startsWith('/') ? '→' : '↗'}</a>
        </li>)}
      </ul></section>}
    </article>
    <div className="actions section"><Button href={pathFor(lang, 'topic-map') + '#' + prep.topic}>{t.onMap} →</Button></div>
  </div>;
}

export function page(lang: Lang, route: string) {
  const t = labels[lang];
  const e = episodes.find((entry) => episodeRoute(entry) === route || summaryRoute(entry) === route);
  const prep = preps.find((entry) => prepRoute(entry) === route);
  const result = (title: string, description: string, body: ReactNode, episode?: Episode) => ({
    title: title ? title + ' · 3 AImigo' : '3 AImigo',
    description,
    element: <Layout lang={lang} route={route}>{body}</Layout>,
    episode,
  });
  switch (route) {
    case '': return result('', t.hero, <Home lang={lang} />);
    case 'episodes': return result(t.episodes, t.episodeLead, <Archive lang={lang} />);
    case 'materials': return result(t.materials, t.materialsLead, <Materials lang={lang} />);
    case 'prep': return result(t.prep, t.prepLead, <PrepIndex lang={lang} />);
    case 'topic-map': return result(t.map, t.mapLead, <>
      <Heading kicker="3 AImigo" title={t.map} lead={t.mapLead}><p className="muted map-note">
        {t.updated}: <time dateTime={map.asOf}>{formatDate(map.asOf, lang)}</time> · {t.mapNote}
      </p></Heading><TopicMap lang={lang} />
    </>);
  }
  if (e && route === episodeRoute(e)) return result(e.title[lang], e.intro[lang][0], <EpisodePage episode={e} lang={lang} />, e);
  if (e?.summary && route === summaryRoute(e)) return result(e.summary[lang].title, e.summary[lang].description, <SummaryPage episode={e} lang={lang} />);
  if (prep) return result(prep[lang].title, prep[lang].description, <PrepPage prep={prep} lang={lang} />);
  return result(t.notFound, t.lost, <Heading kicker="404" title={t.notFound} lead={t.lost}>
    <div className="actions"><Button href={pathFor(lang, 'episodes')} primary>{t.episodes} →</Button>
      <Button href={pathFor(lang, 'topic-map')}>{t.map} →</Button></div>
  </Heading>);
}
