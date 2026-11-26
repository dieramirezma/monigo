import type { NextConfig } from "next";

/** Localized path segments: the app's folders use Spanish; English URLs are rewritten. */
const EN_SEGMENTS: Record<string, string> = {
  places: "lugares",
  routes: "rutas",
  map: "mapa",
  plan: "planea",
  brand: "marca",
};

const nextConfig: NextConfig = {
  // Cache Components is not fully supported by OpenNext on Cloudflare yet (the Worker hangs on
  // cross-request promises). The site is fully static, so classic SSG is the right model.
  transpilePackages: ["@monigo/content", "@monigo/db"],
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [480, 960, 1600],
    imageSizes: [240, 360],
    qualities: [70, 80],
  },
  async redirects() {
    return [{ source: "/", destination: "/es", permanent: false }];
  },
  async rewrites() {
    return Object.entries(EN_SEGMENTS).flatMap(([en, es]) => [
      { source: `/en/${en}`, destination: `/en/${es}` },
      { source: `/en/${en}/:path*`, destination: `/en/${es}/:path*` },
    ]);
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
