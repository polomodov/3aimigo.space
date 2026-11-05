import { formatDate, map, pathFor, preps, topicEpisode, topicStatus, topicTitle, original, type Lang, type Topic } from './data';
import { CLUSTER_BOXES, MAP_HEIGHT, MAP_WIDTH, edgeSegment, nodeBox, percentBox } from './map-layout';

const copy = {
  en: {
    filters: { all: 'All topics', covered: 'Discussed', plan: 'Planned', reserve: 'In reserve' },
    statuses: { covered: 'Discussed', next: 'Next episode', planned: 'Planned', reserve: 'In reserve' },
    legend: 'Arrows show which topic continues an earlier one; dashed lines connect topics that share a question.',
    filter: 'Filter by status', links: 'Connections', from: 'Continues', to: 'Continued in', related: 'Shared question',
    episode: 'Episode', read: 'Open episode', prep: 'Read the prep brief', source: 'Background reading',
  },
  ru: {
    filters: { all: 'Все темы', covered: 'Обсудили', plan: 'В плане', reserve: 'В резерве' },
    statuses: { covered: 'Обсудили', next: 'Следующий выпуск', planned: 'В плане', reserve: 'В резерве' },
    legend: 'Стрелки показывают продолжение темы, пунктир соединяет темы с общим вопросом.',
    filter: 'Фильтр по статусу', links: 'Связи', from: 'Вырастает из', to: 'Продолжение', related: 'Общий вопрос',
    episode: 'Выпуск', read: 'Открыть выпуск', prep: 'Подготовка к выпуску', source: 'Почитать по теме',
  },
} as const;

const byId = new Map(map.nodes.map((node) => [node.id, node]));
const defaultId = map.nodes.find((node) => topicStatus(node) === 'next')?.id ?? map.nodes[0].id;
const edgesFor = (id: string) => map.edges.filter((edge) => edge.from === id || edge.to === id);

function TopicButton({ node, lang, diagram = false }: { node: Topic; lang: Lang; diagram?: boolean }) {
  const status = topicStatus(node);
  const title = topicTitle(node, lang);
  return <button type="button" className="topic-button" data-topic={node.id} data-status={status}
    aria-pressed={node.id === defaultId} aria-label={`${title} · ${copy[lang].statuses[status]}`}
    style={diagram ? percentBox(nodeBox(node.id)) : undefined}>
    {diagram ? node.label[lang].map((line, i) => <span key={i}>{line}</span>) : <>{title}<small>{copy[lang].statuses[status]}</small></>}
  </button>;
}

function TopicDetail({ node, lang }: { node: Topic; lang: Lang }) {
  const t = copy[lang];
  const status = topicStatus(node);
  const episode = topicEpisode(node);
  const prep = preps.find((entry) => entry.topic === node.id);
  const neighbours = edgesFor(node.id);
  return <article className="topic-detail panel" data-detail={node.id} hidden={node.id !== defaultId}>
    <p className="kicker" data-status={status}>{t.statuses[status]}
      {episode ? ` · ${t.episode} ${episode.number} · ${formatDate(episode.date, lang)}` :
        node.month ? ` · ${formatDate(node.month, lang, { month: 'long', year: 'numeric' })}` : ''}
    </p>
    <h2 tabIndex={-1}>{topicTitle(node, lang)}</h2>
    <p>{episode?.intro[lang][0] ?? node.summary?.[lang]}</p>
    <div className="actions">
      {episode && <a className="button primary" href={pathFor(lang, `episodes/${episode.slug}`)}>{t.read} →</a>}
      {prep && <a className="button primary" href={pathFor(lang, `prep/${prep.slug}`)}>{t.prep} →</a>}
      {!prep && node.prepPath && <a className="button" href={original(node.prepPath, lang)}>{t.source} ↗</a>}
    </div>
    {neighbours.length > 0 && <>
      <h3 className="kicker muted">{t.links}</h3>
      <ul className="connections">{neighbours.map((edge) => {
        const target = byId.get(edge.from === node.id ? edge.to : edge.from)!;
        const label = edge.kind === 'related' ? t.related : edge.from === node.id ? t.to : t.from;
        return <li key={target.id}><button type="button" className="button" data-follow={target.id}>
          <small>{label}</small>{topicTitle(target, lang)}
        </button></li>;
      })}</ul>
    </>}
  </article>;
}

export function TopicMap({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const filters = Object.entries(t.filters);
  return <div data-topic-map data-default={defaultId}>
    <div className="actions filters" role="group" aria-label={t.filter}>
      {filters.map(([id, label]) => {
        const count = map.nodes.filter((n) => id === 'all' || topicStatus(n) === id || (id === 'plan' && ['planned', 'next'].includes(topicStatus(n)))).length;
        return <button type="button" className="button" data-filter={id} disabled={count === 0} aria-pressed={id === 'all'} key={id}>{label} <small>{count}</small></button>;
      })}
    </div>
    <ul className="legend">{Object.entries(t.statuses).map(([id, label]) =>
      <li data-status={id} key={id}><span aria-hidden="true" />{label}</li>)}</ul>
    <div className="diagram" data-diagram style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      {map.clusters.map((cluster) => <div className="diagram-cluster" key={cluster.id} style={percentBox(CLUSTER_BOXES[cluster.id])}>{cluster.title[lang]}</div>)}
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="diagram-edges" aria-hidden="true">
        <defs><marker id="topic-arrow" markerWidth="7" markerHeight="7" viewBox="0 0 10 10" refX="9" refY="5" orient="auto">
          <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </marker></defs>
        {map.nodes.map((node) => <g key={node.id} data-edges={node.id} className={node.id === defaultId ? '' : 'inactive-edges'}>
          {edgesFor(node.id).map((edge) => {
            const { start, end } = edgeSegment(edge.from, edge.to, 4);
            return <line key={`${edge.from}-${edge.to}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y}
              data-from={edge.from} data-to={edge.to} stroke="currentColor" strokeWidth="2" strokeDasharray={edge.kind === 'related' ? '6 5' : undefined}
              markerEnd={edge.kind === 'continues' ? 'url(#topic-arrow)' : undefined} />;
          })}
        </g>)}
      </svg>
      {map.nodes.map((node) => <TopicButton key={node.id} node={node} lang={lang} diagram />)}
    </div>
    <p className="map-note muted">{t.legend}</p>
    <div className="topic-list">
      {map.clusters.map((cluster) => <section key={cluster.id} data-cluster>
        <h2 className="kicker muted">{cluster.title[lang]}</h2>
        <div className="topic-buttons">{map.nodes.filter((node) => node.cluster === cluster.id).map((node) =>
          <TopicButton key={node.id} node={node} lang={lang} />)}</div>
      </section>)}
    </div>
    <div data-details>{map.nodes.map((node) => <TopicDetail key={node.id} node={node} lang={lang} />)}</div>
  </div>;
}
