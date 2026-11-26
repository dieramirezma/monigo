"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, switchLocalePath, type Locale } from "@/i18n/config";
import { useAlbum } from "@/lib/album-store";

export function LangSwitch({
  locale,
  label,
  short,
}: {
  locale: Locale;
  label: string;
  short: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const to: Locale = locale === "es" ? "en" : "es";
  return (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      className="rounded-full px-3 py-2 font-rotulo text-[15px] no-underline hover:bg-[color-mix(in_oklab,var(--on-field)_14%,transparent)]"
      aria-label={label}
    >
      {short}
    </Link>
  );
}

/** "Mi álbum (n)": the target the pegar animation flies into. */
export function AlbumCounter({
  locale,
  label,
  total,
}: {
  locale: Locale;
  label: string;
  total: number;
}) {
  const list = useAlbum();
  const n = list.length;
  const [bump, setBump] = useState(0);
  const prev = useRef(n);
  useEffect(() => {
    if (n > prev.current) setBump((b) => b + 1);
    prev.current = n;
  }, [n]);

  return (
    <Link
      href={href(locale, "album")}
      data-album-target
      className="flex items-center gap-2 rounded-full bg-lamina py-1.5 pr-3.5 pl-1.5 text-tinta no-underline shadow-[var(--shadow-lamina)]"
    >
      <span
        key={bump}
        className={`numero-lamina grid h-8 min-w-8 place-items-center rounded-full bg-guayaba px-1.5 text-[16px] text-lamina ${bump ? "anim-contador" : ""}`}
        aria-hidden
      >
        {n}
      </span>
      <span className="font-rotulo text-[15px]">
        <span>{label}</span>
        <span className="sr-only">{`: ${n} / ${total}`}</span>
      </span>
    </Link>
  );
}
