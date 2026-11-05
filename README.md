# 3 AImigo

A bilingual podcast site about AI in engineering. Alexander Polomodov, Evgeny Sergeev, and Aleksey Litvinov compare hands-on practice, engineering leadership, and architecture.

[English](https://polomodov.github.io/3aimigo.space/) · [Русский](https://polomodov.github.io/3aimigo.space/ru/) · [Original archive](https://polomodov.tech/3-aimigo/)

The site includes episode pages, summaries, longreads and slides, an interactive topic map, and public briefs for upcoming discussions. The original recordings are in Russian. English is the default site language; every Russian page lives under `/ru/`.

## Work locally

Use Node 24.11+:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

React, TypeScript and Vite generate a static HTML page for every route and locale. The podcast map is interactive with a small client script; the archive, summaries and preparation pages render without JavaScript. The build verifies local URLs and language metadata.

## Edit episodes and prep

- [content/podcast.json](content/podcast.json) holds the public episode archive, summaries and topic map. It is seeded from the matching revision of polomodov.tech recorded in the file. Refresh that snapshot with `npm run import:polomodov -- /path/to/polomodov YYYY-MM-DD` when importing updates from upstream. Review the generated diff; the importer replaces the whole snapshot and does not touch prep briefs.
- For a release authored here, add both languages, official recording links, and a topic node. If the topic was already planned, add the new episode ID to that node to retain its links and connections.
- [content/prep/](content/prep/) holds the published preparation briefs. Use the [template](content/prep/TEMPLATE.md) to prepare the next episode. Keep private research, unannounced guest details and recordings in a separate private workspace; files and history in this repository are public.

## Deploy

GitHub Actions checks pull requests and publishes `main` to GitHub Pages. The default project URL uses the `/3aimigo.space/` base path.

The domain `3aimigo.space` is parked at Timeweb. To cut over, verify domain ownership in GitHub Pages, set the repository's custom domain, and point the domain's DNS records to GitHub Pages. Set Actions variables `SITE_ORIGIN=https://3aimigo.space` and `BASE_PATH=/`, redeploy, and confirm HTTPS and both language paths. See [GitHub's custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Fonts and their licenses are in [public/fonts/](public/fonts/).
