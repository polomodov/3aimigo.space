# T6. Нужны ли тимлиды: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T6](../T06-team-leads-and-agents.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T06-team-leads-and-agents.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

Крупных событий в окне не нашёл, но поиск оборвался (см. конец). Самое сильное досье пропустило до окна.

## Новое

1. [Granitzer et al., arXiv 2611.00689](https://arxiv.org/abs/2611.00689), 31.10; препринт. Четыре недели, 9→19 агентов и двое людей. P90 ответа человека-координатора 0,5 → 4,2 ч, медиана координатора-агента — минута. Релиз ждал проверок в среднем 3,3 ч, деплой — 8 минут. Люди — сами авторы, контроля нет, разметка агентом. Новый повод, усиливает факт 8. (уточнено в разборе: подтверждённого повода у темы нет, препринт взят как факт)
2. [Cuadron, Gupta, arXiv 2611.02207](https://arxiv.org/abs/2611.02207), 01.11; препринт, бенчмарк. Одиночные запросы около 95%, цепочки около 51%; правильность реализации агенты оценивают с точностью около 53%. Контекст к ревью.
3. [Каккар, The Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-software-engineering-is-changing), 03.11; блог. Около 10 человек, без PM, у фичи один владелец, риск — bus factor. Контекст.

## Устарело в досье

Опорные факты не опровергнуты; у Chou et al. только v1. Вне окна, но не учтено:

- [Reuters, 26.08](https://bnnbloomberg.ca/business/company-news/2026/08/26/mark-zuckerberg-had-a-bold-plan-to-replace-meta-staff-with-ai-heres-how-it-imploded/) (перепечатка), Project OT: поды минимум в 11 подразделениях, Pod Lead без формальных полномочий. Изменения кода +220%, фичи +36%, инциденты +40%. (уточнено в разборе: числа даны без привязки к подам) Контраргумент досье (Google, Amazon, бюрократия) неполон.
- Meta: 50:1 в Applied AI Engineering, [обещают снизить](https://aiweekly.co/alerts/zuckerberg-admits-meta-mistakes-in-ai-workforce-shift) (агрегатор, 13.06); [части исполнителей предложили вернуться в менеджеры](https://fortune.com/2026/09/12/meta-year-of-efficiency-managers-ai-investment/) (пресса, 12.09). К открытому вопросу 4.
- [Bain, 29.09](https://www.bain.com/insights/the-half-finished-redesign-how-ai-reshapes-software-organizations-technology-report-2026/), консалтинг, n=155: пирамиды 66% → 29%, 70% решают централизованно.
- [Anthropic, 27.10](https://www.anthropic.com/research/agents-judgment-calls), вендор, РКИ: 50 аналитиков выбрали вариант агента в 86% решений, 15% упомянули агента. (уточнено в плане T7: уклон агента усилен намеренно, навык не измерен)
- Россия: [Сбер, 19.06](https://expert.ru/ru/news/german-gref-soobschil-o-sokraschenii-65-regionalnykh-upravlentsev-za-schet-vnedreniya-ii), минус 65% кураторов отделений, большинство переведено.

## Срок годности темы

- 16–18.11: [QCon SF](https://infoq.com/news/2026/10/qconsf-2026-sessions), доклад OpenAI о решениях, оставшихся за людьми.
- Конец 2026: горизонт прогноза Gartner (по Deloitte из досье).
- Ноябрьская волна Meta отменена: повода не будет.

## Другие уже обсудили

- Ларсон у Ороса, 21.10 (в досье).
- [We Built What?](https://www.augmentcode.com/resources/podcast/has-the-role-of-an-engineering-leader-changed), Ойстершек, 25.06: ядро роли прежнее, менеджеры уходят в исполнители.
- Русскоязычного выпуска не нашёл; у [Podlodka](https://podlodka.io/podcast-records) нет, судя только по заголовкам.

## Не удалось проверить

Бюджет поиска кончился: Q3-звонки Meta и Amazon, прогнозы на 2027 год, NBER не просмотрены. Недоступны OpenAI, Gartner (75% возврата менеджеров — только выдача), LeadDev, Gallup, McKinsey, сайты QCon и TeamLead Conf. Meta 93% и Uber не перепроверены. По Яндексу и Т-Банку ничего; Avito и Ozon не искал.
