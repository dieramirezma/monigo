import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://monigo.dieramirezma.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/es/marca", "/en/brand"] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
