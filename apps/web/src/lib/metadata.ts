import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

/** Production screenshot of the home page, 1200×630, used as og:image and twitter:image. */
export const SHARE_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "Portada de MoniGo: «Moniquirá, colecciónala.» sobre fondo vinotinto, con láminas de lugares de Moniquirá, Boyacá",
};

/**
 * Open Graph shared by every page. A page that sets `openGraph` replaces the parent's object
 * (Next merges metadata shallowly), so it must spread this to keep the image and site fields.
 */
export function baseOpenGraph(locale: Locale): NonNullable<Metadata["openGraph"]> {
  return {
    siteName: "MoniGo",
    locale: locale === "es" ? "es_CO" : "en_US",
    type: "website",
    images: [SHARE_IMAGE],
  };
}
