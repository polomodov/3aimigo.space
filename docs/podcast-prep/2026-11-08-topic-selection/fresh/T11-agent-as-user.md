# T11. Агент как пользователь: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T11](../T11-agent-as-user.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T11-agent-as-user.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое

1. **Cloudflare, 04.11.** В аналитике категория Personal Assistants, политика на каждого агента (Allow, Block on pages with ads, Block); в раннем доступе видно, какого пользователя представляет агент, и можно блокировать один аккаунт. [Пост](https://blog.cloudflare.com/personal-agents-visibility-control/), вендор. Новый повод, дополняет факт 10.
2. **Cloudflare, 05.11.** Коалиция Trusted Agent Delegation, четыре уровня раскрытия пользователя (Nothing, Session, Account, Unique). Участники не названы, механизм не определён, локальные агенты вне рамок. [Пост](https://blog.cloudflare.com/trusted-agent-delegation/), вендор. Главный повод, поддерживает тезис.
3. **curl, 03.11.** Отчёты LOW и MEDIUM с 26.10 идут в публичные issues; больше 90 % заявок ниже HIGH. Причина: «avalanche» отчётов, включая ИИ-исследователей. [Пост](https://daniel.haxx.se/blog/2026/11/03/scrutinize-our-assessments/), [правило 20.10](https://daniel.haxx.se/blog/2026/10/20/do-minor-curl-vulnerabilities-in-the-open/), мейнтейнер. Дополняет §4.
4. **Willison, 02.11.** llm 0.37: правки 12 авторов, почти все с ИИ; с триажем моделями нагрузка ниже ожиданий. [Пост](https://simonwillison.net/2026/Nov/2/llm/), блог, один проект. Контекст, контрпозиция.
5. **GitHub, 02.11.** `pull_request_target` в публичных репозиториях блокируется по умолчанию с 02.12 (было 02.11). [Changelog](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2), вендор. Контекст: безопасность, ИИ не упомянут.

## Устарело в досье

- Факт 12: в пересмотре отказано 10.09; 21.09 Amazon уточнила иск: «No user device touches Amazon's servers». Это заявления Amazon, [TNW](https://thenextweb.com/news/amazon-blocks-muse-perplexity-amended-complaint), пресса.
- [48]: актуальна [-01 от 29.10](https://datatracker.ietf.org/doc/draft-ietf-webbotauth-httpsig-protocol/), истекает 02.05.2027; делегирование всё ещё вне рамок.
- §2: [Lighthouse](https://github.com/GoogleChrome/lighthouse/releases) с 13.5.0 проверяет и ARD (теперь `ard.json`).
- Не подтверждено, п. 8: [Mintlify, 30.10](https://www.mintlify.com/blog/modern-docs-playbook), вендор: 78 %, но запросы против загрузок страниц.
- П. 12: ст. 50 без общей отсрочки, для старых генеративных систем маркировка до 02.12: [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force), юрфирма.
- П. 5: WebMCP вне [Standards Track](https://webmachinelearning.github.io/webmcp/) (черновик 02.11).

Без изменений на 07.11: девять настроек, шесть репозиториев; Moderate недоступна.

## Срок годности темы

- 09.11 и 16.11: пробные блокировки GitHub; 02.12: постоянная.
- 18.11, 00:30 UTC: webbotauth на IETF 127 ([повестка](https://datatracker.ietf.org/doc/agenda-127-webbotauth/)).

## Другие уже обсудили

- [Latent Space, Supabase, 28.10](https://latent.space/p/supabase/): конверсия выросла, чисел нет.
- [Changelog #687, Resend, 22.10](https://changelog.com/podcast/687): главы об AX; расшифровки нет.

Судя по описаниям, мейнтейнеры и замеры AX не в центре.

## Не удалось проверить

Лимит WebSearch кончился: русский запрос один (в окне ничего); Neon, доля Supabase, история о Vercel, ноябрьские политики PR не искались. Не открыты: HUMAN (403), первичка Ahrefs, Radar 57,5/61 %. Не подтверждены origin trial WebMCP, ноябрьское движение дела Amazon.
