import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Public pages are prerendered at build time; no incremental cache is needed for the MVP.
// When the admin (Phase 3) starts revalidating, add an R2 incremental cache here.
export default defineCloudflareConfig({});
