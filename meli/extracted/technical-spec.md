# Especificación Técnica — loopi-web

**Generado**: 2026-04-30
**Modo**: Reverse-engineering FULL
**Idioma**: Español (términos técnicos en inglés)
**Confianza global**: 🔸 CODE_ONLY (fuente única: código TypeScript / HTML / JSON de configuración)

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión | Evidencia |
|---|---|---|---|
| Framework UI | Angular standalone | ^20.1.0 | `package.json:14-21` |
| Lenguaje | TypeScript | ~5.8.2 | `package.json:36` |
| Reactividad | Angular Signals + RxJS | nativa / ~7.8.0 | `package.json:24` |
| Estilos | Tailwind CSS v4 + PostCSS | ^4.1.18 | `package.json:23,35`, `.postcssrc.json` |
| UI Primitives | Angular CDK (solo DragDrop) | ^20.2.14 | `package.json:14`, `category-list.component.ts:4` |
| PWA | Angular Service Worker | ^20.1.0 | `package.json:21`, `app.config.ts:22-25` |
| Tests (configurado) | Karma + Jasmine | 6.4 / 5.8 | `package.json:31-34` |
| Hosting | Firebase Hosting (estático) | n/a | `firebase.json`, `.firebaserc:3` |
| Builder | @angular/build (Vite-based) | ^20.1.5 | `angular.json:18` |
| Backend (externo) | REST API en Google App Engine | n/a | `environment.prod.ts:3` |

> ❗ Firebase se usa **solo como hosting estático** (`dist/loopi-web/browser`). No se usan Firebase Auth, Firestore, Storage, Functions ni Realtime DB.

---

## 2. Arquitectura general

```
Browser
  │
  ├── Angular SPA (Firebase Hosting CDN)
  │     ├── app.config.ts  ← providers globales
  │     ├── app.routes.ts  ← lazy routing con functional guards
  │     ├── authInterceptor ← añade Bearer token a cada request
  │     │
  │     ├── core/
  │     │   ├── StorageService   (wrapper localStorage)
  │     │   ├── AuthService      (estado sesión: Signals)
  │     │   ├── InventoryService (estado flujo empleado: Signals)
  │     │   └── AdminService     (stateless CRUD)
  │     │
  │     ├── features/auth/        (login)
  │     ├── features/inventory/   (flujo 7 pantallas)
  │     └── features/admin/       (backoffice, 7 vistas)
  │
  └── API REST loopi (Google App Engine)
        └── https://loopi-dot-quotes-api-100.ue.r.appspot.com/api
```

### Principios de diseño implementados

| Principio | Implementación |
|---|---|
| Standalone components | No hay `*.module.ts`. Todo usa `standalone: true`. |
| Lazy loading exhaustivo | Todas las rutas usan `loadComponent` o `loadChildren`. |
| Separation of concerns | Servicios con HTTP; componentes con UI + Signals locales. |
| Functional API | Guards (`CanActivateFn`), interceptor (`HttpInterceptorFn`), `inject()`. |
| Signals-first state | `signal()` + `computed()` para estado reactivo; RxJS solo para HTTP y debounce. |

---

## 3. Bootstrap de la aplicación

### Punto de entrada — `src/main.ts`

```
bootstrapApplication(App, appConfig)
```

### Providers globales — `src/app/app.config.ts:14-27`

| Provider | Línea | Propósito |
|---|---|---|
| `provideBrowserGlobalErrorListeners()` | 16 | Captura errores globales del navegador |
| `provideZoneChangeDetection({ eventCoalescing: true })` | 17 | Optimiza detección de cambios (Zone.js) |
| `provideRouter(routes)` | 18 | Router con las rutas definidas en `app.routes.ts` |
| `provideHttpClient(withInterceptors([authInterceptor]))` | 19-21 | HTTP con interceptor de autenticación |
| `provideServiceWorker(...)` | 22-25 | PWA (solo en producción; `registerWhenStable:30000`) |

### Componente raíz — `src/app/app.ts:10`

`<router-outlet />` puro. Sin layout global.

---

## 4. Routing

### Rutas principales (`src/app/app.routes.ts`)

| Path | Guards | Carga | Componente |
|---|---|---|---|
| `/login` | `publicGuard` | `loadComponent` | `LoginComponent` |
| `/admin/**` | `authGuard`, `adminGuard` | `loadChildren` | `adminRoutes` |
| `/inventory` | `authGuard` | `loadComponent` | `HomeComponent` |
| `/inventory/schedule` | `authGuard` | `loadComponent` | `ScheduleSelectComponent` |
| `/inventory/:id/item` | `authGuard` | `loadComponent` | `ItemEntryComponent` |
| `/inventory/:id/review` | `authGuard` | `loadComponent` | `DiscrepancyReviewComponent` |
| `/inventory/:id/sales` | `authGuard` | `loadComponent` | `SalesEntryComponent` |
| `/inventory/:id/summary` | `authGuard` | `loadComponent` | `SummaryComponent` |
| `/inventory/:id/confirmation` | `authGuard` | `loadComponent` | `ConfirmationComponent` |
| `''` | `authGuard` | `loadComponent` | `RoleRedirectComponent` |
| `**` | — | redirect a `''` | — |

### Rutas admin (`src/app/features/admin/admin.routes.ts`)

Todas hijas de `AdminLayoutComponent` (sidebar colapsable + header):

| Sub-path | Componente |
|---|---|
| `` (→ `dashboard`) | `DashboardComponent` |
| `dashboard` | `DashboardComponent` |
| `inventories` | `InventoryListComponent` |
| `inventories/:inventoryID` | `InventoryDetailComponent` |
| `items` | `ItemListComponent` |
| `employees` | `EmployeeListComponent` |
| `categories` | `CategoryListComponent` |
| `suppliers` | `SupplierListComponent` |

---

## 5. Seguridad

### Guards funcionales (`src/app/core/guards/auth.guard.ts`)

| Guard | Tipo | Lógica | Línea |
|---|---|---|---|
| `authGuard` | `CanActivateFn` | Exige token en storage; si no → redirige a `/login` | 6-16 |
| `publicGuard` | `CanActivateFn` | Bloquea `/login` si hay sesión; redirige a `/admin` o `/inventory` | 18-34 |
| `adminGuard` | `CanActivateFn` | Exige `role === 'admin'`; si no → redirige a `/inventory` | 36-47 |
| `employeeGuard` | `CanActivateFn` | ⚠️ Devuelve `true` siempre. No se aplica en ninguna ruta. | 49-51 |

### Interceptor HTTP (`src/app/core/interceptors/auth.interceptor.ts`)

```typescript
// Patrón (HttpInterceptorFn):
1. Lee localStorage['token']
2. Si existe → clona request y añade:
   Authorization: Bearer <token>
3. En error 401 (excepto /auth/login):
   - storage.clear()
   - router.navigate(['/login'])
```

| Línea | Comportamiento |
|---|---|
| 14 | Lee token de `localStorage` |
| 15-21 | Inyecta header `Authorization: Bearer` |
| 23-33 | Maneja 401 → logout + redirect |

### Almacenamiento de sesión

- **Token**: clave `'token'` en `localStorage`.
- **Empleado**: clave `'employee'` como JSON en `localStorage`.
- **Servicio**: `StorageService` encapsula todas las operaciones (`storage.service.ts`).

> ⚠️ No se usa `sessionStorage`. El token persiste entre pestañas y reinicios del browser.

---

## 6. Servicios — contratos técnicos

### `StorageService` (`src/app/core/services/storage.service.ts`)

Wrapper de `localStorage`. Síncrono, sin dependencias.

| Método | Firma |
|---|---|
| `setToken(token: string): void` | |
| `getToken(): string \| null` | |
| `removeToken(): void` | |
| `setEmployee(employee: any): void` | Serializa con `JSON.stringify` |
| `getEmployee(): any \| null` | Deserializa con `JSON.parse` |
| `removeEmployee(): void` | |
| `clear(): void` | Llama `removeToken` + `removeEmployee` |
| `isLoggedIn(): boolean` | `!!getToken()` |

### `AuthService` (`src/app/core/services/auth.service.ts`)

Estado de sesión vía Signals. `@Injectable({ providedIn: 'root' })`.

**Signals públicos (readonly)**:

| Signal | Tipo | Derivación |
|---|---|---|
| `employee` | `Signal<Employee \| null>` | `currentEmployee` (privado) |
| `isLoggedIn` | `Signal<boolean>` | `!!currentEmployee()` |
| `isAdmin` | `Signal<boolean>` | `currentEmployee()?.role === 'admin'` |
| `employeeName` | `Signal<string>` | `currentEmployee()?.name ?? ''` |

**Métodos**:

| Método | Endpoint | Side-effects |
|---|---|---|
| `login(credentials: LoginRequest): Observable<LoginResponse>` | `POST {apiUrl}/auth/login` | `setToken`, `setEmployee`, `currentEmployee.set` |
| `logout(): void` | — | `storage.clear`, `currentEmployee.set(null)`, `router.navigate(['/login'])` |
| `getProfile(): Observable<Employee>` | `GET {apiUrl}/employees/me` | `setEmployee`, `currentEmployee.set` |

**Constructor** (línea 24-30): restaura `currentEmployee` desde `storage.getEmployee()`.

### `InventoryService` (`src/app/core/services/inventory.service.ts`)

Mantiene el **estado del flujo de toma de inventario** vía Signals privadas. `@Injectable({ providedIn: 'root' })`.

**Estado interno (Signals privadas)**:

| Signal | Descripción |
|---|---|
| `currentInventory: WritableSignal<Inventory \| null>` | Inventario activo |
| `currentItems: WritableSignal<InventoryItem[]>` | Lista de ítems de Phase 1 |
| `currentIndex: WritableSignal<number>` | Índice actual en Phase 1 |
| `requiresSalesFlag: WritableSignal<boolean>` | Si requiere Phase 2 |
| `requiresPurchasesOnlyFlag: WritableSignal<boolean>` | Solo compras en Phase 2 |
| `currentInventoryType: WritableSignal<InventoryType \| null>` | Tipo del inventario activo |
| `_discrepancyItems: WritableSignal<DiscrepancyItem[]>` | Ítems de Phase 2 |
| `_discrepancyIndex: WritableSignal<number>` | Índice actual en Phase 2 |

**Endpoints HTTP**:

| Método | Endpoint |
|---|---|
| `getSuggestedSchedule()` | `GET /inventories/suggested-schedule` |
| `getLatestInventory()` | `GET /inventories/latest` |
| `getInProgressInventories()` | `GET /inventories/in-progress` |
| `createInventory(req)` | `POST /inventories` |
| `getInventoryItems(id)` | `GET /inventories/{id}/items` |
| `saveDetail(id, detail)` | `POST /inventories/{id}/details` |
| `getDiscrepancies(id)` | `GET /inventories/{id}/discrepancies` |
| `saveSales(id, sales)` | `POST /inventories/{id}/sales` (fuerza `units_sold=0` si `requiresPurchasesOnly`) |
| `getSummary(id)` | `GET /inventories/{id}/summary` |
| `completeInventory(id)` | `POST /inventories/{id}/complete` (body `{}`) |

**Helpers de navegación (Phase 1)**:
`nextItem`, `previousItem`, `setCurrentIndex`, `getCurrentItem`, `isFirstItem`, `isLastItem`, `getProgress`.

**Helpers de navegación (Phase 2)**:
`nextDiscrepancyItem`, `previousDiscrepancyItem`, `setDiscrepancyIndex`, `getCurrentDiscrepancyItem`, `isFirstDiscrepancyItem`, `isLastDiscrepancyItem`, `getDiscrepancyProgress`, `hasDiscrepancies`.

**`reset()`** (líneas 248-257): restaura todas las Signals a su estado inicial. Se llama tras `completeInventory`.

### `AdminService` (`src/app/core/services/admin.service.ts`)

Stateless. `baseUrl = ${environment.apiUrl}/admin`. `@Injectable({ providedIn: 'root' })`.

**Todos los métodos retornan `Observable<T>`**:

#### Dashboard
| Método | Endpoint |
|---|---|
| `getDashboard(days: number = 3)` | `GET /admin/dashboard?days=N` |

#### Inventarios (admin)
| Método | Endpoint |
|---|---|
| `listInventories(filter: InventoryFilter)` | `GET /admin/inventories` (params: `page, page_size, date_from, date_to, inventory_type, employee_id, has_discrepancies`) |
| `getInventoryDetail(inventoryId)` | `GET /admin/inventories/{id}` |
| `updateInventoryDetail(inventoryId, detailId, data)` | `PUT /admin/inventories/{id}/details/{detailId}` |
| `getActiveInventoriesCount()` | `GET /admin/inventories/active-count` |
| `createInitialInventory(data)` | `POST /admin/inventories/initial` |

#### Unidades de medida
| Método | Endpoint |
|---|---|
| `listMeasurementUnits()` | `GET /admin/measurement-units` |

#### Items
| Método | Endpoint |
|---|---|
| `listItems(filter: ItemFilter)` | `GET /admin/items` (params: `page, page_size, type, frequency, active, search`) |
| `getItem(id)` | `GET /admin/items/{id}` |
| `createItem(data: CreateItemRequest)` | `POST /admin/items` |
| `updateItem(id, data: UpdateItemRequest)` | `PUT /admin/items/{id}` |
| `updateItemStatus(id, active)` | `PATCH /admin/items/{id}/status` |

#### Empleados
| Método | Endpoint |
|---|---|
| `listAllActiveEmployees()` | `GET /admin/employees/active` |
| `listEmployees(filter: EmployeeFilter)` | `GET /admin/employees` |
| `getEmployee(id)` | `GET /admin/employees/{id}` |
| `createEmployee(data: CreateEmployeeRequest)` | `POST /admin/employees` |
| `updateEmployee(id, data: UpdateEmployeeRequest)` | `PUT /admin/employees/{id}` |
| `updateEmployeeStatus(id, active)` | `PATCH /admin/employees/{id}/status` |
| `resetEmployeePassword(id)` | `POST /admin/employees/{id}/reset-password` (body `{}`) |

#### Categorías
| Método | Endpoint |
|---|---|
| `listCategories()` | `GET /admin/categories` |
| `getCategory(id)` | `GET /admin/categories/{id}` |
| `createCategory(data)` | `POST /admin/categories` |
| `updateCategory(id, data)` | `PUT /admin/categories/{id}` |
| `updateCategoryStatus(id, active)` | `PATCH /admin/categories/{id}/status` |
| `reorderCategories(data)` | `POST /admin/categories/reorder` |

#### Proveedores
| Método | Endpoint |
|---|---|
| `listSuppliers(filter: SupplierFilter)` | `GET /admin/suppliers` |
| `listAllActiveSuppliers()` | `GET /admin/suppliers/active` |
| `getSupplier(id)` | `GET /admin/suppliers/{id}` |
| `createSupplier(data)` | `POST /admin/suppliers` |
| `updateSupplier(id, data)` | `PUT /admin/suppliers/{id}` |
| `updateSupplierStatus(id, active)` | `PATCH /admin/suppliers/{id}/status` |

---

## 7. Modelos de datos (TypeScript — frontend)

> Los nombres en `snake_case` reflejan la serialización del backend.

### Tipos / enums globales

```typescript
InventoryType  = 'daily' | 'weekly' | 'monthly' | 'initial'
Schedule       = 'opening' | 'noon' | 'closing'
InventoryStatus = 'in_progress' | 'completed'
ItemType       = 'product' | 'supply'
InventoryFrequency = 'daily' | 'weekly' | 'monthly'
EmployeeRole   = 'employee' | 'admin'
// ⚠️ DocumentType no tiene tipo formal; solo opciones en markup: 'CC' | 'CE' | 'NUIP' | 'PP'
```

### `Employee` (vista sesión) — `employee.model.ts`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `username` | `string` | ✅ |
| `name` | `string` | ✅ |
| `last_name` | `string` | ✅ |
| `full_name` | `string` | ✅ |
| `role` | `'employee' \| 'admin'` | ✅ |

### `Employee` (vista CRUD admin) — `admin.model.ts:159-173` ⚠️ D-01

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `username` | `string` | ✅ |
| `name` | `string` | ✅ |
| `last_name` | `string` | ✅ |
| `document_type` | `string` | ❌ |
| `document_number` | `string` | ❌ |
| `phone` | `string` | ❌ |
| `email` | `string` | ❌ |
| `birth_date` | `string` | ❌ |
| `role` | `EmployeeRole` | ✅ |
| `active` | `boolean` | ✅ |
| `created_at` | `string` | ✅ |
| `updated_at` | `string` | ✅ |

> ⚠️ No incluye `full_name`. El componente la construye como `name + ' ' + last_name`.

### `Inventory` — `inventory.model.ts:5-14`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `inventory_date` | `string` (ISO date) | ✅ |
| `inventory_type` | `InventoryType` | ✅ |
| `schedule` | `Schedule` | ❌ |
| `status` | `InventoryStatus` | ✅ |
| `responsible_id` | `number` | ✅ |
| `started_at` | `string` | ✅ |
| `completed_at` | `string` | ❌ |

### `InventoryItem` — `inventory.model.ts:22-31`

| Campo | Tipo | Req |
|---|---|---|
| `item_id` | `number` | ✅ |
| `name` | `string` | ✅ |
| `category_name` | `string` | ❌ |
| `suggested_value` | `number` | ❌ |
| `real_value` | `number` | ❌ |
| `stock_received` | `number` | ❌ |
| `units_sold` | `number` | ❌ |
| `is_complete` | `boolean` | ✅ |

### `DiscrepancyItem` — `inventory.model.ts:61-69`

| Campo | Tipo | Req |
|---|---|---|
| `item_id` | `number` | ✅ |
| `name` | `string` | ✅ |
| `suggested_value` | `number` | ✅ |
| `real_value` | `number` | ✅ |
| `difference` | `number` | ✅ |
| `stock_received` | `number` | ❌ |
| `units_sold` | `number` | ❌ |

### `InventoryDetailItem` (admin) — `admin.model.ts:51-65`

| Campo | Tipo | Req | Nota |
|---|---|---|---|
| `detail_id` | `number` | ✅ | PK de la tabla `inventory_details` |
| `item_id` | `number` | ✅ | |
| `item_name` | `string` | ✅ | |
| `item_type` | `string` | ✅ | ⚠️ debería ser `ItemType` (D-03) |
| `suggested_value` | `number \| null` | ✅ | |
| `real_value` | `number \| null` | ✅ | |
| `stock_received` | `number \| null` | ✅ | |
| `units_sold` | `number \| null` | ✅ | |
| `shrinkage` | `number \| null` | ✅ | Mermas |
| `expected_value` | `number` | ✅ | `suggested − shrinkage + stock_received − units_sold` |
| `difference` | `number` | ✅ | |
| `has_discrepancy` | `boolean` | ✅ | |

### `Item` — `admin.model.ts:100-115`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `type` | `ItemType` | ✅ |
| `name` | `string` | ✅ |
| `active` | `boolean` | ✅ |
| `inventory_frequency` | `InventoryFrequency` | ✅ |
| `category_id` | `number` | ✅ |
| `supplier_id` | `number` | ❌ |
| `cost` | `number` | ✅ |
| `measurement_unit_id` | `number` | ✅ |
| `created_at` | `string` | ✅ |
| `updated_at` | `string` | ✅ |
| `category` | `{ id, name }` | ❌ (eager-load) |
| `supplier` | `{ id, business_name }` | ❌ |
| `measurement_unit` | `MeasurementUnit` | ❌ |

### `Category` — `admin.model.ts:218-226`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `name` | `string` | ✅ |
| `display_order` | `number` | ✅ |
| `active` | `boolean` | ✅ |
| `item_count` | `number` | ✅ |
| `created_at` | `string` | ✅ |
| `updated_at` | `string` | ✅ |

### `Supplier` — `admin.model.ts:252-263`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `business_name` | `string` | ✅ |
| `tax_id` | `string` | ✅ |
| `contact_name` | `string` | ✅ |
| `contact_phone` | `string` | ✅ |
| `contact_email` | `string` | ✅ |
| `active` | `boolean` | ✅ |
| `item_count` | `number` | ✅ |
| `created_at` | `string` | ✅ |
| `updated_at` | `string` | ✅ |

### `MeasurementUnit` — `admin.model.ts:94-98`

| Campo | Tipo | Req |
|---|---|---|
| `id` | `number` | ✅ |
| `code` | `string` | ✅ |
| `name` | `string` | ✅ |

### Relaciones lógicas (inferidas desde frontend)

```
Employee ──1──*── Inventory        (Inventory.responsible_id)
Inventory ──1──*── InventoryDetail (InventoryDetailItem.item_id + detail_id)
Item ──*──── InventoryDetail       (item_id)
Category ──1──*── Item             (Item.category_id)
Supplier ──0..1──*── Item          (Item.supplier_id, opcional)
MeasurementUnit ──1──*── Item      (Item.measurement_unit_id)
```

---

## 8. API REST consumida

**Base URL producción**: `https://loopi-dot-quotes-api-100.ue.r.appspot.com/api`
**Base URL dev**: `http://localhost:8080/api`

> ⚠️ Los contratos (request/response bodies) se infieren del frontend. No hay OpenAPI para validación cruzada.

### Auth

| Método | Ruta | Request | Response |
|---|---|---|---|
| POST | `/auth/login` | `{ username, password }` | `{ token: string, employee: Employee }` |
| GET | `/employees/me` | — | `Employee` |

### Inventory (empleado)

| Método | Ruta | Request | Response |
|---|---|---|---|
| GET | `/inventories/suggested-schedule` | — | `SuggestedSchedule` |
| GET | `/inventories/latest` | — | `{ inventory: Inventory \| null }` |
| GET | `/inventories/in-progress` | — | `{ inventories: InProgressInventory[], count: number }` |
| POST | `/inventories` | `{ inventory_type, schedule?, date }` | `Inventory` |
| GET | `/inventories/{id}/items` | — | `InventoryItemsResponse` |
| POST | `/inventories/{id}/details` | `{ item_id, real_value }` | `{ saved: boolean, suggested_value?: number }` |
| GET | `/inventories/{id}/discrepancies` | — | `DiscrepanciesResponse` |
| POST | `/inventories/{id}/sales` | `{ item_id, stock_received?, units_sold? }` | `{ saved: boolean, suggested_value?: number }` |
| GET | `/inventories/{id}/summary` | — | `InventorySummary` |
| POST | `/inventories/{id}/complete` | `{}` | `{ completed: boolean, issues_created: number }` |

### Admin — Dashboard

| Método | Ruta | Query params | Response |
|---|---|---|---|
| GET | `/admin/dashboard` | `days` | `{ stats: DashboardStats }` |

### Admin — Inventarios

| Método | Ruta | Params / Body | Response |
|---|---|---|---|
| GET | `/admin/inventories` | `page, page_size, date_from, date_to, inventory_type, employee_id, has_discrepancies` | `InventoryListResult` |
| GET | `/admin/inventories/{id}` | — | `InventoryDetailView` |
| PUT | `/admin/inventories/{id}/details/{detailId}` | `UpdateDetailRequest` (todos opcionales) | `void` |
| GET | `/admin/inventories/active-count` | — | `{ count: number }` |
| POST | `/admin/inventories/initial` | `{ responsible_id }` | `{ inventory: Inventory }` |

### Admin — Catálogos

| Método | Ruta | Response |
|---|---|---|
| GET | `/admin/measurement-units` | `MeasurementUnit[]` |
| GET | `/admin/items` | `ItemListResult` |
| POST | `/admin/items` | `Item` |
| PUT | `/admin/items/{id}` | `Item` |
| PATCH | `/admin/items/{id}/status` | `void` |
| GET | `/admin/categories` | `CategoryListResult` |
| POST | `/admin/categories` | `Category` |
| PUT | `/admin/categories/{id}` | `Category` |
| PATCH | `/admin/categories/{id}/status` | `void` |
| POST | `/admin/categories/reorder` | `void` |
| GET | `/admin/suppliers` | `SupplierListResult` |
| GET | `/admin/suppliers/active` | `{ suppliers: Supplier[], total: number }` |
| POST | `/admin/suppliers` | `Supplier` |
| PUT | `/admin/suppliers/{id}` | `Supplier` |
| PATCH | `/admin/suppliers/{id}/status` | `void` |

### Admin — Empleados

| Método | Ruta | Response |
|---|---|---|
| GET | `/admin/employees` | `EmployeeListResult` |
| GET | `/admin/employees/active` | `{ employees: Employee[], total: number }` |
| POST | `/admin/employees` | `Employee` |
| PUT | `/admin/employees/{id}` | `Employee` |
| PATCH | `/admin/employees/{id}/status` | `void` |
| POST | `/admin/employees/{id}/reset-password` | `void` |

---

## 9. Componentes principales

### Flujo de inventario (empleado)

| Componente | Ruta | Fuente | Estado (Signals) |
|---|---|---|---|
| `HomeComponent` | `/inventory` | `inventory/home/` | `latestInventory`, `inProgressInventories`, `loading` |
| `ScheduleSelectComponent` | `/inventory/schedule` | `inventory/schedule-select/` | `suggestedSchedule`, `selectedType`, `selectedSchedule`, `loading`, `creating`, `error` |
| `ItemEntryComponent` | `/inventory/:id/item` | `inventory/item-entry/` | `inventoryId`, `loading`, `saving`, `error`, `realValue` + computeds del servicio |
| `DiscrepancyReviewComponent` | `/inventory/:id/review` | `inventory/discrepancy-review/` | `inventoryId`, `loading`, `completing`, `error`, `discrepancies`, `hasDiscrepancies`, `requiresSales`, `isInitialInventory` |
| `SalesEntryComponent` | `/inventory/:id/sales` | `inventory/sales-entry/` | `inventoryId`, `loading`, `saving`, `error`, `stockReceived`, `unitsSold` + computeds |
| `SummaryComponent` | `/inventory/:id/summary` | `inventory/summary/` | `inventoryId`, `summary`, `loading`, `completing`, `error` |
| `ConfirmationComponent` | `/inventory/:id/confirmation` | `inventory/confirmation/` | `issuesCreated` (desde `Router state`) |

### Backoffice admin

| Componente | Ruta | Fuente | Complejidad |
|---|---|---|---|
| `AdminLayoutComponent` | layout padre `/admin/**` | `admin/layout/` | sidebar colapsable, `routerLinkActive` a 6 rutas |
| `DashboardComponent` | `/admin/dashboard` | `admin/dashboard/` | 4 KPIs + modal crear inventario inicial |
| `InventoryListComponent` | `/admin/inventories` | `admin/inventories/` | filtros fecha (Subject + debounce), paginación, query params |
| `InventoryDetailComponent` | `/admin/inventories/:id` | `admin/inventories/` | edición inline (5 campos), toggle discrepancias |
| `ItemListComponent` | `/admin/items` | `admin/items/` | `forkJoin` de 4 recursos, modal doble, flag `add_to_active_inventories` |
| `EmployeeListComponent` | `/admin/employees` | `admin/employees/` | dos modales (crear/editar + reset password) |
| `CategoryListComponent` | `/admin/categories` | `admin/categories/` | CDK DragDrop, reorder optimista |
| `SupplierListComponent` | `/admin/suppliers` | `admin/suppliers/` | búsqueda + filtro activo |

---

## 10. PWA y despliegue

### Service Worker (`ngsw-config.json`)

| Asset group | Modo | Recursos |
|---|---|---|
| `app` | prefetch | `favicon.ico`, `index.html`, `*.css`, `*.js`, `manifest.webmanifest` |
| `assets` | lazy (updateMode: prefetch) | Imágenes (`svg/jpg/png/webp/avif/gif`), fuentes (`otf/ttf/woff/woff2`) |

> ❌ Sin `dataGroups` → **las respuestas de la API no se cachean**. La app requiere conexión activa para funcionar.

**Habilitado**: solo en producción (`!isDevMode()`).
**Registro**: `registerWhenStable:30000` — se registra cuando la app está idle por 30 s.

### Firebase Hosting (`firebase.json`)

| Config | Valor |
|---|---|
| `public` | `dist/loopi-web/browser` |
| Rewrite SPA | `/**` → `/index.html` |
| Cache JS/CSS | `max-age=31536000` (1 año) |
| Cache imágenes | `max-age=31536000` |

**Proyecto Firebase**: `loopi-c048d` (`.firebaserc:3`).

### Ambientes

| Variable | `environment.ts` (dev) | `environment.prod.ts` (prod) |
|---|---|---|
| `production` | `false` | `true` |
| `apiUrl` | `http://localhost:8080/api` | `https://loopi-dot-quotes-api-100.ue.r.appspot.com/api` |

Reemplazo configurado en `angular.json:50-55` (`fileReplacements`, build `production`).

### Build

| Config | Valor |
|---|---|
| Builder | `@angular/build:application` (Vite-based) |
| Polyfill | `zone.js` |
| Estilos globales | `src/styles.scss` |
| Budget initial | 500 kB warning / 1 MB error |
| Budget componentStyle | 4 kB warning / 8 kB error |
| outputHashing | `all` (solo producción) |

---

## 11. Deuda técnica y hallazgos

| ID | Severidad | Descripción | Archivo(s) |
|---|---|---|---|
| D-01 | 🔴 CRÍTICO | Dos interfaces `Employee` incompatibles | `employee.model.ts` vs `admin.model.ts:159` |
| D-02 | 🟡 MEDIO | `employeeGuard` devuelve siempre `true` y no se usa en rutas | `auth.guard.ts:49` |
| D-03 | 🟡 MEDIO | `InventoryDetailItem.item_type: string` en lugar de `ItemType` | `admin.model.ts:54` |
| D-04 | 🟡 MEDIO | Literal `InventoryType` duplicado en `InventoryListItem` | `admin.model.ts:21` |
| D-05 | 🟡 MEDIO | `services/index.ts` no re-exporta `AdminService` | `core/services/index.ts` |
| D-06 | 🟡 MEDIO | `expected_value: number` mientras sus inputs pueden ser `null` | `admin.model.ts:60` |
| D-07 | 🟡 MEDIO | Debounce de búsqueda inconsistente (RxJS vs `setTimeout`) | 4 componentes |
| D-08 | 🟡 MEDIO | `document_type` solo como literal en markup; sin tipo formal | `employee-list.component.ts:259` |
| D-09 | 🔵 INFO | Sin `dataGroups` en Service Worker (sin caché de API) | `ngsw-config.json` |
| D-10 | 🔵 INFO | Sin tests `.spec.ts`; Karma+Jasmine configurados pero sin uso | `package.json:31-34` |
| D-11 | 🔵 INFO | `StorageService.setEmployee/getEmployee` usan `any` | `storage.service.ts:23-30` |
| D-12 | 🔵 INFO | Ruta `''` → `RoleRedirectComponent` → login si no autenticado; redirección doble (`authGuard` + `RoleRedirect`) | `app.routes.ts:55-59` |
