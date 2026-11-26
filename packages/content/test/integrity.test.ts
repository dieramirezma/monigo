import { describe, expect, it } from "vitest";
import { content, mediaByFile, publicPlaces } from "../src";

describe("content integrity", () => {
  it("album numbers are unique", () => {
    const nums = content.places.map((p) => p.albumNumber);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it("slugs are unique", () => {
    const slugs = content.places.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every referenced photo exists in the manifest with a license and author", () => {
    for (const p of content.places) {
      for (const m of p.media) {
        const info = mediaByFile.get(m.file);
        expect(info, `${p.slug} → ${m.file}`).toBeDefined();
        expect(info!.license.length).toBeGreaterThan(0);
        expect(info!.author.length).toBeGreaterThan(0);
      }
    }
  });

  it("route stops reference existing, public places", () => {
    const pub = new Set(publicPlaces().map((p) => p.slug));
    for (const r of content.routes) {
      for (const s of r.stops) expect(pub.has(s.place), `${r.slug} → ${s.place}`).toBe(true);
    }
  });

  it("nothing is published without field verification", () => {
    for (const p of content.places.filter((p) => p.status === "published")) {
      expect(p.verifiedAt, p.slug).toBeTruthy();
    }
  });

  it("swimming is never asserted as safe without verification", () => {
    for (const p of content.places.filter((p) => p.swimming === true)) {
      expect(p.status, p.slug).toBe("published");
    }
  });
});
