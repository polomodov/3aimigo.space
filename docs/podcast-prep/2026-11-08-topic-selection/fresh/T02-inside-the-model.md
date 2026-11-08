# T2. Что внутри модели: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T2](../T02-inside-the-model.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T02-inside-the-model.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое

1. Выложены веса Kimi K3.1 Pro: 2,8T, 104B активных, 46 баллов AA. [HF](https://huggingface.co/moonshotai/Kimi-K3.1-Pro), [TechNode](https://technode.com/2026/11/05/moonshot-ai-releases-kimi-k3-1-pro-model-weights/), 05.11. Первичный, пресса. Меняет факт. (уточнено в разборе T10: веса открыты 04.11; 05.11 — дата статьи TechNode)
2. Inkling 2 Small: 31 балл, $0,30/$1,00, $1,18 за задачу; против Inkling Small токенов вчетверо больше, задача почти вшестеро дороже. [AA](https://artificialanalysis.ai/articles/thinking-machines-releases-inkling-2-small-highest-scoring-open-weights-model-outside-of-chinia-upon-weights-release-it), 05.11. Замер. Наш расчёт: против GPT-6.1 Sol low (35 баллов, $0,16) выходной токен в 10 раз дешевле, задача в 7,4 раза дороже. Новый повод.
3. Message threads, бета: сервер хранит диалог, запрос несёт только новое, первый токен быстрее (чисел нет); цена и лимиты прежние, кеш сам не включается. [Anthropic](https://platform.claude.com/docs/en/build-with-claude/message-threads), 02.11. Вендор. Новый повод.
4. Водяной знак дошёл до старых моделей; на Sonnet 4.6 при нестандартной temperature может отсутствовать. [Anthropic](https://platform.claude.com/docs/en/release-notes/overview), 03.11. Вендор. Контекст к факту 7.
5. KVGuard: покрыто 29 прежних ошибок KV-кеша в vLLM и SGLang, найдено 8 новых. [arXiv](https://arxiv.org/abs/2611.06138), 04.11. Препринт, только аннотация. Контекст к Cloudflare.

## Устарело в досье

- «Лучшие выложенные веса — 32 балла»: теперь 46.
- «Лидер Opus 5.5, разрыв 12»: лидер [Gemini 4 Carbon](https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1) (28.10), [доступ ограничен](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/); в таблице 60, разрыв 14.
- [Таблица AA](https://artificialanalysis.ai/leaderboards/models): Opus 5.5 max 59, Sonnet 5.5 max 55, вровень с Sol; цены задач прежние, 7,9× в силе.
- Первый токен на max: Opus 729,62→369,34 с, Sol 315,06→203,17 с (столбец First Answer Token; сопоставимость не подтверждена).
- Снято: Terra [поддерживает](https://developers.openai.com/api/docs/models/gpt-6.1-terra) `none`; −53% [есть](https://arxiv.org/html/2609.26779) в приложении CliffCompaction; 44,6/77,2 у Min et al.: [завершения](https://arxiv.org/html/2608.06503), не «корректные».
- До окна, в досье нет: OpenAI 30.10 [сделала](https://developers.openai.com/api/docs/changelog) фоновое уплотнение умолчанием, токенов может стать больше; SGLang 26.10 [описал](https://www.lmsys.org/blog/2026-10-26-cf-security/) второй механизм утечки.

## Срок годности темы

- 16.11: [QCon SF](https://qconsf.com/presentation/nov2026/inside-disaggregated-architecture-serving-llm-inference), Cerebras о разделении стадий.
- 30.11: конец [скидки](https://developers.openai.com/api/docs/pricing) GPT-5.6 Sol; [снятие](https://platform.claude.com/docs/en/release-notes/overview) fast mode Opus 4.8; отключение [Sonnet 4.5](https://platform.claude.com/docs/en/about-claude/model-deprecations).
- 01.12: Gemini 4 Argon [вдвое дороже](https://aistudio.google.com/docs/pricing), $4/$20.

## Другие уже обсудили

- [Dwarkesh, Reiner Pope](https://www.dwarkesh.com/p/reiner-pope), 29.04: пакеты и цена длинного контекста; цены задачи и усилий в оглавлении нет.
- [Latent Space](https://www.latent.space/podcast), октябрь–ноябрь: профильного выпуска по заголовкам нет. Русскоязычного не нашёл (один поиск).

## Не удалось проверить

S-1, сентябрьский отчёт о дистилляции: только пересказы. Журнал DeepSeek не открылся. InferenceX: постов в окне нет. HighLoad++, Яндекс, AI Journey: лимит поиска исчерпан.
