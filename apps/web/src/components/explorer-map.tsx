"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MlMap, Marker, StyleSpecification } from "maplibre-gl";
import type { Feature } from "geojson";
import { StickButton } from "./stick-button";

export type MapPlace = {
  slug: string;
  num: string;
  name: string;
  summary: string;
  page: string;
  field: string;
  lat: number | null;
  lng: number | null;
  href: string;
  unverified: boolean;
  photo?: { src: string; alt: string; width: number; height: number; credit: string };
};

export type MapPage = { slug: string; name: string; field: string };

type Labels = {
  list: string;
  filterAll: string;
  close: string;
  openPlace: string;
  attribution: string;
  unlocated: string;
  unverified: string;
  missingPhoto: string;
  stick: string;
  unstick: string;
  loading: string;
  error: string;
};

const FIELD_HEX: Record<string, string> = {
  rio: "#2e6f9e",
  bijao: "#2f6b3a",
  guayaba: "#a3203f",
  barro: "#7a4a2e",
  panela: "#c98a2b",
  pulpa: "#f2879a",
};
const DARK_TEXT = new Set(["panela", "pulpa"]);

/**
 * Town-centre places sit metres apart. Push overlapping pins apart in screen space
 * (simple repulsion) and keep the result as a fixed pixel offset per marker.
 */
function repel(points: { x: number; y: number }[], minDist = 44, iterations = 120) {
  const out = points.map((p) => ({ ...p }));
  for (let k = 0; k < iterations; k++) {
    let moved = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i]!;
        const b = out[j]!;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d >= minDist) continue;
        if (d < 0.01) {
          dx = Math.cos(i * 2.4);
          dy = Math.sin(i * 2.4);
          d = 1;
        }
        const push = (minDist - d) / 2;
        a.x -= (dx / d) * push;
        a.y -= (dy / d) * push;
        b.x += (dx / d) * push;
        b.y += (dy / d) * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}

/** Recolor the OpenFreeMap Positron style into the album palette. */
function albumize(style: StyleSpecification): StyleSpecification {
  for (const layer of style.layers) {
    const id = layer.id;
    const paint = ((layer as { paint?: Record<string, unknown> }).paint ??= {});
    if (layer.type === "background") paint["background-color"] = "#eceee8";
    else if (layer.type === "fill" && /water/.test(id)) paint["fill-color"] = "#9cc3df";
    else if (layer.type === "line" && /waterway|river|stream/.test(id)) paint["line-color"] = "#5f97c2";
    else if (layer.type === "fill" && /(park|wood|forest|grass|landcover|landuse)/.test(id)) {
      paint["fill-color"] = "#d9e3d2";
      paint["fill-opacity"] = 0.7;
    } else if (layer.type === "line" && /(road|highway|street|path|track|bridge|tunnel)/.test(id)) {
      paint["line-color"] = id.includes("casing") ? "#c9cdc3" : "#ffffff";
    } else if (layer.type === "symbol" && /poi/.test(id)) {
      (layer as { layout?: Record<string, unknown> }).layout = {
        ...((layer as { layout?: Record<string, unknown> }).layout ?? {}),
        visibility: "none",
      };
    } else if (layer.type === "symbol") {
      paint["text-color"] = "#4a4548";
      paint["text-halo-color"] = "#eceee8";
    }
  }
  return style;
}

export function ExplorerMap({
  places,
  pages,
  boundary,
  labels,
  center,
}: {
  places: MapPlace[];
  pages: MapPage[];
  boundary: Feature;
  labels: Labels;
  center: { lat: number; lng: number };
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const markers = useRef<Map<string, { marker: Marker; el: HTMLButtonElement }>>(new Map());
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const located = useMemo(() => places.filter((p) => p.lat != null && p.lng != null), [places]);
  const visible = useMemo(
    () => places.filter((p) => filter === "all" || p.page === filter),
    [places, filter],
  );
  const current = places.find((p) => p.slug === selected) ?? null;

  /* init map once */
  useEffect(() => {
    let cancelled = false;
    const markerMap = markers.current;
    (async () => {
      try {
        const [maplibregl, styleRes] = await Promise.all([
          import("maplibre-gl"),
          fetch("https://tiles.openfreemap.org/styles/positron"),
        ]);
        if (!styleRes.ok) throw new Error(String(styleRes.status));
        maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        const style = albumize((await styleRes.json()) as StyleSpecification);
        if (cancelled || !box.current) return;
        const m = new maplibregl.Map({
          container: box.current,
          style,
          center: [center.lng, center.lat],
          zoom: 11,
          attributionControl: { compact: true, customAttribution: labels.attribution },
          cooperativeGestures: false,
        });
        m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        m.on("load", () => {
          m.addSource("municipio", { type: "geojson", data: boundary });
          m.addLayer({
            id: "municipio-line",
            type: "line",
            source: "municipio",
            paint: { "line-color": "#1d1a1c", "line-width": 2.5, "line-dasharray": [3, 2] },
          });
          const bounds = new maplibregl.LngLatBounds();
          for (const p of located) {
            const el = document.createElement("button");
            el.type = "button";
            el.className = "map-pin";
            el.textContent = p.num;
            el.setAttribute("aria-label", `${p.num} · ${p.name}`);
            el.style.setProperty("--pin", FIELD_HEX[p.field] ?? "#1d1a1c");
            el.style.setProperty("--pin-ink", DARK_TEXT.has(p.field) ? "#1d1a1c" : "#ffffff");
            el.addEventListener("click", (e) => {
              e.stopPropagation();
              setSelected(p.slug);
            });
            const marker = new maplibregl.Marker({ element: el }).setLngLat([p.lng!, p.lat!]).addTo(m);
            markers.current.set(p.slug, { marker, el });
            bounds.extend([p.lng!, p.lat!]);
          }
          if (!bounds.isEmpty()) m.fitBounds(bounds, { padding: 70, maxZoom: 13, duration: 0 });
          /* declutter at the framed zoom; offsets are kept as fixed pixels */
          const truePx = located.map((p) => m.project([p.lng!, p.lat!]));
          const placed = repel(truePx.map((q) => ({ x: q.x, y: q.y })));
          located.forEach((p, i) => {
            markers.current.get(p.slug)?.marker.setOffset([placed[i]!.x - truePx[i]!.x, placed[i]!.y - truePx[i]!.y]);
          });
          setStatus("ready");
        });
        m.on("error", () => {
          /* tile hiccups are non-fatal */
        });
        map.current = m;
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
      markerMap.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* filter pins */
  useEffect(() => {
    for (const p of located) {
      const entry = markers.current.get(p.slug);
      if (!entry) continue;
      entry.el.toggleAttribute("hidden", !(filter === "all" || p.page === filter));
    }
  }, [filter, located, status]);

  /* selection → fly + highlight */
  useEffect(() => {
    for (const [slug, { el }] of markers.current) el.setAttribute("data-active", String(slug === selected));
    const p = places.find((x) => x.slug === selected);
    if (p?.lat != null && p.lng != null && map.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.current.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.current.getZoom(), 13), duration: reduce ? 0 : 700 });
    }
  }, [selected, places]);

  return (
    <div className="relative grid min-h-[calc(100dvh-5rem)] grid-rows-[auto_1fr] lg:grid-cols-[380px_minmax(0,1fr)] lg:grid-rows-1">
      {/* list + filters (always available, also the non-visual alternative to the map) */}
      <aside className="order-2 flex max-h-none flex-col border-tinta bg-papel lg:order-1 lg:max-h-[calc(100dvh-5rem)] lg:border-r-2">
        <div
          className="flex gap-2 overflow-x-auto border-b-2 border-tinta px-4 py-3 pr-10 [mask-image:linear-gradient(to_right,#000_82%,transparent)]"
          role="group"
          aria-label={labels.list}
        >
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} color="#1d1a1c">
            {labels.filterAll}
          </FilterChip>
          {pages.map((pg) => (
            <FilterChip key={pg.slug} active={filter === pg.slug} onClick={() => setFilter(pg.slug)} color={FIELD_HEX[pg.field]!}>
              {pg.name}
            </FilterChip>
          ))}
        </div>
        <h2 className="sr-only">{labels.list}</h2>
        <ul className="flex-1 overflow-y-auto" role="list">
          {visible.map((p) => (
            <li key={p.slug} className="border-b border-papel-2">
              <button
                type="button"
                onClick={() => setSelected(p.slug)}
                aria-current={selected === p.slug}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-lamina aria-[current=true]:bg-lamina"
              >
                <span
                  className="numero-lamina grid size-9 shrink-0 place-items-center rounded-full text-[15px]"
                  style={{ background: FIELD_HEX[p.field], color: DARK_TEXT.has(p.field) ? "#1d1a1c" : "#fff" }}
                >
                  {p.num}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-rotulo text-[17px] leading-tight">{p.name}</span>
                  {p.lat == null ? <span className="block text-[13px] text-tinta-2">{labels.unlocated}</span> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="relative order-1 h-[58dvh] lg:order-2 lg:h-[calc(100dvh-5rem)]">
        <div className="absolute inset-0">
          <div ref={box} className="size-full" />
        </div>
        {status !== "ready" ? (
          <div className="pagina-trama absolute inset-0 grid place-items-center bg-papel p-6 text-center" data-field="papel" role="status">
            <p className="max-w-[36ch] font-rotulo text-lg">{status === "loading" ? labels.loading : labels.error}</p>
          </div>
        ) : null}

        {current ? (
          <section
            aria-label={current.name}
            className="absolute inset-x-3 bottom-3 z-10 max-h-[80%] overflow-y-auto rounded-[12px] bg-lamina p-3 text-tinta shadow-[var(--shadow-lamina-lift)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[360px]"
          >
            <div className="flex gap-3" data-lamina={`map-${current.slug}`}>
              <div className={`relative w-28 shrink-0 overflow-hidden rounded-[4px] ${current.photo ? "" : "lamina-vacia"}`} style={{ aspectRatio: "4 / 5" }}>
                {current.photo ? (
                  <Image src={current.photo.src} alt={current.photo.alt} width={current.photo.width} height={current.photo.height} sizes="112px" quality={70} className="size-full object-cover" />
                ) : (
                  <span className="numero-lamina grid size-full place-items-center text-4xl text-tinta/30">{current.num}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="numero-lamina text-sm" style={{ color: FIELD_HEX[current.field] }}>{current.num}</p>
                <h3 className="font-rotulo text-xl leading-tight">{current.name}</h3>
                <p className="mt-1 line-clamp-3 text-[15px] leading-snug text-tinta-2">{current.summary}</p>
                {current.unverified ? <p className="mt-1 text-[13px] font-bold text-tinta-2">{labels.unverified}</p> : null}
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-papel" aria-label={labels.close}>
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={current.href} className="inline-flex min-h-12 items-center rounded-full bg-tinta px-5 font-rotulo text-[17px] text-lamina no-underline">
                {labels.openPlace}
              </Link>
              <StickButton slug={current.slug} labels={{ stick: labels.stick, unstick: labels.unstick }} sourceSelector={`[data-lamina="map-${current.slug}"]`} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="shrink-0 rounded-full border-2 px-3.5 py-1.5 font-rotulo text-[15px] transition-colors"
      style={{
        borderColor: color,
        background: active ? color : "transparent",
        color: active ? (color === "#c98a2b" || color === "#f2879a" ? "#1d1a1c" : "#fff") : "#1d1a1c",
      }}
    >
      {children}
    </button>
  );
}
