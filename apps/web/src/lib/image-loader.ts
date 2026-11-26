"use client";

/**
 * Production: Cloudflare Image Transformations on the zone (/cdn-cgi/image/…).
 * Only a handful of widths are configured to stay under the free 5,000 unique transformations/month.
 * Development / transforms disabled: the original file, with the width as a cache-key hint.
 */
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (process.env.NEXT_PUBLIC_IMAGE_TRANSFORMS !== "1") {
    return `${src}?w=${width}`;
  }
  const params = [`width=${width}`, `quality=${quality ?? 75}`, "format=auto", "fit=scale-down"];
  const base = process.env.NEXT_PUBLIC_MEDIA_ORIGIN ?? "";
  return `/cdn-cgi/image/${params.join(",")}/${base}${src}`;
}
