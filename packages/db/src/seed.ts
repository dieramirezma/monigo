/**
 * Emits idempotent SQL that loads @monigo/content into D1.
 *   pnpm --filter @monigo/db seed:sql      → migrations/seed.local.sql
 *   wrangler d1 execute monigo-db --local --file ../../packages/db/migrations/seed.local.sql
 * The content package stays the single source of truth until the admin panel (Phase 3) takes over.
 */
import { content, mediaByFile } from "@monigo/content";

const q = (v: unknown): string => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const row = (table: string, obj: Record<string, unknown>) =>
  `INSERT OR REPLACE INTO ${table} (${Object.keys(obj).join(", ")}) VALUES (${Object.values(obj).map(q).join(", ")});`;

const out: string[] = ["PRAGMA foreign_keys = ON;"];
const locales = ["es", "en"] as const;

for (const p of content.pages) {
  out.push(row("categories", { id: p.slug, slug: p.slug, color_token: p.colorToken, sort: p.sort }));
  for (const l of locales)
    out.push(row("category_i18n", { category_id: p.slug, locale: l, name: p.name[l], imperative: p.imperative[l], description: p.description[l] }));
}

const mediaRows = new Set<string>();
for (const pl of content.places) {
  out.push(
    row("places", {
      id: pl.slug,
      slug: pl.slug,
      album_number: pl.albumNumber,
      category_id: pl.page,
      lat: pl.coords?.lat,
      lng: pl.coords?.lng,
      vereda: pl.vereda,
      difficulty: pl.difficulty,
      visit_minutes: pl.visitMinutes,
      access: pl.access,
      swimming: pl.swimming,
      best_time: pl.bestTime,
      status: pl.status,
      verified_at: pl.verifiedAt ? Math.floor(Date.parse(pl.verifiedAt) / 1000) : null,
      featured: pl.featured,
    }),
  );
  for (const l of locales)
    out.push(
      row("place_i18n", {
        place_id: pl.slug,
        locale: l,
        name: pl.name[l],
        summary: pl.summary[l],
        body_md: pl.body?.[l],
        tips_md: pl.tips?.[l],
      }),
    );
  pl.sources.forEach((s, i) => out.push(row("place_sources", { id: `${pl.slug}-${i}`, place_id: pl.slug, label: s.label, url: s.url })));
  pl.media.forEach((m, i) => {
    const info = mediaByFile.get(m.file)!;
    const id = m.file.replace(/\.[a-z]+$/, "");
    if (!mediaRows.has(id)) {
      mediaRows.add(id);
      out.push(
        row("media", {
          id,
          r2_key: `places/${m.file}`,
          width: info.width,
          height: info.height,
          mime: "image/jpeg",
          author: info.author,
          source_url: info.sourceUrl,
          license: info.license,
          license_url: info.licenseUrl,
          status: "approved",
        }),
      );
      for (const l of locales) out.push(row("media_i18n", { media_id: id, locale: l, alt: m.alt[l], caption: m.caption?.[l] }));
    }
    out.push(row("place_media", { place_id: pl.slug, media_id: id, position: i, is_cover: i === 0 }));
  });
}

for (const r of content.routes) {
  out.push(
    row("routes", {
      id: r.slug,
      slug: r.slug,
      category_id: r.page,
      difficulty: r.difficulty,
      duration_min: r.durationMin,
      transport: r.transport,
      best_season: r.bestSeason.es,
      status: r.status,
      featured: r.featured,
    }),
  );
  for (const l of locales)
    out.push(row("route_i18n", { route_id: r.slug, locale: l, name: r.name[l], summary: r.summary[l], body_md: r.body[l], what_to_bring_md: r.whatToBring[l] }));
  r.stops.forEach((s, i) =>
    out.push(
      row("route_stops", {
        route_id: r.slug,
        position: i + 1,
        place_id: s.place,
        suggested_minutes: s.suggestedMinutes,
        suggested_time: s.suggestedTime,
        note_es: s.note?.es,
        note_en: s.note?.en,
      }),
    ),
  );
}

for (const e of content.events) {
  out.push(row("events", { id: e.slug, slug: e.slug, month_hint: e.monthHint, status: "published" }));
  for (const l of locales) out.push(row("event_i18n", { event_id: e.slug, locale: l, name: e.name[l], description: e.description[l] }));
}

process.stdout.write(out.join("\n") + "\n");
