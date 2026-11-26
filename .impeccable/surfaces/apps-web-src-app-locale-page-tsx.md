---
version: 1
slug: "apps-web-src-app-locale-page-tsx"
primary_target: "apps/web/src/app/[locale]/page.tsx"
related_targets: []
---

# Surface: Home (portada del álbum)

Scope: public home `/[locale]` (es/en). Visitor mode: **Persuade**. Related surfaces inherit this world: place page (Experience), routes (Persuade), map / Mi álbum / admin (Operate), Planea (Read).

Audience & job: domestic and foreign tourists deciding whether Moniquirá is worth a trip and what to see. Action: open the map or start a route; secondary: save láminas to Mi álbum.
Proof/content: real places with real (licensed) photos, numbered láminas; honest empty láminas where photos are missing.
Constraints: mobile-first, weak signal, ES/EN, no invented facts.

## Direction contract

THESIS: Moniquirá is an album you collect. Every place is a numbered lámina with a white border; each category is a full album page in its own color field. Refuses the tourism default (full-bleed drone hero, jungle green, equal card rows) and the AI default (cream + italic serif).

OWN-WORLD: Page fields Guayaba #A3203F, Bijao #2F6B3A, Río #2E6F9E, Panela #C98A2B, Barro #7A4A2E (the Memoria page: cave earth, the sixth album page needed its own field), Pulpa #F2879A (Descanso page and highlights); pure white lámina borders; Tinta #1D1A1C; Papel álbum #ECEEE8 for quiet UI. Bricolage Grotesque condensed/extra-bold for titles and lámina numbers in circles; Atkinson Hyperlegible Next for text. Láminas 4:5, slight rotations only where "pegadas"; empty slots are printed on the page itself (dashed, field-deep tint) with number, one line of text and best hour; each page has one double-size lead slot and a printed page number. Map pins = the same numbered circle.

STORY: The visitor sees the album cover, recognizes the collecting ritual, flips through pages (Agua, Alturas, Pueblo, Dulce, Memoria, Descanso), understands what Moniquirá offers and where, then opens the map or a route and saves láminas to build a plan.

FIRST VIEWPORT: Guayaba field edge to edge. Top: MoniGo wordmark left, ES/EN + "Mi álbum (n)" right. Display title huge, left-aligned, ~2 lines: "Moniquirá, colecciónala." One line of plain subcopy (what, where: Boyacá, 3 h from Bogotá). Primary action "Abrir el mapa" (white button, tinta text) + secondary "Ver rutas" in the same row. Lower third: a strip of 5 real láminas (Cascada Real, Basílica, Granadillo, El Cajón, bocadillo) at slight rotations overlapping the fold, plus one empty slot "¿?" — the strip continues into the Agua page below.

FORM: Álbum de láminas (user-pinned; grounded list position 1). seed:ccb135159404c9ee
- Raise from WPA park poster: total ink discipline — each album page uses only its field + white + tinta + one accent, and states exactly one imperative.
- Raise from cutting-bench select rail: state is a mark, not a hue — peeled corner = in Mi álbum, punched corner = unverified, dotted outline = photo missing.
- Raise from orizuru sequence: route stops numbered in a strict margin column, each step deep-linkable.
- Raise from daylight section: tabular time stamps — each route stop and lámina carries a suggested hour / best light.
- Raise from broadcast card: proportions hold at any width — láminas keep 4:5; narrow screens drop columns, never shrink below legibility; Mi álbum strip pinned to the foot on mobile.
Signature interaction: "pegar la lámina" — saving flies the lámina into its numbered slot, rotates a few degrees, presses (1.04→1), shadow flattens; reduced-motion = instant state change. Motion grammar: paper physics (short, damped), orchestrated once.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Real licensed photos for featured láminas (until then empty láminas are shown honestly).
