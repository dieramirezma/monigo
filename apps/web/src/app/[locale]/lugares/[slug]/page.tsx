import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  content,
  formatAlbumNumber,
  googleDirectionsUrl,
  isVerified,
  mediaByFile,
  pageBySlug,
  placeBySlug,
  placesOnPage,
  publicPlaces,
  t,
} from "@monigo/content";
import { href, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Lamina, mediaSrc } from "@/components/lamina";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickButton } from "@/components/stick-button";
import { PocketMap } from "@/components/pocket-map";
import { JsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  return locales.flatMap((locale) => publicPlaces().map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/lugares/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const place = placeBySlug(slug);
  if (!place || place.status === "draft" || !isLocale(locale)) return {};
  const cover = place.media[0];
  return {
    title: t(place.name, locale),
    description: t(place.summary, locale),
    alternates: {
      languages: { es: href("es", "places", slug), en: href("en", "places", slug) },
    },
    openGraph: cover ? { images: [{ url: mediaSrc(cover.file) }] } : undefined,
  };
}

async function PlacePageContent({ params }: PageProps<"/[locale]/lugares/[slug]">) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const place = placeBySlug(slug);
  if (!place || place.status === "draft") notFound();

  const d = getDictionary(locale);
  const page = pageBySlug(place.page);
  const num = formatAlbumNumber(place.albumNumber);
  const neighbours = placesOnPage(place.page).filter((p) => p.slug !== place.slug);
  const routes = content.routes.filter((r) => r.stops.some((s) => s.place === place.slug));
  const gallery = place.media.slice(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: t(place.name, locale),
    description: t(place.summary, locale),
    ...(place.coords
      ? { geo: { "@type": "GeoCoordinates", latitude: place.coords.lat, longitude: place.coords.lng } }
      : {}),
    containedInPlace: { "@type": "City", name: "Moniquirá, Boyacá, Colombia" },
  };

  return (
    <>
      <div data-field={page.colorToken} className="pagina-trama">
        <SiteHeader locale={locale} />
        <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-4 pb-20 sm:px-8 sm:pt-8 lg:pb-28">
          <Link
            href={`${href(locale, "home")}#pagina-${page.slug}`}
            className="inline-flex items-center gap-2 font-rotulo text-[17px] no-underline opacity-90 hover:opacity-100"
          >
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
              <path d="M16 10H5m4-4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t(page.name, locale)}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            {/* the lámina itself, at the scale it has in the hand */}
            <div className="mx-auto w-full max-w-[560px] lg:mx-0">
              <Lamina place={place} locale={locale} size="lg" rotate={-1.2} link={false} priority empty="paper" />
              {place.media[0] ? (
                <PhotoCredit file={place.media[0].file} caption={place.media[0].caption ? t(place.media[0].caption, locale) : undefined} label={d.place.photoCredit} />
              ) : (
                <p className="mt-4 max-w-[46ch] text-[15px]" style={{ color: "var(--on-field-soft)" }}>
                  {d.lamina.missingPhotoHint}
                </p>
              )}
            </div>

            <div>
              <p className="numero-lamina text-[clamp(4rem,10vw,7rem)] leading-[0.8] opacity-35" aria-hidden>
                {num}
              </p>
              <h1 className="mt-2 font-cartel text-[clamp(2.8rem,6.5vw,5.5rem)] leading-[0.88]">
                {t(place.name, locale)}
              </h1>
              <p className="mt-6 max-w-[42ch] text-xl leading-snug">{t(place.summary, locale)}</p>

              {!isVerified(place) ? (
                <p className="mt-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-rotulo text-[15px] ring-2 ring-current ring-inset">
                  <span aria-hidden className="size-3 rounded-full ring-2 ring-current" />
                  {d.lamina.unverified}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <StickButton slug={place.slug} labels={{ stick: d.lamina.stick, unstick: d.lamina.unstick }} />
                {place.coords ? (
                  <a
                    href={googleDirectionsUrl(place.coords.lat, place.coords.lng)}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 font-rotulo text-[17px] no-underline ring-2 ring-current ring-inset"
                    rel="noopener"
                  >
                    {d.place.directions}
                    <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                      <path d="M7 13 13 7m-5 0h5v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : null}
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t-2 border-current pt-6 sm:grid-cols-3">
                {place.bestTime ? <Fact term={d.place.bestTime} value={place.bestTime} /> : null}
                {place.visitMinutes ? <Fact term={d.place.visit} value={d.place.minutes(place.visitMinutes)} /> : null}
                {place.access ? <Fact term={d.place.howToGet} value={d.routes.transport[place.access]} /> : null}
                {place.coords ? (
                  <Fact
                    term="GPS"
                    value={`${place.coords.lat.toFixed(4)}, ${place.coords.lng.toFixed(4)}`}
                  />
                ) : null}
              </dl>

              {place.tips ? (
                <section className="mt-10" aria-labelledby="antes">
                  <h2 id="antes" className="font-rotulo text-2xl">{d.place.tips}</h2>
                  <p className="mt-2 max-w-[56ch] text-[17px]" style={{ color: "var(--on-field-soft)" }}>
                    {t(place.tips, locale)}
                  </p>
                </section>
              ) : null}

              {routes.length ? (
                <section className="mt-8" aria-labelledby="en-rutas">
                  <h2 id="en-rutas" className="font-rotulo text-2xl">{d.place.inRoutes}</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {routes.map((r) => (
                      <li key={r.slug}>
                        <Link href={href(locale, "routes", r.slug)} className="inline-block rounded-full bg-lamina px-4 py-2 font-rotulo text-tinta no-underline">
                          {t(r.name, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </div>

          {gallery.length ? (
            <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-24" role="list">
              {gallery.map((m, i) => {
                const info = mediaByFile.get(m.file)!;
                return (
                  <li key={m.file} className={info.width / info.height > 3 ? "sm:col-span-2" : ""}>
                    <figure className="lamina" style={{ "--rot": `${i % 2 ? 0.8 : -0.6}deg` } as React.CSSProperties}>
                      <Image
                        src={mediaSrc(m.file)}
                        alt={t(m.alt, locale)}
                        width={info.width}
                        height={info.height}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        quality={70}
                        className="h-auto w-full rounded-[3px]"
                      />
                      <figcaption className="px-0.5 pt-2 text-sm text-tinta-2">
                        {`${d.place.photoCredit}: ${info.author} · `}
                        <a href={info.licenseUrl} rel="license noopener" className="underline">{info.license}</a>
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </main>
      </div>

      {/* Where it is: the pocket map, this lámina highlighted by being the only one drawn */}
      <section data-field="papel" aria-labelledby="donde" className="border-t-2 border-tinta">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2 id="donde" className="font-cartel text-[clamp(2.4rem,5vw,4rem)]">{d.place.whereSources}</h2>
            {place.coords ? null : <p className="mt-4 max-w-[40ch] text-lg text-tinta-2">{d.place.noCoords}</p>}
            <h3 className="mt-10 font-rotulo text-xl">{d.place.sources}</h3>
            <ul className="mt-2 space-y-1.5 text-[15px] text-tinta-2">
              {place.sources.map((s) => (
                <li key={s.label}>
                  {s.url ? <a href={s.url} className="underline" rel="noopener">{s.label}</a> : s.label}
                </li>
              ))}
            </ul>
          </div>
          {place.coords ? (
            <div className="lamina p-3" style={{ "--rot": "0.4deg" } as React.CSSProperties}>
              <PocketMap places={[place]} locale={locale} label={`${d.place.whereSources}: ${t(place.name, locale)}`} />
            </div>
          ) : null}
        </div>
      </section>

      {neighbours.length ? (
        <section data-field={page.colorToken} aria-labelledby="vecinas" className="pagina-trama">
          <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
            <h2 id="vecinas" className="font-cartel text-[clamp(2.2rem,5vw,3.5rem)]">{d.place.nearby}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6" role="list">
              {neighbours.slice(0, 6).map((p, i) => (
                <li key={p.slug}>
                  <Lamina place={p} locale={locale} size="sm" rotate={p.media.length ? [-1.2, 1, -0.6][i % 3]! : 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <SiteFooter locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-[13px] font-bold tracking-[0.06em] uppercase" style={{ color: "var(--on-field-soft)" }}>
        {term}
      </dt>
      <dd className="mt-1 numero-lamina text-2xl">{value}</dd>
    </div>
  );
}

function PhotoCredit({ file, caption, label }: { file: string; caption?: string; label: string }) {
  const info = mediaByFile.get(file);
  if (!info) return null;
  return (
    <p className="mt-4 max-w-[52ch] text-[14px]" style={{ color: "var(--on-field-soft)" }}>
      {caption ? `${caption} ` : ""}
      {`${label}: ${info.author} · `}
      <a href={info.licenseUrl} rel="license noopener" className="underline">{info.license}</a>
      {" · "}
      <a href={info.sourceUrl} rel="noopener" className="underline">Wikimedia Commons</a>
    </p>
  );
}

/** The slug is URL data: keep it behind Suspense so the shell can be prefetched and shared. */
export default function PlacePage(props: PageProps<"/[locale]/lugares/[slug]">) {
  return (
    <Suspense fallback={<div data-field="papel" className="pagina-trama min-h-dvh" aria-busy="true" />}>
      <PlacePageContent {...props} />
    </Suspense>
  );
}
