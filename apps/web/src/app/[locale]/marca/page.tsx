import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { placeBySlug } from "@monigo/content";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { Isotype, Wordmark } from "@/components/logo";
import { Lamina } from "@/components/lamina";

export const metadata: Metadata = { title: "Marca", robots: { index: false, follow: false } };

const SWATCHES = [
  { name: "Guayaba", hex: "#A3203F", role: "Página Pueblo · CTA · pines", ink: "#fff" },
  { name: "Bijao", hex: "#2F6B3A", role: "Página Alturas · rutas", ink: "#fff" },
  { name: "Río", hex: "#2E6F9E", role: "Página Agua", ink: "#fff" },
  { name: "Barro", hex: "#7A4A2E", role: "Página Memoria", ink: "#fff" },
  { name: "Panela", hex: "#C98A2B", role: "Página Dulce · fiestas", ink: "#1D1A1C" },
  { name: "Pulpa", hex: "#F2879A", role: "Página Descanso · resaltado", ink: "#1D1A1C" },
  { name: "Tinta", hex: "#1D1A1C", role: "Texto · números", ink: "#fff" },
  { name: "Papel álbum", hex: "#ECEEE8", role: "Superficies neutras", ink: "#1D1A1C" },
  { name: "Lámina", hex: "#FFFFFF", role: "Marco de lámina", ink: "#1D1A1C" },
];

/** Brand board — not indexed. A living reference for the identity. */
export default async function BrandPage({ params }: PageProps<"/[locale]/marca">) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const basilica = placeBySlug("basilica-nuestra-senora-del-rosario")!;
  const cajon = placeBySlug("cascada-el-cajon")!;

  return (
    <div data-field="papel" className="min-h-dvh">
      <SiteHeader locale={locale} />
      <main id="contenido" className="mx-auto max-w-[1400px] px-5 pt-6 pb-24 sm:px-8">
        <h1 className="font-cartel text-[clamp(3rem,9vw,7rem)] leading-[0.86]">{d.brand.title}</h1>

        <section className="mt-12 grid gap-5 md:grid-cols-3" aria-label="Logo">
          <div data-field="guayaba" className="grid aspect-[4/3] place-items-center rounded-[12px]">
            <div className="flex items-center gap-3">
              <Isotype className="size-16 text-tinta" />
              <Wordmark className="text-6xl" />
            </div>
          </div>
          <div data-field="papel" className="grid aspect-[4/3] place-items-center rounded-[12px] bg-lamina ring-2 ring-tinta">
            <div className="flex items-center gap-3">
              <Isotype className="size-16 text-tinta" />
              <Wordmark className="text-6xl" />
            </div>
          </div>
          <div data-field="bijao" className="grid aspect-[4/3] place-items-center rounded-[12px]">
            <Isotype className="size-28 text-tinta" title="MoniGo" />
          </div>
        </section>

        <section className="mt-16" aria-labelledby="paleta">
          <h2 id="paleta" className="font-cartel text-5xl">Paleta</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" role="list">
            {SWATCHES.map((s) => (
              <li key={s.hex} className="overflow-hidden rounded-[10px] ring-2 ring-tinta">
                <div className="flex aspect-[4/3] items-end p-3" style={{ background: s.hex, color: s.ink }}>
                  <span className="numero-lamina text-2xl">{s.name}</span>
                </div>
                <div className="bg-lamina p-3 text-sm">
                  <p className="font-bold tabular-nums">{s.hex}</p>
                  <p className="text-tinta-2">{s.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-2" aria-labelledby="tipos">
          <div>
            <h2 id="tipos" className="font-cartel text-5xl">Tipografía</h2>
            <p className="mt-6 font-cartel text-[5.5rem] leading-[0.85]">Ññ Áá 0123</p>
            <p className="mt-2 text-tinta-2">Bricolage Grotesque · 800 · ancho 75% — títulos y números de lámina</p>
            <p className="mt-6 font-rotulo text-4xl">Métete al agua.</p>
            <p className="mt-2 text-tinta-2">Bricolage Grotesque · 700 · ancho 85% — rótulos y controles</p>
            <p className="mt-6 max-w-[60ch] text-lg">
              Cascadas, miradores, plaza y bocadillo. Atkinson Hyperlegible Next para leer al sol, en la vía y con mala señal.
            </p>
            <p className="mt-2 text-tinta-2">Atkinson Hyperlegible Next · 400 / 700 — texto</p>
          </div>
          <div>
            <h2 className="font-cartel text-5xl">Láminas</h2>
            <div className="mt-6 grid grid-cols-3 items-start gap-5">
              <Lamina place={basilica} locale={locale} size="sm" rotate={-2} link={false} />
              <div data-field="rio" className="rounded-[8px] p-3">
                <Lamina place={cajon} locale={locale} size="sm" link={false} />
              </div>
              <Lamina place={cajon} locale={locale} size="sm" rotate={1.5} link={false} empty="paper" />
            </div>
            <div className="mt-8 flex items-center gap-4">
              {["rio", "bijao", "guayaba", "barro", "panela", "pulpa"].map((f, i) => (
                <span key={f} className="map-pin" style={{ "--pin": SWATCHES.find((s) => s.name.toLowerCase().startsWith(f.slice(0, 3)))?.hex ?? "#1d1a1c", "--pin-ink": f === "panela" || f === "pulpa" ? "#1d1a1c" : "#fff" } as React.CSSProperties}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
