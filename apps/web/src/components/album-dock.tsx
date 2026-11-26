"use client";

import Image from "next/image";
import Link from "next/link";
import { useAlbum } from "@/lib/album-store";

export type DockPlace = { slug: string; num: string; photo?: string };

/**
 * Mobile only: the album strip pinned to the foot — counter + the last stuck láminas.
 * It is also the visible target the "pegar" animation flies into on small screens.
 */
export function AlbumDock({
  places,
  href,
  label,
  progressLabel,
}: {
  places: DockPlace[];
  href: string;
  label: string;
  /** "{n} de {total}" */
  progressLabel: string;
}) {
  const list = useAlbum();
  const bySlug = new Map(places.map((p) => [p.slug, p]));
  const stuck = list.map((s) => bySlug.get(s)).filter((p): p is DockPlace => !!p);
  const last = stuck.slice(-4).reverse();
  const progress = progressLabel.replace("{n}", String(stuck.length)).replace("{total}", String(places.length));

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <Link
        href={href}
        data-album-target
        className="pointer-events-auto flex items-center gap-3 rounded-[14px] bg-tinta py-2 pr-4 pl-2 text-lamina no-underline shadow-[var(--shadow-lamina-lift)]"
      >
        <span className="flex -space-x-3" aria-hidden>
          {last.length ? (
            last.map((p, i) => (
              <span
                key={p.slug}
                className="relative block h-12 w-[38px] overflow-hidden rounded-[3px] border-[3px] border-lamina bg-papel"
                style={{ rotate: `${[-4, 3, -2, 4][i]}deg`, zIndex: 4 - i }}
              >
                {p.photo ? (
                  <Image src={p.photo} alt="" width={76} height={96} sizes="38px" quality={70} className="size-full object-cover" />
                ) : (
                  <span className="numero-lamina grid size-full place-items-center text-[13px] text-tinta/50">{p.num}</span>
                )}
              </span>
            ))
          ) : (
            <span className="block h-12 w-[38px] rounded-[3px] border-2 border-dashed border-lamina/50" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-rotulo text-[17px] leading-tight">{label}</span>
          <span className="numero-lamina block text-[14px] text-lamina/75">{progress}</span>
        </span>
        <svg viewBox="0 0 20 20" className="size-5 shrink-0" aria-hidden>
          <path d="M4 10h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
