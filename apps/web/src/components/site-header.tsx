import Link from "next/link";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Isotype, Wordmark } from "./logo";
import { AlbumCounter, LangSwitch } from "./header-client";
import { formatAlbumNumber, publicPlaces } from "@monigo/content";
import { AlbumDock } from "./album-dock";

/**
 * Sits on top of whatever field the page opens with; inherits --on-field.
 * `field` decides the colors (the header never paints its own band).
 */
export function SiteHeader({ locale, dock = true }: { locale: Locale; dock?: boolean }) {
  const d = getDictionary(locale);
  const pub = publicPlaces();
  const total = pub.length;
  const dockPlaces = pub.map((p) => ({
    slug: p.slug,
    num: formatAlbumNumber(p.albumNumber),
    photo: p.media[0] ? `/media/${p.media[0].file}` : undefined,
  }));
  return (
    <header className="relative z-20">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-lamina focus:px-4 focus:py-2 focus:text-tinta"
      >
        {d.nav.skip}
      </a>
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-4 sm:px-8 sm:py-5">
        <Link
          href={href(locale, "home")}
          className="flex items-center gap-2.5 rounded-md"
          aria-label={d.nav.home}
        >
          <Isotype className="size-9 shrink-0 text-tinta" />
          <Wordmark className="text-[28px] sm:text-[32px]" />
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {(
              [
                ["map", d.nav.map],
                ["routes", d.nav.routes],
                ["plan", d.nav.plan],
              ] as const
            ).map(([section, label]) => (
              <li key={section}>
                <Link
                  href={href(locale, section)}
                  className="rounded-full px-3.5 py-2 font-rotulo text-[17px] no-underline hover:bg-[color-mix(in_oklab,var(--on-field)_14%,transparent)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <LangSwitch locale={locale} label={d.nav.lang} short={d.nav.langShort} />
          <AlbumCounter locale={locale} label={d.nav.album} total={total} />
        </nav>
      </div>
      <nav
        aria-label="Secundaria"
        className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 pb-2 md:hidden"
      >
        {(
          [
            ["map", d.nav.map],
            ["routes", d.nav.routes],
            ["plan", d.nav.plan],
          ] as const
        ).map(([section, label]) => (
          <Link
            key={section}
            href={href(locale, section)}
            className="shrink-0 rounded-full border border-[color-mix(in_oklab,var(--on-field)_35%,transparent)] px-3.5 py-1.5 font-rotulo text-[15px] no-underline"
          >
            {label}
          </Link>
        ))}
      </nav>
      {dock ? (
        <AlbumDock
          places={dockPlaces}
          href={href(locale, "album")}
          label={d.nav.album}
          progressLabel={d.album.progress(-1, -2).replace("-1", "{n}").replace("-2", "{total}")}
        />
      ) : null}
    </header>
  );
}
