import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { content, t, townFacts } from "@monigo/content";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export async function generateMetadata({ params }: PageProps<"/[locale]/planea">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    title: d.plan.title,
    alternates: { languages: { es: href("es", "plan"), en: href("en", "plan") } },
  };
}

export default async function PlanPage({ params }: PageProps<"/[locale]/planea">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const events = [...content.events].sort((a, b) => (a.monthHint ?? 13) - (b.monthHint ?? 13));

  return (
    <>
      <div data-field="papel">
        <SiteHeader locale={locale} />
        <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
          <h1 className="font-cartel text-[clamp(3.4rem,11vw,8.5rem)] leading-[0.84]">{d.plan.title}</h1>

          <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <section aria-labelledby="llegar">
              <h2 id="llegar" className="font-cartel text-[clamp(2.2rem,4.5vw,3.25rem)]">{d.plan.getThere}</h2>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-tinta-2">
                {d.plan.getThereBody(t(townFacts.fromBogota, locale), t(townFacts.fromTunja, locale))}
              </p>
              <h2 className="mt-12 font-cartel text-[clamp(2.2rem,4.5vw,3.25rem)]">{d.plan.climate}</h2>
              <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-tinta-2">
                {d.plan.climateBody(townFacts.altitudeM, townFacts.meanTempC)}
              </p>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t-2 border-tinta pt-5">
                <div>
                  <dt className="text-[13px] font-bold tracking-[0.06em] text-tinta-2 uppercase">msnm</dt>
                  <dd className="numero-lamina mt-1 text-4xl">{townFacts.altitudeM.toLocaleString(locale === "es" ? "es-CO" : "en-US")}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold tracking-[0.06em] text-tinta-2 uppercase">°C</dt>
                  <dd className="numero-lamina mt-1 text-4xl">{Math.round(townFacts.meanTempC)}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-bold tracking-[0.06em] text-tinta-2 uppercase">mm/año</dt>
                  <dd className="numero-lamina mt-1 text-4xl">{townFacts.annualRainMm.toLocaleString(locale === "es" ? "es-CO" : "en-US")}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-tinta-2">IDEAM 1981–2010 · Wikipedia</p>
            </section>

            <section aria-labelledby="fiestas">
              <h2 id="fiestas" className="font-cartel text-[clamp(2.2rem,4.5vw,3.25rem)]">{d.plan.festivals}</h2>
              <ol className="mt-6" role="list">
                {events.map((e) => (
                  <li key={e.slug} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 border-t-2 border-tinta py-5">
                    <span className="numero-lamina text-xl leading-tight">
                      {e.monthHint ? d.plan.month(e.monthHint) : <span className="text-base text-tinta-2">{d.plan.dateTbc}</span>}
                    </span>
                    <div>
                      <h3 className="font-rotulo text-2xl leading-tight">{t(e.name, locale)}</h3>
                      <p className="mt-1.5 max-w-[56ch] text-tinta-2">{t(e.description, locale)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </main>
      </div>
      <SiteFooter locale={locale} />
    </>
  );
}
