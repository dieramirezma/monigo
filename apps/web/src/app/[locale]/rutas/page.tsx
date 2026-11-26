import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicRoutes } from "@monigo/content";
import { href, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteCard } from "@/components/route-card";

export async function generateMetadata({ params }: PageProps<"/[locale]/rutas">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  return {
    title: d.routes.title,
    description: d.routes.lead,
    alternates: { languages: { es: href("es", "routes"), en: href("en", "routes") } },
  };
}

export default async function RoutesPage({ params }: PageProps<"/[locale]/rutas">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  return (
    <>
      <div data-field="papel" className="pagina-trama">
        <SiteHeader locale={locale} />
        <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
          <h1 className="font-cartel text-[clamp(3.4rem,11vw,8.5rem)] leading-[0.84]">{d.routes.title}</h1>
          <p className="mt-6 max-w-[52ch] text-xl text-tinta-2">{d.routes.lead}</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {publicRoutes().map((r) => (
              <RouteCard key={r.slug} route={r} locale={locale} />
            ))}
          </div>
        </main>
      </div>
      <SiteFooter locale={locale} />
    </>
  );
}
