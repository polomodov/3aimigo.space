# T12. Легаси и миграции: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T12](../T12-legacy-migrations.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T12-legacy-migrations.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое
1. **Microsoft, Copilot Cowork.** Python → Rust на живом трафике, переключение 23.09–10.10, удалено ≈4,9 млн строк (с тестами и генерируемым кодом), ≈430 фикстур снято с Python. Фикстуры не поймали порядок событий, агенты-ревьюеры пропустили 4 блокирующие проблемы. [02.11](https://commandline.microsoft.com/how-we-built-copilot-cowork-python-to-rust-migration/), данные вендора. Новый повод.
2. **Bloomberg.** 2 333 PR, слито 729: сборка C++ 34,2 %, упаковка Python 10,5 %; без решения владельцев 57,7 и 67,7 %. [03.11](https://arxiv.org/abs/2611.05457), препринт, данные о себе, без контрольной группы. Новый повод.
3. **Accepted but Wrong.** Типичные входы пропускали 41 % неверных правок, один крайний вход из release notes: 6,5 %. Правки выбирались из авторского меню. [05.11](https://arxiv.org/abs/2611.08269), препринт. Опора для §4.
4. **Лицензии.** [69 переписываний](https://arxiv.org/abs/2611.07887) (05.11): один низкий JPlag не доказывает независимость, а им защищался chardet. [Launder-Bench](https://arxiv.org/abs/2611.01966) (01.11): лучший статический метод, AUROC 0,66. Препринты. Повод к вопросу 4.
5. **Req2Rust.** Против базового Claude Code: 69,5 → 91,9 %, OpenHarmony 45,4 → 87,9 %. [05.11](https://arxiv.org/abs/2611.07442), препринт авторов инструмента. Контекст.

## Устарело в досье
- **§4 TRACTOR, «чисел нет».** [Второй отчёт](https://github.com/DARPA-TRACTOR-Program/Reports) (выложен 26.10, вне окна; независимый оценщик): 100 % на 86 тестах, 96,3 % на ≈100 тыс. строк libgit2. Доводить небезопасный код труднее, чем генерировать сразу; наш вывод: это вопрос к отложенному идиоматичному Rust в Bun. Код отредактирован, конкурентности нет; с 32,8–52,3 % несравнимо.
- **№11 Ladybird.** [Рантайм LibJS тоже на Rust](https://ladybird.org/newsletter/2026-10-31) (31.10, вендор).
- **§2 AWS.** [Живая страница](https://aws.amazon.com/transform/): 15 млрд строк, 3,5 млн часов.
- **Не подтверждено → подтвердилось:** [chardet](https://www.theregister.com/2026/03/06/ai_kills_software_licensing/), [Hunt](https://www.theregister.com/2025/12/24/microsoft_rust_codebase_migration/), [Hacktron 45/24](https://hacktron.ai/blog/hacking-cloudflare-vinext).
- **Вне окна, в досье нет:** [OpenAI](https://bleepingcomputer.com/news/artificial-intelligence/openai-says-gpt-61-sol-is-dramatically-better-at-migrating-legacy-code) (19.10): COBOL 5,4 → 86,6 %, [тесты закрыты](https://letsdatascience.com/blog/openai-cobol-score-5-4-to-86-6-only-openai-can-check), пресса. [GitHub](https://www.infoq.com/news/2026/10/github-copilot-rust-migration/) (09.10): 800 000+ строк TypeScript → Rust за 14,5 недели.

## Срок годности темы
- 18.11: [VibeKode](https://www.innoq.com/de/talks/2026/11/agentic-software-modernization-back-to-the-roots-vibekode-berlin-2026/), Harrer.
- 30.11–01.12: [HighLoad++](https://highload.ru/moscow/2026), [Лапшин, Erlang → Rust](https://highload.ru/moscow/2026/abstracts/10953764): может закрыть «российских кейсов нет»; цифры заявлены докладчиком.
- 30.11–04.12: [re:Invent](https://aws.amazon.com/transform/), 200+ сессий о миграциях.

## Другие уже обсудили
[Syntax #992](https://syntax.fm/show/992/migrating-legacy-code-just-got-easier) (01.04), [Thoughtworks](https://www.thoughtworks.com/insights/podcasts/pragmatism-in-practice/why-ai-alone-wont-modernize-legacy-systems) (13.08). По описаниям, оракул не главный сюжет; выпуски не слушал.

## Не удалось проверить
Поисковый лимит кончился рано; русский поиск: один запрос, Хабр не смотрел. Оригинал OpenAI отдал 403. Не подтверждены даты Ignite, поставка IBM Elevate, первоисточник «семи уязвимостей» Vercel. DOGE и GitClear не проверял.
