import Link from "next/link";
import { formatAlbumNumber, pageBySlug, placeBySlug, t, type Route } from "@monigo/content";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** A route reads as a strip of numbered láminas joined by the dotted route line. */
export function RouteCard({ route, locale }: { route: Route; locale: Locale }) {
  const d = getDictionary(locale);
  const page = pageBySlug(route.page);
  return (
    <Link
      href={href(locale, "routes", route.slug)}
      data-field={page.colorToken}
      className="group relative flex flex-col gap-5 overflow-hidden rounded-[10px] p-6 no-underline shadow-[var(--shadow-lamina)] transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lamina-lift)] sm:p-7"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-cartel text-[clamp(2rem,4vw,2.75rem)]">{t(route.name, locale)}</h3>
        <span className="shrink-0 font-rotulo text-sm opacity-85">{d.routes.duration(route.durationMin)}</span>
      </div>
      <ol className="flex items-center" aria-label={d.routes.stops(route.stops.length)}>
        {route.stops.map((s, i) => {
          const p = placeBySlug(s.place)!;
          return (
            <li key={s.place} className="flex items-center">
              {i > 0 ? (
                <span aria-hidden className="mx-1 h-0 w-5 border-t-[3px] border-dotted border-current opacity-70 sm:w-8" />
              ) : null}
              <span
                title={t(p.name, locale)}
                className="numero-lamina grid size-11 place-items-center rounded-full bg-lamina text-[17px] text-tinta shadow-[0_1px_2px_rgb(0_0_0/0.3)]"
              >
                {formatAlbumNumber(p.albumNumber)}
                <span className="sr-only">{t(p.name, locale)}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="max-w-[46ch] text-[16px] leading-snug" style={{ color: "var(--on-field-soft)" }}>
        {t(route.summary, locale)}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 font-rotulo text-sm">
        <span className="rounded-full border-2 border-current px-3 py-1">{d.routes.difficulty[route.difficulty]}</span>
        <span className="rounded-full border-2 border-current px-3 py-1">{d.routes.transport[route.transport]}</span>
        <span className="rounded-full border-2 border-current px-3 py-1">{d.routes.stops(route.stops.length)}</span>
      </div>
    </Link>
  );
}
