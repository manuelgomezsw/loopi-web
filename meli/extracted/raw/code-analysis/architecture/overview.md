# Resumen de Arquitectura — loopi-web

> Aplicación Angular 20 standalone para gestión de inventario en cafetería (productos e insumos), con consumo de una API REST externa y deploy en Firebase Hosting.

## Stack Tecnológico

| Capa | Tecnología | Versión | Evidencia |
|---|---|---|---|
| Framework | Angular standalone | ^20.1.0 | `package.json:14-21` |
| Lenguaje | TypeScript | ~5.8.2 | `package.json:36` |
| Reactividad | RxJS | ~7.8.0 | `package.json:24` + Signals nativos de Angular |
| Estilos | Tailwind CSS v4 | ^4.1.18 | `package.json:23,35`, `.postcssrc.json` |
| UI Primitives | Angular CDK (DragDrop) | ^20.2.14 | `package.json:14`, `category-list.component.ts:4` |
| PWA | @angular/service-worker | ^20.1.0 | `package.json:21`, `app.config.ts:22-25` |
| Tests | Karma + Jasmine | 6.4 / 5.8 | `package.json:31-34` (no hay archivos `.spec.ts` en `src/app/` ❓) |
| Hosting | Firebase Hosting (estático) | n/a | `firebase.json` |
| API backend | REST en Google App Engine | n/a | `environment.prod.ts:3` → `loopi-dot-quotes-api-100.ue.r.appspot.com/api` |

> ❗ Nota: aunque el repo se denomina "Firebase web app", **NO** se usan SDKs de Firebase Auth/Firestore/Storage. Toda la persistencia se hace contra una API REST externa con autenticación por Bearer token en `localStorage`.

## Bootstrap de la aplicación

- Punto de entrada: `src/main.ts:5` → `bootstrapApplication(App, appConfig)`.
- Componente raíz: `src/app/app.ts:10` (`<router-outlet />` puro, standalone, sin layout global).
- Configuración global: `src/app/app.config.ts:14-27` provee:
  - `provideBrowserGlobalErrorListeners()` (línea 16)
  - `provideZoneChangeDetection({ eventCoalescing: true })` (línea 17)
  - `provideRouter(routes)` (línea 18)
  - `provideHttpClient(withInterceptors([authInterceptor]))` (líneas 19-21)
  - `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:30000' })` (líneas 22-25)

## Estructura de carpetas

```
src/
├── main.ts                             # bootstrap
├── index.html
├── styles.scss
├── environments/
│   ├── environment.ts                  # apiUrl=http://localhost:8080/api
│   └── environment.prod.ts             # apiUrl=https://loopi-dot-quotes-api-100.ue.r.appspot.com/api
└── app/
    ├── app.ts                          # root component (router-outlet)
    ├── app.config.ts                   # providers globales
    ├── app.routes.ts                   # rutas principales
    ├── core/
    │   ├── guards/auth.guard.ts        # authGuard, publicGuard, adminGuard, employeeGuard
    │   ├── interceptors/auth.interceptor.ts  # añade Bearer + maneja 401
    │   ├── models/
    │   │   ├── employee.model.ts       # Employee, LoginRequest, LoginResponse
    │   │   ├── inventory.model.ts      # Inventory, InventoryItem, etc.
    │   │   ├── admin.model.ts          # Modelos del módulo admin
    │   │   └── index.ts                # re-exporta employee + inventory
    │   └── services/
    │       ├── storage.service.ts      # wrapper de localStorage
    │       ├── auth.service.ts         # login/logout/getProfile + Signals
    │       ├── inventory.service.ts    # flujo de inventario (estado con Signals)
    │       ├── admin.service.ts        # CRUD admin
    │       └── index.ts                # re-exporta storage/auth/inventory (NO admin)
    └── features/
        ├── auth/login/                 # login.component.ts + .html
        ├── shared/role-redirect.component.ts
        ├── inventory/                  # flujo del empleado (tomar inventario)
        │   ├── home/
        │   ├── schedule-select/
        │   ├── item-entry/
        │   ├── discrepancy-review/
        │   ├── sales-entry/
        │   ├── summary/
        │   └── confirmation/
        └── admin/                      # backoffice
            ├── admin.routes.ts
            ├── layout/admin-layout.component.ts
            ├── dashboard/dashboard.component.ts
            ├── inventories/{inventory-list,inventory-detail}.component.ts
            ├── items/item-list.component.ts
            ├── employees/employee-list.component.ts
            ├── categories/category-list.component.ts
            └── suppliers/supplier-list.component.ts
```

## Routing

### Rutas principales (`src/app/app.routes.ts`)

| Path | Guards | Componente | Modo |
|---|---|---|---|
| `/login` | `publicGuard` | `LoginComponent` | lazy |
| `/admin/**` | `authGuard`, `adminGuard` | `adminRoutes` (loadChildren) | lazy children |
| `/inventory` | `authGuard` | `HomeComponent` | lazy |
| `/inventory/schedule` | `authGuard` | `ScheduleSelectComponent` | lazy |
| `/inventory/:id/item` | `authGuard` | `ItemEntryComponent` | lazy |
| `/inventory/:id/review` | `authGuard` | `DiscrepancyReviewComponent` | lazy |
| `/inventory/:id/sales` | `authGuard` | `SalesEntryComponent` | lazy |
| `/inventory/:id/summary` | `authGuard` | `SummaryComponent` | lazy |
| `/inventory/:id/confirmation` | `authGuard` | `ConfirmationComponent` | lazy |
| `''` | `authGuard` | `RoleRedirectComponent` | lazy |
| `**` | — | redirect a `''` | — |

### Rutas admin (`src/app/features/admin/admin.routes.ts`)

Todas hijas de `AdminLayoutComponent` (sidebar + header):
- `''` redirige a `dashboard` (pathMatch `full`)
- `dashboard` → `DashboardComponent`
- `inventories` → `InventoryListComponent`
- `inventories/:inventoryID` → `InventoryDetailComponent`
- `items` → `ItemListComponent`
- `employees` → `EmployeeListComponent`
- `categories` → `CategoryListComponent`
- `suppliers` → `SupplierListComponent`

## Service Worker / PWA

- Definido en `ngsw-config.json`:
  - **assetGroup `app`** (prefetch): `/favicon.ico`, `/index.csr.html`, `/index.html`, `/manifest.webmanifest`, `/*.css`, `/*.js`.
  - **assetGroup `assets`** (lazy + updateMode prefetch): imágenes (`svg/cur/jpg/jpeg/png/apng/webp/avif/gif`), fuentes (`otf/ttf/woff/woff2`).
  - No hay `dataGroups` definidos (sin caching de respuestas API).
- Habilitado solo en producción: `app.config.ts:23` (`enabled: !isDevMode()`).
- Archivo `manifest.webmanifest` referenciado pero ❓ no inspeccionado en este barrido (está en `public/` probablemente).

## Firebase

- Proyecto: `loopi-c048d` (`.firebaserc:3`).
- Hosting: solo `dist/loopi-web/browser` (`firebase.json:3`).
- SPA rewrite global a `/index.html` (`firebase.json:9-14`).
- Cache headers: `max-age=31536000` para JS/CSS y para imágenes (`firebase.json:17-33`).
- **NO** se usa Firebase Functions, Auth, Firestore, Storage ni Realtime DB.

## Interceptors HTTP

Único interceptor: `authInterceptor` en `src/app/core/interceptors/auth.interceptor.ts`:
- Línea 14: lee `localStorage['token']`.
- Líneas 15-21: si existe, clona la request agregando `Authorization: Bearer <token>`.
- Líneas 23-33: en errores `401`, salvo que la URL contenga `/auth/login`, limpia storage y navega a `/login`.

## Guards

`src/app/core/guards/auth.guard.ts`:
- `authGuard` (línea 6): exige token en storage; si no, redirige a `/login`.
- `publicGuard` (línea 18): bloquea login si ya hay sesión; redirige según rol (`/admin` o `/inventory`).
- `adminGuard` (línea 36): exige rol `admin`; si no, redirige a `/inventory`.
- `employeeGuard` (línea 49): actualmente devuelve `true` siempre. ⚠️ Posible TODO/inacabado.

## Variables de entorno

| Clave | dev (`environment.ts`) | prod (`environment.prod.ts`) |
|---|---|---|
| `production` | `false` | `true` |
| `apiUrl` | `http://localhost:8080/api` | `https://loopi-dot-quotes-api-100.ue.r.appspot.com/api` |

Reemplazo via `angular.json:50-55` (`fileReplacements` solo en configuración `production`).

## Build

- Builder: `@angular/build:application` (Vite-based, no Webpack) — `angular.json:18`.
- Polyfill único: `zone.js` (`angular.json:21-23`).
- Estilos: SCSS, `src/styles.scss` (`angular.json:32-34`).
- Budgets: initial 500 kB warning / 1 MB error, anyComponentStyle 4 kB / 8 kB (`angular.json:38-49`).
- `outputHashing: all` y `serviceWorker: ngsw-config.json` solo en producción.

## Hallazgos / TODOs

- ❓ No se encontraron archivos `.spec.ts` en `src/app/` pese a que `karma` está configurado.
- ⚠️ `employeeGuard` (auth.guard.ts:49) devuelve siempre `true` — parece código no terminado.
- ⚠️ `services/index.ts` re-exporta `storage/auth/inventory` pero **no** `admin.service` (importes de admin van por path completo).
- ❓ `manifest.webmanifest` y assets en `public/` no se leyeron en este barrido.
