import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatAlbumNumber, mediaByFile, publicPlaces, t } from "@monigo/content";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AlbumView, type AlbumPlace } from "@/components/album-view";
import { mediaSrc } from "@/components/lamina";

export async function generateMetadata({ params }: PageProps<"/[locale]/album">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDictionary(locale).album.title, robots: { index: false } };
}

export default async function AlbumPage({ params }: PageProps<"/[locale]/album">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);

  const places: AlbumPlace[] = publicPlaces().map((p) => {
    const cover = p.media[0];
    const info = cover ? mediaByFile.get(cover.file) : undefined;
    return {
      slug: p.slug,
      num: formatAlbumNumber(p.albumNumber),
      name: t(p.name, locale),
      href: href(locale, "places", p.slug),
      photo: cover && info ? { src: mediaSrc(cover.file), alt: t(cover.alt, locale), width: info.width, height: info.height } : undefined,
    };
  });

  return (
    <>
      <div data-field="guayaba" className="pagina-trama">
        <SiteHeader locale={locale} />
        <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
          <h1 className="font-cartel text-[clamp(3.4rem,11vw,8.5rem)] leading-[0.84]">{d.album.title}</h1>
          <p className="mt-5 max-w-[50ch] text-xl" style={{ color: "var(--on-field-soft)" }}>{d.album.lead}</p>
          <div className="mt-10">
            <AlbumView
              places={places}
              homeHref={href(locale, "home")}
              labels={{
                empty: d.album.empty,
                emptyCta: d.album.emptyCta,
                progress: d.album.progress(-1, -2).replace("-1", "{n}").replace("-2", "{total}"),
                up: d.album.up,
                down: d.album.down,
                remove: d.lamina.unstick,
                clear: d.album.clear,
                share: d.album.share,
                copied: d.album.copied,
                missingPhoto: d.lamina.missingPhoto,
              }}
            />
          </div>
        </main>
      </div>
      <SiteFooter locale={locale} />
    </>
  );
}
