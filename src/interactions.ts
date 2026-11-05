export function activate() {
  const map = document.querySelector<HTMLElement>('[data-topic-map]');
  if (!map) return;
  const buttons = [...map.querySelectorAll<HTMLButtonElement>('[data-topic]')];
  const topics = new Map(buttons.map((button) => [button.dataset.topic!, button.dataset.status!]));
  let selected = topics.has(location.hash.slice(1)) ? location.hash.slice(1) : map.dataset.default!;
  let filter = 'all';
  const matches = (status: string) =>
    filter === 'all' || status === filter || (filter === 'plan' && ['next', 'planned'].includes(status));
  const language = document.querySelector<HTMLAnchorElement>('[data-language-switch]');
  const languagePath = language?.getAttribute('href');
  const panels = [...map.querySelectorAll<HTMLElement>('[data-detail]')];
  const details = map.querySelector<HTMLElement>('[data-details]')!;
  const mobile = window.matchMedia('(max-width: 1059px)');

  function update(focus = false) {
    const activePanel = panels.find((panel) => panel.dataset.detail === selected)!;
    panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
    for (const button of buttons) {
      button.hidden = !matches(button.dataset.status!);
      button.setAttribute('aria-pressed', String(button.dataset.topic === selected));
    }
    const mobileButton = buttons.find((button) => button.dataset.topic === selected && button.closest('.topic-list'));
    if (mobile.matches && mobileButton) mobileButton.after(activePanel);
    else details.append(activePanel);
    for (const edge of map!.querySelectorAll<SVGGElement>('[data-edges]')) {
      edge.classList.toggle('inactive-edges', edge.dataset.edges !== selected);
      if (edge.dataset.edges === selected) {
        for (const line of edge.querySelectorAll('line')) {
          const from = line.getAttribute('data-from')!;
          const to = line.getAttribute('data-to')!;
          line.style.display = matches(topics.get(from)!) && matches(topics.get(to)!) ? '' : 'none';
        }
      }
    }
    for (const cluster of map!.querySelectorAll<HTMLElement>('[data-cluster]')) {
      cluster.hidden = !cluster.querySelector('[data-topic]:not([hidden])');
    }
    for (const chip of map!.querySelectorAll<HTMLButtonElement>('[data-filter]')) {
      chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter));
    }
    if (language && languagePath) language.href = languagePath + (location.hash ? '#' + selected : '');
    if (focus) activePanel.querySelector('h2')?.focus();
  }

  map.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest('button');
    if (!button) return;
    const { topic, follow, filter: nextFilter } = button.dataset;
    if (!topic && !follow && !nextFilter) return;
    if (nextFilter) {
      filter = nextFilter;
      if (!matches(topics.get(selected)!)) selected = [...topics].find(([, status]) => matches(status))?.[0] ?? selected;
    } else {
      selected = (topic ?? follow)!;
      if (!matches(topics.get(selected)!)) filter = 'all';
    }
    history.replaceState(null, '', '#' + selected);
    update(Boolean(follow || (topic && mobile.matches)));
  });

  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    selected = topics.has(id) ? id : map.dataset.default!;
    if (!matches(topics.get(selected)!)) filter = 'all';
    update();
  });
  mobile.addEventListener('change', () => update());
  update();
}
