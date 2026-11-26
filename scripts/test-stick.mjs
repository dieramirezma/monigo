// e2e smoke: stick a lámina from its page, see the counter and the album update.
import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto("http://localhost:3100/es/lugares/basilica-nuestra-senora-del-rosario", { waitUntil: "networkidle" });
const counter = p.locator("[data-album-target] .numero-lamina").first();
console.log("before:", await counter.textContent());
await p.getByRole("button", { name: "Pegar en mi álbum" }).click();
await p.waitForTimeout(900);
console.log("after:", await counter.textContent(), "| pressed:", await p.getByRole("button", { name: "Despegar del álbum" }).getAttribute("aria-pressed"));
await p.screenshot({ path: ".impeccable/review/stick-after.png", clip: { x: 0, y: 0, width: 1280, height: 700 } });
await p.goto("http://localhost:3100/es/album", { waitUntil: "networkidle" });
console.log("album list:", await p.locator("ol li a").allTextContents());
await p.goto("http://localhost:3100/en/places/basilica-nuestra-senora-del-rosario", { waitUntil: "networkidle" });
console.log("en title:", await p.locator("h1").textContent(), "| lang switch href:", await p.locator('a[hreflang="es"]').getAttribute("href"));
await b.close();
