# T10. Свои модели или фронтир: что вышло с 31.10 по 07.11.2026

Рабочие заметки поиска от 07.11.2026 к теме [T10](../T10-open-vs-frontier-models.md) и её [досье](../../../research/2026-10-31-3-aimigo-topics/T10-open-vs-frontier-models.md). Номера фактов и источников (S…) — из досье. Разбор и план темы прошли проверку; где заметки с ними расходятся, верны разбор и план.

## Новое

1. **Веса Kimi K3.1 Pro вышли [4.11](https://runtimewire.com/article/moonshot-ai-kimi-k3-1-pro-weights).** 2,8 трлн параметров, репозиторий 1,56 ТБ ([HF](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/tree/main)). Внутреннее использование свободно; сервисам-API с выручкой свыше $20 млн за 12 месяцев нужен договор ([лицензия](https://huggingface.co/moonshotai/Kimi-K3.1-Pro/blob/main/LICENSE)). [AA](https://artificialanalysis.ai/models/kimi-k3-1-pro): 46 баллов, $3,68 за задачу; Opus 5.5: 59, $10,04. Первичный документ, замер. **Меняет факт 1.**
2. **Revolut: свой инференс GLM, 56 NVIDIA B200.** Около 2000 инженеров, расходы на инференс для кодинга упали примерно на 90%. GPT и Claude заменены не полностью. Полной стоимости владения и метрик качества нет. [The Register, 3.11](https://www.theregister.com/ai-and-ml/2026/11/03/british-fintech-revolut-slashes-ai-coding-costs-10x-by-cutting-out-claude-and-going-self-hosted/5307345). Пресса со слов компании. **Новый повод:** первый в досье именованный заказчик со своим инференсом; мотив — цена.
3. **[Inkling 2 Small](https://thinkingmachines.ai/news/inkling-2-small/), 5.11.** Веса под Apache 2.0 обещаны «next week», если пройдут проверку безопасности. [AA](https://artificialanalysis.ai/articles/thinking-machines-releases-inkling-2-small-highest-scoring-open-weights-model-outside-of-chinia-upon-weights-release-it): 31 балл, $1,18; с весами — лучшая открытая модель вне Китая. Вендор, замер. **Новый повод.**
4. **ERNIE-5.5-Flash-Base, 5.11.** [Лицензия](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base/blob/main/LICENSE) исключает ЕС, Великобританию и Южную Корею; выше $50 млн годовой выручки нужно разрешение. Первичный документ. **Контекст:** неоднородность «открытых весов».
5. **OpenRouter.** 6.11 у DeepSeek 50,71% из 22,34 трлн токенов ([Dirac](https://dirac.run/labs-market-share), блог на данных OpenRouter), но 29,8% запросов за неделю с 26.10 ([OpenRouter](https://openrouter.ai/rankings), данные вендора). **Обновляет факт 4**, метрика другая.

## Устарело в досье

- «Лучшая выпущенная открытая модель ниже Haiku 5.5, на 26 ниже лидера». Теперь Kimi: 46, выше Haiku (36), на 14 ниже Carbon (60; расчёт). Разрыв остаётся.
- [Таблица AA](https://artificialanalysis.ai/leaderboards/models), v5.0.1: Carbon 60, Opus 59, DeepSeek 33, Haiku xhigh 35. Цены факта 2 прежние.

## Срок годности темы

- Неделя с 9.11: веса Inkling, условно.
- 12.11: вступают [политика регионов](https://www.anthropic.com/legal/supported-regions) и [AUP](https://www.anthropic.com/legal/aup) Anthropic. Отключение OpenAI у Cursor: об изменении даты сообщений не нашёл.
- I полугодие 2027: закрытие NVIDIA–Hugging Face ([Reuters через CPI](https://pymnts.com/cpi-posts/nvidias-12-9-billion-hugging-face-deal-draws-justice-department-questions), 28.10, вне окна).

## Другие уже обсудили

- Дэвид Абитбол (Revolut), AI Engineer, Нью-Йорк, октябрь. Запись не смотрел.
- Выделенных выпусков за окно в архивах Latent Space и Dwarkesh нет.

## Не удалось проверить

- Лимит WebSearch исчерпан: ограничения США на китайские модели, русскоязычные подкасты и релизы не искал.
- Не открылись: Epoch, OpenAI о Cursor, Yandex AI Studio, AI Journey.
- 243-ФЗ: принятого постановления не нашёл.
- Что изменилось в редакции Anthropic и почему AA перешёл на v5.0.1.
