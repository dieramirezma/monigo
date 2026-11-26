# Infraestructura y despliegue (capa gratuita)

Todo corre en Cloudflare, en la zona `dieramirezma.dev`, con costo **USD 0** al inicio.

| Pieza | Servicio | Free tier | Estado |
|---|---|---|---|
| Sitio Next.js 16 | Workers + OpenNext (`@opennextjs/cloudflare`) | 100k req/día · 10 ms CPU/req | Configurado (`apps/web/wrangler.jsonc`) |
| Base de datos | D1 `monigo-db` + Drizzle | 5 GB · 5M lecturas/día · 100k escrituras/día | Esquema y migración `0000_init.sql` listos |
| Fotos | Assets estáticos del Worker (MVP) → R2 `monigo-media` (Fase 3) | R2: 10 GB · egress gratis | MVP sirve `public/media` |
| Transformación de imágenes | Image Transformations (`/cdn-cgi/image`) | 5.000 únicas/mes | Loader listo, se activa con `NEXT_PUBLIC_IMAGE_TRANSFORMS=1` |
| Mapa | MapLibre GL + OpenFreeMap | Sin llave ni límites | Funcionando |
| CI/CD | GitHub Actions | 2.000 min/mes (privado) | `ci.yml` y `deploy.yml` |

## Por qué así

- **Sin backend separado.** Las páginas públicas se prerenderizan en el build; el admin (Fase 3) usará Server Actions y Route Handlers en el mismo Worker con los bindings `DB` y `MEDIA`. Si llega una app móvil se agrega `apps/api` (Hono) reutilizando `packages/db`.
- **Relacional (D1/SQLite).** Paradas ordenadas, traducciones por idioma, reseñas por usuario y lugar, estados de moderación.
- **Fotos en assets estáticos para el MVP.** Son pocas (6 fotos con licencia, ~5 MB). R2 entra cuando el admin permita subir fotos.
- **10 ms de CPU.** Todo lo público es estático/PPR; el mapa y "Mi álbum" corren en el navegador. Si el admin o la autenticación chocan con el límite, Workers Paid cuesta USD 5/mes sin cambios de código.

## Pasos (una sola vez)

> OpenNext no tiene soporte completo en Windows: el despliegue corre en GitHub Actions (Linux). Para probar `preview` en local, usa WSL.

1. **Login y recursos**
   ```bash
   cd apps/web
   pnpm exec wrangler login
   pnpm exec wrangler d1 create monigo-db        # copia el database_id a wrangler.jsonc
   pnpm exec wrangler r2 bucket create monigo-media
   ```
2. **Migraciones y datos**
   ```bash
   pnpm exec wrangler d1 migrations apply monigo-db --remote
   pnpm --filter @monigo/db seed:sql
   pnpm exec wrangler d1 execute monigo-db --remote --file ../../packages/db/seed.local.sql
   ```
3. **Dominio.** `wrangler.jsonc` ya declara `monigo.dieramirezma.dev` como *custom domain*; en el primer deploy Cloudflare crea el DNS y el certificado.
4. **R2 (cuando entre el admin).** R2 → `monigo-media` → Settings → Custom domain: **`monigo-media.dieramirezma.dev`**.
   - No uses `media.monigo.dieramirezma.dev`: es un subdominio de segundo nivel y el certificado universal gratuito no lo cubre.
   - CORS: permitir `PUT` desde `https://monigo.dieramirezma.dev` y `http://localhost:3100`.
5. **Image Transformations.** Images → Transformations → activar en la zona, con orígenes permitidos `monigo.dieramirezma.dev` y `monigo-media.dieramirezma.dev`. Luego definir `NEXT_PUBLIC_IMAGE_TRANSFORMS=1` en `vars`.
6. **GitHub.** Secretos del repo: `CLOUDFLARE_API_TOKEN` (permisos: Workers Scripts:Edit, D1:Edit, Workers Routes:Edit, Zone DNS:Edit en la zona) y `CLOUDFLARE_ACCOUNT_ID`. Cada push a `main` aplica migraciones y despliega.
7. **Analítica.** Cloudflare Web Analytics → agregar el sitio (sin cookies).

## Secretos de fases siguientes

| Secreto | Fase | Uso |
|---|---|---|
| `BETTER_AUTH_SECRET` | 3 | Sesiones del admin |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | 3 | Login con Google (redirect `https://monigo.dieramirezma.dev/api/auth/callback/google`) |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | 3 | URLs prefirmadas de subida (token con alcance al bucket) |
| `TURNSTILE_SECRET` | 5 | Reseñas y fotos de usuarios |

Se cargan con `pnpm exec wrangler secret put <NOMBRE>`.

## Dominio dedicado a futuro

Agrega la nueva zona en Cloudflare, añade su *custom domain* en `wrangler.jsonc`, cambia `NEXT_PUBLIC_SITE_URL` y crea una Redirect Rule 301 desde `monigo.dieramirezma.dev`. Las URLs canónicas, el sitemap y los `hreflang` salen de esa sola variable.

## Desarrollo local

```bash
pnpm install
pnpm dev                       # http://localhost:3000 (copia fotos y worker de MapLibre a public/)
pnpm db:migrate:local          # D1 local (Miniflare)
pnpm db:seed:local
pnpm --filter @monigo/content test
```
