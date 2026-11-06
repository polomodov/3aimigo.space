# Publish or update a recording

1. Create or locate the episode package. For an existing episode, preserve its
   `id`, slug, season/number and generated `baseEpisodeHash`. An existing package
   can be edited in place; successful publication synchronizes it to the new base.
2. Verify exact recording URLs, release date, actual duration and participants.
   A podcast landing page, channel or playlist does not identify one recording.
3. Obtain the episode's actual transcript or subtitles: use text supplied by the
   author, a caption export or a verified external transcription tool. There is
   no bundled ASR command. Keep the resulting text in `.private/transcripts/`
   and set `recordingSource.kind` and `.path` in the draft. Read and verify it.
4. Edit the bilingual title, intro and topics from the real discussion. Use
   [create-talk-summary](../../create-talk-summary/SKILL.md) for `episode.summary`.
   Keep planned questions separate from the conversation that happened.
5. Review the summary against the speech source, including numbers, names,
   attribution, uncertainty and claims in both languages. Add verified public
   recording/source URLs. Do not publish raw speech text or local source paths.
6. Run `npm run episode -- check --slug <slug>` (add `--date YYYY-MM-DD` to
   check a release-date override). Resolve errors without weakening
   validation or creating fake evidence.
7. Run `npm run episode -- publish --slug <slug> --date YYYY-MM-DD --reviewed`.
   `--reviewed` attests to the editorial review you performed; it does not require
   an additional user confirmation. The CLI writes canonical data locally,
   records speech-source provenance and updates the topic relationship.
8. Run `npm test` and `npm run build`; review the diff and both locale pages.
   Check episode, summary, related materials, media and topic-map status.

On a stale-draft conflict, compare against the current episode and reapply the
intended changes using a current base. Do not modify `baseEpisodeHash` merely to
silence the error. A repeated identical release is safe; inspect the outcome.

Without usable speech text, finish the preparation and verified fields, record
the gap and stop before releasing. Do not produce transcript-derived summaries,
quotes or timestamps from metadata. Publication to GitHub Pages, uploading media
and sending prepared announcements happen only within the user's requested scope.
