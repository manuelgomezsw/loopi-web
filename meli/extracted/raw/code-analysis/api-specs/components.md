# Componentes (`src/app/features/`)

Todos son standalone (`standalone: true`). Estado interno con `signal()`/`computed()`. Templates con la nueva sintaxis de control flow `@if/@for/@empty`.

---

## Auth

### `LoginComponent` — `auth/login/login.component.ts`
- **Propósito**: pantalla de inicio de sesión por usuario+contraseña.
- **Imports**: `CommonModule, FormsModule`. Template externo (`login.component.html`).
- **Signals**: `username`, `password`, `loading`, `error` (todos `string`/`boolean`).
- **Servicios**: `AuthService` (login), `Router`.
- **Ruta**: `/login` (con `publicGuard`) — `app.routes.ts:5-9`.
- **Acciones**: `onSubmit()` (línea 22) — valida campos, llama `authService.login`, redirige a `/admin` o `/inventory` según `response.employee.role`. Manejo: 401 → "Usuario o contraseña incorrectos"; otro → "Error al iniciar sesión".

---

## Shared

### `RoleRedirectComponent` — `shared/role-redirect.component.ts`
- **Propósito**: pantalla puente que redirige según rol (mostrando un spinner). Usada como landing en `''`.
- **Template inline** (líneas 8-12): spinner Tailwind.
- **Servicios**: `AuthService`, `Router`.
- **Ruta**: `''` (con `authGuard`) — `app.routes.ts:55-59`.
- **Acción** (`ngOnInit`, línea 18): si `auth.isAdmin()` → `/admin`, si no → `/inventory`.

---

## Inventory (flujo del empleado)

### `HomeComponent` — `inventory/home/home.component.ts`
- **Propósito**: dashboard del empleado: muestra inventario en curso (si existe) y permite iniciar uno nuevo o continuar.
- **Imports**: `CommonModule`. Template externo.
- **Signals**: `latestInventory`, `inProgressInventories`, `loading`. `employeeName` viene de `AuthService`.
- **Servicios**: `AuthService, InventoryService, Router`.
- **Ruta**: `/inventory` (`authGuard`).
- **Acciones**: `loadData()` (forkJoin de `getLatestInventory` + `getInProgressInventories`), `continueInventory(inv)` → `/inventory/{id}/item`, `startNewInventory()` → `/inventory/schedule`, `logout()`. Helpers de formateo i18n-ES.

### `ScheduleSelectComponent` — `inventory/schedule-select/schedule-select.component.ts`
- **Propósito**: pantalla previa que sugiere tipo (`daily/weekly/monthly`) y horario (solo para `daily`); permite override y crea el inventario.
- **Signals**: `suggestedSchedule, selectedType, selectedSchedule, loading, creating, error`.
- **Servicios**: `InventoryService, Router`.
- **Ruta**: `/inventory/schedule`.
- **Acciones**: `selectType, selectSchedule, isDaily, continue()` (POST `createInventory`, redirige a `/inventory/{id}/item`; maneja 409 = "Ya existe un inventario de este tipo para hoy"), `goBack`.

### `ItemEntryComponent` — `inventory/item-entry/item-entry.component.ts`
- **Propósito**: Phase 1 — captura `real_value` (conteo físico) ítem por ítem.
- **Imports**: `CommonModule, FormsModule`. `@ViewChild('realValueInput')` para autofocus.
- **Signals**: `inventoryId, loading, saving, error, realValue`. Computeds: `currentItem, progress, isFirst, isLast`.
- **Servicios**: `InventoryService` (público para template), `Router, ActivatedRoute`.
- **Ruta**: `/inventory/:id/item`.
- **Acciones**: `saveAndNext()` (POST `saveDetail`; si `isLast()` → `/review`; si no, `nextItem`), `previous`, `goToSummary` → `/review`, `incrementValue/decrementValue/onRealValueChange`.

### `DiscrepancyReviewComponent` — `inventory/discrepancy-review/discrepancy-review.component.ts`
- **Propósito**: muestra ítems con discrepancia tras Phase 1; pregunta si justificar con ventas/compras o terminar.
- **Signals**: `inventoryId, loading, completing, error, discrepancies, hasDiscrepancies, requiresSales, isInitialInventory`.
- **Servicios**: `InventoryService`, `Router, ActivatedRoute`.
- **Ruta**: `/inventory/:id/review`.
- **Lógica clave** (`ngOnInit`, líneas 33-62):
  - Inventario `'initial'` → no muestra discrepancias ni Phase 2.
  - Si todos los `suggested_value === 0` (primer inventario sin baseline) → tampoco muestra Phase 2.
- **Acciones**: `continueToSales` → `/sales`, `finishInventory` → `/summary`, `goBackToItems` → `/item`.

### `SalesEntryComponent` — `inventory/sales-entry/sales-entry.component.ts`
- **Propósito**: Phase 2 — captura `stock_received` y `units_sold` por ítem para justificar diferencias.
- **Imports**: `CommonModule, FormsModule`. `@ViewChild('stockReceivedInput')`. Expone `Math` al template (línea 23).
- **Signals**: `inventoryId, loading, saving, error, stockReceived, unitsSold`. Computeds: `currentItem, progress, isFirst, isLast, expectedAdjustment, adjustmentBalance`.
- **Servicios**: `InventoryService` (público para template), `Router, ActivatedRoute`.
- **Ruta**: `/inventory/:id/sales`.
- **Acciones**: `saveAndNext()` (POST `saveSales`; al final → `/summary`), `previous`, `goToSummary`, increment/decrement de cada campo.

### `SummaryComponent` — `inventory/summary/summary.component.ts`
- **Propósito**: resumen final con `can_complete`, lista de ítems con/sin discrepancia, botón Completar.
- **Signals**: `inventoryId, summary, loading, completing, error`.
- **Servicios**: `InventoryService, Router, ActivatedRoute`.
- **Ruta**: `/inventory/:id/summary`.
- **Acciones**: `complete()` (POST `completeInventory`; redirige a `/confirmation` con state `issuesCreated`), `goBackToItems`, `goBack` (a home).

### `ConfirmationComponent` — `inventory/confirmation/confirmation.component.ts`
- **Propósito**: pantalla de éxito post-cierre; lee `issuesCreated` desde `Router.getCurrentNavigation().extras.state` o `history.state`.
- **Signals**: `issuesCreated`.
- **Ruta**: `/inventory/:id/confirmation`.
- **Acciones**: `goHome()` → `/`.

---

## Admin

### `AdminLayoutComponent` — `admin/layout/admin-layout.component.ts`
- **Propósito**: shell del backoffice (sidebar colapsable + header con avatar + `<router-outlet />`).
- **Imports**: `CommonModule, RouterModule, RouterOutlet`. Template inline (167 líneas).
- **Signals**: `collapsed`.
- **Servicios**: `AuthService` (público para template).
- **Acciones**: `toggleCollapse, logout, getInitials`. Navegación con `routerLink` y `routerLinkActive` a 6 rutas hijas.

### `DashboardComponent` — `admin/dashboard/dashboard.component.ts`
- **Propósito**: vista inicial admin con 4 KPIs (`today_inventories, with_discrepancies, without_discrepancies, pending_inventories`) + banner si no hay inventario inicial + modal para crearlo.
- **Imports**: `CommonModule, FormsModule, RouterModule`.
- **Signals**: `loading, data, hasInitialInventory, showInitialModal, loadingEmployees, employees, creatingInitial, modalError`. Variable plana: `selectedEmployeeId: number = 0`.
- **Servicios**: `AdminService`.
- **Ruta**: `/admin/dashboard` (default redirect del módulo admin).
- **Acciones**: `loadDashboard, checkInitialInventory, openInitialInventoryModal, closeInitialInventoryModal, loadEmployees, createInitialInventory` (POST `/admin/inventories/initial`).

### `InventoryListComponent` — `admin/inventories/inventory-list.component.ts`
- **Propósito**: tabla paginada de todos los inventarios con filtros (rango de fecha, tipo, con/sin discrepancias).
- **Imports**: `CommonModule, FormsModule, RouterModule`.
- **Signals**: `loading, inventories, currentPage, totalPages, total`. Variables planas: filtros (`filterDateFrom/To/Type/Discrepancies`).
- **Servicios**: `AdminService, ActivatedRoute, Router`.
- **Ruta**: `/admin/inventories`.
- **Patrón**: filtros de fecha con `Subject` + `debounceTime(300)` (líneas 183-189). Lee filtros iniciales desde `route.queryParams`.
- **Acciones**: `loadInventories, applyFilters, clearFilters, prevPage, nextPage, formatDate, formatType`. Cada fila linkea a `/admin/inventories/:id`.

### `InventoryDetailComponent` — `admin/inventories/inventory-detail.component.ts`
- **Propósito**: detalle editable de un inventario. Tabla con columnas: Item, Tipo, **Esperado** (editable), Contado, Compras, Ventas, **Mermas** (editable), Diferencia, Acciones.
- **Imports**: `CommonModule, FormsModule, RouterModule`. Template inline (~340 líneas).
- **Signals**: `loading, saving, inventory, editingItem`. Variables planas: `showOnlyDiscrepancies, editSuggestedValue, editRealValue, editStockReceived, editUnitsSold, editShrinkage`.
- **Servicios**: `AdminService, ActivatedRoute, Router`.
- **Ruta**: `/admin/inventories/:inventoryID`.
- **Acciones**: `filteredDetails()` (filtra por discrepancia), `startEdit, cancelEdit, saveEdit` (PUT `/admin/inventories/{id}/details/{detailId}`).

### `ItemListComponent` — `admin/items/item-list.component.ts`
- **Propósito**: CRUD de ítems (productos/insumos) con filtros (búsqueda, tipo, frecuencia, estado) y modal de crear/editar.
- **Imports**: `CommonModule, FormsModule`.
- **Signals**: `items, total, totalPages, loading, showModal, editingItem, saving, categories, suppliers, measurementUnits, activeInventoriesCount`. Filtros y form como variables planas.
- **Servicios**: `AdminService`.
- **Ruta**: `/admin/items`.
- **Patrón**: en `loadInitialData()` usa `forkJoin` para cargar `categories + suppliers + measurement-units + active-count` antes de items (líneas 382-397).
- **Acciones**: `applyFilters, clearFilters, goToPage, toggleStatus, openCreateModal, openEditModal, saveItem` (POST/PUT). Search con debounce manual (`setTimeout` 300ms).
- **Flag clave**: `formAddToActiveInventories` se manda como `add_to_active_inventories` en `CreateItemRequest`, controlando si el ítem se agrega también a inventarios en curso (banner amber visible cuando `activeInventoriesCount > 0`).

### `EmployeeListComponent` — `admin/employees/employee-list.component.ts`
- **Propósito**: CRUD de empleados (incluye reset de contraseña). Soporta document_type CC/CE/NUIP/PP.
- **Imports**: `CommonModule, FormsModule`. Template inline (~380 líneas, incluye modal de crear/editar y modal de confirmación de reset).
- **Signals**: `employees, total, totalPages, loading, showModal, editingEmployee, saving, showResetModal, resetEmployee, resetting`. Form variables planas.
- **Servicios**: `AdminService`.
- **Ruta**: `/admin/employees`.
- **Acciones**: `loadEmployees, applyFilters, clearFilters, goToPage, toggleStatus, openCreateModal, openEditModal, saveEmployee, resetPassword, confirmResetPassword`.
- **Nota**: la nueva contraseña tras reset se anuncia como "Documento + Año de nacimiento" (línea 360-361).

### `CategoryListComponent` — `admin/categories/category-list.component.ts`
- **Propósito**: CRUD de categorías con drag-and-drop para reordenar. Switch de active. Muestra `item_count`.
- **Imports**: `CommonModule, FormsModule, DragDropModule` (`@angular/cdk/drag-drop`).
- **Signals**: `categories, loading, showModal, editingCategory, saving, error`. `formData = { name, active }` plano.
- **Servicios**: `AdminService`.
- **Ruta**: `/admin/categories`.
- **Acciones**: `onDrop` (CdkDragDrop, recalcula `display_order` y llama `reorderCategories`), `openCreateModal, openEditModal, saveCategory, toggleStatus`. Optimistic update local con rollback al fallar.

### `SupplierListComponent` — `admin/suppliers/supplier-list.component.ts`
- **Propósito**: CRUD de proveedores con búsqueda y filtro activo/inactivo.
- **Imports**: `CommonModule, FormsModule`.
- **Signals**: `suppliers, loading, showModal, editingSupplier, saving, error, total, totalPages`. `filter: SupplierFilter`, `formData` planos.
- **Servicios**: `AdminService`.
- **Ruta**: `/admin/suppliers`.
- **Acciones**: `loadSuppliers, onSearchChange` (debounce 300ms con setTimeout), `onFilterChange, goToPage, openCreateModal, openEditModal, saveSupplier, toggleStatus`.

---

## Notas transversales

- **Templates externos (.html)** solo en: login, home, schedule-select, item-entry, discrepancy-review, sales-entry, summary, confirmation. **Inline** en role-redirect, todos los componentes admin.
- **Iconografía**: SVGs inline (Heroicons-style) en los templates. No hay librería de iconos.
- **Paleta**: `indigo` y `emerald` predominan; `coffee-*` (custom Tailwind) aparece en `category-list` y `supplier-list` ❓ — su definición no fue inspeccionada en este barrido.
- **No hay tests `.spec.ts`** para ningún componente.
