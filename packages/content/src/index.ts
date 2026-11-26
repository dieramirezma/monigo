import { z } from "zod";
import { albumPages, events, places, routes, townFacts } from "./data";
import { albumPage, event, place, route, type Localized, type PageSlug, type Place } from "./schema";
import boundary from "./geo/moniquira-boundary.json";
import mediaManifest from "../media/manifest.json";

export * from "./schema";
export { townFacts, boundary };

export type MediaInfo = (typeof mediaManifest)[number];

/** Parse on import so a broken dataset fails the build, not the visitor. */
export const content = {
  pages: z.array(albumPage).parse(albumPages),
  places: z.array(place).parse(places),
  routes: z.array(route).parse(routes),
  events: z.array(event).parse(events),
};

export const mediaByFile = new Map<string, MediaInfo>(mediaManifest.map((m) => [m.file, m]));

export const t = (l: Localized, locale: string) => (locale === "en" ? l.en : l.es);

/** Places a visitor may see: published + sourced-but-unverified (marked "por verificar"). */
export const publicPlaces = () =>
  content.places
    .filter((p) => p.status !== "draft")
    .sort((a, b) => a.albumNumber - b.albumNumber);

export const publicRoutes = () => content.routes.filter((r) => r.status !== "draft");

export const placeBySlug = (slug: string) => content.places.find((p) => p.slug === slug);
export const routeBySlug = (slug: string) => content.routes.find((r) => r.slug === slug);
export const pageBySlug = (slug: PageSlug) => content.pages.find((p) => p.slug === slug)!;

export const placesOnPage = (slug: PageSlug) => publicPlaces().filter((p) => p.page === slug);

export const isVerified = (p: Place) => p.status === "published";

export const coverOf = (p: Place) => p.media[0];

/** Straight-line distance in km — labeled as such in the UI, never as trail distance. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const formatAlbumNumber = (n: number) => String(n).padStart(2, "0");

export const googleDirectionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
