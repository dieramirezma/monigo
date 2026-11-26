"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { album, useAlbum } from "@/lib/album-store";

export type AlbumPlace = {
  slug: string;
  num: string;
  name: string;
  href: string;
  photo?: { src: string; alt: string; width: number; height: number };
};

type Labels = {
  empty: string;
  emptyCta: string;
  progress: string; // "{n} de {total} láminas" with placeholders
  up: string;
  down: string;
  remove: string;
  clear: string;
  share: string;
  copied: string;
  missingPhoto: string;
};

/**
 * The album page: every lámina has a printed slot; stuck ones show their sticker.
 * Below, the stuck láminas in order = the itinerary. Shared via ?l=slug,slug.
 */
export function AlbumView({
  places,
  labels,
  homeHref,
}: {
  places: AlbumPlace[];
  labels: Labels;
  homeHref: string;
}) {
  const list = useAlbum();
  const [copied, setCopied] = useState(false);
  const bySlug = new Map(places.map((p) => [p.slug, p]));
  const stuck = list.map((s) => bySlug.get(s)).filter((p): p is AlbumPlace => !!p);

  /* import a shared itinerary once */
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("l");
    if (!shared) return;
    const slugs = shared.split(",").filter((s) => bySlug.has(s));
    if (slugs.length) album.replace(slugs);
    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?l=${stuck.map((p) => p.slug).join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(labels.share, url);
    }
  }

  const progress = labels.progress.replace("{n}", String(stuck.length)).replace("{total}", String(places.length));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="numero-lamina text-[clamp(2rem,5vw,3rem)]" aria-live="polite">{progress}</p>
        <div className="h-3 min-w-40 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--on-field)_22%,transparent)]" aria-hidden>
          <div className="h-full rounded-full bg-lamina transition-[width] duration-500" style={{ width: `${(stuck.length / Math.max(1, places.length)) * 100}%` }} />
        </div>
      </div>

      {/* the album grid: every slot printed, stickers where stuck */}
      <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-9" role="list">
        {places.map((p) => {
          const isStuck = list.includes(p.slug);
          return (
            <li key={p.slug}>
              <Link
                href={p.href}
                className={isStuck ? "lamina block" : "lamina-slot"}
                style={{ padding: 4 } as React.CSSProperties}
                aria-label={`${p.num} · ${p.name}`}
              >
                <div className={`relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[2px] ${isStuck && !p.photo ? "lamina-vacia" : ""}`}>
                  {isStuck && p.photo ? (
                    <Image src={p.photo.src} alt="" width={p.photo.width} height={p.photo.height} sizes="120px" quality={70} className="size-full object-cover" />
                  ) : (
                    <span className={`numero-lamina text-3xl ${isStuck ? "text-tinta/40" : "opacity-45"}`}>{p.num}</span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* the itinerary */}
      <div className="mt-14 rounded-[12px] bg-lamina p-5 text-tinta shadow-[var(--shadow-lamina)] sm:p-7">
        {stuck.length === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-lg">{labels.empty}</p>
            <Link href={homeHref} className="inline-flex min-h-12 items-center rounded-full bg-tinta px-5 font-rotulo text-[17px] text-lamina no-underline">
              {labels.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ol className="divide-y-2 divide-papel" role="list">
              {stuck.map((p, i) => (
                <li key={p.slug} className="flex items-center gap-4 py-3">
                  <span className="numero-lamina w-8 text-right text-2xl text-tinta-2">{i + 1}</span>
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-[4px] bg-papel">
                    {p.photo ? (
                      <Image src={p.photo.src} alt="" width={p.photo.width} height={p.photo.height} sizes="56px" quality={70} className="size-full object-cover" />
                    ) : (
                      <span className="numero-lamina grid size-full place-items-center text-lg text-tinta/40">{p.num}</span>
                    )}
                  </span>
                  <Link href={p.href} className="min-w-0 flex-1 font-rotulo text-lg leading-tight">{p.name}</Link>
                  <div className="flex shrink-0 gap-1">
                    <IconButton label={labels.up} disabled={i === 0} onClick={() => album.move(p.slug, -1)} d="M10 15V5m-4 4 4-4 4 4" />
                    <IconButton label={labels.down} disabled={i === stuck.length - 1} onClick={() => album.move(p.slug, 1)} d="M10 5v10m-4-4 4 4 4-4" />
                    <IconButton label={`${labels.remove}: ${p.name}`} onClick={() => album.remove(p.slug)} d="m6 6 8 8M14 6l-8 8" />
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={share} className="inline-flex min-h-12 items-center rounded-full bg-tinta px-5 font-rotulo text-[17px] text-lamina">
                {copied ? labels.copied : labels.share}
              </button>
              <button type="button" onClick={() => album.clear()} className="inline-flex min-h-12 items-center rounded-full px-5 font-rotulo text-[17px] ring-2 ring-tinta ring-inset">
                {labels.clear}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IconButton({ label, onClick, d, disabled }: { label: string; onClick: () => void; d: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full hover:bg-papel disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
