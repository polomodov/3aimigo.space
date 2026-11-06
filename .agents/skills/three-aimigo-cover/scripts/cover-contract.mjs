import { closeSync, openSync, readSync } from "node:fs";
import path from "node:path";

export function validateRecipe(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Cover recipe must be a JSON object");
  if (typeof data.badge !== "string" || !/^S[1-9]\d*E[1-9]\d*$/.test(data.badge)) throw new Error("Cover badge must use S<season>E<episode>, for example S1E13");
  if (typeof data.title !== "string" || !data.title.trim()) throw new Error("Cover title must be a non-empty string");
  if (data.title.split("\n").length > 2) throw new Error("Cover title supports at most two explicit lines");
  if (data.locale !== undefined && !["en", "ru"].includes(data.locale)) throw new Error("Cover locale must be en or ru");
  if (data.caps !== undefined && typeof data.caps !== "boolean") throw new Error("Cover caps must be a boolean");
  // Legacy Russian recipes predate an explicit locale. Preserve their meaning.
  return { ...data, locale: data.locale ?? "ru", caps: data.caps ?? false };
}

export function selectLayouts(data, layoutOnly) {
  if (layoutOnly !== undefined && layoutOnly !== "landscape") throw new Error("Optional format must be landscape");
  const layouts = [
    { name: "landscape", width: 1280, height: 720, plate: "plate.png", suffix: "" },
    { name: "square", width: 1400, height: 1400, plate: "sq/plate.png", suffix: "-square" },
  ];
  return layouts.filter((layout) => !(layoutOnly === "landscape" || data.locale === "en") || layout.name === "landscape");
}

export function assertRenderAsset(file, kind, repoRoot) {
  const head = Buffer.alloc(64);
  const fd = openSync(file, "r");
  let count;
  try { count = readSync(fd, head, 0, head.length, 0); } finally { closeSync(fd); }
  const text = head.subarray(0, count).toString("latin1");
  if (text.startsWith("version https://git-lfs")) {
    throw new Error(`${file} is a Git LFS pointer: run git lfs pull --include="${path.relative(repoRoot, file)}" --exclude="" in the repository`);
  }
  const valid = kind === "png"
    ? head.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : text.startsWith("wOF2");
  if (!valid) throw new Error(`${file} is not a valid ${kind.toUpperCase()} asset`);
}
