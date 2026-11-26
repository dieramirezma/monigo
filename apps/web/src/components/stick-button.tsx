"use client";

import { album, useAlbum } from "@/lib/album-store";

/**
 * Signature interaction — "pegar la lámina".
 * A paper copy of the lámina flies to the "Mi álbum" counter, turning a few degrees;
 * the original presses (1.06 → 1) and its shadow flattens; the folded corner appears.
 * Reduced motion: instant state change.
 */
export function StickButton({
  slug,
  labels,
  sourceSelector,
}: {
  slug: string;
  labels: { stick: string; unstick: string };
  /** element to fly (defaults to the lámina with this slug) */
  sourceSelector?: string;
}) {
  const list = useAlbum();
  const stuck = list.includes(slug);

  function onClick() {
    if (stuck) {
      album.remove(slug);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const source = document.querySelector<HTMLElement>(
      sourceSelector ?? `[data-lamina="${slug}"]`,
    );
    const target = Array.from(document.querySelectorAll<HTMLElement>("[data-album-target]")).find(
      (el) => el.offsetParent !== null,
    );

    if (!reduce && source && target) {
      const a = source.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const ghost = source.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("data-lamina");
      ghost.setAttribute("aria-hidden", "true");
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${a.left}px`,
        top: `${a.top}px`,
        width: `${a.width}px`,
        height: `${a.height}px`,
        margin: "0",
        zIndex: "60",
        pointerEvents: "none",
        transformOrigin: "center",
        rotate: "0deg",
      });
      document.body.appendChild(ghost);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const s = Math.max(0.08, 36 / a.width);
      ghost
        .animate(
          [
            { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 40}px) scale(${(1 + s) / 2}) rotate(-8deg)`,
              opacity: 1,
              offset: 0.6,
            },
            { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(4deg)`, opacity: 0.2 },
          ],
          { duration: 620, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        )
        .finished.finally(() => ghost.remove());

      source.classList.remove("anim-pegar");
      void source.offsetWidth;
      source.classList.add("anim-pegar");
      window.setTimeout(() => album.add(slug), 480);
    } else {
      album.add(slug);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={stuck}
      className={`group inline-flex min-h-12 items-center gap-2.5 rounded-full px-5 py-3 font-rotulo text-[17px] transition-colors ${
        stuck
          ? "bg-transparent text-current ring-2 ring-current ring-inset hover:bg-[color-mix(in_oklab,currentColor_10%,transparent)]"
          : "bg-lamina text-tinta shadow-[var(--shadow-lamina)] hover:shadow-[var(--shadow-lamina-lift)]"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        {stuck ? (
          <path d="M5 12.5 10 17l9-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <>
            <rect x="4" y="3.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M18 14.5 14 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </svg>
      {stuck ? labels.unstick : labels.stick}
    </button>
  );
}
