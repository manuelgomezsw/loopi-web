# Especificación Funcional — loopi-web

**Generado**: 2026-04-30
**Modo**: Reverse-engineering FULL
**Idioma**: Español
**Confianza global**: 🔸 CODE_ONLY (única fuente: código TypeScript / HTML)

---

## 1. Visión general

`loopi-web` es una aplicación SPA (Single Page Application) para la **gestión de inventarios de una cafetería**. Cubre dos perfiles de usuario: el **empleado** que ejecuta la toma física del inventario y el **administrador** que configura el catálogo y revisa los resultados.

La aplicación es 100% frontend Angular y consume una API REST externa para toda la persistencia.

### Propuesta de valor

| Necesidad | Cómo la cubre la app |
|---|---|
| Tomar inventario de manera asistida y reproducible | Flujo guiado de 7 pantallas con conteo, justificación de diferencias y resumen |
| Detectar y justificar diferencias (mermas / ventas / compras) | Phase 2 del flujo + edición admin con columna **Mermas** y **Esperado** editables |
| Mantener el catálogo de productos, insumos, categorías, proveedores y empleados | Backoffice CRUD con paginación, filtros y reordenamiento drag-and-drop |
| Acceso seguro por rol | Login + 4 guards funcionales + interceptor con Bearer token |

---

## 2. Actores 🔸

| Actor | Tipo | Autenticación | Cómo interactúa |
|---|---|---|---|
| **Empleado** | Humano interno | Usuario + contraseña → Bearer token (`localStorage`) | Toma de inventario asistida (UC-03 a UC-09) |
| **Administrador** | Humano interno | Usuario + contraseña → Bearer token con rol `admin` | Backoffice completo (UC-10 a UC-17) |
| **API REST loopi (backend)** | Sistema externo | El frontend envía `Authorization: Bearer <token>` | Persistencia y reglas de negocio (~30 endpoints) |
| **Service Worker (Angular SW)** | Sistema | n/a | Caché de assets estáticos (sin caché de API) |

> ⚠️ El backend no se inspecciona en esta extracción — su contrato se infiere a partir de las llamadas del frontend.

---

## 3. Contexto del sistema 🔸

### Dependencias de salida (lo que la app llama)

| Dependencia | Tipo | Propósito |
|---|---|---|
| API REST loopi | Servicio HTTP externo | Toda la persistencia y lógica de negocio |
| Firebase Hosting | Servicio de hosting | Sirve los assets estáticos (`dist/loopi-web/browser`) |

### Clientes de entrada (quién llama a la app)

| Cliente | Tipo | Interacción |
|---|---|---|
| Navegadores de empleados | Externo | Cargan la SPA y operan vía UI |
| Navegadores de administradores | Externo | Acceden al backoffice `/admin` |

> ❌ La app **no** usa Firebase Auth, Firestore, Storage, Functions ni Realtime DB.

---

## 4. Casos de uso

> Cada caso conserva su identificador del análisis exhaustivo (`raw/code-analysis/architecture/use-cases.md`).

### UC-01 — Iniciar sesión ✅✅

- **Actor**: Empleado o Admin.
- **Precondición**: Sin sesión activa (`publicGuard`).
- **Trigger**: Usuario navega a `/` o `/login`.
- **Flujo principal**:
  1. El usuario ingresa `username` y `password`.
  2. La app envía `POST /auth/login` con las credenciales.
  3. El backend responde con `{ token, employee }`.
  4. La app persiste el token y el empleado en `localStorage`.
  5. Según `employee.role`, la app redirige a `/admin` o `/inventory`.
- **Reglas de negocio**:
  - 401 → mensaje "Usuario o contraseña incorrectos".
  - Cualquier otro error → "Error al iniciar sesión".
- **Postcondición**: Sesión activa con Bearer token.

### UC-02 — Redirección por rol ✅✅

- **Actor**: Cualquier usuario autenticado.
- **Trigger**: Navegación a `''`.
- **Flujo**: `RoleRedirectComponent` lee `auth.isAdmin()` y navega a `/admin` o `/inventory`.

### UC-03 — Continuar inventario en curso ✅✅

- **Actor**: Empleado.
- **Trigger**: Llega a `/inventory`.
- **Flujo principal**:
  1. La app pide en paralelo `getLatestInventory` + `getInProgressInventories`.
  2. Si hay inventarios en progreso, los lista con tarjetas "Continuar".
  3. Click "Continuar" → `/inventory/{id}/item`.
- **Regla**: si `inProgress.count === 0`, no se muestra la tarjeta.

### UC-04 — Iniciar nuevo inventario ✅✅

- **Actor**: Empleado.
- **Trigger**: Botón "Nuevo inventario" en `HomeComponent`.
- **Flujo principal**:
  1. Navega a `/inventory/schedule`.
  2. La app sugiere tipo (`daily | weekly | monthly`) y `schedule` (`opening | noon | closing`, solo si `daily`) vía `getSuggestedSchedule()`.
  3. El empleado puede aceptar la sugerencia o cambiar tipo / horario.
  4. La app envía `POST /inventories` con `{ inventory_type, schedule?, date }`.
  5. Redirige a `/inventory/{id}/item`.
- **Reglas de negocio**:
  - **409** → "Ya existe un inventario de este tipo para hoy" (impide duplicados por tipo y día).
  - `schedule` solo aplica para inventarios `daily`.
  - El tipo `initial` **no** se crea desde este flujo (lo crea el admin desde el dashboard, UC-11).

### UC-05 — Tomar inventario · Phase 1 (conteo físico) ✅✅

- **Actor**: Empleado.
- **Trigger**: Llega a `/inventory/:id/item`.
- **Flujo principal**:
  1. La app carga `getInventoryItems(id)` que devuelve `items, requires_sales, requires_purchases_only, inventory_type`.
  2. La app posiciona el cursor en el primer ítem con `is_complete = false`.
  3. Por cada ítem:
     - El empleado teclea `real_value` (cantidad real contada).
     - Pulsa "Guardar y siguiente" → `POST /inventories/{id}/details`.
     - El ítem se marca `is_complete = true` localmente.
  4. Cuando es el último ítem → navega a `/inventory/:id/review`.
- **Reglas de negocio**:
  - El input expone botones "+" y "−" para incrementar/decrementar enteros.
  - El usuario puede retroceder con "Anterior" sin perder valores.

### UC-06 — Revisar discrepancias ✅✅

- **Actor**: Empleado.
- **Trigger**: Llega a `/inventory/:id/review`.
- **Flujo principal**:
  1. La app pide `getDiscrepancies(id)`.
  2. La app decide qué fase mostrar:
     - **Inventario `initial`** → no se calculan discrepancias; va directo a "Finalizar".
     - **Todos los `suggested_value === 0`** (primer inventario sin baseline) → no se calculan discrepancias.
     - **Hay discrepancias y `requires_sales`** → permite "Justificar con ventas/compras" (`/sales`).
     - **Sin discrepancias o sin `requires_sales`** → permite "Finalizar" (`/summary`).
- **Acciones disponibles**:
  - "Volver a items" → vuelve a `/item` para ajustar conteos.
  - "Justificar con ventas/compras" → `/sales` (UC-07).
  - "Finalizar" → `/summary` (UC-08).

### UC-07 — Justificar diferencias · Phase 2 (ventas y compras) ✅✅

- **Actor**: Empleado.
- **Trigger**: Llega a `/inventory/:id/sales`.
- **Flujo principal**:
  1. Por cada ítem con discrepancia, el empleado captura `stock_received` (compras) y `units_sold` (ventas).
  2. La app muestra dos cómputos auxiliares:
     - `expectedAdjustment = suggested − real` (lo que sobra/falta).
     - `adjustmentBalance = units_sold − stock_received − expectedAdjustment` (cuánta merma queda sin explicar).
  3. La app envía `POST /inventories/{id}/sales`.
  4. En el último ítem → `/summary`.
- **Reglas de negocio**:
  - Si `requires_purchases_only` está activo, el frontend **fuerza** `units_sold = 0` antes de enviar.
  - Si la lista de discrepancias está vacía al entrar, se solicita primero `getDiscrepancies`.

### UC-08 — Resumen y completar ✅✅

- **Actor**: Empleado.
- **Trigger**: `/inventory/:id/summary`.
- **Flujo principal**:
  1. La app pide `getSummary(id)` → devuelve `can_complete` y `missing_items`.
  2. Si `can_complete`, el botón "Completar" llama `POST /inventories/{id}/complete`.
  3. El backend responde con `{ completed, issues_created }`.
  4. La app resetea el estado del flujo (`inventory.service.reset()`) y navega a `/inventory/:id/confirmation` con `state: { issuesCreated }`.
- **Regla**: si `can_complete === false`, el botón se inhabilita y se listan los `missing_items`.

### UC-09 — Confirmación post-cierre ✅✅

- **Actor**: Empleado.
- **Trigger**: `/inventory/:id/confirmation`.
- **Flujo**: La pantalla muestra "✓ Inventario completado" y, si `issuesCreated > 0`, anuncia "Se crearon N issues". Único botón: "Volver al inicio" → `/`.

---

### UC-10 — Acceder al backoffice ✅✅

- **Actor**: Admin.
- **Trigger**: Navega a `/admin` (cualquier subruta).
- **Flujo**: `authGuard` + `adminGuard` validan token y rol. Si todo está OK, `AdminLayoutComponent` (sidebar + header) renderiza el `<router-outlet />`. Si no es admin, redirige a `/inventory`.

### UC-11 — Dashboard administrativo ✅✅

- **Actor**: Admin.
- **Flujo principal**:
  1. La app pide `getDashboard(3)` → 4 KPIs: `today_inventories`, `with_discrepancies`, `without_discrepancies`, `pending_inventories`.
  2. La app pide `listInventories({ inventory_type: 'initial', page_size: 1 })` para detectar la existencia de un inventario inicial.
  3. Si **no** existe inventario inicial, la pantalla muestra un banner ámbar con un botón "Crear inventario inicial".
  4. El modal:
     - Carga `listAllActiveEmployees` para el selector de responsable.
     - Llama `POST /admin/inventories/initial` con `{ responsible_id }`.
     - Recarga el dashboard tras crear.

### UC-12 — Listar inventarios ✅✅

- **Actor**: Admin.
- **Flujo**: `/admin/inventories` muestra una tabla paginada con filtros: rango de fecha (debounce 300 ms), tipo de inventario, con/sin discrepancias.
- **Estados de fila**:
  - "Completado" (verde, con punto naranja si `items_with_diff > 0`).
  - "En progreso" (amarillo).
- **Acciones**: click en la fila → detalle (UC-13).
- **Filtros iniciales**: se leen desde `route.queryParams` (permite enlaces directos).

### UC-13 — Detallar y editar un inventario ✅✅

- **Actor**: Admin.
- **Flujo principal**:
  1. `/admin/inventories/:inventoryID` carga `getInventoryDetail`.
  2. La tabla muestra columnas: **Item**, **Tipo**, **Esperado** (editable), **Contado**, **Compras**, **Ventas**, **Mermas** (editable), **Diferencia**, **Acciones**.
  3. Toggle "Solo discrepancias" filtra la tabla.
  4. Botón lápiz por fila → modo edición inline con cinco campos opcionales (`suggested_value`, `real_value`, `stock_received`, `units_sold`, `shrinkage`).
  5. "Guardar" → `PUT /admin/inventories/{id}/details/{detailId}`. La app recarga el detalle tras guardar.
- **Regla de negocio**: `expected_value = suggested − shrinkage + stock_received − units_sold` (computado por backend).

### UC-14 — CRUD de items (productos e insumos) ✅✅

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/items` muestra tabla con búsqueda + filtros por tipo (`product | supply`), frecuencia (`daily | weekly | monthly`) y estado (activo/inactivo).
  2. Modal de crear/editar con campos: `name`, `type`, `inventory_frequency`, `category_id`, `measurement_unit_id`, `supplier_id?`, `cost`.
  3. **Si hay inventarios en curso al crear** → checkbox "Agregar a inventarios en curso" envía `add_to_active_inventories: true`.
  4. En edición se añade el switch `active`.
  5. Toggle inline en la fila → `PATCH /admin/items/{id}/status` con rollback optimista.

### UC-15 — CRUD de categorías + reordenamiento ✅✅

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/categories` lista las categorías con `display_order`.
  2. Drag handles (Angular CDK) permiten reordenar; al soltar, la app envía `POST /admin/categories/reorder` con `{ orders: [{id, display_order}] }`.
  3. Modal crear (`name`) y editar (`name + active`).
  4. Toggle inline → `PATCH /admin/categories/{id}/status`.

### UC-16 — CRUD de empleados + reset de contraseña ✅✅

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/employees` muestra tabla paginada con filtros (rol, activo, búsqueda).
  2. Modal crear: `username, name, last_name, password, role, document_type?, document_number?, phone?, email?, birth_date?`.
  3. Modal editar: como crear, sin `password` y con `active`.
  4. Acción "Reset" → modal de confirmación → `POST /admin/employees/{id}/reset-password`.
- **Regla informativa**: tras reset, la nueva contraseña sigue la convención **"Documento + Año de nacimiento"** (mensaje explícito en el modal).
- **Tipos de documento soportados**: `CC`, `CE`, `NUIP`, `PP` (codificados en el `<select>`, no como enum tipado).

### UC-17 — CRUD de proveedores ✅✅

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/suppliers` lista proveedores con búsqueda y filtro activo/inactivo.
  2. Modal con: `business_name`, `tax_id`, `contact_name`, `contact_phone`, `contact_email`.
  3. Toggle inline activa/desactiva.

---

## 5. Reglas de negocio transversales

| ID | Regla | Origen (evidencia) |
|---|---|---|
| BR-01 | El token Bearer caduca: cualquier 401 (excepto en `/auth/login`) limpia el storage y vuelve a `/login`. | `auth.interceptor.ts:25-30` ✅✅ |
| BR-02 | Solo un inventario por tipo y día (409 al duplicar). | `schedule-select.component.ts` (manejo de error) ✅✅ |
| BR-03 | El tipo `initial` se crea exclusivamente desde el dashboard admin. | `dashboard.component.ts` + `admin.service.createInitialInventory` ✅✅ |
| BR-04 | `requires_purchases_only`: el flujo Phase 2 no captura `units_sold`. | `inventory.service.ts:118-121` ✅✅ |
| BR-05 | `expected_value = suggested − shrinkage + stock_received − units_sold` (computado por backend; 5 campos opcionales). | `admin.model.ts:60-62` 🔸 |
| BR-06 | Reset de contraseña genera "Documento + Año de nacimiento". | `employee-list.component.ts:360-361` ✅✅ |
| BR-07 | Inventario `initial` y "todos los suggested 0" omiten Phase 2. | `discrepancy-review.component.ts:33-62` ✅✅ |
| BR-08 | Las categorías mantienen un `display_order` editable por drag-and-drop. | `category-list.component.ts:43-58` ✅✅ |
| BR-09 | Al crear un ítem con inventarios en curso, el admin decide si incluirlo (`add_to_active_inventories`). | `item-list.component.ts` + `admin.model.ts:142` ✅✅ |
| BR-10 | Sin `dataGroups` en service worker → la API nunca se sirve desde caché. | `ngsw-config.json` 🔸 |

---

## 6. Estados del inventario

```
                ┌─────────────────┐
   create ──►   │   in_progress    │   ──► complete (POST /complete) ──►  ┌──────────────┐
                └─────────────────┘                                       │  completed   │
                       │                                                  └──────────────┘
                       └── (admin edita detalles, no cambia estado)
```

- **`in_progress`**: estado inicial.
- **`completed`**: terminal; backend marca `completed_at`. El admin sigue pudiendo editar `details` (UC-13).

Tipos: `daily`, `weekly`, `monthly`, `initial`. Schedules (solo `daily`): `opening`, `noon`, `closing`.

---

## 7. Datos clave (vista funcional)

| Entidad | Qué representa | Campos relevantes para el negocio |
|---|---|---|
| Inventory | Una toma física | `inventory_type`, `schedule?`, `status`, `responsible_id`, `started_at`, `completed_at?`, `total_items`, `items_with_diff` |
| InventoryDetail | Una línea de inventario por item | `suggested_value`, `real_value`, `stock_received`, `units_sold`, `shrinkage`, `expected_value`, `difference` |
| Item | Producto o insumo | `type`, `name`, `inventory_frequency`, `cost`, `measurement_unit_id`, `category_id`, `supplier_id?`, `active` |
| Category | Agrupación de items | `name`, `display_order`, `active`, `item_count` |
| Supplier | Proveedor | `business_name`, `tax_id`, datos de contacto, `active`, `item_count` |
| MeasurementUnit | Unidad (gr, ml, ud…) | `code`, `name` |
| Employee (sesión) | Identidad logueada | `id`, `username`, `name`, `last_name`, `full_name`, `role` |
| Employee (CRUD) | Empleado en backoffice | extiende sesión + `document_type?`, `document_number?`, `phone?`, `email?`, `birth_date?`, `active` ⚠️ ver D-01 |

---

## 8. Permisos por rol

| Capacidad | `employee` | `admin` |
|---|---|---|
| Iniciar sesión | ✅ | ✅ |
| Tomar inventario (UC-03..UC-09) | ✅ | ✅ (no bloqueado) |
| Acceder a `/admin/**` | ❌ (redirect a `/inventory`) | ✅ |
| Crear inventario `initial` | ❌ | ✅ |
| Editar líneas de un inventario | ❌ | ✅ |
| CRUD de items, categorías, proveedores, empleados | ❌ | ✅ |
| Reset de contraseña de empleados | ❌ | ✅ |

> ⚠️ `employeeGuard` (`auth.guard.ts:49`) está implementado pero **no se aplica en ninguna ruta** y devuelve `true` siempre. Ver discrepancia D-02.

---

## 9. Trazabilidad código ↔ caso de uso

| Caso de uso | Componente principal | Servicio(s) | Endpoints |
|---|---|---|---|
| UC-01 | `LoginComponent` | `AuthService` | `POST /auth/login` |
| UC-02 | `RoleRedirectComponent` | `AuthService` | — |
| UC-03 | `HomeComponent` | `InventoryService` | `GET /inventories/latest`, `GET /inventories/in-progress` |
| UC-04 | `ScheduleSelectComponent` | `InventoryService` | `GET /inventories/suggested-schedule`, `POST /inventories` |
| UC-05 | `ItemEntryComponent` | `InventoryService` | `GET /inventories/{id}/items`, `POST /inventories/{id}/details` |
| UC-06 | `DiscrepancyReviewComponent` | `InventoryService` | `GET /inventories/{id}/discrepancies` |
| UC-07 | `SalesEntryComponent` | `InventoryService` | `POST /inventories/{id}/sales` |
| UC-08 | `SummaryComponent` | `InventoryService` | `GET /inventories/{id}/summary`, `POST /inventories/{id}/complete` |
| UC-09 | `ConfirmationComponent` | — | — |
| UC-10 | `AdminLayoutComponent` | `AuthService` | — |
| UC-11 | `DashboardComponent` | `AdminService` | `GET /admin/dashboard`, `GET /admin/inventories`, `GET /admin/employees/active`, `POST /admin/inventories/initial` |
| UC-12 | `InventoryListComponent` | `AdminService` | `GET /admin/inventories` |
| UC-13 | `InventoryDetailComponent` | `AdminService` | `GET /admin/inventories/{id}`, `PUT /admin/inventories/{id}/details/{detailId}` |
| UC-14 | `ItemListComponent` | `AdminService` | `GET/POST/PUT /admin/items`, `PATCH /admin/items/{id}/status`, `GET /admin/categories`, `GET /admin/suppliers/active`, `GET /admin/measurement-units`, `GET /admin/inventories/active-count` |
| UC-15 | `CategoryListComponent` | `AdminService` | `GET/POST/PUT /admin/categories`, `PATCH .../status`, `POST .../reorder` |
| UC-16 | `EmployeeListComponent` | `AdminService` | `GET/POST/PUT /admin/employees`, `PATCH .../status`, `POST .../reset-password` |
| UC-17 | `SupplierListComponent` | `AdminService` | `GET/POST/PUT /admin/suppliers`, `PATCH .../status` |

---

## 10. Hallazgos funcionales

1. ⚠️ El flujo Phase 2 deduce las mermas de forma indirecta: la app calcula `adjustmentBalance` pero no lo persiste como campo separado; las mermas finales solo aparecen en la edición admin (UC-13).
2. ⚠️ `requires_sales` y `requires_purchases_only` provienen del backend al cargar los items; el frontend no decide la regla.
3. ⚠️ La pantalla de confirmación lee `issuesCreated` desde el `state` del Router; si el usuario refresca la página, la cuenta se pierde.
4. ⚠️ No hay flujo explícito de cancelación / abandono de un inventario en progreso desde la UI del empleado.

> **Confianza**: Todas las reglas y casos de uso provienen de **código** (🔸 CODE_ONLY). El backend no fue inspeccionado y no existe OpenAPI; cualquier discrepancia con el contrato real debe validarse antes de evolucionar la API.
