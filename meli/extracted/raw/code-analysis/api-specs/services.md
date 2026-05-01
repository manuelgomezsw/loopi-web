# Servicios (`src/app/core/services/`)

Cuatro servicios `@Injectable({ providedIn: 'root' })`: `StorageService`, `AuthService`, `InventoryService`, `AdminService`. Todos consumen `environment.apiUrl` excepto `StorageService`.

---

## 1. `StorageService` — `storage.service.ts`

Wrapper sobre `localStorage`. Sin dependencias externas, sin observables.

| Método | Firma | Comportamiento | Línea |
|---|---|---|---|
| `setToken` | `(token: string): void` | `localStorage.setItem('token', token)` | 11-13 |
| `getToken` | `(): string \| null` | `localStorage.getItem('token')` | 15-17 |
| `removeToken` | `(): void` | `localStorage.removeItem('token')` | 19-21 |
| `setEmployee` | `(employee: any): void` | `JSON.stringify` y guarda en `'employee'` | 23-25 |
| `getEmployee` | `(): any \| null` | `JSON.parse` del valor de `'employee'` | 27-30 |
| `removeEmployee` | `(): void` | `localStorage.removeItem('employee')` | 32-34 |
| `clear` | `(): void` | llama a `removeToken` + `removeEmployee` | 36-39 |
| `isLoggedIn` | `(): boolean` | `!!getToken()` | 41-43 |

> ⚠️ `setEmployee/getEmployee` usan `any` (sin tipar) — `auth.service.ts` debe tratarlos como `Employee`.

---

## 2. `AuthService` — `auth.service.ts`

Estado local con `signal<Employee \| null>` y `computed`. Lee/escribe vía `StorageService`.

### Signals públicos (líneas 19-22)
- `employee`: `Signal<Employee | null>` (readonly).
- `isLoggedIn`: `Signal<boolean>` = `!!currentEmployee()`.
- `isAdmin`: `Signal<boolean>` = `currentEmployee()?.role === 'admin'`.
- `employeeName`: `Signal<string>` = `currentEmployee()?.name ?? ''`.

### Métodos públicos

| Método | Firma | Endpoint | Side-effects | Línea |
|---|---|---|---|---|
| `login` | `(credentials: LoginRequest): Observable<LoginResponse>` | `POST {apiUrl}/auth/login` | `storage.setToken`, `storage.setEmployee`, `currentEmployee.set(employee)` | 32-41 |
| `logout` | `(): void` | — | `storage.clear`, `currentEmployee.set(null)`, `router.navigate(['/login'])` | 43-47 |
| `getProfile` | `(): Observable<Employee>` | `GET {apiUrl}/employees/me` | `storage.setEmployee`, `currentEmployee.set` | 49-57 |

### Constructor (línea 24-30)
Restaura `currentEmployee` desde `storage.getEmployee()` si existe.

---

## 3. `InventoryService` — `inventory.service.ts`

Mantiene **estado del flujo de toma de inventario** vía Signals privadas con índices y banderas. 

### Signals públicas (líneas 40-47)

| Nombre | Tipo | Origen |
|---|---|---|
| `inventory` | `Signal<Inventory \| null>` | `currentInventory` |
| `items` | `Signal<InventoryItem[]>` | `currentItems` |
| `currentItemIndex` | `Signal<number>` | `currentIndex` |
| `requiresSales` | `Signal<boolean>` | `requiresSalesFlag` |
| `requiresPurchasesOnly` | `Signal<boolean>` | `requiresPurchasesOnlyFlag` |
| `inventoryType` | `Signal<InventoryType \| null>` | `currentInventoryType` |
| `discrepancyItems` | `Signal<DiscrepancyItem[]>` | `_discrepancyItems` |
| `discrepancyIndex` | `Signal<number>` | `_discrepancyIndex` |

### Métodos HTTP

| Método | Endpoint | Línea |
|---|---|---|
| `getSuggestedSchedule(): Observable<SuggestedSchedule>` | `GET /inventories/suggested-schedule` | 49-51 |
| `getLatestInventory(): Observable<{ inventory: Inventory \| null }>` | `GET /inventories/latest` | 53-55 |
| `getInProgressInventories(): Observable<InProgressInventoriesResponse>` | `GET /inventories/in-progress` | 57-59 |
| `createInventory(request: CreateInventoryRequest): Observable<Inventory>` | `POST /inventories` | 61-66 |
| `getInventoryItems(inventoryId: number): Observable<InventoryItemsResponse>` | `GET /inventories/{id}/items` | 68-81 |
| `saveDetail(inventoryId: number, detail: SaveDetailRequest): Observable<SaveDetailResponse>` | `POST /inventories/{id}/details` | 83-103 |
| `getDiscrepancies(inventoryId: number): Observable<DiscrepanciesResponse>` | `GET /inventories/{id}/discrepancies` | 105-116 |
| `saveSales(inventoryId: number, sales: SaveSalesRequest): Observable<SaveDetailResponse>` | `POST /inventories/{id}/sales` (con `units_sold=0` forzado si `requiresPurchasesOnly`) | 118-141 |
| `getSummary(inventoryId: number): Observable<InventorySummary>` | `GET /inventories/{id}/summary` | 143-145 |
| `completeInventory(inventoryId: number): Observable<CompleteInventoryResponse>` | `POST /inventories/{id}/complete` (body `{}`) | 147-154 |

### Helpers de navegación (Phase 1: conteo físico)
- `nextItem(): void` — 157-163
- `previousItem(): void` — 165-170
- `setCurrentIndex(index: number): void` — 172-174
- `getCurrentItem(): InventoryItem \| null` — 176-180
- `isFirstItem(): boolean` — 182-184
- `isLastItem(): boolean` — 186-188
- `getProgress(): { current: number; total: number; percentage: number }` (calcula con `is_complete`) — 190-198

### Helpers de navegación (Phase 2: ventas/compras)
- `nextDiscrepancyItem(): void` — 201-207
- `previousDiscrepancyItem(): void` — 209-214
- `setDiscrepancyIndex(index: number): void` — 216-218
- `getCurrentDiscrepancyItem(): DiscrepancyItem \| null` — 220-224
- `isFirstDiscrepancyItem(): boolean` — 226-228
- `isLastDiscrepancyItem(): boolean` — 230-232
- `getDiscrepancyProgress(): { current: number; total: number; percentage: number }` — 234-242
- `hasDiscrepancies(): boolean` — 244-246

### `reset(): void` (líneas 248-257)
Restablece todas las signals a su estado inicial. Llamado tras `completeInventory`.

---

## 4. `AdminService` — `admin.service.ts`

Stateless. `baseUrl = ${environment.apiUrl}/admin` (línea 41). Usa `HttpParams` para query strings.

### Dashboard
- `getDashboard(days: number = 3): Observable<DashboardData>` — `GET /admin/dashboard?days=N` — 43-47.

### Inventories (admin)
- `listInventories(filter: InventoryFilter = {}): Observable<InventoryListResult>` — `GET /admin/inventories` con `page, page_size, date_from, date_to, inventory_type, employee_id, has_discrepancies` — 49-63.
- `getInventoryDetail(inventoryId: number): Observable<InventoryDetailView>` — `GET /admin/inventories/{id}` — 65-67.
- `updateInventoryDetail(inventoryId: number, detailId: number, data: UpdateDetailRequest): Observable<void>` — `PUT /admin/inventories/{id}/details/{detailId}` — 69-71.
- `getActiveInventoriesCount(): Observable<{ count: number }>` — `GET /admin/inventories/active-count` — 75-77.
- `createInitialInventory(data: CreateInitialInventoryRequest): Observable<{ inventory: Inventory }>` — `POST /admin/inventories/initial` — 79-81.

### Measurement Units
- `listMeasurementUnits(): Observable<MeasurementUnit[]>` — `GET /admin/measurement-units` — 85-87.

### Items
- `listItems(filter: ItemFilter = {}): Observable<ItemListResult>` — `GET /admin/items` con `page, page_size, type, frequency, active, search` — 89-100.
- `getItem(id: number): Observable<Item>` — `GET /admin/items/{id}` — 102-104.
- `createItem(data: CreateItemRequest): Observable<Item>` — `POST /admin/items` — 106-108.
- `updateItem(id: number, data: UpdateItemRequest): Observable<Item>` — `PUT /admin/items/{id}` — 110-112.
- `updateItemStatus(id: number, active: boolean): Observable<void>` — `PATCH /admin/items/{id}/status` body `{ active }` — 114-116.

### Employees
- `listAllActiveEmployees(): Observable<{ employees: Employee[]; total: number }>` — `GET /admin/employees/active` — 120-122.
- `listEmployees(filter: EmployeeFilter = {}): Observable<EmployeeListResult>` — `GET /admin/employees` con `page, page_size, role, active, search` — 124-134.
- `getEmployee(id: number): Observable<Employee>` — `GET /admin/employees/{id}` — 136-138.
- `createEmployee(data: CreateEmployeeRequest): Observable<Employee>` — `POST /admin/employees` — 140-142.
- `updateEmployee(id: number, data: UpdateEmployeeRequest): Observable<Employee>` — `PUT /admin/employees/{id}` — 144-146.
- `updateEmployeeStatus(id: number, active: boolean): Observable<void>` — `PATCH /admin/employees/{id}/status` — 148-150.
- `resetEmployeePassword(id: number): Observable<void>` — `POST /admin/employees/{id}/reset-password` body `{}` — 152-154.

### Categories
- `listCategories(): Observable<CategoryListResult>` — `GET /admin/categories` — 158-160.
- `getCategory(id: number): Observable<Category>` — `GET /admin/categories/{id}` — 162-164.
- `createCategory(data: CreateCategoryRequest): Observable<Category>` — `POST /admin/categories` — 166-168.
- `updateCategory(id: number, data: UpdateCategoryRequest): Observable<Category>` — `PUT /admin/categories/{id}` — 170-172.
- `updateCategoryStatus(id: number, active: boolean): Observable<void>` — `PATCH /admin/categories/{id}/status` — 174-176.
- `reorderCategories(data: ReorderCategoriesRequest): Observable<void>` — `POST /admin/categories/reorder` — 178-180.

### Suppliers
- `listSuppliers(filter: SupplierFilter = {}): Observable<SupplierListResult>` — `GET /admin/suppliers` con `page, page_size, active, search` — 184-193.
- `listAllActiveSuppliers(): Observable<{ suppliers: Supplier[]; total: number }>` — `GET /admin/suppliers/active` — 195-197.
- `getSupplier(id: number): Observable<Supplier>` — `GET /admin/suppliers/{id}` — 199-201.
- `createSupplier(data: CreateSupplierRequest): Observable<Supplier>` — `POST /admin/suppliers` — 203-205.
- `updateSupplier(id: number, data: UpdateSupplierRequest): Observable<Supplier>` — `PUT /admin/suppliers/{id}` — 207-209.
- `updateSupplierStatus(id: number, active: boolean): Observable<void>` — `PATCH /admin/suppliers/{id}/status` — 211-213.

---

## Resumen de endpoints (consolidado)

### Públicos / auth
- `POST /auth/login`
- `GET /employees/me`

### Inventory (rol empleado)
- `GET /inventories/suggested-schedule`
- `GET /inventories/latest`
- `GET /inventories/in-progress`
- `POST /inventories`
- `GET /inventories/{id}/items`
- `POST /inventories/{id}/details`
- `GET /inventories/{id}/discrepancies`
- `POST /inventories/{id}/sales`
- `GET /inventories/{id}/summary`
- `POST /inventories/{id}/complete`

### Admin
- `GET /admin/dashboard`
- `GET /admin/inventories` / `GET /admin/inventories/{id}` / `PUT /admin/inventories/{id}/details/{detailId}`
- `GET /admin/inventories/active-count` / `POST /admin/inventories/initial`
- `GET /admin/measurement-units`
- `GET|POST|PUT /admin/items` (+ `PATCH .../status`)
- `GET|POST|PUT /admin/employees` (+ `PATCH .../status`, `POST .../reset-password`, `GET /active`)
- `GET|POST|PUT /admin/categories` (+ `PATCH .../status`, `POST /reorder`)
- `GET|POST|PUT /admin/suppliers` (+ `PATCH .../status`, `GET /active`)

Total: **~30 endpoints** únicos consumidos.
