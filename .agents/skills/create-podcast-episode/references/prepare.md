# Prepare an episode

1. Identify the stable slug, season, number and map topic ID. Read the relevant
   existing public brief and research dossier. Use the topic's actual ID from
   `content/podcast.json`, not a dossier filename.
2. Create the package with `npm run episode -- prepare --slug <slug> --topic
   <topic-id> --number <n> --season <s>`. Read the generated files before editing.
   Keep existing work; do not reset a package just to regenerate templates.
3. In `research.md`, collect claim → primary source → check date → evidence type
   → limitation → intended use. Open new sources and recheck changing facts.
   Preserve the original cutoff date when borrowing historical research.
4. Build `script.md` around tension, mechanism, evidence, counterargument,
   tradeoffs, application and conclusion. Include open questions and possible
   disagreements. Do not write planned dialogue as a transcript.
5. Edit `prep.json` and both announcement files. Translate the same ideas into
   idiomatic English and Russian; maintain identical numbers and qualifications.
6. If the user wants a public brief, run `npm run episode -- publish-prep --slug
   <slug>`, then the required checks. The brief routes are `/prep/<slug>/` and
   `/ru/prep/<slug>/`. It does not publish a recorded episode.

The package remains valid editorial preparation with no recording or summary.
A release-readiness check is expected to reject such a package. Keep media,
duration and date empty until verified; do not create placeholder identities.

When a cover is requested, use the separate `three-aimigo-cover` skill. A deck or
longread can be linked as a material once it exists; this repository has no
inherited polomodov.tech deck renderer. Do not link to a future episode page
until the published record actually makes that route available.
