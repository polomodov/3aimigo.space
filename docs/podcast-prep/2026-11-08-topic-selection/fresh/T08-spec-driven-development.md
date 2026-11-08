# T8. Spec-driven development: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T8](../T08-spec-driven-development.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T08-spec-driven-development.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое

1. **Radar vol. 35 вышел.** [OpenSpec](https://www.thoughtworks.com/radar/tools/openspec) поднят из Assess в Trial за spec-anchored дельты; [SDD](https://www.thoughtworks.com/radar/techniques/spec-driven-development) и [Spec Kit](https://www.thoughtworks.com/radar/languages-and-frameworks/github-spec-kit) в выпуск не вошли, отдельной оценки нет. 04.11, экспертная оценка консалтинга. Меняет факт.
2. **Там же [AI-driven documentation sprawl](https://www.thoughtworks.com/radar/techniques/ai-driven-documentation-sprawl), Caution:** называет Spec-kit и BMAD, «big ball of documentation mud». [Grilling](https://www.thoughtworks.com/radar/techniques/grilling) (агент интервьюирует автора) в Trial. 04.11. Главный новый повод.
3. **[Gated SDD в Claude Code](https://arxiv.org/abs/2611.05094):** 9 фич, 7 проектов авторов; завершены 5 из 9; незаявленные правки в 11 из 247 проверок, остановок 4. Слабое звено: оркестратор сам судит свои проверки. 03.11, препринт. Новый повод.
4. **[SDD и справедливость ML](https://arxiv.org/abs/2611.03231):** 97,22 % требований в спеке, 82,41 % в коде, модели значимо не справедливее. Прослеживаемо, но не исполнимо. 02.11, препринт. Контекст к тезису «в проверки».
5. **[Каскад моделей Kiro](https://kiro.dev/blog/model-cascade/):** pass@1 63,96 % у начальной, 69,37 % у каскада, 70,57 % у сильной; наверх передано 19,52 %; цены нет. 06.11, вендор. Контекст: маршрутизация без спеки.
6. **[Kiro и Lean](https://kiro.dev/blog/harness-properties-in-lean/):** из 96 свойств доказано 70, 18 опровергнуты и воспроизведены на коде. 02.11, вендор. Контекст: формальная спека как датчик.

## Устарело в досье

- «Radar выйдет 04.11» и строка в «Не подтверждено»: закрыто.
- Лагерь 2 относит журнал OpenSpec к spec-first; Radar называет OpenSpec spec-anchored.
- Spec Kit: не v1.1.0, а [v1.3.2](https://github.com/github/spec-kit/releases) (06.11; год выведен); в 1.3.0 `taskstoissues` убрана из ядра; 148,4 тыс. звёзд.
- OpenSpec: 74,2 тыс. звёзд.
- Репозиторий сайта polomodov.tech: 71 каталог фич Spec Kit, не 63; «хуков нет» неверно: 07.11 там добавлены советующие хуки Codex (ADR 0079).

## Срок годности темы

Подтверждённых будущих дат нет. Ближайший повод уже случился: Radar 04.11.

## Другие уже обсудили

- [Böckeler и Tacho](https://www.thoughtworks.com/en-in/insights/podcasts/technology-podcasts/what-is-spec-driven-development), 28.05.2026: уровни, водопад, непрочитанный markdown.
- [Brooker, AI Native Dev №123](https://tessl.io/podcast/123), 16.09.2026: спеки, оракулы.

Оба вышли до работы Jain, первый и до CMU.

## Не удалось проверить

- PDF Radar (503): проверены страницы блипов.
- Не открылись: OpenAI (82 %), arXiv 2606.13995, re:Invent, Highload.
- Лимит поиска исчерпан: русскоязычного из окна и российских кейсов не нашёл, ноябрьские конференции не проверены.
- `grill-me` как «дрилми» из E1: предположение.
