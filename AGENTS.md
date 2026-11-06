# AGENTS.md

This is the public repository for the bilingual 3 AImigo podcast and
`https://3aimigo.space`. English is the default language; Russian uses `/ru`.
The repository owns the website, research archive, episode preparation and
publication workflow. Setup and deployment are in [README.md](README.md).

## Read before editing

- Episode preparation, publication and content: [episode workflow](docs/episode-workflow.md).
- Research or historical material: [editorial archive](docs/README.md) and
  [migration provenance](docs/migration/README.md).
- Workflow architecture: [ADR 0001](docs/adr/0001-local-episode-pipeline.md).
- For a concrete episode, use `.agents/skills/create-podcast-episode/SKILL.md`.
  For a transcript-grounded summary, use
  `.agents/skills/create-talk-summary/SKILL.md`. Cover work has its own
  `.agents/skills/three-aimigo-cover/SKILL.md`.

## Ownership and invariants

- `content/podcast.json` is the canonical published series, episode and topic-map
  registry. Do not replace it with a new import from polomodov.tech. The importer
  produces a review candidate; local editorial changes remain authoritative.
- `content/prep/*.json` contains public bilingual briefs. `production/episodes/`
  contains editable release packages. A prepared draft is not a published
  episode and must not invent a recording, duration or publication date.
- `docs/research/` preserves editorial research, including dated historical
  evidence. These files are public in Git but are not automatically site pages.
- Keep episode slugs stable. Published episode URLs are `/episodes/<slug>/`
  and `/ru/episodes/<slug>/`; summary pages append `summary/`. Public briefs
  live under `/prep/<slug>/` and `/ru/prep/<slug>/`.
- Edit both languages. Keep facts, names, numbers, qualifications and source
  identity aligned; idiomatic wording may differ. Label condensed retellings
  **Summary / Конспект**, not verbatim transcripts.
- Raw recordings, transcript text, credentials, downloads and personal contact
  details belong outside tracked content. `.private/` and `.env*` are ignored.
  Never place a secret in a `VITE_` variable. A release stores speech-source
  provenance, not the speech-source text.
- Preserve published prose and user edits. Make a draft for updates and use
  the workflow's conflict checks; do not bypass them by changing hashes.
- Source files in this repository own routes and build discovery. Do not
  hand-edit `dist`, `.ssg`, the generated sitemap or generated HTML.

## Verification and completion

Run `npm test` for changes. Run `npm run build` when changing site content,
routes, rendering, public assets, build or publication behavior. Use
`npm run episode -- check --slug <slug>` for a release candidate; a future
unrecorded episode is expected to fail release-readiness checks.

Review the final diff. For visible changes, check the affected English and
Russian pages, links, media and narrow-screen layout. Report the checks actually
run and any remaining source gaps. Do not claim release success when a draft
still lacks a recording or a reviewed summary.

Publishing via the local CLI changes repository data only. Git push/deployment,
media hosting and messages to external platforms are separate actions governed
by the user's request. Do not send an announcement merely because its copy exists.
