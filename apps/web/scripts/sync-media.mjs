// Copies licensed media from @monigo/content into public/media for local dev and static builds.
// In production the same files live in R2 (monigo-media.dieramirezma.dev); see docs/infra.md.
import { cpSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const from = resolve(here, "../../../packages/content/media");
const to = resolve(here, "../public/media");
mkdirSync(to, { recursive: true });
cpSync(from, to, { recursive: true, filter: (p) => !p.endsWith("manifest.json") });
console.log("media synced →", to);

// MapLibre's web worker must be served as a static file (the bundler can't inline it).
const ml = resolve(here, "../node_modules/maplibre-gl/dist");
const mlOut = resolve(here, "../public/maplibre");
mkdirSync(mlOut, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) cpSync(resolve(ml, f), resolve(mlOut, f));
console.log("maplibre worker synced →", mlOut);
