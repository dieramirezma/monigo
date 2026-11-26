import type { MetadataRoute } from "next";
import { publicPlaces, publicRoutes } from "@monigo/content";
import { href, locales, type Section } from "@/i18n/config";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://monigo.dieramirezma.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (section: Section, slug?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${href("es", section, slug)}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE}${href(l, section, slug)}`])),
    },
  });
  return [
    entry("home"),
    entry("map"),
    entry("routes"),
    entry("plan"),
    ...publicPlaces().map((p) => entry("places", p.slug)),
    ...publicRoutes().map((r) => entry("routes", r.slug)),
  ];
}
