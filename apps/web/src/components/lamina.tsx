import Image from "next/image";
import Link from "next/link";
import {
  formatAlbumNumber,
  isVerified,
  mediaByFile,
  t,
  type Place,
} from "@monigo/content";
import type { Locale } from "@/i18n/config";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { StuckMark } from "./stuck-mark";

type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, string> = {
  sm: "(max-width: 640px) 45vw, 220px",
  md: "(max-width: 640px) 80vw, 320px",
  lg: "(max-width: 768px) 100vw, 560px",
};

export function mediaSrc(file: string) {
  return `/media/${file}`;
}

export function Lamina({
  place,
  locale,
  size = "md",
  rotate = 0,
  priority = false,
  link = true,
  className = "",
  empty = "slot",
}: {
  place: Place;
  locale: Locale;
  size?: Size;
  rotate?: number;
  priority?: boolean;
  link?: boolean;
  className?: string;
  /** how a lámina without a licensed photo looks: printed slot on the page, or a blank paper sticker */
  empty?: "slot" | "paper";
}) {
  const dict = getDictionary(locale);
  const cover = place.media[0];
  const info = cover ? mediaByFile.get(cover.file) : undefined;
  const name = t(place.name, locale);
  const num = formatAlbumNumber(place.albumNumber);
  const unverified = !isVerified(place);

  const isSlot = !cover && empty === "slot";

  const slotBody = (
    <>
      {/* what a real album prints inside an empty slot: number, a line of text, the data */}
      <div className="relative flex aspect-[4/5] flex-col p-2 sm:p-2.5">
        <span aria-hidden className={`numero-lamina opacity-40 ${size === "sm" ? "text-5xl sm:text-6xl" : "text-8xl"}`}>
          {num}
        </span>
        <span
          className={`mt-auto leading-snug ${size === "sm" ? "line-clamp-4 text-[12.5px] sm:text-[13px]" : "line-clamp-5 text-[15px]"}`}
          style={{ color: "var(--on-field-soft)" }}
        >
          {t(place.summary, locale)}
        </span>
        {place.bestTime ? (
          <span className="numero-lamina mt-1.5 inline-flex items-center gap-1 text-[15px]">
            <SunIcon />
            <span className="sr-only">{dict.place.bestTime}: </span>
            {place.bestTime}
          </span>
        ) : null}
      </div>
      <div className={`px-0.5 pt-2 font-rotulo leading-[1.05] ${size === "sm" ? "text-[15px]" : "text-lg"}`}>
        {name}
      </div>
      <span className="sr-only">
        {`${dict.lamina.number} ${num}.`}
        {unverified ? ` ${dict.lamina.unverified}.` : ""}
        {` ${dict.lamina.missingPhotoHint}`}
      </span>
      {unverified ? <span className="perforacion" aria-hidden /> : null}
      <StuckMark slug={place.slug} label={dict.lamina.stuck} />
    </>
  );

  const body = (
    <>
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-[3px] ${cover ? "bg-papel-2" : "lamina-vacia"}`}
      >
        {cover && info ? (
          <Image
            src={mediaSrc(cover.file)}
            alt={t(cover.alt, locale)}
            width={info.width}
            height={info.height}
            sizes={SIZES[size]}
            priority={priority}
            quality={70}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center text-tinta-2">
            <span
              aria-hidden
              className={`numero-lamina text-tinta/25 ${size === "sm" ? "text-6xl" : "text-8xl"}`}
            >
              {num}
            </span>
            <span className="text-xs font-bold tracking-wide uppercase">
              {dict.lamina.missingPhoto}
            </span>
          </div>
        )}
        <span
          className={`numero-lamina absolute top-2 left-2 grid place-items-center rounded-full bg-lamina text-tinta shadow-[0_1px_2px_rgb(0_0_0/0.25)] ${size === "sm" ? "size-8 text-[15px]" : "size-10 text-lg"}`}
          aria-hidden
        >
          {num}
        </span>
      </div>
      <div className="flex items-start justify-between gap-2 px-0.5 pt-2">
        <span
          className={`font-rotulo leading-[1.05] ${size === "sm" ? "text-[15px]" : size === "md" ? "text-lg" : "text-2xl"}`}
        >
          {name}
        </span>
      </div>
      <span className="sr-only">
        {`${dict.lamina.number} ${num}.`}
        {unverified ? ` ${dict.lamina.unverified}.` : ""}
        {!cover ? ` ${dict.lamina.missingPhotoHint}` : ""}
      </span>
      <StuckMark slug={place.slug} label={dict.lamina.stuck} />
    </>
  );

  const style = { "--rot": `${rotate}deg` } as React.CSSProperties;
  const common = `${isSlot ? "lamina-slot" : "lamina block"} ${className}`;
  const content_ = isSlot ? slotBody : body;

  return link ? (
    <Link
      href={href(locale, "places", place.slug)}
      className={common}
      style={style}
      data-unverified={unverified}
      data-lamina={place.slug}
    >
      {content_}
    </Link>
  ) : (
    <div className={common} style={style} data-unverified={unverified} data-lamina={place.slug}>
      {content_}
    </div>
  );
}

/** The "¿?" slot: a lámina not yet in the album. */
export function MysterySlot({ label, rotate = 0 }: { label: string; rotate?: number }) {
  return (
    <div
      className="lamina lamina-vacia block"
      style={{ "--rot": `${rotate}deg` } as React.CSSProperties}
      aria-hidden
    >
      <div className="grid aspect-[4/5] place-items-center">
        <span className="numero-lamina text-7xl text-tinta/30">¿?</span>
      </div>
      <div className="px-0.5 pt-2 font-rotulo text-[15px] text-tinta-2">{label}</div>
    </div>
  );
}

/** Best-light / suggested-hour mark, drawn to match the 2px stroke icon set. */
export function SunIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden>
      <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
