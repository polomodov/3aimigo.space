# ADR 0001: Local ownership of the episode lifecycle

- Status: accepted
- Date: 2026-11-06

## Context

3aimigo.space began as an English-first bilingual website imported from
polomodov.tech. Preparation research and publication procedures still lived in
the source repository. The podcast needs to prepare and publish its next episode
without editing or rebuilding the personal website.

## Decision

Own public preparation packages in `production/episodes/<slug>/`, public briefs
in `content/prep/`, and published episodes/summaries/topic relationships in
`content/podcast.json`. A stable slug joins the stages. Expose `prepare`,
`publish-prep`, `check` and `publish` through `npm run episode -- …`.

Preparation can exist before a recording. It must not fabricate date, duration,
media identity or transcript-derived copy. Publishing a brief does not create a
published recording. The website continues to use `/` for English and `/ru` for
Russian, with separate episode, summary and preparation routes.

A release requires a real local transcript/subtitle source, bilingual editorial
copy and exact media identity. Keep the speech source in ignored `.private/`;
record its kind and content hash in publication provenance. `--reviewed` is the
executor's editorial attestation. It does not automate factual review or ask
for a second user approval. Do not copy raw speech sources into the public repo.

Protect canonical data with an atomic registry write, a captured base episode
hash, stale-draft rejection and idempotent release retries. The original importer
produces review candidates instead of overwriting canonical data.

Migrate the 13-topic research package and directly related preparation documents
with immutable source references and SHA-256 receipts. Keep historical research
and validation dates intact. Adapt the episode and summary skills to the local
contract. The archive is public Git content but is not automatically rendered by
the website.

## Consequences

A new episode can be prepared and published using this checkout alone. Raw
speech sources remain locally recoverable inputs; someone revising a release
in a fresh checkout must obtain the real source. Existing imported episodes are
preserved rather than retroactively claiming a new source verification.

Git deployment, podcast hosting, announcement delivery and source transcription
are separate operations. This migration does not port the personal website's
slide renderer, global transcript corpus, audience-stat services or unrelated
podcast families. Related public materials can remain external links.
