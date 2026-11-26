import type { Metadata } from "next";
import type { Feature } from "geojson";
import { notFound } from "next/navigation";
import {
  boundary,
  content,
  formatAlbumNumber,
  isVerified,
  mediaByFile,
  pageBySlug,
  publicPlaces,
  t,
  townFacts,
} from "@monigo/content";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { ExplorerMap, type MapPlace } from "@/components/explorer-map";
import { mediaSrc } from "@/components/lamina";

export async function generateMetadata({ params }: PageProps<"/[locale]/mapa">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    title: d.map.title,
    alternates: { languages: { es: href("es", "map"), en: href("en", "map") } },
  };
}

export default async function MapPage({ params }: PageProps<"/[locale]/mapa">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);

  const places: MapPlace[] = publicPlaces().map((p) => {
    const cover = p.media[0];
    const info = cover ? mediaByFile.get(cover.file) : undefined;
    return {
      slug: p.slug,
      num: formatAlbumNumber(p.albumNumber),
      name: t(p.name, locale),
      summary: t(p.summary, locale),
      page: p.page,
      field: pageBySlug(p.page).colorToken,
      lat: p.coords?.lat ?? null,
      lng: p.coords?.lng ?? null,
      href: href(locale, "places", p.slug),
      unverified: !isVerified(p),
      photo:
        cover && info
          ? { src: mediaSrc(cover.file), alt: t(cover.alt, locale), width: info.width, height: info.height, credit: `${info.author} · ${info.license}` }
          : undefined,
    };
  });

  return (
    <div data-field="papel">
      <SiteHeader locale={locale} dock={false} />
      <main id="contenido" className="border-t-2 border-tinta">
        <h1 className="sr-only">{d.map.title}</h1>
        <ExplorerMap
          places={places}
          pages={content.pages.map((p) => ({ slug: p.slug, name: t(p.name, locale), field: p.colorToken }))}
          boundary={boundary as Feature}
          center={townFacts.center}
          labels={{
            list: d.map.list,
            filterAll: d.map.filterAll,
            close: d.map.close,
            openPlace: d.map.openPlace,
            attribution: d.map.attribution,
            unlocated: d.map.unlocated,
            unverified: d.lamina.unverified,
            missingPhoto: d.lamina.missingPhoto,
            stick: d.lamina.stick,
            unstick: d.lamina.unstick,
            loading: d.map.loading,
            error: d.map.error,
          }}
        />
      </main>
    </div>
  );
}
