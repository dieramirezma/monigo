export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export type Section = "home" | "places" | "routes" | "map" | "album" | "plan" | "brand";

const SEGMENTS: Record<Locale, Record<Exclude<Section, "home">, string>> = {
  es: {
    places: "lugares",
    routes: "rutas",
    map: "mapa",
    album: "album",
    plan: "planea",
    brand: "marca",
  },
  en: {
    places: "places",
    routes: "routes",
    map: "map",
    album: "album",
    plan: "plan",
    brand: "brand",
  },
};

/** Build a localized URL: href("en", "places", "salto-de-pomeca") → /en/places/salto-de-pomeca */
export function href(locale: Locale, section: Section, slug?: string) {
  if (section === "home") return `/${locale}`;
  const base = `/${locale}/${SEGMENTS[locale][section]}`;
  return slug ? `${base}/${slug}` : base;
}

/** Same page in the other language (used by the language switch). */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/").filter(Boolean);
  const from: Locale = isLocale(parts[0] ?? "") ? (parts[0] as Locale) : defaultLocale;
  const seg = parts[1];
  if (!seg) return `/${to}`;
  const entry = Object.entries(SEGMENTS[from]).find(([, v]) => v === seg);
  if (!entry) return `/${to}`;
  return href(to, entry[0] as Section, parts.slice(2).join("/") || undefined);
}
