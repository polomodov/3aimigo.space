---
name: create-podcast-episode
description: Prepare, publish or update a 3 AImigo podcast episode in 3aimigo.space, including research, scripts, bilingual public briefs, recording links and editorial summaries. Use for a concrete episode or its release; the requested scope determines which stages to perform.
---

# 3 AImigo episode workflow

Read [AGENTS.md](../../../AGENTS.md) and the
[local episode workflow](../../../docs/episode-workflow.md). This skill works in
this repository; it does not require a polomodov.tech checkout.

## Choose the scope

- **Prepare:** research, discussion script, announcement or future episode brief.
  Read [prepare](references/prepare.md).
- **Publish:** the recording is available and the episode should be released or
  updated. Read [publish](references/publish.md).
- **Full:** perform both stages with one stable slug.
- **Focused edit:** change the requested fields and their dependencies. Replacing
  one media URL does not justify rewriting the published summary.

Find the episode and topic in `content/podcast.json`, any public brief in
`content/prep/`, and its package in `production/episodes/`. Prefer editing an
existing package over creating duplicates. Preserve user edits and published prose.

## Invariants

1. English is primary. Russian uses `/ru`; episode URLs are `/episodes/<slug>/`,
   summaries append `summary/`, and preparation uses `/prep/<slug>/`.
2. A future draft is not a recording. Do not invent date, duration, media IDs,
   host quotations or summary content. A public brief may precede the recording.
3. Keep claims tied to primary sources, dates and limitations. Distinguish what
   the hosts plan to discuss from what they actually said.
4. Published recording links identify the exact episode. Raw transcript text and
   private contact data stay in ignored `.private/`, outside public content.
5. `content/podcast.json` is canonical. Use the local lifecycle CLI, respect its
   base-hash conflict check, and do not overwrite it with an import candidate.
6. Use [create-talk-summary](../create-talk-summary/SKILL.md) when writing a
   summary. It requires actual speech text and substantive bilingual editing.

Finish with the checks in the workflow. Report the draft/release status, actual
public routes and remaining source gaps. The local `publish` command edits data;
Git deployment, media upload and sending announcements are separate actions.
