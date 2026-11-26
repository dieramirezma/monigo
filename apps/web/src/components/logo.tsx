/**
 * MoniGo identity.
 * Isotype: a rounded lámina whose lower-right corner peels back to reveal a map pin.
 * Wordmark: "MoniG" + the numbered circle that is also the map pin.
 */

export function Isotype({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* sticker body with the peeled corner cut away */}
      <path
        d="M9 4h30a5 5 0 0 1 5 5v19L28 44H9a5 5 0 0 1-5-5V9a5 5 0 0 1 5-5Z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* the peel: the sticker's back, folding over */}
      <path d="M44 28 28 44c1-7 2-11 5-13s6-3 11-3Z" fill="var(--color-papel-2, #dde1d8)" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* the pin revealed under the peel */}
      <path
        d="M39.5 33.2c-2.6 0-4.6 2-4.6 4.5 0 3.2 4.6 7.8 4.6 7.8s4.6-4.6 4.6-7.8c0-2.5-2-4.5-4.6-4.5Z"
        fill="var(--color-guayaba, #a3203f)"
        transform="translate(-1.5 -2)"
      />
      {/* lámina photo window */}
      <rect x="9.5" y="9.5" width="29" height="17" rx="2" fill="currentColor" opacity="0.9" />
      <path d="m9.5 22 7-6 6 5 5-4 11 8.5v1h-29Z" fill="var(--color-papel, #eceee8)" opacity="0.9" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.04em] font-cartel leading-none ${className ?? ""}`}>
      <span>MoniG</span>
      <span
        aria-hidden
        className="inline-grid size-[0.82em] place-items-center rounded-full bg-current translate-y-[0.04em]"
      >
        <span className="block size-[0.3em] rounded-full bg-[var(--field,var(--color-papel))]" />
      </span>
      <span className="sr-only">o</span>
    </span>
  );
}
