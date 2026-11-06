#!/usr/bin/env node
// Fixed 3 AImigo artwork, local fonts, and text-only rendering.
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assertRenderAsset, selectLayouts, validateRecipe } from "./cover-contract.mjs";

const skill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(skill, "../../..");

async function main() {
  const [dataPath, prefix, layoutOnly, ...extra] = process.argv.slice(2);
  if (!dataPath || !prefix || extra.length) throw new Error("Usage: node render.mjs <episode.json> <output-prefix> [landscape]");
  const data = validateRecipe(JSON.parse(readFileSync(dataPath, "utf8")));
  const layouts = selectLayouts(data, layoutOnly);
  for (const layout of layouts) assertRenderAsset(path.join(skill, "template", layout.plate), "png", repoRoot);
  for (const subset of ["cyrillic", "latin-ext", "latin"]) {
    assertRenderAsset(path.join(skill, "template/fonts", `roboto-condensed-${subset}.woff2`), "woff2", repoRoot);
  }
  // Resolve only from this checkout's dependencies: no old repository or HOME fallback.
  const { chromium } = await import("playwright");
  const { default: sharp } = await import("sharp");
  mkdirSync(path.dirname(path.resolve(prefix)), { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const layout of layouts) {
      const out = `${prefix}${layout.suffix}`;
      const page = await browser.newPage({ viewport: { width: layout.width, height: layout.height }, deviceScaleFactor: 1 });
      // Fonts and artwork are bundled. A cover must never depend on a remote request.
      await page.route(/^https?:\/\//, (route) => route.abort());
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await page.addInitScript(([recipe, name]) => { window.COVER_DATA = recipe; window.COVER_LAYOUT = name; }, [data, layout.name]);
      await page.goto(pathToFileURL(path.join(skill, "template/cover.html")).href);
      await page.waitForSelector("body[data-ready='1']", { timeout: 20000 });
      if (pageErrors.length) throw new Error(`Cover template failed: ${pageErrors.join("; ")}`);
      const report = JSON.parse(await page.evaluate(() => document.body.dataset.report));
      const fontOk = await page.evaluate(() => [...document.fonts].some((font) => font.family.replace(/["']/g, "") === "Roboto Condensed" && font.status === "loaded"));
      if (!fontOk) throw new Error("Roboto Condensed did not load; refusing to render with a fallback font");
      // Do not leave a plausible publication image behind on a layout failure.
      if (report.mode === "overflow") throw new Error(`${layout.name}: OVERFLOW; shorten the cover title to fit two lines`);
      await page.locator("#cover").screenshot({ path: `${out}.png` });
      await page.close();
      await sharp(`${out}.png`).jpeg({ quality: 92 }).toFile(`${out}.jpg`);
      console.log(`${out}.png + .jpg ${layout.width}x${layout.height} title=${report.size}px lines=${report.lines}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
