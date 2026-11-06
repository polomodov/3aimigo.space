---
name: create-talk-summary
description: Create or update a bilingual editorial summary of a 3 AImigo episode in 3aimigo.space from its actual transcript or subtitles. Use for episode summaries and source-grounded revisions; not for inventing transcripts, transcribing audio, or translating unrelated text.
---

# A source-grounded episode summary

Read [AGENTS.md](../../../AGENTS.md) and the
[episode workflow](../../../docs/episode-workflow.md). Write a condensed editorial
retelling in English and Russian, labeled **Summary / Конспект**. The public
routes are `/episodes/<slug>/summary/` and `/ru/episodes/<slug>/summary/`.

## 1. Verify the episode and speech source

Find the canonical episode and its package. If updating an existing episode,
use the local `prepare` command so the package captures its base revision.
Preserve the stable slug and previously published editorial work.

Use an author-provided transcript, the actual recording's exported subtitles,
or text produced by an external transcription tool. The repository has no ASR
service or transcript generator. Read the text and match it to the recording;
a video description, announcement or deck is not a substitute for speech text.

Store raw text under ignored `.private/transcripts/` and set `recordingSource`
in `production/episodes/<slug>/episode.json`. Supported kinds are `transcript`
and `subtitles`. Do not commit the speech text. If it is missing, identify the
gap and keep the summary unpublished rather than creating a fictitious source.

## 2. Build the factual outline

Extract the central problem, 8–15 supported claims, disagreements, examples,
tradeoffs, limitations and conclusions. Group sections by meaningful turns of
the conversation. Use timestamps only when they were verified in the actual
recording or timed source.

Attribute assessments and forecasts to the speaker. Preserve evidence dates,
sample sizes, units and qualifications. A primary written source may resolve
an ASR spelling or citation; it must not silently add a claim the hosts never
made. Distinguish an editorial explanation from an attributed statement.

## 3. Write the local schema

Edit `episode.summary.en` and `.ru` in the draft envelope. Each locale contains:

- `title`, `description` and `lead`;
- `sourceNote`, describing relevant condensation or source limitations;
- `sections`: meaningful `title` plus one or more substantive `paragraphs`;
- `takeaways`: concrete conclusions supported by the discussion;
- `sources`: public `{ "label": "…", "url": "https://…" }` references, including
  the correct recording.

Keep the argument and section order aligned across languages. Paragraph counts
may differ. Write natural technical prose with concrete examples from the source.
Prefer a developed summary over a list of keywords; do not pad to an arbitrary
word count or repeat the same point to satisfy a gate. This schema does not use
the old site's `sourcePath`, `/transcript`, reading-time or transcript-inventory
fields. Source provenance is managed by the release command.

Do not copy platform marketing as the summary. Do not regenerate published prose
from a scaffold. For a focused correction, edit the requested fields and their
dependencies instead of rewriting the entire episode.

## 4. Review and release

Read both versions against the actual speech text. Check names, numbers, source
identity, attribution and the limits of every inference. Confirm that public
sources are useful and do not include local paths or private text.

Run `npm run episode -- check --slug <slug>`. To release the reviewed episode,
follow the parent episode workflow, including `publish ... --reviewed`, `npm test`
and `npm run build`. The review flag records your completed editorial review;
it is not a substitute for reading the source or a new user approval step.

Report the updated summary routes and checks. If a source gap prevents a faithful
summary, retain the draft and state the specific missing input.
