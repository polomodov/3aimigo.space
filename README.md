# 3 AImigo

A bilingual podcast about AI in engineering. Alexander Polomodov, Evgeny Sergeev, and Aleksey Litvinov compare hands-on practice, engineering leadership, and architecture.

[English](https://3aimigo.space/) · [Русский](https://3aimigo.space/ru/) · [Original archive](https://polomodov.tech/3-aimigo/)

This repository owns the website and the episode preparation/publication workflow: research, discussion outlines, bilingual announcements, covers, transcript-based summaries and release checks. English is the primary site language; Russian pages use `/ru/`. The original recordings are in Russian.

## Work locally

Use Node 24.11+:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

React, TypeScript and Vite generate static HTML for every route and locale. Episodes, summaries and preparation pages render without JavaScript. The topic map is interactive. Builds validate the public content, local links, language metadata and sitemap.

## Prepare and publish episodes

Start with the [episode workflow](docs/episode-workflow.md) and [editorial archive](docs/README.md). The [S1E13 working package](production/episodes/agent-development-infrastructure/) is already prepared, with its real public brief and references to the migrated infrastructure research. It remains an unreleased draft.

```sh
# Create a new package using a free topic from content/podcast.json.
npm run episode -- prepare --slug your-episode --topic TOPIC_ID --number NUMBER --season 1

# Publish a reviewed bilingual brief without releasing a recording.
npm run episode -- publish-prep --slug your-episode

# After recording, edit episode.json and add its local transcript under .private/.
npm run episode -- check --slug your-episode --date YYYY-MM-DD
npm run episode -- publish --slug your-episode --date YYYY-MM-DD --reviewed
npm test
npm run build
```

Replace example values with the actual slug, topic, number and release date. `publish` applies a reviewed release to the local registry and updates the same topic-map node. A retry is safe; conflicting drafts, incomplete bilingual summaries, missing source text, future releases and channel-level media links are rejected. Review the diff, then commit and push to deploy. The commands do not upload recordings or send announcements.

- `production/episodes/<slug>/` holds the editable episode, brief, research, outline and EN/RU announcement copy.
- `content/podcast.json` is the canonical published registry, summaries and topic map. `content/prep/*.json` holds public preparation briefs; see the [brief template](content/prep/TEMPLATE.md).
- `docs/research/` contains the migrated 13-topic package and supporting research. [Migration records](docs/migration/) preserve the source revision and hashes; historical evidence retains its original dates.
- `.agents/skills/` contains the local `create-podcast-episode`, `create-talk-summary` and `three-aimigo-cover` workflows, also linked for Codex and Claude Code.
- `.private/` is ignored. Keep raw recordings, transcripts, credentials and private guest details there. All tracked preparation and Git history are public; working files are not automatically website pages.

The legacy importer is only a comparison tool:

```sh
npm run import:polomodov -- /path/to/polomodov YYYY-MM-DD
```

It writes a new `.private/imports/polomodov-YYYY-MM-DD.json` candidate, refuses existing output and cannot replace the canonical registry. Review and selectively merge changes so locally authored episodes remain intact.

## Render covers

The original artwork, fonts, recipes and historical exports are bundled with the [cover skill](.agents/skills/three-aimigo-cover/SKILL.md). Images use Git LFS; hydrate the templates and install the browser once:

```sh
git lfs install
git lfs pull --include=".agents/skills/three-aimigo-cover/template/**" --exclude=""
npx playwright install chromium
npm run cover:render -- path/to/recipe.json /tmp/3aimigo-cover
npm run test:cover-render
```

English recipes export landscape covers; Russian recipes support landscape and square. Rendering checks artwork/fonts and text overflow. Inspect the output, then add selected site images under `public/covers/` and reference them in the bilingual episode `covers` field. Historical RU S1E1–13 and EN S1E1–8 recipes are preserved; absent translations were not invented.

## Deploy

GitHub Actions runs installation, a dependency audit, tests and the production build. Pushing `main` publishes to GitHub Pages at `https://3aimigo.space/`. Actions variables set `SITE_ORIGIN=https://3aimigo.space` and `BASE_PATH=/`.

Cloudflare provides DNS. The apex uses GitHub Pages A and AAAA records; `www` points to `polomodov.github.io` via CNAME. Records use DNS only. GitHub Pages serves HTTPS and redirects `www` to the apex. Keep the GitHub domain verification TXT record in Cloudflare.

Fonts and licenses are in [public/fonts/](public/fonts/); cover fonts have their own bundled OFL license.
