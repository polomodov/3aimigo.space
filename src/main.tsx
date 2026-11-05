import './style.css';
import { activate } from './interactions';

if (import.meta.env.DEV) {
  const [{ page }, { createRoot }, { flushSync }] = await Promise.all([
    import('./app'), import('react-dom/client'), import('react-dom'),
  ]);
  const [first, ...rest] = location.pathname.slice(import.meta.env.BASE_URL.length).split('/').filter(Boolean);
  const lang = first === 'ru' ? 'ru' : 'en';
  const route = (lang === 'ru' ? rest : [first, ...rest]).filter(Boolean).join('/');
  const current = page(lang, route);
  document.documentElement.lang = lang;
  document.title = current.title;
  flushSync(() => createRoot(document.getElementById('app')!).render(current.element));
}

activate();
