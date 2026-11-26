import Link from "next/link";
import { content, mediaByFile } from "@monigo/content";
import { href, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Isotype, Wordmark } from "./logo";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const used = Array.from(
    new Set(content.places.flatMap((p) => p.media.map((m) => m.file))),
  )
    .map((f) => mediaByFile.get(f))
    .filter((m) => !!m);

  return (
    <footer data-field="papel" className="border-t-2 border-tinta">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Isotype className="size-10 text-tinta" />
            <Wordmark className="text-[34px]" />
          </div>
          <p className="mt-4 max-w-sm text-tinta-2">{d.footer.made}</p>
          <p className="mt-2 max-w-sm text-sm text-tinta-2">{d.footer.honesty}</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-rotulo">
            <li><Link href={href(locale, "map")}>{d.nav.map}</Link></li>
            <li><Link href={href(locale, "routes")}>{d.nav.routes}</Link></li>
            <li><Link href={href(locale, "plan")}>{d.nav.plan}</Link></li>
            <li><Link href={href(locale, "album")}>{d.nav.album}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-rotulo text-lg">{d.footer.credits}</h2>
          <ul className="mt-3 space-y-2 text-sm text-tinta-2">
            {used.map((m) => (
              <li key={m!.file}>
                <a href={m!.sourceUrl} className="underline" rel="noopener">
                  {m!.description.split(",")[0]}
                </a>
                {` — ${m!.author}, `}
                <a href={m!.licenseUrl} rel="license noopener" className="underline">
                  {m!.license}
                </a>
                {" · Wikimedia Commons"}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-rotulo text-lg">OpenStreetMap</h2>
          <p className="mt-3 text-sm text-tinta-2">{d.footer.data}</p>
          <p className="mt-6 text-sm text-tinta-2">© MoniGo</p>
        </div>
      </div>
    </footer>
  );
}
