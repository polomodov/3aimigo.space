# Migration provenance

On 6 November 2026, the 3 AImigo editorial archive was copied from
[polomodov/polomodov at revision 50001bbb27a97a18f29afc32f51882bb1c109b19](https://github.com/polomodov/polomodov/tree/50001bbb27a97a18f29afc32f51882bb1c109b19).
The archive contains 20 Markdown files: the 13-topic package and its index,
four supporting research/validation documents, the S1E13 announcement and the
existing YouTube chapter document.

Every archive file is byte-for-byte identical to its source at migration.
[source-manifest.json](source-manifest.json) records the original revision,
path, immutable source URL and SHA-256. The manifest is a migration receipt;
later editorial corrections should be explicit changes and must not rewrite
that historical receipt to imply the edited file was the original.

The [source link index](source-links.md) resolves old relative references that
point outside the migrated archive. No raw transcript or recording was copied.
References to local speech sources preserve the original research trail; they
do not make those sources public or guarantee a remotely accessible copy.

The two workflow skills were adapted from the original
[create-podcast-episode](https://github.com/polomodov/polomodov/blob/50001bbb27a97a18f29afc32f51882bb1c109b19/.agents/skills/create-podcast-episode/SKILL.md)
and [create-talk-summary](https://github.com/polomodov/polomodov/blob/50001bbb27a97a18f29afc32f51882bb1c109b19/.agents/skills/create-talk-summary/SKILL.md).
They preserve the editorial method, but use this repository's own commands,
EN-first routes and data contract. They do not require the original checkout.

Historical research and original validation results are not a fresh fact check
or a test report for 3aimigo.space. Source dates and qualifications remain part
of the evidence. The website's earlier imported content is recorded separately
in the `source` object of `content/podcast.json`.
