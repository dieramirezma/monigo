import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const PUBLISH_STATUS = ["draft", "review", "published"] as const;
export const MODERATION_STATUS = ["pending", "approved", "rejected"] as const;
export const DIFFICULTY = ["easy", "medium", "hard"] as const;
export const ACCESS = ["foot", "car", "mixed"] as const;
export const ROLES = ["visitor", "editor", "admin"] as const;
export const BUSINESS_KIND = [
  "bocadillo",
  "restaurant",
  "lodging",
  "tour",
  "craft",
  "other",
] as const;

const id = () => text("id").primaryKey();
const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
};
const locale = () => text("locale", { enum: LOCALES }).notNull();

/* ------------------------------------------------------------------ */
/* Album pages (categories)                                            */
/* ------------------------------------------------------------------ */

export const categories = sqliteTable("categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  /** design token name, e.g. "rio", "bijao", "guayaba" */
  colorToken: text("color_token").notNull(),
  icon: text("icon"),
  sort: integer("sort").notNull().default(0),
});

export const categoryI18n = sqliteTable(
  "category_i18n",
  {
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    locale: locale(),
    name: text("name").notNull(),
    /** the page's single imperative ("Métete al agua") */
    imperative: text("imperative"),
    description: text("description"),
  },
  (t) => [primaryKey({ columns: [t.categoryId, t.locale] })],
);

/* ------------------------------------------------------------------ */
/* Media (R2)                                                          */
/* ------------------------------------------------------------------ */

export const media = sqliteTable(
  "media",
  {
    id: id(),
    r2Key: text("r2_key").notNull().unique(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    mime: text("mime").notNull(),
    blurDataUrl: text("blur_data_url"),
    dominantColor: text("dominant_color"),
    /** provenance — required before publication */
    author: text("author").notNull(),
    sourceUrl: text("source_url"),
    license: text("license").notNull(),
    licenseUrl: text("license_url"),
    capturedAt: integer("captured_at", { mode: "timestamp" }),
    uploadedBy: text("uploaded_by").references(() => user.id, { onDelete: "set null" }),
    status: text("status", { enum: MODERATION_STATUS }).notNull().default("pending"),
    ...timestamps,
  },
  (t) => [index("media_status_idx").on(t.status)],
);

export const mediaI18n = sqliteTable(
  "media_i18n",
  {
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    locale: locale(),
    alt: text("alt").notNull(),
    caption: text("caption"),
  },
  (t) => [primaryKey({ columns: [t.mediaId, t.locale] })],
);

/* ------------------------------------------------------------------ */
/* Places (láminas)                                                    */
/* ------------------------------------------------------------------ */

export const places = sqliteTable(
  "places",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    albumNumber: integer("album_number").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    lat: real("lat"),
    lng: real("lng"),
    vereda: text("vereda"),
    altitudeM: integer("altitude_m"),
    difficulty: text("difficulty", { enum: DIFFICULTY }),
    visitMinutes: integer("visit_minutes"),
    access: text("access", { enum: ACCESS }),
    /** null = unknown; never claim swimming is safe without verification */
    swimming: integer("swimming", { mode: "boolean" }),
    entryFeeNote: text("entry_fee_note"),
    /** "HH:MM-HH:MM" best light / suggested hour */
    bestTime: text("best_time"),
    status: text("status", { enum: PUBLISH_STATUS }).notNull().default("draft"),
    verifiedAt: integer("verified_at", { mode: "timestamp" }),
    verifiedBy: text("verified_by"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("places_album_number_uq").on(t.albumNumber),
    index("places_status_category_idx").on(t.status, t.categoryId),
  ],
);

export const placeI18n = sqliteTable(
  "place_i18n",
  {
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    locale: locale(),
    name: text("name").notNull(),
    summary: text("summary").notNull(),
    bodyMd: text("body_md"),
    tipsMd: text("tips_md"),
    howToGetMd: text("how_to_get_md"),
  },
  (t) => [primaryKey({ columns: [t.placeId, t.locale] })],
);

export const placeMedia = sqliteTable(
  "place_media",
  {
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    isCover: integer("is_cover", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.placeId, t.mediaId] })],
);

/** Where a fact came from (press, official portfolio, field visit). */
export const placeSources = sqliteTable("place_sources", {
  id: id(),
  placeId: text("place_id")
    .notNull()
    .references(() => places.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  url: text("url"),
});

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export const routes = sqliteTable("routes", {
  id: id(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").references(() => categories.id),
  difficulty: text("difficulty", { enum: DIFFICULTY }).notNull(),
  distanceKm: real("distance_km"),
  durationMin: integer("duration_min"),
  elevationGainM: integer("elevation_gain_m"),
  transport: text("transport", { enum: ACCESS }).notNull(),
  bestSeason: text("best_season"),
  geojsonR2Key: text("geojson_r2_key"),
  gpxR2Key: text("gpx_r2_key"),
  coverMediaId: text("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  status: text("status", { enum: PUBLISH_STATUS }).notNull().default("draft"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  ...timestamps,
});

export const routeI18n = sqliteTable(
  "route_i18n",
  {
    routeId: text("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "cascade" }),
    locale: locale(),
    name: text("name").notNull(),
    summary: text("summary").notNull(),
    bodyMd: text("body_md"),
    whatToBringMd: text("what_to_bring_md"),
  },
  (t) => [primaryKey({ columns: [t.routeId, t.locale] })],
);

export const routeStops = sqliteTable(
  "route_stops",
  {
    routeId: text("route_id")
      .notNull()
      .references(() => routes.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    placeId: text("place_id")
      .notNull()
      .references(() => places.id),
    suggestedMinutes: integer("suggested_minutes"),
    /** "HH:MM" suggested arrival */
    suggestedTime: text("suggested_time"),
    noteEs: text("note_es"),
    noteEn: text("note_en"),
  },
  (t) => [primaryKey({ columns: [t.routeId, t.position] })],
);

/* ------------------------------------------------------------------ */
/* Businesses                                                          */
/* ------------------------------------------------------------------ */

export const businesses = sqliteTable(
  "businesses",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    kind: text("kind", { enum: BUSINESS_KIND }).notNull(),
    placeId: text("place_id").references(() => places.id, { onDelete: "set null" }),
    lat: real("lat"),
    lng: real("lng"),
    address: text("address"),
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    instagram: text("instagram"),
    website: text("website"),
    /** { mon: "08:00-18:00", ... } */
    hoursJson: text("hours_json", { mode: "json" }).$type<Record<string, string>>(),
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: PUBLISH_STATUS }).notNull().default("draft"),
    ...timestamps,
  },
  (t) => [index("businesses_status_kind_idx").on(t.status, t.kind)],
);

export const businessI18n = sqliteTable(
  "business_i18n",
  {
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    locale: locale(),
    name: text("name").notNull(),
    description: text("description"),
  },
  (t) => [primaryKey({ columns: [t.businessId, t.locale] })],
);

export const businessMedia = sqliteTable(
  "business_media",
  {
    businessId: text("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.businessId, t.mediaId] })],
);

/* ------------------------------------------------------------------ */
/* Events (fiestas)                                                    */
/* ------------------------------------------------------------------ */

export const events = sqliteTable("events", {
  id: id(),
  slug: text("slug").notNull().unique(),
  /** 1-12; used when exact dates are unconfirmed */
  monthHint: integer("month_hint"),
  startsOn: text("starts_on"),
  endsOn: text("ends_on"),
  status: text("status", { enum: PUBLISH_STATUS }).notNull().default("draft"),
});

export const eventI18n = sqliteTable(
  "event_i18n",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    locale: locale(),
    name: text("name").notNull(),
    description: text("description"),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.locale] })],
);

/* ------------------------------------------------------------------ */
/* Auth (Better Auth core tables) + role                               */
/* ------------------------------------------------------------------ */

export const user = sqliteTable("user", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ROLES }).notNull().default("visitor"),
  ...timestamps,
});

export const session = sqliteTable("session", {
  id: id(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const account = sqliteTable("account", {
  id: id(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  ...timestamps,
});

export const verification = sqliteTable("verification", {
  id: id(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ...timestamps,
});

/* ------------------------------------------------------------------ */
/* Community                                                           */
/* ------------------------------------------------------------------ */

export const reviews = sqliteTable(
  "reviews",
  {
    id: id(),
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    locale: locale(),
    status: text("status", { enum: MODERATION_STATUS }).notNull().default("pending"),
    moderatedBy: text("moderated_by").references(() => user.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [
    index("reviews_place_status_idx").on(t.placeId, t.status),
    uniqueIndex("reviews_one_per_user_place").on(t.placeId, t.userId),
  ],
);

export const reviewMedia = sqliteTable(
  "review_media",
  {
    reviewId: text("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => media.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.reviewId, t.mediaId] })],
);

export const favorites = sqliteTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    placeId: text("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.placeId] })],
);
