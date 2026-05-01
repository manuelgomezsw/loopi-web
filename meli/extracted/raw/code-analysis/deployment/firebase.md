# Despliegue — Firebase Hosting

## Proyecto

- `.firebaserc:1-5` define un único alias:
  ```json
  { "projects": { "default": "loopi-c048d" } }
  ```
- Sin proyectos `staging/prod` separados — solo `default`.

## `firebase.json`

| Sección | Valor | Notas |
|---|---|---|
| `hosting.public` | `dist/loopi-web/browser` | Output del builder `@angular/build:application` |
| `hosting.ignore` | `["firebase.json", "**/.*", "**/node_modules/**"]` | Estándar |
| `hosting.rewrites` | `{ source: "**", destination: "/index.html" }` | SPA routing |
| `hosting.headers[0]` | `**/*.@(js\|css)` → `Cache-Control: max-age=31536000` | 1 año |
| `hosting.headers[1]` | `**/*.@(jpg\|jpeg\|gif\|png\|svg\|webp\|ico)` → `max-age=31536000` | 1 año |

> Solo Hosting está configurado. **No** hay sección `firestore`, `functions`, `storage` ni `database`.

## Service Worker (`ngsw-config.json`)

Schema: `@angular/service-worker/config/schema.json`. Index: `/index.html`.

### `assetGroup` "app" (prefetch)
Recursos cargados al instalar el SW:
- `/favicon.ico`
- `/index.csr.html`
- `/index.html`
- `/manifest.webmanifest`
- `/*.css`
- `/*.js`

### `assetGroup` "assets" (lazy + updateMode prefetch)
- Imágenes: `svg/cur/jpg/jpeg/png/apng/webp/avif/gif`
- Fuentes: `otf/ttf/woff/woff2`

### Sin `dataGroups`
**Las llamadas HTTP a la API NO se cachean en el SW.** Toda data es siempre fresh.

## Activación del Service Worker

`src/app/app.config.ts:22-25`:
```ts
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000'
})
```
- Solo activo cuando `!isDevMode()` (en builds de producción).
- Espera a que la app esté estable o 30 s antes de registrarse.

## Diferencias por entorno

| Variable | dev | prod |
|---|---|---|
| `production` | `false` | `true` |
| `apiUrl` | `http://localhost:8080/api` | `https://loopi-dot-quotes-api-100.ue.r.appspot.com/api` |

`fileReplacements` (`angular.json:50-55`) intercambia `environment.ts` por `environment.prod.ts` solo en config `production`.

## Configuración del builder (`angular.json`)

- Builder: `@angular/build:application` (Vite).
- Polyfills: `zone.js` únicamente.
- Output hashing: `all` (busting de cache vs headers `max-age=31536000`).
- Service worker: solo en producción.
- Budgets:
  - `initial`: warning 500 kB, error 1 MB
  - `anyComponentStyle`: warning 4 kB, error 8 kB

## Flujo típico de deploy (inferido)

1. `npm run build` → genera `dist/loopi-web/browser/` con SW + manifest + bundles hasheados.
2. `firebase deploy --only hosting` → publica al proyecto `loopi-c048d`.
3. CDN de Firebase sirve con cache largo + SW del cliente toma control para offline parcial.

## Hallazgos

- ⚠️ La API en producción está en **App Engine** (`loopi-dot-quotes-api-100.ue.r.appspot.com`), no en Firebase Functions. La parte web (loopi) y la API (`quotes-api-100`) parecen vivir en proyectos GCP/App Engine separados, conectados por CORS.
- ⚠️ Sin `dataGroups`: si la API cae, la app cargada offline no tiene fallback de datos.
- ❓ No se observó configuración de CSP, security headers ni preview channels.
