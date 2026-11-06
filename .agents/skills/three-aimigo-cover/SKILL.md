---
name: three-aimigo-cover
description: >-
  Create or re-render bilingual 3 AImigo podcast covers and live announcement images in the fixed series artwork. Use for episode badge/title changes, historical cover exports and site cover integration in 3aimigo.space.
---

# 3 AImigo covers

Keep the original scene unchanged. Render only the episode badge and short title on the panel using the bundled plates and Roboto Condensed fonts. No image-generation call is needed for normal episodes.

This skill is self-contained in `.agents/skills/three-aimigo-cover`. Install this repository's dependencies with `npm ci` and the browser with `npx playwright install chromium`. Node 24, Playwright and Sharp are required; ImageMagick and another repository are not. `python3` + Pillow are needed only to rebuild a plate with `scripts/clean_plate.py`.

## Render a cover

1. Read the episode's local preparation/publication record for its season, number and title. Keep the assigned badge; do not infer the next number from this historical archive. A thumbnail title can be shorter than the page title, but must preserve its meaning. Do not invent a thesis for an unrecorded episode.
2. Write a recipe with an explicit locale for new covers. English is the site's primary language. Russian recipes without `locale` remain Russian for backwards compatibility.

   ```json
   { "badge": "S1E13", "title": "Infrastructure for\nAgentic Development", "locale": "en" }
   ```

   Use `\n` for a deliberate phrase boundary, at most two lines. `"caps": true` is supported for historical all-caps covers; default to mixed case. The old optional `episodePath` field is provenance and is not interpreted as a current route.
3. Render into an ignored scratch/output directory:

   ```bash
   node .agents/skills/three-aimigo-cover/scripts/render.mjs ep.json /tmp/3aimigo-s1e13-en
   ```

   English recipes produce landscape 1280×720 PNG + JPG. Russian recipes produce landscape 1280×720 and square 1400×1400 PNG + JPG; append `landscape` to request only landscape. The square filename ends in `-square`. Output parent directories are created automatically. JPG quality is 92.
4. Inspect every exported layout. Keep the badge gold, lettering inside the dotted panel border, the logo intact, and Russian «Й» marks clear of the line above. The renderer fails if fonts/artwork are missing, an asset is a Git LFS pointer, or text overflows. It prints font size and line count: below about 40 px landscape or 54 px square, prefer a shorter title for feed readability.
5. Save accepted recipes and exports in `archive/episodes/` and `archive/covers/` only when archival or publication is in scope. For site publication, copy the chosen optimized image to the site's public assets and reference it from the local episode record. Follow the repository's episode publication workflow and verify its build. Rendering a file alone does not publish an episode or send an announcement.

## Assets and history

- `template/plate.png`: the S1E6 landscape artwork with the panel text removed, preserving original frame and logo pixels.
- `template/sq/plate.png`: the owner's S1E7 square scene, cleaned and resized from 1254 to 1400 pixels. Do not make a square by cropping/upscaling the landscape scene.
- `template/cover.html`, `fonts.css`, `fonts/`: local deterministic layout and fonts; no network is used during rendering. Hyphenated words stay together and short Russian words stick to the following word.
- `archive/episodes/`: the actual Russian S1E1–S1E13 and English S1E1–S1E8 recipes. English S1E9–S1E13 recipes are absent from the source archive; create them only from an approved episode title when requested.
- `archive/sources/`: original YouTube thumbnails and the original square artwork.
- `archive/covers/inventory.json`: preserved historical export audit. Multiple versions exist; it does not select the current publication image.
- `archive/import-provenance.json`: source repository/revision, hashes, sizes and resolved LFS object IDs of imported assets. Historical `episodePath` values retain the old site's paths.

PNG/JPG artwork and exports use Git LFS. Hydrate the two templates before rendering:

```bash
git lfs install
git lfs pull --include=".agents/skills/three-aimigo-cover/template/**" --exclude=""
```

Hydrate historical exports separately when comparing/reusing them:

```bash
git lfs pull --include=".agents/skills/three-aimigo-cover/archive/**" --exclude=""
```

Keep archival variants unless an explicit cleanup is requested. Imported files are source snapshots: use a distinct filename for a revised recipe or export so the recorded source hashes remain meaningful. Rebuild plates only when the owner changes the series artwork: `python3 scripts/clean_plate.py landscape|square input.png output.png` from this skill directory. Re-measure its `LAYOUTS` panel geometry and the corresponding HTML `.field` coordinates together; the cleaning helper documents the original process.
