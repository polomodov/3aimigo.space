# Preparing and publishing an episode

All new 3 AImigo episode work can be done in this repository. English is the
primary website language (`/`); Russian uses `/ru`. A draft, a public preparation
brief and a published recording are separate stages of the same episode.

## Files and ownership

| File | Purpose |
| --- | --- |
| `content/podcast.json` | Canonical published episodes, summaries and topic map |
| `content/prep/<slug>.json` | Reviewed bilingual preparation brief on the website |
| `production/episodes/<slug>/episode.json` | Release draft and base revision information |
| `production/episodes/<slug>/prep.json` | Editable public-brief candidate |
| `production/episodes/<slug>/research.md` | Claim/source ledger, dates, limitations and counterarguments |
| `production/episodes/<slug>/script.md` | Discussion flow, questions and recording notes |
| `production/episodes/<slug>/announcement.en.md` / `.ru.md` | Platform announcement copy |
| `.private/transcripts/<slug>.txt` | Local speech source; ignored by Git |
| `docs/research/` | Public editorial archive; not automatically site pages |

The `production/` files are tracked public preparation. Keep private guest
contacts, unapproved personal anecdotes and raw recordings in `.private/`.
Do not embed raw transcript text in `episode.json` or the public research file.

## 1. Start or update a preparation package

Choose an existing topic ID from `content/podcast.json` → `map.nodes`; dossier
filenames such as `T01` are editorial references, not necessarily map IDs.
Keep the episode slug stable across preparation, recording and release.

```bash
npm run episode -- prepare --slug agent-development-infrastructure --topic t1 --number 13 --season 1
```

`prepare` creates a local package. For an existing published slug it copies
that episode and records its base hash. For a new episode it uses the selected
topic to seed bilingual titles. It does not fabricate media, duration, date or
a summary and does not publish an episode. Existing draft work must be retained.

Fill `research.md` with a ledger: claim → primary source → check date → evidence
type → limitation → planned use. Distinguish measurements, vendor statements,
simulations, forecasts and the hosts' analysis. Preserve sample sizes and dates.
The [13-topic package](research/2026-10-31-3-aimigo-topics/README.md) is a useful
starting point, but its cutoff is historical.

Build `script.md` around the question, mechanism, evidence, counterargument,
tradeoffs, application and conclusion. Write announcements in both languages.
Keep proposed questions distinct from statements actually made in the recording.
A prepared deck or external longread can be a linked material; this repository
does not include polomodov.tech's deck authoring/rendering stack.

## 2. Publish the public preparation brief

Edit the package's `prep.json` and keep its EN/RU copy aligned. Required fields
are `slug`, `topic`, and `en`/`ru`, each containing `title`, `description`,
`intro` and `questions`. Optional sections extend the brief. New sources use
`{ "label": { "en": "…", "ru": "…" }, "url": { "en": "https://…", "ru": "https://…" } }`.
The legacy `source` field remains supported for existing polomodov.tech paths.

```bash
npm run episode -- publish-prep --slug agent-development-infrastructure
```

This validates the brief and copies it to `content/prep/`. It checks the captured
`basePrepHash` against the current public brief, then synchronizes the draft
hash so later edits can be published from the same package. After deployment,
the pages are `/prep/<slug>/` and `/ru/prep/<slug>/`. A public brief does not add
a recording to the published catalog or mark a topic as discussed.

## 3. Obtain the recording and actual speech source

Confirm the episode's release date, exact media URLs, participants and duration.
A channel, playlist or podcast-series landing page is not an episode recording.
Use a transcript supplied by the author, subtitles exported from the actual
recording, or an external transcription tool on the correct recording. This
repository does not include or pretend to run an automatic transcription service.

Read the resulting text and check that it matches the episode. Store the source
locally in `.private/transcripts/<slug>.txt` and set the draft's `recordingSource`
to `{ "kind": "transcript", "path": ".private/transcripts/<slug>.txt" }` (or
`"kind": "subtitles"`). The path must remain inside `.private/`. Correct ASR
names against primary sources; preserve meaningful uncertainty. Do not infer a
transcript, guest quotation or timestamp from a title, deck or announcement.

The source is required locally for the release check and publication. A fresh
checkout does not contain raw speech text; recover it from the authorized
original source when revising an episode. The published record retains source
kind and SHA-256 provenance, not the raw text.

## 4. Edit the bilingual episode and summary

`episode.json` is an envelope containing `schemaVersion: 1`, `topic`,
`baseEpisodeHash`, `basePrepHash`, `episode` and `recordingSource`. Keep the base hash as generated:
it protects published work from stale drafts. The `episode` object carries the
stable identity (`id`, `slug`, `season`, `number`), date, display and ISO duration,
bilingual `title`, `intro` and `topics`, exact `media`, optional materials/covers/
participants, and the bilingual `summary`.

Use [.agents/skills/create-talk-summary/SKILL.md](../.agents/skills/create-talk-summary/SKILL.md)
for the source-grounded summary. Each locale has `title`, `description`, `lead`,
`sourceNote`, `sections` (`title`, `paragraphs`), `takeaways` and `sources`
(`label`, `url`). Preserve the same argument, limitations and source identities
in both languages. Translate meaning rather than matching sentence count.
Do not overwrite an existing editorial summary with a generated scaffold.

A summary condenses the conversation; it is not a verbatim transcript. Public
recording links belong in its `sources`. Local file paths and transcript text
do not belong in public copy. Historical imported episode summaries remain
valid records; their migration provenance is distinct from new release evidence.

## 5. Check and apply the release locally

```bash
npm run episode -- check --slug agent-development-infrastructure --date YYYY-MM-DD
npm run episode -- publish --slug agent-development-infrastructure --date YYYY-MM-DD --reviewed
npm test
npm run build
```

Use a real release date in place of `YYYY-MM-DD`. `check` validates release
readiness without publishing. `--reviewed` records that the person or agent
performing the release has checked the speech source, facts, bilingual copy
and exact recording identity; it is not a request for an additional approval.
Do that editorial review before using the flag. Structural validation cannot
prove that prose faithfully reflects the recording.

`publish` validates the candidate and speech source, adds source provenance,
updates the published episode and its topic-map relationship in the canonical
registry, and writes the registry atomically. It then synchronizes the working
episode and `baseEpisodeHash`, ready for the next update in the same package.
It supports a retry of the same release, including recovery if draft sync
failed, and rejects a draft whose published base changed. If a conflict occurs,
compare the current episode and your draft, create a fresh draft as appropriate,
and deliberately reapply the intended edits. Do not force an old hash to match.
A missing source or incomplete summary is a reason to keep preparing, not to
bypass the check with placeholder text.

For a future episode such as S1E13, an empty recording/date/summary is intentional.
Its release-readiness check should fail until recording and editorial work are
complete; a ready preparation brief can still be published independently.

## 6. Deliver and verify

Review the final diff and the English/Russian episode, summary and brief pages.
Check media identity, related links, topic-map state, readable narrow-screen
layout and generated metadata. `npm run build` prerenders and validates the
production output; do not commit `dist/` or `.ssg/`.

The CLI does not push Git, upload recordings, send announcements or change DNS.
Commit and push through the repository's normal GitHub Pages deployment when
that is within the user's requested scope. Check the deployment and live routes
before saying the site is published. Send platform messages only when requested.

`npm run import:polomodov` is a migration comparison tool: inspect its output
candidate and selectively merge useful changes. It must not replace the canonical
registry or erase episodes and summaries authored here.
