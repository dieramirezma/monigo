"use client";

import { useAlbum } from "@/lib/album-store";

/** Folded corner shown on láminas that are in "Mi álbum". */
export function StuckMark({ slug, label }: { slug: string; label: string }) {
  const list = useAlbum();
  if (!list.includes(slug)) return null;
  return (
    <>
      <span className="lamina-doblez anim-doblar" aria-hidden />
      <span className="sr-only">{label}</span>
    </>
  );
}
