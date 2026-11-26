import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every public page is prerendered at build time (generateStaticParams). Serve those pages straight
 * from Workers static assets and intercept the cache before Next runs, so a request costs almost no
 * CPU (free plan: 10 ms per request). No revalidation is needed until the admin panel (Phase 3);
 * then switch to the R2 incremental cache.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
