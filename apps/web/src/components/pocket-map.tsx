import Link from "next/link";
import { boundary, formatAlbumNumber, pageBySlug, t, type Place } from "@monigo/content";
import { href, type Locale } from "@/i18n/config";

const ring = boundary.geometry.coordinates[0] as [number, number][];

type Bounds = { minLon: number; maxLon: number; minLat: number; maxLat: number };

const MUNICIPIO: Bounds = {
  minLon: Math.min(...ring.map((p) => p[0])),
  maxLon: Math.max(...ring.map((p) => p[0])),
  minLat: Math.min(...ring.map((p) => p[1])),
  maxLat: Math.max(...ring.map((p) => p[1])),
};

const W = 1000;
const PAD = 40;

/** Equirectangular projection corrected by cos(lat): fine at municipal scale. */
function makeView(b: Bounds) {
  const kx = Math.cos((((b.minLat + b.maxLat) / 2) * Math.PI) / 180);
  const H = Math.round(((b.maxLat - b.minLat) / ((b.maxLon - b.minLon) * kx)) * (W - PAD * 2) + PAD * 2);
  const project = (lng: number, lat: number) =>
    [
      PAD + ((lng - b.minLon) / (b.maxLon - b.minLon)) * (W - PAD * 2),
      PAD + ((b.maxLat - lat) / (b.maxLat - b.minLat)) * (H - PAD * 2),
    ] as const;
  const outline = ring.map(([lng, lat], i) => `${i ? "L" : "M"}${project(lng, lat).join(" ")}`).join("") + "Z";
  return { H, project, outline };
}

/** Frame a set of points with breathing room (min span ≈ 1.5 km) at a 4:3-ish ratio. */
function boundsAround(points: { lat: number; lng: number }[]): Bounds {
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lng);
  const cLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const cLon = (Math.min(...lons) + Math.max(...lons)) / 2;
  const spanLat = Math.max(0.014, (Math.max(...lats) - Math.min(...lats)) * 1.6);
  const spanLon = Math.max(spanLat * 1.3, (Math.max(...lons) - Math.min(...lons)) * 1.6);
  return { minLon: cLon - spanLon / 2, maxLon: cLon + spanLon / 2, minLat: cLat - spanLat / 2, maxLat: cLat + spanLat / 2 };
}

/**
 * Pins in the town centre sit a few metres apart. Spread them (simple repulsion) so every
 * number stays legible, and draw a short leader line back to the true point.
 */
function declutter(points: { x: number; y: number }[], minDist = 50, iterations = 80) {
  const out = points.map((p) => ({ ...p }));
  for (let k = 0; k < iterations; k++) {
    let moved = false;
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const a = out[i]!;
        const b = out[j]!;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        if (dist >= minDist) continue;
        if (dist < 0.01) {
          dx = Math.cos(i + j);
          dy = Math.sin(i + j);
          dist = 1;
        }
        const push = (minDist - dist) / 2;
        a.x -= (dx / dist) * push;
        a.y -= (dy / dist) * push;
        b.x += (dx / dist) * push;
        b.y += (dy / dist) * push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}

const FIELD_VAR: Record<string, string> = {
  rio: "var(--color-rio)",
  bijao: "var(--color-bijao)",
  guayaba: "var(--color-guayaba)",
  barro: "var(--color-barro)",
  panela: "var(--color-panela)",
  pulpa: "var(--color-pulpa-deep)",
};

/**
 * The whole municipality drawn from its OSM boundary, with every located lámina as its numbered pin.
 * Pure SVG, server-rendered: costs no client JS and works on weak signal.
 */
export function PocketMap({
  places,
  locale,
  label,
  townLabel = "Moniquirá",
  routeLine,
  fit = "municipio",
}: {
  places: Place[];
  locale: Locale;
  label: string;
  townLabel?: string;
  /** ordered slugs to join with a dashed straight line */
  routeLine?: string[];
  /** frame the whole municipality, or zoom to the drawn points */
  fit?: "municipio" | "points";
}) {
  const located = places.filter((p) => p.coords);
  const frame = fit === "points" && located.length ? boundsAround(located.map((p) => p.coords!)) : MUNICIPIO;
  const { H, project, outline } = makeView(frame);
  /* scale bar: a round distance that fits ~20% of the width */
  const kmPerPx =
    ((frame.maxLon - frame.minLon) * 111.32 * Math.cos((((frame.minLat + frame.maxLat) / 2) * Math.PI) / 180)) /
    (W - PAD * 2);
  const scaleKm = [0.1, 0.2, 0.5, 1, 2, 5].find((k) => k / kmPerPx > 140) ?? 5;
  const scalePx = scaleKm / kmPerPx;
  const town = project(-73.57321, 5.87631);
  const truePts = located.map((p) => {
    const [x, y] = project(p.coords!.lng, p.coords!.lat);
    return { x, y };
  });
  const placed = declutter(truePts);
  const linePts = routeLine
    ?.map((s) => located.find((p) => p.slug === s))
    .filter((p): p is Place => !!p?.coords)
    .map((p) => project(p.coords!.lng, p.coords!.lat));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} overflow="hidden" role="img" aria-label={label} className="h-auto w-full">
      <defs>
        <pattern id="trama" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="var(--color-tinta)" opacity="0.13" />
        </pattern>
      </defs>
      <path d={outline} fill="var(--color-lamina)" />
      <path d={outline} fill="url(#trama)" />
      <path
        d={outline}
        fill="none"
        stroke="var(--color-tinta)"
        strokeWidth="2.5"
        strokeDasharray="10 7"
        strokeLinejoin="round"
      />
      {/* town centre */}
      <g transform={`translate(${town[0]} ${town[1]})`}>
        <rect x="-9" y="-9" width="18" height="18" fill="var(--color-tinta)" transform="rotate(45)" />
        <text
          x="-150"
          y="-58"
          className="font-cartel"
          fontSize="34"
          fill="var(--color-tinta)"
          paintOrder="stroke"
          stroke="var(--color-lamina)"
          strokeWidth="8"
        >
          {townLabel}
        </text>
      </g>
      <g transform={`translate(${PAD} ${H - PAD / 2})`} aria-hidden>
        <rect width={scalePx} height="8" fill="var(--color-tinta)" />
        <rect width={scalePx / 2} height="8" fill="var(--color-lamina)" stroke="var(--color-tinta)" strokeWidth="2" />
        <text x={scalePx + 12} y="9" fontSize="22" className="numero-lamina" fill="var(--color-tinta)">
          {scaleKm < 1 ? `${scaleKm * 1000} m` : `${scaleKm} km`}
        </text>
      </g>
      {linePts && linePts.length > 1 ? (
        <polyline
          points={linePts.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="var(--color-tinta)"
          strokeWidth="4"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      ) : null}
      {located.map((p, i) => {
        const tp = truePts[i]!;
        const lp = placed[i]!;
        if (Math.hypot(lp.x - tp.x, lp.y - tp.y) < 4) return null;
        return (
          <line key={`l-${p.slug}`} x1={tp.x} y1={tp.y} x2={lp.x} y2={lp.y} stroke="var(--color-tinta)" strokeWidth="2" />
        );
      })}
      {located.map((p, i) => {
        const { x, y } = placed[i]!;
        const color = FIELD_VAR[pageBySlug(p.page).colorToken] ?? "var(--color-tinta)";
        return (
          <Link key={p.slug} href={href(locale, "places", p.slug)} aria-label={t(p.name, locale)}>
            <g transform={`translate(${x} ${y})`} className="cursor-pointer">
              <circle r="21" fill={color} stroke="var(--color-lamina)" strokeWidth="4" />
              <text
                textAnchor="middle"
                dy="7.5"
                fontSize="21"
                className="numero-lamina"
                fill={p.page === "dulce" || p.page === "descanso" ? "var(--color-tinta)" : "var(--color-lamina)"}
              >
                {formatAlbumNumber(p.albumNumber)}
              </text>
              <title>{t(p.name, locale)}</title>
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
