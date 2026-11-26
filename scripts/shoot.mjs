// Usage: node scripts/shoot.mjs <url-path> <outfile> [width] [height] [full=1]
import { chromium } from "@playwright/test";
const [, , path = "/es", out = "shot.png", w = "1440", h = "900", full = "1"] = process.argv;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:3100${path}`, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: full === "1" });
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
console.log("saved", out);
