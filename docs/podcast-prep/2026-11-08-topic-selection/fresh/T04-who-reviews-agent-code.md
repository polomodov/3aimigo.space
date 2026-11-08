# T4. Кто ревьюит код агента: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T4](../T04-who-reviews-agent-code.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T04-who-reviews-agent-code.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое
1. **Ядро Linux убрало тег Assisted-by.** [Коммит](https://github.com/torvalds/linux/commit/1e035297ffda) от 14.10 вошёл в v7.4-rc1 (01.11): тег стоял примерно на 10 % из 18 533 коммитов 7.3 (до rc7) и сигнала не давал. Signed-off-by и ответственность человека остались. Первичный документ. Меняет факт.
2. **Thoughtworks Radar 35**, 04.11: [«Human-in-the-loop theater»](https://www.thoughtworks.com/es-cl/radar/techniques/human-in-the-loop-theater), кольцо Caution, одобрение как «accountability sink»; [ярусы риска](https://www.thoughtworks.com/radar/techniques/risk-tiered-human-oversight), кольцо Trial. Чисел нет. Мнение консалтинга. Новый повод.
3. **[CR-Bench-v2](https://arxiv.org/abs/2611.02566)**, 02.11, Nutanix: 584 задачи, лучшие агенты находят около 33 % известных дефектов, Gemini Code Assist 8,1 %; вывод: «not gate merges». Только Python, Copilot не проверяли. Препринт. Новый довод к факту № 1.
4. **[Foresight-SWE](https://arxiv.org/abs/2611.01181)**, 31.10: 212 задач, 11 моделей, задача решена без будущего дефекта в 6,13–24,53 %. Встроенное ревью поднимает долю (Opus 5 до 35,85 %), но снижает решаемость. Препринт. Контекст к S11.
5. **[GitHub, метрики](https://github.blog/changelog/2026-11-05-usage-metrics-api-adds-code-review-details-and-addressed-rate)**, 05.11: счётчик слитых PR без человеческого запроса правок после ревью Copilot, включая PR ботов. Вендор, значений нет. Новый повод: это не «прочитано».
6. **[GitHub, ревью](https://github.blog/changelog/2026-11-06-copilot-code-review-api-management-and-review-overview-updates)**, 06.11: уровень Balanced теперь три модели плюс агрегатор (провайдеры не названы). Вендор. Уточняет факт № 1.

## Устарело в досье
- S34 и кейс ядра: «атрибуция — тег Assisted-by» неверно для основной ветки.
- «28 октября GitHub сделал возможным»: это GA, [превью с 01.09](https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests).

## Срок годности темы
- 12.11, [AI Engineer Code Summit](https://www.ai.engineer/code/2026/schedule): «Code review without reviewing code» (Atlassian); расписание предварительное.
- 18.11, QCon SF: [Лори Восс](https://qconsf.com/presentation/nov2026/death-code-review).
- 11.12, [CRA](https://digital-strategy.ec.europa.eu/en/factpages/cyber-resilience-act-implementation): органы оценки соответствия, слабый повод; полное применение 11.12.2027.

## Другие уже обсудили
- Восс, [«The Death of the Code Review»](https://podwise.ai/episodes/9045197), 30.09 (читал пересказ).
- [Dev Interrupted, Роб Цубер](https://www.iheart.com/podcast/269-dev-interrupted-73784954/episode/why-the-traditional-pull-request-has-339747758/), 28.07: ответственность упомянута кратко.

В описаниях нет сравнения правил одобрения у вендоров; записи не слушал.

## Не удалось проверить
- Статья LWN о саммите заблокирована разрешениями, Phoronix вернул 403; причины взяты из сообщения коммита.
- Одобряет ли Copilot собственные PR, доля включивших: ответа нет.
- Amazon после июня, Сбер, Т-Банк, Avito, Ozon, ГОСТ Р 56939: в окне ничего, только поиск.
- DORA ROI не читал; Фогельс только во вторичных пересказах.
- Инциденты автослияния и новые опросы в окне: не нашёл.
- Вне окна: [LLVM](https://llvm.org/docs/AIToolPolicy.html) подтверждён, требует человека в контуре.
