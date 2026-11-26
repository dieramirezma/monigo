---
name: MoniGo
description: Moniquirá as an album you collect. Every place is a numbered lámina, every category a full-color album page.
colors:
  guayaba: "#a3203f"
  guayaba-deep: "#7e1730"
  bijao: "#2f6b3a"
  bijao-deep: "#224f2b"
  rio: "#2e6f9e"
  rio-deep: "#1f5378"
  barro: "#7a4a2e"
  barro-deep: "#5a3420"
  panela: "#c98a2b"
  panela-deep: "#8f5f17"
  pulpa: "#f2879a"
  pulpa-deep: "#c4566b"
  lamina: "#ffffff"
  papel: "#eceee8"
  papel-2: "#dde1d8"
  tinta: "#1d1a1c"
  tinta-2: "#4a4548"
typography:
  cartel-cover:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.6rem, 13vw, 10.5rem)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.03em"
    fontVariation: "\"opsz\" 96, \"wdth\" 75"
  cartel-page:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 11vw, 8.5rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.03em"
    fontVariation: "\"opsz\" 96, \"wdth\" 75"
  cartel-section:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "\"opsz\" 96, \"wdth\" 75"
  rotulo:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 85"
  numero-lamina:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 75"
  body:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  photo-window: "3px"
  lamina: "6px"
  card: "10px"
  dock: "14px"
  pill: "999px"
spacing:
  marco: "7px"
  gutter: "20px"
  gutter-sm: "32px"
  container: "1400px"
  grid-gap: "16px"
  grid-gap-sm: "24px"
  section-y: "80px"
  section-y-lg: "112px"
components:
  lamina:
    backgroundColor: "{colors.lamina}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.lamina}"
    padding: "7px 7px 7.7px"
  lamina-number-circle:
    backgroundColor: "{colors.lamina}"
    textColor: "{colors.tinta}"
    typography: "{typography.numero-lamina}"
    rounded: "{rounded.pill}"
    size: "40px"
  button-primary:
    backgroundColor: "{colors.lamina}"
    textColor: "{colors.tinta}"
    typography: "{typography.rotulo}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "52px"
  button-primary-on-papel:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.lamina}"
    typography: "{typography.rotulo}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
    height: "52px"
  button-stick:
    backgroundColor: "{colors.lamina}"
    textColor: "{colors.tinta}"
    typography: "{typography.rotulo}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
    height: "48px"
  album-counter:
    backgroundColor: "{colors.lamina}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "6px 14px 6px 6px"
  album-counter-badge:
    backgroundColor: "{colors.guayaba}"
    textColor: "{colors.lamina}"
    typography: "{typography.numero-lamina}"
    rounded: "{rounded.pill}"
    height: "32px"
  album-dock:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.lamina}"
    rounded: "{rounded.dock}"
    padding: "8px 16px 8px 8px"
  route-card:
    rounded: "{rounded.card}"
    padding: "28px"
  map-pin:
    textColor: "{colors.lamina}"
    rounded: "{rounded.pill}"
    size: "38px"
---

# Design System: MoniGo

## Overview

**Creative North Star: "The Álbum de Láminas"**

MoniGo is a sticker album of Moniquirá. Every place is a numbered lámina: a white-bordered 4:5 sticker with its number in a circle. Every category is an album page painted edge to edge in its own color field: Agua in Río, Alturas in Bijao, Pueblo in Guayaba, Memoria in Barro, Dulce in Panela, Descanso in Pulpa. The cover is a Guayaba field. Visitors flip through the pages, stick láminas into "Mi álbum", and the stuck láminas become their itinerary. The map uses the same object: a pin is the lámina's numbered circle in its page color.

Ink discipline does most of the work. A page holds only its field, white láminas, Tinta, and the field's own deep and soft tints. Each page states one imperative ("Métete al agua", "Sube a mirar"). Display type is huge, condensed, and extra bold, like a poster. Text is set in a hyperlegible sans for a mobile, weak-signal audience. Depth is paper: soft shadows under láminas, a slight hand-stuck tilt, a folded corner. Motion follows paper physics: short, damped, played once.

State is shown by a mark on the lámina, not by color. A punched corner means unverified, a printed dashed slot means no licensed photo yet, and a folded corner means stuck in my album. Content truth is part of the visual system. Empty láminas stay honestly empty and are never filled with stock imagery, and every photograph carries its credit and license.

**Key Characteristics:**
- Full-bleed color fields, one per album page, carrying data-driven ink variables.
- The white-bordered 4:5 lámina with a numbered circle is the one recurring object (sticker, map pin, route stop, wordmark "o").
- Condensed extra-bold Bricolage display over Atkinson Hyperlegible Next text.
- State shown as physical marks (punched, printed slot, folded), never as hue alone.
- Paper shadows and small tilts. Motion is limited to "pegar", "doblar", and the counter bump.
- Printed page numbers, page counts, and tabular figures everywhere.

## Colors

Six saturated album-page fields over a cool paper neutral, with pure white for láminas and a warm near-black ink.

### Primary
- **Guayaba** (`guayaba`, deep `guayaba-deep`): the cover field and the Pueblo page. It is also the brand accent outside fields: the "Mi álbum" counter badge, the isotype pin, the text caret, and the browser theme color.

### Secondary (page fields)
- **Bijao** (`bijao` / `bijao-deep`): leaf green, the Alturas page.
- **Río** (`rio` / `rio-deep`): river blue, the Agua page.
- **Barro** (`barro` / `barro-deep`): cave earth, the Memoria page.
- **Panela** (`panela` / `panela-deep`): cane-sugar amber, the Dulce page and the festival close.
- **Pulpa** (`pulpa` / `pulpa-deep`): guava-pulp pink, the Descanso page. Also the text-selection highlight.

### Neutral
- **Lámina** (`lamina`, pure white): sticker borders, primary buttons on fields, the counter, number circles, pin borders.
- **Papel álbum** (`papel`): quiet UI pages (legend, pocket map, routes, place sources), the html background, and the paper of empty paper-stickers.
- **Papel 2** (`papel-2`): the deep tint of the papel field, the photo-window placeholder, and the back of the folded corner.
- **Tinta** (`tinta`): all text on light fields and papel, focus rings, the mobile dock, and the 2px rules that separate papel sections.
- **Tinta 2** (`tinta-2`): secondary text on papel.

### Field mechanics
A field is set with `data-field="guayaba|bijao|rio|barro|panela|pulpa|papel"`. That attribute paints the background and defines four variables that every descendant uses:
- `--field`: the page color (the background).
- `--field-deep`: the `-deep` token. Printed slots are tinted with it (55% mix, 85% on hover).
- `--on-field`: the ink. White on Guayaba, Bijao, Río, and Barro. Tinta on Panela, Pulpa, and Papel.
- `--on-field-soft`: secondary text on the field. Light tints on dark fields (#f6d5dc, #d3e6d4, #d4e5f2, #efdccf). Dark tints on light fields (#3f2a0a on Panela, #4a1c26 on Pulpa, Tinta 2 on Papel).

Hover washes, borders, and the printed dot grid (`pagina-trama`: a 1px dot on a 22px grid at 14% of `--on-field`) are all `color-mix` of `--on-field`. Focus rings flip to white inside any field.

### Named Rules
**The Total Ink Rule.** An album page uses only its field, white láminas, Tinta, and its own `--field-deep` and `--on-field-soft`. Never put one page's color inside another page.

**The Field Owns the Ink Rule.** Inside a field, components take color from `--on-field` / `--on-field-soft` / `--field-deep`, never from hard-coded hex. The header never paints its own band. It inherits whatever field the page opens with.

**The State Is a Mark Rule.** Verification, photo availability, and album membership are shown as physical marks on the lámina (punched hole, printed dashed slot, folded corner). Each mark also has screen-reader text. Never encode these states as a tint.

## Typography

**Display Font:** Bricolage Grotesque variable (wght 200–800, wdth 75–100%), with ui-sans-serif fallback
**Body Font:** Atkinson Hyperlegible Next (400, 400 italic, 700), with ui-sans-serif fallback

**Character:** a condensed, extra-bold poster face for titles and numbers, set against a body face designed for legibility. The display face sets the album's character and the body face keeps the text readable in sunlight and on a weak connection.

### Hierarchy
- **Cartel / Cover** (800, 75% width, opsz 96, `cartel-cover`): the album cover title only. Two lines, left-aligned.
- **Cartel / Page** (800, `cartel-page`): album page names (Agua, Alturas…). Very tight leading so the name reads as a block.
- **Cartel / Section** (800, `cartel-section`; smaller clamps of 2.2–4rem for legend and sub-sections): papel section titles, place titles, route names.
- **Rótulo** (700, 85% width): nav links, buttons, lámina names (15px sm / 18px md / 24px lg), page imperatives (clamp 1.4–2rem), chips.
- **Número de lámina** (800, 75% width, tabular): lámina numbers ("01"), number circles, page counts, printed page numbers, best-hour stamps, progress ("3 de 25"), data values.
- **Body** (400, 17px / 1.55, tabular figures): running text. Measure is held at 38–46ch, and lead copy runs 19–20px.
- **Label** (700, 13px, 0.06em tracking, uppercase): the term in definition lists of facts (altitude, temperature, duration) only.

### Named Rules
**The Numbers Are Display Rule.** Every number a visitor reads as part of the album (lámina, page, count, hour) is set in `numero-lamina`, never in body type.

**The Two Voices Rule.** Bricolage is for titles, names, numbers, and controls. Atkinson is for sentences. Do not set paragraphs in Bricolage, and do not set titles in Atkinson.

## Layout

- **Container:** max width 1400px, centered. Gutters are 20px, and 32px from `sm`.
- **Album page section:** full-bleed field with the dot grid. The header is a two-column grid on `md`+: page name and imperative on the left, page count (`numero-lamina`, 3xl) and a short `--on-field-soft` description on the right. Below it is a dense lámina grid: 2 columns, 4 at `sm`, 6 at `lg`. Gaps are 16/24px horizontal and 24/32px vertical. The section closes with a **printed page number** ("01", `numero-lamina`, 70% opacity), right-aligned at the bottom outer corner.
- **Lead slot:** a page opens with a double-size lámina (2×2 cells) **only when that page has a real photograph**. An empty slot is never enlarged. If no lámina is photographed, the page has no lead.
- **Cover:** a Guayaba field. Wordmark on the left, nav, ES/EN, and "Mi álbum (n)" on the right. Then the two-line cartel title, one line of subcopy, and the CTA row. A strip of six small láminas (3 on mobile) crosses the fold into the first page (negative bottom margin of 112/144px; the first page adds 160/208px of top padding to receive it).
- **Papel sections** (legend, pocket map, routes, sources) are separated by 2px Tinta rules. Vertical rhythm is 80px, and 96–112px at `lg`.
- **Responsive:** láminas always keep 4:5. Narrow screens drop columns and never shrink láminas below legibility. On mobile the desktop nav moves into a scrollable pill row under the header, and the album dock is pinned to the foot.

## Elevation & Depth

Depth is paper. Láminas, primary buttons, the counter, route cards, and map controls sit on soft two-layer shadows tinted with Tinta: a 1px contact line plus a soft, offset blur. Hover lifts a lámina 3px, straightens its tilt to 40%, and moves to the lift shadow. When a lámina is stuck, it presses and its shadow goes flat. Shadows are never hard or offset blocks.

### Shadow Vocabulary
- **Lámina** (`0 1px 0 rgb(29 26 28 / 0.08), 0 6px 14px -6px rgb(29 26 28 / 0.35)`): resting stickers, white buttons, counter, route cards, map control groups.
- **Lámina lift** (`0 2px 0 rgb(29 26 28 / 0.06), 0 18px 30px -12px rgb(29 26 28 / 0.45)`): hover and focus on láminas and buttons, the mobile dock, and the start of "pegar".
- **Lámina flat** (`0 1px 0 rgb(29 26 28 / 0.1), 0 1px 2px rgb(29 26 28 / 0.15)`): the end state of "pegar". The sticker is now pressed into the album.
- **Pin** (`0 2px 6px rgb(29 26 28 / 0.35)`; active adds a 3px Tinta ring and a 0 6px 14px drop): map pins.

### Named Rules
**The Hand-Stuck Rule.** Photographed láminas tilt slightly (deterministic −2.2° to +2°). Printed empty slots sit at 0°, because they are part of the page and not stuck on it.

## Shapes

- Láminas: gently rounded (6px) outer border with a 7px white frame (`marco`). The photo window inside is rounded 3px. The proportion is always 4:5.
- Number circles, pins, buttons, chips, the counter: full pills/circles.
- Route cards: 10px. Mobile dock: 14px.
- **State marks:**
  - *Punched corner* (unverified): a 5px-radius hole masked out 14px from the top-right corner. On printed slots the hole is ringed with a 1.5px `--on-field` stroke at 75% so it stays visible against the same field behind it.
  - *Printed slot* (no licensed photo): on a page, a `--field-deep` 55% fill with a 2px dashed `--on-field` 45% outline. It shows the number large at 40% opacity, a one-line summary, and the best-hour stamp. As a paper sticker (cover strip, legend), it is Papel with a 5% Tinta diagonal hatch and a 2px dashed Tinta 35% inset outline.
  - *Folded corner* (in Mi álbum): a 30px Papel 2 triangle at the bottom-right corner with a soft drop shadow. It unfolds with `doblar`.
- Route line: a 3px dotted line in the current ink joining numbered circles.

## Components

### Lámina (signature)
White 4:5 sticker with a numbered circle (top-left, 32px sm / 40px md) over the photo and its name in Rótulo below. Sizes are sm, md (lead), and lg. It links to the place. Hover and focus: lift, de-tilt, lift shadow, 380ms `ease-papel`. Every lámina carries screen-reader text for its number, verification, and photo state.

### Printed slot
The empty-lámina form on album pages, described under Shapes. Hover deepens the fill to 85% and turns the outline solid `--on-field`. It is never given a stock image and never enlarged to lead size.

### Buttons
- **Shape:** full pill, minimum height 52px (48px for the stick button).
- **Primary on a field:** white with Tinta text and the lámina shadow, Rótulo at 20px, with an optional 2px-stroke arrow icon. Hover moves to the lift shadow.
- **Secondary on a field:** transparent with a 2px inset white ring. Hover adds a 12% white wash.
- **Primary on papel:** Tinta fill with white text.
- **Stick ("Pegar en mi álbum"):** white pill with a sticker-plus icon. When pressed (`aria-pressed`) it becomes a transparent pill with a 2px current-color ring and a check icon.

### Chips
Rótulo at 14px, pill, 2px current-color border, transparent. Used for route difficulty, transport, and stop count.

### Navigation
The header sits on the page's field and inherits its ink. Wordmark (isotype plus cartel "MoniG" with a numbered-circle "o") on the left. On the right are Rótulo 17px pill links with a 14% `--on-field` hover wash, ES/EN, and the **Mi álbum counter**: a white pill with a Guayaba number badge that bumps (`contador`) on add. On mobile the links become bordered pills in a horizontally scrolling row. A skip link appears on focus.

### Mobile album dock
Mobile only, fixed to the bottom with a safe-area inset. A Tinta 14px-radius bar with the lift shadow shows the last four stuck láminas as tiny overlapping 38×48 stickers (3px white border, alternating −4°/3°/−2°/4° tilts; an empty dashed slot when none are stuck). Beside them are "Mi álbum" in Rótulo, progress "n de total" in `numero-lamina` at 75% white, and an arrow. It is a `data-album-target`, the visible target "pegar" flies into on small screens.

### Route card
A full field in the route's page color, 10px radius, lámina shadow. It shows the cartel name and duration, numbered stop circles joined by the dotted route line, a summary in `--on-field-soft`, and chips. Hover lifts it 4px.

### Map pin
A 38px circle in the place's page color with a 3px white border, showing the lámina number (`numero-lamina` 15px) in white or Tinta to match that field's ink. Hover scales to 1.12. Active scales to 1.25 with a Tinta ring. MapLibre controls get the lámina shadow, 8px radius, and Papel attribution.

### Photo credit
Every licensed photo on a place page has a figcaption in Tinta 2, 14px, giving author, source, and a linked license (`rel="license"`). The footer lists all credits.

### Motion grammar
- `ease-papel` cubic-bezier(0.16, 1, 0.3, 1): sticker physics. `ease-salida` cubic-bezier(0.22, 1, 0.36, 1): exits, washes, shadows.
- **pegar** (520ms): scale 1.06 with lift shadow → 0.985 at 55% → 1 with flat shadow. At the same time a ghost copy flies to the visible album target over 620ms, arcing up 40px, rotating −8° then 4°, and fading. The state commits at 480ms.
- **doblar** (320ms): the folded corner scales in from its corner.
- **contador** (420ms): the counter badge pulses to 1.25.
- **Reduced motion:** every animation and transition collapses to 1ms, and "pegar" skips the flight and commits immediately.

## Do's and Don'ts

### Do:
- **Do** give every category page its own full-bleed field via `data-field`, and color everything inside it from `--on-field`, `--on-field-soft`, and `--field-deep`.
- **Do** keep láminas at 4:5 with a 7px white frame, a 6px radius, and the numbered circle top-left.
- **Do** show a missing photo as a printed slot (number, one line, best hour) and leave it honestly empty.
- **Do** lead a page with a double-size lámina only when it has a real photograph.
- **Do** credit every photograph with author, source, and linked license.
- **Do** set every album number, count, hour, and page number in `numero-lamina` with tabular figures.
- **Do** close each album page with its printed two-digit page number at the bottom outer corner.
- **Do** tilt photographed láminas slightly and keep printed slots straight.
- **Do** honor reduced motion as an instant state change.

### Don't:
- **Don't** fill empty láminas with stock, generic, or AI imagery. An empty slot is the truthful state.
- **Don't** enlarge an empty slot to lead size.
- **Don't** mix two page fields inside one album page, or paint the header its own band.
- **Don't** encode verification, photo, or album state with color alone. Use the punched, printed, and folded marks plus screen-reader text.
- **Don't** use hard or offset block shadows. Depth is soft paper shadow only.
- **Don't** set running text in Bricolage, or titles in Atkinson.
- **Don't** shrink láminas below legibility on narrow screens. Drop columns instead.
- **Don't** put small uppercase tracked kicker labels above headings. Uppercase tracking is reserved for definition-list terms.
