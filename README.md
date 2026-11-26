# MoniGo

Guía visual de Moniquirá, Boyacá: cada lugar es una lámina de un álbum que se colecciona. Mapa interactivo, rutas armadas, "Mi álbum" como itinerario. Español e inglés.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind v4 · pnpm + Turborepo · Cloudflare Workers (OpenNext) · D1 + Drizzle · R2 · MapLibre + OpenFreeMap.

```
apps/web          Sitio Next.js (público; /admin en Fase 3)
packages/content  Dataset bilingüe validado con Zod (lugares, rutas, fiestas, fotos con licencia, contorno OSM)
packages/db       Esquema Drizzle para D1, migraciones y seed generado desde content
packages/ui       Tokens de diseño "Álbum de láminas"
packages/config   tsconfig compartido
docs/             Infraestructura, contenido pendiente y permiso de fotos
```

```bash
pnpm install
pnpm dev                          # sitio en http://localhost:3000
pnpm --filter @monigo/content test
```

- Despliegue y free tier: [docs/infra.md](docs/infra.md)
- Qué falta verificar en campo y qué fotos tomar: [docs/contenido-pendiente.md](docs/contenido-pendiente.md)
- Producto: [PRODUCT.md](PRODUCT.md) · Diseño: [DESIGN.md](DESIGN.md)

Datos de lugares: prensa regional, SITUR Boyacá y © colaboradores de OpenStreetMap (ODbL). Fotos: Wikimedia Commons, con autor y licencia en cada una.
