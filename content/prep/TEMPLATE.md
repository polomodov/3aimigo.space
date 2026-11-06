# Episode prep template / Шаблон подготовки выпуска

Use `npm run episode -- prepare --slug <slug> --topic <map-id> --number <n>` to create `production/episodes/<slug>/prep.json`. Read the [full workflow](../../docs/episode-workflow.md).

1. Keep `slug` stable and `topic` connected to the same map node throughout preparation and release.
2. Write `title`, `description`, `intro` and discussion `questions` in both `en` and `ru`. Questions must correspond in the same order.
3. Add optional `sections: [{ "title": "…", "paragraphs": ["…"] }]` inside each language for longer background. Keep section counts aligned.
4. Add public references under `sources: [{ "label": { "en": "…", "ru": "…" }, "url": { "en": "https://…", "ru": "https://…" } }]`. Internal URLs must include their locale (`/…/` or `/ru/…/`). The legacy `source` path is only for existing polomodov.tech material.
5. Review names, claims and sources, then run `npm run episode -- publish-prep --slug <slug>`. This updates the public brief; an episode is released separately after recording and summary review.

В публичный файл идут проверенные формулировки и источники. Исследования и сценарий остаются в рабочем пакете; расшифровки, записи и личные контакты — в игнорируемой `.private/`.
