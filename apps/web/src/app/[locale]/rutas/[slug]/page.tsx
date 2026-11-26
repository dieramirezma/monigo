import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  formatAlbumNumber,
  haversineKm,
  pageBySlug,
  placeBySlug,
  publicRoutes,
  routeBySlug,
  t,
  type Place,
} from "@monigo/content";
import { href, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Lamina } from "@/components/lamina";
import { PocketMap } from "@/components/pocket-map";
import { JsonLd } from "@/lib/json-ld";

export function generateStaticParams() {
  return locales.flatMap((locale) => publicRoutes().map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/rutas/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = routeBySlug(slug);
  if (!route || !isLocale(locale)) return {};
  return {
    title: t(route.name, locale),
    description: t(route.summary, locale),
    alternates: { languages: { es: href("es", "routes", slug), en: href("en", "routes", slug) } },
  };
}

async function RoutePageContent({ params }: PageProps<"/[locale]/rutas/[slug]">) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const route = routeBySlug(slug);
  if (!route || route.status === "draft") notFound();
  const d = getDictionary(locale);
  const page = pageBySlug(route.page);
  const stops = route.stops.map((s) => ({ ...s, place: placeBySlug(s.place)! }));
  const located = stops.map((s) => s.place).filter((p): p is Place => !!p.coords);

  let km = 0;
  for (let i = 1; i < located.length; i++) km += haversineKm(located[i - 1]!.coords!, located[i]!.coords!);
  const kmLabel = km.toLocaleString(locale === "es" ? "es-CO" : "en-US", { maximumFractionDigits: 1 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: t(route.name, locale),
    description: t(route.summary, locale),
    itinerary: {
      "@type": "ItemList",
      itemListElement: stops.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: t(s.place.name, locale) },
      })),
    },
  };

  return (
    <>
      <div data-field={page.colorToken} className="pagina-trama">
        <SiteHeader locale={locale} />
        <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-4 pb-16 sm:px-8 sm:pt-8">
          <Link href={href(locale, "routes")} className="inline-flex items-center gap-2 font-rotulo text-[17px] no-underline">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
              <path d="M16 10H5m4-4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {d.routes.all}
          </Link>
          <h1 className="mt-6 font-cartel text-[clamp(3.2rem,10vw,8rem)] leading-[0.84]">{t(route.name, locale)}</h1>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <p className="max-w-[48ch] text-xl leading-snug">{t(route.body, locale)}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-start border-t-2 border-current pt-5">
              <Meta term={d.routes.metaDifficulty} value={d.routes.difficulty[route.difficulty]} />
              <Meta term={d.routes.metaDuration} value={d.routes.duration(route.durationMin)} />
              <Meta term={d.routes.metaDistance} value={located.length > 1 ? `${kmLabel} km` : "—"} />
              <Meta term={d.routes.stopsTitle} value={`${stops.length} · ${d.routes.transport[route.transport]}`} />
              <div className="col-span-2">
                <Meta term={d.routes.season} value={t(route.bestSeason, locale)} small />
              </div>
            </dl>
          </div>
        </main>
      </div>

      {/* Stops in a strict margin column, each deep-linkable; the pocket map beside */}
      <section data-field="papel" aria-labelledby="paradas" className="border-t-2 border-tinta">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
          <div>
            <h2 id="paradas" className="font-cartel text-[clamp(2.4rem,5vw,4rem)]">{d.routes.stopsTitle}</h2>
            <ol className="mt-8" role="list">
              {stops.map((s, i) => (
                <li key={s.place.slug} id={`parada-${i + 1}`} className="relative grid scroll-mt-24 grid-cols-[4.5rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0">
                  {/* the margin column: step number + suggested hour, joined by the dotted route line */}
                  <div className="relative flex flex-col items-center">
                    <a href={`#parada-${i + 1}`} className="numero-lamina grid size-14 place-items-center rounded-full bg-tinta text-2xl text-lamina no-underline" aria-label={`${i + 1}`}>
                      {i + 1}
                    </a>
                    {s.suggestedTime ? (
                      <span className="numero-lamina mt-2 text-lg" aria-label={`${d.routes.stopAt} ${s.suggestedTime}`}>
                        {s.suggestedTime}
                      </span>
                    ) : null}
                    {i < stops.length - 1 ? (
                      <span aria-hidden className="mt-2 w-0 flex-1 border-l-[3px] border-dotted border-tinta/60" />
                    ) : null}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
                    <Lamina place={s.place} locale={locale} size="sm" rotate={s.place.media.length ? (i % 2 ? 1 : -1) : 0} />
                    <div className="pt-1">
                      <h3 className="font-rotulo text-2xl leading-tight">
                        <Link href={href(locale, "places", s.place.slug)}>{t(s.place.name, locale)}</Link>
                      </h3>
                      <p className="numero-lamina mt-1 text-[15px] text-tinta-2">
                        {d.lamina.number} {formatAlbumNumber(s.place.albumNumber)}
                        {s.suggestedMinutes ? ` · ${d.place.minutes(s.suggestedMinutes)}` : ""}
                      </p>
                      <p className="mt-2 max-w-[44ch] text-tinta-2">{t(s.place.summary, locale)}</p>
                      {s.note ? <p className="mt-2 font-rotulo">{t(s.note, locale)}</p> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            {located.length ? (
              <div className="lamina p-3" style={{ "--rot": "0.5deg" } as React.CSSProperties}>
                <PocketMap places={located} locale={locale} label={t(route.name, locale)} routeLine={located.map((p) => p.slug)} fit="points" />
              </div>
            ) : null}
            {located.length > 1 ? (
              <p className="mt-4 text-[15px] text-tinta-2">* {d.routes.straightLine(kmLabel)}. {d.routes.straightLineNote}</p>
            ) : null}
            <h3 className="mt-10 font-rotulo text-2xl">{d.routes.bring}</h3>
            <p className="mt-2 max-w-[48ch] text-lg text-tinta-2">{t(route.whatToBring, locale)}</p>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
      <JsonLd data={jsonLd} />
    </>
  );
}

function Meta({ term, value, small }: { term: string; value: string; small?: boolean }) {
  return (
    <div>
      <dt className="text-[13px] font-bold tracking-[0.06em] uppercase" style={{ color: "var(--on-field-soft)" }}>{term}</dt>
      <dd className={`mt-1 ${small ? "text-[16px] leading-snug" : "numero-lamina text-3xl"}`}>{value}</dd>
    </div>
  );
}

/** The slug is URL data: keep it behind Suspense so the shell can be prefetched and shared. */
export default function RoutePage(props: PageProps<"/[locale]/rutas/[slug]">) {
  return (
    <Suspense fallback={<div data-field="papel" className="pagina-trama min-h-dvh" aria-busy="true" />}>
      <RoutePageContent {...props} />
    </Suspense>
  );
}
