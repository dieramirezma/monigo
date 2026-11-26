# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 in a pnpm + Turborepo monorepo (user-specified). Hosting, database and storage were delegated with evaluation: Cloudflare Workers via OpenNext, Cloudflare D1 (SQLite) with Drizzle ORM, Cloudflare R2 for media. No separate backend service; Next.js Server Actions and Route Handlers cover admin, uploads and reviews. Initial domain: `monigo.dieramirezma.dev` (a dedicated domain may come later). Free tiers only at launch.

## Users

- **Domestic tourist** (mainly from Bogotá and Tunja, 3–4 h by road) planning a weekend or long-weekend getaway who does not know what Moniquirá offers. Usually on a phone, often with weak rural signal.
- **Foreign tourist** passing through Villa de Leyva / Boyacá looking for a nearby day trip or two-day escape.
- **Moniquireños** who want to show their town.
- **Local businesses** (bocadillo factories, restaurants, lodging, guides) that want to be found.
- **Editor/admin** (the author, a local; possibly a municipal collaborator later) who maintains places, routes, photos and moderation.

## Product Purpose

MoniGo lets a visitor discover Moniquirá's tourist sites through photographs, locate them on an interactive map, follow ready-made routes, and keep a personal plan ("Mi álbum"). Success: a first-time visitor understands within seconds what there is to do in Moniquirá, finds where each place is, and leaves with a route or a saved plan.

## Positioning

The visual guide to Moniquirá made by someone from the town: places verified on the ground, every photo credited, and every site numbered like a collectible sticker (lámina) in an album the visitor fills by visiting. Aggregator listings and press articles cannot copy local field verification or the collecting mechanism.

## Operating Context

- Bilingual: Spanish (primary) and English, with localized routes (`/es/lugares`, `/en/places`).
- Visitors use it before the trip (planning on desktop or phone) and during it (phone, outdoors, sunlight, 3G/4G or no signal near waterfalls).
- "Cómo llegar" hands off to Google Maps directions via URL; MoniGo does not do turn-by-turn navigation.
- The town's identity is "Ciudad Dulce de Colombia": guava bocadillo, panela, mute; festivals such as the Ferias y Fiestas del Dulce y el Bocadillo (December) and the Festival del Mararay (San Pedro long weekend).
- Climate: ~1,669 m altitude, mean ~19 °C; January driest, May wettest (IDEAM via Wikipedia).

## Capabilities and Constraints

- MVP: interactive map (MapLibre, custom style) of places by category; place pages with photo galleries and credits; curated routes with stops, line geometry, GPX download; "Mi álbum" favorites/itinerary (local-first); business listings with contact/WhatsApp; ES/EN; own admin panel (CRUD for places, routes, media, businesses).
- Later phase: visitor accounts (Google OAuth), reviews with ratings, user photos, moderation queue.
- Content states: draft → review → published. Places record `verified_at`; unverified facts (hours, prices, phones, coordinates, swimming safety) are never published as fact.
- Cloudflare Workers free plan: 10 ms CPU per request, so public pages are prerendered (SSG/ISR); login is OAuth-only (no password hashing).
- Images are only used with a license or written permission. Google Maps user photos are excluded. Municipal/SITUR photos need written authorization first.
- Undecided: whether the repo is public; exact names/locations for several sites (see Evidence on Hand).

## Brand Commitments

- Name: **MoniGo** (existing project name, owned by the user).
- Visual world chosen by the user: **"Álbum de láminas"**: places as numbered collectible stickers with white borders, album pages as color fields. Pinned direction; it wins over any generated alternative.
- Must feel organic and locally made, never generic AI-template or stock tourism.

## Evidence on Hand

- Web research (Nov 2026): Semana (2024, 2026), Pulzo (2025), Viaja por Colombia, Wikipedia, GCatholic (Basílica, minor basilica decree 2010, Cra 4 No. 18). Official SITUR Boyacá portfolio PDF "Moniquirá, naturalmente dulce" exists but blocks automated download; to be saved manually in `docs/sources/`.
- Candidate places (most need field verification): Cascada Real (~25 m), Salto de Pómeca, Salto de los Micos, Salto de Las Golondrinas, Cascada El Cajón, Cascada La Chorrera, Salto del Zorro, Salto del Diablo, Cascada La Playa, Cascada La Romana, Quebrada La Sicha, Río Suárez, Termales El Salitre, Mirador Alto del Granadillo, La Cumbre, PNR Serranía del Peligro, Basílica Menor de Nuestra Señora del Rosario, Parque Simón Bolívar, El Obelisco, Puente de Minas, Cueva de Pueblo Viejo, cueva con momias, Centro Vacacional Comfaboy.
- **Absent, must not be fabricated:** coordinates, opening hours, entry prices (except one source's "free entry" for a natural waterfall park), business names/phones, festival dates for the current year, licensed photographs. No testimonials, visitor counts, or partnerships exist.

## Product Principles

1. **The photo leads.** Every place is introduced by its image; text supports it. A missing photo is shown honestly as an unfilled lámina, never replaced with a generic stock image.
2. **Field truth.** Unverified data is not published as fact; every photo carries its author, source and license.
3. **Works on weak signal.** Prerendered pages, responsive images, lightweight map, offline-friendly where possible.
4. **Made from the town.** Local voice, local place names, credit to whoever took each photo.

## Accessibility & Inclusion

WCAG 2.2 AA. Respect `prefers-reduced-motion`. High contrast for outdoor/sunlight use. Readable for all ages (tourists include families and older visitors). Full keyboard and screen-reader support for the map's place list (the map always has a non-visual list alternative).
