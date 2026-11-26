import { z } from "zod";

export const localized = z.object({ es: z.string().min(1), en: z.string().min(1) });
export type Localized = z.infer<typeof localized>;

export const pageSlug = z.enum(["agua", "alturas", "pueblo", "memoria", "dulce", "descanso"]);
export type PageSlug = z.infer<typeof pageSlug>;

export const albumPage = z.object({
  slug: pageSlug,
  colorToken: z.enum(["rio", "bijao", "guayaba", "barro", "panela", "pulpa"]),
  sort: z.number().int(),
  name: localized,
  /** the page's single imperative */
  imperative: localized,
  description: localized,
});
export type AlbumPage = z.infer<typeof albumPage>;

export const source = z.object({ label: z.string(), url: z.string().url().optional() });

export const mediaRef = z.object({
  file: z.string(),
  alt: localized,
  caption: localized.optional(),
});

export const place = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    albumNumber: z.number().int().min(1).max(99),
    page: pageSlug,
    name: localized,
    summary: localized,
    body: localized.optional(),
    tips: localized.optional(),
    /** null when no trustworthy coordinate exists yet */
    coords: z
      .object({
        lat: z.number().min(5.7).max(6.0),
        lng: z.number().min(-73.7).max(-73.4),
        source: z.string(),
      })
      .nullable(),
    vereda: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    access: z.enum(["foot", "car", "mixed"]).optional(),
    visitMinutes: z.number().int().optional(),
    /** "HH:MM–HH:MM" suggested hour / best light */
    bestTime: z.string().optional(),
    /** null = unknown. Never claim safe swimming without field verification. */
    swimming: z.boolean().nullable().default(null),
    /**
     * review    = sourced (press / OSM) but not field-verified → shown with the "por verificar" mark
     * published = field-verified
     * draft     = not shown publicly
     */
    status: z.enum(["draft", "review", "published"]),
    verifiedAt: z.string().optional(),
    featured: z.boolean().default(false),
    media: z.array(mediaRef).default([]),
    sources: z.array(source).min(1),
  })
  .refine((p) => p.status !== "published" || !!p.verifiedAt, {
    message: "published places need verifiedAt (field verification)",
  });
export type Place = z.infer<typeof place>;
export type PlaceInput = z.input<typeof place>;

export const routeStop = z.object({
  place: z.string(),
  suggestedTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  suggestedMinutes: z.number().int().optional(),
  note: localized.optional(),
});

export const route = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  page: pageSlug,
  name: localized,
  summary: localized,
  body: localized,
  whatToBring: localized,
  difficulty: z.enum(["easy", "medium", "hard"]),
  transport: z.enum(["foot", "car", "mixed"]),
  /** total duration estimate in minutes, from the sum of stops; field-check pending */
  durationMin: z.number().int(),
  bestSeason: localized,
  status: z.enum(["draft", "review", "published"]),
  featured: z.boolean().default(false),
  stops: z.array(routeStop).min(2),
});
export type Route = z.infer<typeof route>;
export type RouteInput = z.input<typeof route>;

export const event = z.object({
  slug: z.string(),
  monthHint: z.number().int().min(1).max(12).optional(),
  name: localized,
  description: localized,
  source: source,
});
export type FestivalEvent = z.infer<typeof event>;
