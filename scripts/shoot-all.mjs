import { chromium } from "@playwright/test";
const routes = [
  ["home", "/es"], ["place", "/es/lugares/basilica-nuestra-senora-del-rosario"], ["place-empty", "/en/places/cascada-el-cajon"],
  ["routes", "/es/rutas"], ["route", "/es/rutas/ruta-dulce"], ["map", "/es/mapa"], ["album", "/es/album"], ["plan", "/en/plan"], ["brand", "/es/marca"],
];
const sizes = [["desktop", 1440, 900], ["mobile", 390, 844]];
const b = await chromium.launch({ channel: "chrome" });
for (const [sname, w, h] of sizes) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  for (const [name, path] of routes) {
    const p = await ctx.newPage();
    const errs = [];
    p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
    await p.goto(`http://localhost:3100${path}`, { waitUntil: name === "map" ? "load" : "networkidle", timeout: 180000 });
    await p.waitForTimeout(name === "map" ? 3500 : 600);
    await p.screenshot({ path: `.impeccable/review/${sname}-${name}.png`, fullPage: name !== "map" });
    console.log(sname, name, errs.length ? "ERR " + errs.join(" | ") : "ok");
    await p.close();
  }
  await ctx.close();
}
await b.close();
