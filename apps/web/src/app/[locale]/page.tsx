import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  content,
  placeBySlug,
  placesOnPage,
  publicPlaces,
  publicRoutes,
  t,
  type AlbumPage,
} from "@monigo/content";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { baseOpenGraph } from "@/lib/metadata";
import { Lamina, MysterySlot } from "@/components/lamina";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PocketMap } from "@/components/pocket-map";
import { RouteCard } from "@/components/route-card";

/** Deterministic, small, alternating tilt — láminas are stuck by hand, not by grid. */
const tilt = (i: number) => [-2.2, 1.4, -0.8, 2, -1.6, 0.9][i % 6]!;

const COVER_STRIP = [
  "basilica-nuestra-senora-del-rosario",
  "cascada-el-cajon",
  "parque-principal",
  "alto-el-granadillo",
  "rio-moniquira",
];

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const url = href(locale, "home");
  return {
    alternates: { canonical: url, languages: { es: href("es", "home"), en: href("en", "home") } },
    openGraph: { ...baseOpenGraph(locale), url },
  };
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const all = publicPlaces();
  const unlocated = all.filter((p) => !p.coords).length;
  const strip = COVER_STRIP.map((s) => placeBySlug(s)!).filter(Boolean);

  return (
    <>
      {/* ---------------- Cover: the album's front ---------------- */}
      <div data-field="guayaba" className="pagina-trama relative">
        <SiteHeader locale={locale} />
        <main id="contenido">
          <section aria-labelledby="portada" className="relative mx-auto max-w-[1400px] px-5 pt-6 sm:px-8 sm:pt-10">
            <h1 id="portada" className="font-cartel text-[clamp(3.6rem,13vw,10.5rem)] leading-[0.84]">
              <span className="block">{d.cover.title[0]}</span>
              <span className="block">{d.cover.title[1]}</span>
            </h1>
            <div className="mt-7 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-[44ch] text-[19px] leading-snug sm:text-xl" style={{ color: "var(--on-field-soft)" }}>
                {d.cover.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={href(locale, "map")}
                  className="inline-flex min-h-13 items-center gap-2 rounded-full bg-lamina px-7 py-3.5 font-rotulo text-xl text-tinta no-underline shadow-[var(--shadow-lamina)] transition-shadow hover:shadow-[var(--shadow-lamina-lift)]"
                >
                  {d.cover.ctaMap}
                  <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                    <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href={href(locale, "routes")}
                  className="inline-flex min-h-13 items-center rounded-full px-7 py-3.5 font-rotulo text-xl no-underline ring-2 ring-lamina ring-inset hover:bg-[color-mix(in_oklab,white_12%,transparent)]"
                >
                  {d.cover.ctaRoutes}
                </Link>
              </div>
            </div>

            {/* the strip of láminas crosses the fold into the first album page */}
            <ul className="relative z-10 mt-12 -mb-28 grid grid-cols-3 gap-3 sm:mt-14 sm:-mb-36 sm:grid-cols-6 sm:gap-5" role="list">
              {strip.map((p, i) => (
                <li key={p.slug} className={i > 2 ? "hidden sm:block" : ""}>
                  <Lamina place={p} locale={locale} size="sm" rotate={tilt(i)} priority={i < 3} empty="paper" />
                </li>
              ))}
              <li className="hidden sm:block">
                <MysterySlot label={d.cover.mystery} rotate={tilt(5)} />
              </li>
            </ul>
          </section>
        </main>
      </div>

      {/* ---------------- Album pages ---------------- */}
      {content.pages.map((page, i) => (
        <AlbumPageSection key={page.slug} page={page} locale={locale} first={i === 0} pageNumber={i + 1} />
      ))}

      {/* ---------------- How to read a lámina ---------------- */}
      <section data-field="papel" aria-labelledby="leyenda" className="border-y-2 border-tinta">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[auto_1fr] md:gap-16">
          <h2 id="leyenda" className="font-cartel text-[clamp(2.2rem,5vw,3.5rem)] md:max-w-[9ch]">
            {d.legend.title}
          </h2>
          <ul className="grid gap-6 sm:grid-cols-3" role="list">
            <LegendItem kind="unverified" text={d.legend.unverified} />
            <LegendItem kind="missing" text={d.legend.missing} />
            <LegendItem kind="stuck" text={d.legend.stuck} />
          </ul>
        </div>
      </section>

      {/* ---------------- Pocket map ---------------- */}
      <section data-field="papel" aria-labelledby="bolsillo" className="pagina-trama">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-28">
          <div>
            <h2 id="bolsillo" className="font-cartel text-[clamp(2.75rem,7vw,5.5rem)]">
              {d.pocketMap.title}
            </h2>
            <p className="mt-5 max-w-[38ch] text-xl text-tinta-2">{d.pocketMap.body}</p>
            <Link
              href={href(locale, "map")}
              className="mt-8 inline-flex min-h-13 items-center gap-2 rounded-full bg-tinta px-7 py-3.5 font-rotulo text-xl text-lamina no-underline"
            >
              {d.pocketMap.cta}
            </Link>
            {unlocated > 0 ? (
              <p className="mt-6 max-w-[40ch] text-sm text-tinta-2">{d.pocketMap.noCoords(unlocated)}</p>
            ) : null}
          </div>
          <div className="lamina p-3 sm:p-4" style={{ "--rot": "0.6deg" } as React.CSSProperties}>
            <PocketMap places={all} locale={locale} label={d.pocketMap.title} />
          </div>
        </div>
      </section>

      {/* ---------------- Routes ---------------- */}
      <section aria-labelledby="rutas" data-field="papel" className="border-t-2 border-tinta">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="rutas" className="font-cartel text-[clamp(2.75rem,7vw,5.5rem)]">{d.routes.title}</h2>
            <p className="max-w-[46ch] text-lg text-tinta-2">{d.routes.lead}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {publicRoutes().map((r) => (
              <RouteCard key={r.slug} route={r} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Festival close ---------------- */}
      <section data-field="panela" aria-labelledby="fiestas" className="pagina-trama">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-end md:justify-between">
          <h2 id="fiestas" className="font-cartel text-[clamp(2.5rem,7vw,5rem)] md:max-w-[14ch]">
            {t(content.events[0]!.name, locale)}
          </h2>
          <div className="max-w-[40ch]">
            <p className="text-lg">{t(content.events[0]!.description, locale)}</p>
            <Link href={href(locale, "plan")} className="mt-4 inline-flex items-center gap-2 font-rotulo text-lg underline">
              {d.plan.title}
              <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
                <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </>
  );
}

function AlbumPageSection({
  page,
  locale,
  first,
  pageNumber,
}: {
  page: AlbumPage;
  locale: Locale;
  first: boolean;
  pageNumber: number;
}) {
  const d = getDictionary(locale);
  const items = placesOnPage(page.slug);
  if (!items.length) return null;
  /* a page leads with a double-size lámina only when it has a real photograph to feature;
     an empty slot is never enlarged */
  const lead = items.find((p) => p.media.length);
  const rest = items.filter((p) => p !== lead);
  return (
    <section
      data-field={page.colorToken}
      aria-labelledby={`pagina-${page.slug}`}
      className={`pagina-trama relative ${first ? "pt-40 sm:pt-52" : "pt-16 sm:pt-20"}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 pb-14 sm:px-8 sm:pb-16">
        <header className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 id={`pagina-${page.slug}`} className="font-cartel text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.82]">
              {t(page.name, locale)}
            </h2>
            <p className="mt-3 font-rotulo text-[clamp(1.4rem,3vw,2rem)]">{t(page.imperative, locale)}</p>
          </div>
          <div className="md:text-right">
            <p className="numero-lamina text-3xl">{d.page.count(items.length)}</p>
            <p className="mt-2 max-w-[42ch] text-[17px]" style={{ color: "var(--on-field-soft)" }}>
              {t(page.description, locale)}
            </p>
          </div>
        </header>
        <ul
          className="mt-10 grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-6"
          role="list"
        >
          {lead ? (
            <li className="col-span-2 row-span-2">
              <Lamina place={lead} locale={locale} size="md" rotate={tilt(page.sort)} />
            </li>
          ) : null}
          {rest.map((p, i) => (
            <li key={p.slug}>
              <Lamina place={p} locale={locale} size="sm" rotate={p.media.length ? tilt(i + page.sort + 1) : 0} />
            </li>
          ))}
        </ul>
        {/* printed page number, bottom outer corner, like the album itself */}
        <p className="numero-lamina mt-10 text-right text-xl opacity-70" aria-hidden>
          {String(pageNumber).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}

function LegendItem({ kind, text }: { kind: "unverified" | "missing" | "stuck"; text: string }) {
  return (
    <li className="flex items-start gap-4">
      <span aria-hidden className="relative block w-16 shrink-0">
        <span
          className={`lamina block ${kind === "missing" ? "lamina-vacia" : ""}`}
          data-unverified={kind === "unverified"}
          style={{ padding: 4 }}
        >
          <span className={`block aspect-[4/5] rounded-[2px] ${kind === "missing" ? "" : "bg-rio"}`} />
          {kind === "stuck" ? <span className="lamina-doblez" style={{ width: 18, height: 18 }} /> : null}
        </span>
      </span>
      <span className="text-[16px] leading-snug text-tinta-2">{text}</span>
    </li>
  );
}
