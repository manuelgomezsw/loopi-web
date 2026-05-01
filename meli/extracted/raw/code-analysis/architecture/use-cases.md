# Casos de Uso

> Derivados de rutas, componentes y servicios. Cada caso lista actor, gatillo, flujo principal y archivos involucrados.

---

## UC-01 — Iniciar sesión

- **Actor**: Empleado o Admin.
- **Gatillo**: usuario navega a `/` o `/login` sin sesión.
- **Flujo principal**:
  1. `publicGuard` permite acceso si no hay token (`auth.guard.ts:18-34`).
  2. `LoginComponent` recoge usuario+contraseña.
  3. `AuthService.login` → `POST /auth/login`.
  4. Token y employee se guardan en `localStorage` y `currentEmployee` signal.
  5. Según `response.employee.role` → redirige a `/admin` o `/inventory` (`login.component.ts:37-41`).
- **Archivos**: `auth/login/login.component.{ts,html}`, `core/services/auth.service.ts`, `core/services/storage.service.ts`, `core/guards/auth.guard.ts`, `core/interceptors/auth.interceptor.ts`.

## UC-02 — Redirección por rol (landing)

- **Actor**: usuario autenticado.
- **Gatillo**: navega a `/`.
- **Flujo**: `RoleRedirectComponent.ngOnInit` (`shared/role-redirect.component.ts:18-24`) lee `auth.isAdmin()` y navega a `/admin` o `/inventory`.

## UC-03 — Continuar inventario en curso

- **Actor**: Empleado.
- **Gatillo**: en `/inventory`, `HomeComponent` muestra lista de "en progreso".
- **Flujo**:
  1. `HomeComponent.loadData()` hace `forkJoin(getLatestInventory, getInProgressInventories)` (`home.component.ts:30-44`).
  2. Si `inProgress.count > 0` se renderiza la tarjeta.
  3. Click en "Continuar" → `continueInventory(inv)` → `/inventory/{id}/item`.
- **Archivos**: `inventory/home/*`, `core/services/inventory.service.ts`.

## UC-04 — Iniciar nuevo inventario

- **Actor**: Empleado.
- **Gatillo**: botón "Nuevo inventario" en `HomeComponent`.
- **Flujo**:
  1. Navega a `/inventory/schedule`.
  2. `ScheduleSelectComponent` carga sugerencia con `getSuggestedSchedule()`.
  3. Empleado confirma/cambia tipo y horario y pulsa Continuar.
  4. `createInventory({ inventory_type, schedule?, date })` → 201.
  5. Manejo de 409: "Ya existe un inventario de este tipo para hoy".
  6. Redirige a `/inventory/{id}/item`.
- **Archivos**: `inventory/schedule-select/*`, `inventory.service.ts`.

## UC-05 — Tomar inventario (Phase 1: conteo físico)

- **Actor**: Empleado.
- **Gatillo**: ruta `/inventory/:id/item`.
- **Flujo**:
  1. `getInventoryItems(id)` carga `items, requires_sales, requires_purchases_only, inventory_type` (`inventory.service.ts:68-81`). Posiciona el índice en el primer ítem incompleto.
  2. Por cada ítem, empleado teclea `real_value` y pulsa "Guardar y siguiente".
  3. `saveDetail({ item_id, real_value })` → marca `is_complete = true` localmente.
  4. Cuando `isLast()` → navega a `/inventory/:id/review`.
- **Archivos**: `inventory/item-entry/*`.

## UC-06 — Revisar discrepancias

- **Actor**: Empleado.
- **Gatillo**: ruta `/inventory/:id/review`.
- **Flujo**:
  1. `getDiscrepancies(id)` (`inventory.service.ts:105-116`).
  2. Si `inventory_type === 'initial'` o todos los `suggested_value === 0` → no se muestran discrepancias y se permite finalizar (`discrepancy-review.component.ts:35-55`).
  3. Si hay discrepancias y `requires_sales` → botón "Justificar con ventas/compras" → `/sales`.
  4. Si no hay discrepancias o no requiere → "Finalizar" → `/summary`.
  5. "Volver a items" → `/item`.
- **Archivos**: `inventory/discrepancy-review/*`.

## UC-07 — Justificar diferencias (Phase 2: ventas/compras)

- **Actor**: Empleado.
- **Gatillo**: ruta `/inventory/:id/sales`.
- **Flujo**:
  1. Si la lista de discrepancias está vacía, se llama `getDiscrepancies` primero.
  2. Por cada ítem se ingresa `stock_received` y `units_sold`.
  3. `saveSales({ item_id, stock_received, units_sold })` (`inventory.service.ts:118-141`).
  4. **Caso `requires_purchases_only`**: el servicio fuerza `units_sold = 0` antes de enviar (línea 119-121).
  5. `expectedAdjustment` y `adjustmentBalance` (computeds en `sales-entry.component.ts:48-60`) ayudan al usuario a verificar que `units_sold − stock_received ≈ suggested − real`.
  6. En el último ítem → `/summary`.
- **Archivos**: `inventory/sales-entry/*`.

## UC-08 — Resumen y completar

- **Actor**: Empleado.
- **Gatillo**: ruta `/inventory/:id/summary`.
- **Flujo**:
  1. `getSummary(id)` → `InventorySummary` con `can_complete` y `missing_items`.
  2. Si `can_complete`, botón "Completar" → `completeInventory(id)` (`POST /inventories/{id}/complete`).
  3. Tras completar: `inventory.service.reset()` y navegación a `/confirmation` con `state: { issuesCreated }`.
- **Archivos**: `inventory/summary/*`, `inventory/confirmation/*`.

## UC-09 — Pantalla de confirmación

- **Actor**: Empleado.
- **Gatillo**: ruta `/inventory/:id/confirmation`.
- **Flujo**: muestra mensaje de éxito y `issuesCreated` (recuperado de `Router.getCurrentNavigation().extras.state` o `history.state`). Botón único: "Volver al inicio" → `/`.
- **Archivos**: `inventory/confirmation/*`.

---

## UC-10 — Acceder al backoffice (admin)

- **Actor**: Admin.
- **Gatillo**: navega a `/admin`.
- **Flujo**: `authGuard` + `adminGuard` validan; redirección a `/admin/dashboard` (configurada en `admin.routes.ts:9`). `AdminLayoutComponent` provee sidebar y outlet.
- **Archivos**: `core/guards/auth.guard.ts`, `features/admin/layout/admin-layout.component.ts`, `features/admin/admin.routes.ts`.

## UC-11 — Dashboard admin

- **Actor**: Admin.
- **Flujo**:
  1. `getDashboard(3)` → 4 KPIs.
  2. `listInventories({ inventory_type: 'initial', page_size: 1 })` para detectar si existe inventario inicial.
  3. Si no hay → banner ámbar + botón "Crear inventario inicial" abre modal.
  4. Modal: `listAllActiveEmployees` para selector → `createInitialInventory({ responsible_id })` → recarga.
- **Archivos**: `features/admin/dashboard/dashboard.component.ts`, `core/services/admin.service.ts`.

## UC-12 — Listar inventarios (admin)

- **Actor**: Admin.
- **Flujo**: `/admin/inventories` muestra tabla paginada con filtros: rango fechas (debounce 300 ms), tipo, con/sin discrepancias. Estado por fila: "Completado" (verde con punto naranja si `items_with_diff > 0`) o "En progreso" (amarillo). Click → detalle.
- **Archivos**: `features/admin/inventories/inventory-list.component.ts`.

## UC-13 — Detallar/editar inventario (mermas, ventas, compras, esperado)

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/inventories/:inventoryID` carga `getInventoryDetail`.
  2. Tabla con columnas Item, Tipo, **Esperado** (editable), Contado, Compras, Ventas, **Mermas** (editable), Diferencia, Acciones.
  3. Toggle "Solo discrepancias".
  4. Botón lápiz → modo edición inline → `updateInventoryDetail(inventoryId, detailId, payload)` con `suggested_value, real_value, stock_received, units_sold, shrinkage` (todos opcionales).
  5. Tras guardar, recarga el detalle.
- **Archivos**: `features/admin/inventories/inventory-detail.component.ts`.

## UC-14 — CRUD de items (admin)

- **Actor**: Admin.
- **Flujo**:
  1. `/admin/items`: tabla con búsqueda, filtros (tipo, frecuencia, activo).
  2. Modal con `name, type, inventory_frequency, category_id, measurement_unit_id, supplier_id?, cost`.
  3. Al crear, si hay inventarios activos: checkbox **"Agregar a inventarios en curso"** → manda `add_to_active_inventories: true`.
  4. Editar: además de los anteriores, switch `active`.
  5. Toggle de estado en la fila → `updateItemStatus(id, active)`.
- **Archivos**: `features/admin/items/item-list.component.ts`.

## UC-15 — CRUD de categorías + reordenar

- **Actor**: Admin.
- **Flujo**: `/admin/categories` lista con drag handles (Angular CDK). `cdkDropListDropped` → `reorderCategories({ orders: [{id, display_order}] })`. Modal crear/editar (campo `name` y, en edición, `active`). Switch toggle inline.
- **Archivos**: `features/admin/categories/category-list.component.ts`.

## UC-16 — CRUD de empleados + reset password

- **Actor**: Admin.
- **Flujo**: `/admin/employees` con filtros (rol, activo, búsqueda). Modal de creación pide `password`; en edición no se pide (existe acción de reset). Reset abre confirmación; al confirmar → `resetEmployeePassword(id)`. Mensaje informa que la nueva contraseña es "Documento + Año de nacimiento".
- **Archivos**: `features/admin/employees/employee-list.component.ts`.

## UC-17 — CRUD de proveedores

- **Actor**: Admin.
- **Flujo**: `/admin/suppliers`: tabla con `business_name, tax_id, contact_*`. Búsqueda con debounce, filtro activo/inactivo. Modal crear/editar; toggle inline.
- **Archivos**: `features/admin/suppliers/supplier-list.component.ts`.

---

## Mapa rápido ruta → caso de uso

| Ruta | Caso |
|---|---|
| `/login` | UC-01 |
| `/` | UC-02 |
| `/inventory` | UC-03 / UC-04 |
| `/inventory/schedule` | UC-04 |
| `/inventory/:id/item` | UC-05 |
| `/inventory/:id/review` | UC-06 |
| `/inventory/:id/sales` | UC-07 |
| `/inventory/:id/summary` | UC-08 |
| `/inventory/:id/confirmation` | UC-09 |
| `/admin` (layout) | UC-10 |
| `/admin/dashboard` | UC-11 |
| `/admin/inventories` | UC-12 |
| `/admin/inventories/:inventoryID` | UC-13 |
| `/admin/items` | UC-14 |
| `/admin/categories` | UC-15 |
| `/admin/employees` | UC-16 |
| `/admin/suppliers` | UC-17 |
