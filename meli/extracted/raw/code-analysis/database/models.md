# Modelos de Datos (`src/app/core/models/`)

> Solo definiciones TypeScript en frontend (no hay schema de BD aquí). Los nombres en `snake_case` indican que el backend serializa así.

## `employee.model.ts`

### `Employee` (líneas 1-8)
| Campo | Tipo | Opcional |
|---|---|---|
| `id` | `number` | no |
| `username` | `string` | no |
| `name` | `string` | no |
| `last_name` | `string` | no |
| `full_name` | `string` | no |
| `role` | `'employee' \| 'admin'` (literal union) | no |

### `LoginRequest` (líneas 10-13)
- `username: string`
- `password: string`

### `LoginResponse` (líneas 15-18)
- `token: string`
- `employee: Employee`

> ⚠️ Hay **dos** definiciones distintas de `Employee`: la de `employee.model.ts` (versión "session") y la de `admin.model.ts` (versión "CRUD"). Ver más abajo.

---

## `inventory.model.ts`

### Enums / type aliases (líneas 1-3)
- `InventoryType = 'daily' | 'weekly' | 'monthly' | 'initial'`
- `Schedule = 'opening' | 'noon' | 'closing'`
- `InventoryStatus = 'in_progress' | 'completed'`

### `Inventory` (líneas 5-14)
| Campo | Tipo | Opcional |
|---|---|---|
| `id` | `number` | no |
| `inventory_date` | `string` (ISO date) | no |
| `inventory_type` | `InventoryType` | no |
| `schedule` | `Schedule` | sí |
| `status` | `InventoryStatus` | no |
| `responsible_id` | `number` | no |
| `started_at` | `string` (ISO datetime) | no |
| `completed_at` | `string` | sí |

### `SuggestedSchedule` (16-20)
- `inventory_type: InventoryType`
- `schedule?: Schedule`
- `date: string`

### `InventoryItem` (22-31)
| Campo | Tipo | Opcional |
|---|---|---|
| `item_id` | `number` | no |
| `name` | `string` | no |
| `category_name` | `string` | sí |
| `suggested_value` | `number` | sí |
| `real_value` | `number` | sí |
| `stock_received` | `number` | sí |
| `units_sold` | `number` | sí |
| `is_complete` | `boolean` | no |

### `InventoryItemsResponse` (33-43)
- `inventory_id: number`
- `inventory_type: InventoryType`
- `schedule?: Schedule`
- `date: string`
- `requires_sales: boolean`
- `requires_purchases_only: boolean`
- `total_items: number`
- `completed_items: number`
- `items: InventoryItem[]`

### `SaveDetailRequest` (45-48)
- `item_id: number`
- `real_value: number`

### `SaveDetailResponse` (50-53)
- `saved: boolean`
- `suggested_value?: number`

### `SaveSalesRequest` (55-59)
- `item_id: number`
- `stock_received?: number`
- `units_sold?: number`

### `DiscrepancyItem` (61-69)
- `item_id: number`
- `name: string`
- `suggested_value: number`
- `real_value: number`
- `difference: number`
- `stock_received?: number`
- `units_sold?: number`

### `DiscrepanciesResponse` (71-81)
- `inventory_id, inventory_type, schedule?, date`
- `requires_sales: boolean`
- `requires_purchases_only: boolean`
- `total_items: number`
- `has_discrepancies: boolean`
- `items: DiscrepancyItem[]`

### `InventorySummaryItem` (83-92)
- `item_id, name`
- `suggested_value, real_value, difference`
- `has_discrepancy: boolean`
- `stock_received?, units_sold?`

### `InventorySummary` (94-105)
- `inventory_id, inventory_type, schedule?, date`
- `requires_purchases_only: boolean`
- `total_items, items_with_issues`
- `items: InventorySummaryItem[]`
- `can_complete: boolean`
- `missing_items: number`

### `CompleteInventoryResponse` (107-110)
- `completed: boolean`
- `issues_created: number`

### `CreateInventoryRequest` (112-116)
- `inventory_type: InventoryType`
- `schedule?: Schedule`
- `date: string`

### `InProgressInventory` (118-124)
- `id, inventory_date, inventory_type`
- `schedule?: Schedule`
- `started_at: string`

### `InProgressInventoriesResponse` (126-129)
- `inventories: InProgressInventory[]`
- `count: number`

---

## `admin.model.ts`

### Dashboard
**`DashboardStats`** (2-7): `today_inventories, with_discrepancies, without_discrepancies, pending_inventories: number`.
**`DashboardData`** (9-11): `{ stats: DashboardStats }`.

### Initial inventory
**`CreateInitialInventoryRequest`** (14-16): `{ responsible_id: number }`.

### Inventory listing (admin)
**`InventoryListItem`** (18-30):
| Campo | Tipo | Opcional |
|---|---|---|
| `id` | `number` | no |
| `inventory_date` | `string` | no |
| `inventory_type` | `'daily' \| 'weekly' \| 'monthly' \| 'initial'` | no |
| `schedule` | `'opening' \| 'noon' \| 'closing'` | sí |
| `status` | `'in_progress' \| 'completed'` | no |
| `employee_id` | `number` | no |
| `employee_name` | `string` | no |
| `total_items` | `number` | no |
| `items_with_diff` | `number` | no |
| `started_at` | `string` | no |
| `completed_at` | `string` | sí |

**`InventoryListResult`** (32-38): `{ items, total, page, page_size, total_pages }`.
**`InventoryFilter`** (40-48): `date_from?, date_to?, inventory_type?, employee_id?, has_discrepancies?, page?, page_size?` (todos opcionales).

### Inventory detail (admin)
**`InventoryDetailItem`** (51-65):
| Campo | Tipo | Notas |
|---|---|---|
| `detail_id` | `number` | id en la tabla `inventory_details` |
| `item_id` | `number` |  |
| `item_name` | `string` |  |
| `item_type` | `string` | (no tipado a `ItemType`) |
| `suggested_value` | `number \| null` |  |
| `real_value` | `number \| null` |  |
| `stock_received` | `number \| null` |  |
| `units_sold` | `number \| null` |  |
| `shrinkage` | `number \| null` | mermas |
| `expected_value` | `number` | computado: `suggested − shrinkage + stock_received − units_sold` |
| `difference` | `number` |  |
| `has_discrepancy` | `boolean` |  |

**`InventoryDetailView`** (67-80): `id, inventory_date, inventory_type, schedule?, status, employee_id, employee_name, started_at, completed_at?, total_items, items_with_diff, details: InventoryDetailItem[]`.

**`UpdateDetailRequest`** (82-88): todas opcionales — `suggested_value?, real_value?, stock_received?, units_sold?, shrinkage?: number`.

### Item & catálogos
**`ItemType = 'product' | 'supply'`** (91).
**`InventoryFrequency = 'daily' | 'weekly' | 'monthly'`** (92).

**`MeasurementUnit`** (94-98): `id: number, code: string, name: string`.

**`Item`** (100-115):
| Campo | Tipo | Opcional |
|---|---|---|
| `id` | `number` | no |
| `type` | `ItemType` | no |
| `name` | `string` | no |
| `active` | `boolean` | no |
| `inventory_frequency` | `InventoryFrequency` | no |
| `category_id` | `number` | no |
| `supplier_id` | `number` | sí |
| `cost` | `number` | no |
| `measurement_unit_id` | `number` | no |
| `created_at` | `string` | no |
| `updated_at` | `string` | no |
| `category` | `{ id: number; name: string }` | sí (eager-load) |
| `supplier` | `{ id: number; business_name: string }` | sí |
| `measurement_unit` | `MeasurementUnit` | sí |

**`ItemListResult`** (117-123): `{ items, total, page, page_size, total_pages }`.
**`ItemFilter`** (125-132): `type?, frequency?, active?, search?, page?, page_size?`.
**`CreateItemRequest`** (134-143): `type, name, inventory_frequency, category_id, supplier_id?, cost, measurement_unit_id, add_to_active_inventories?: boolean` (la última controla si el item se agrega a inventarios en curso).
**`UpdateItemRequest`** (145-154): igual a Create + `active: boolean` y sin `add_to_active_inventories`.

### Employee (admin)
**`EmployeeRole = 'employee' | 'admin'`** (157).

**`Employee`** (159-173) — ⚠️ DIFERENTE al de `employee.model.ts`:
| Campo | Tipo | Opcional |
|---|---|---|
| `id` | `number` | no |
| `username` | `string` | no |
| `name` | `string` | no |
| `last_name` | `string` | no |
| `document_type` | `string` | sí (CC/CE/NUIP/PP) |
| `document_number` | `string` | sí |
| `phone` | `string` | sí |
| `email` | `string` | sí |
| `birth_date` | `string` | sí |
| `role` | `EmployeeRole` | no |
| `active` | `boolean` | no |
| `created_at` | `string` | no |
| `updated_at` | `string` | no |

> No incluye `full_name`. Lo construye el componente concatenando `name + ' ' + last_name`.

**`EmployeeListResult`** (175-181), **`EmployeeFilter`** (183-189) — patrón estándar.
**`CreateEmployeeRequest`** (191-202): añade `password: string`. Datos opcionales: documento, contacto, fecha nac.
**`UpdateEmployeeRequest`** (204-215): igual a Create salvo `password` (no se actualiza por aquí; existe endpoint dedicado de reset) y añade `active: boolean`.

### Category
**`Category`** (218-226): `id, name, display_order, active, item_count, created_at, updated_at`.
**`CategoryListResult`** (228-231): `{ categories: Category[]; total: number }`.
**`CreateCategoryRequest`** (233-235): `{ name: string }`.
**`UpdateCategoryRequest`** (237-240): `{ name: string; active: boolean }`.
**`CategoryOrderItem`** (242-245): `{ id: number; display_order: number }`.
**`ReorderCategoriesRequest`** (247-249): `{ orders: CategoryOrderItem[] }`.

### Supplier
**`Supplier`** (252-263): `id, business_name, tax_id, contact_name, contact_phone, contact_email, active, item_count, created_at, updated_at`.
**`SupplierListResult`** (265-271): `{ suppliers, total, page, page_size, total_pages }`.
**`SupplierFilter`** (273-278): `active?, search?, page?, page_size?`.
**`CreateSupplierRequest`** (280-286): los 5 campos de contacto (todos requeridos en el tipo).
**`UpdateSupplierRequest`** (288-295): igual + `active: boolean`.

---

## Relaciones inferidas (diagrama lógico)

```
Employee 1 ── * Inventory       (Inventory.responsible_id → Employee.id)
Inventory 1 ── * InventoryDetail (InventoryDetailItem.detail_id, item_id)
Item ─ * InventoryDetail        (item_id)
Category 1 ── * Item            (Item.category_id)
Supplier 1 ── * Item            (Item.supplier_id, opcional)
MeasurementUnit 1 ── * Item     (Item.measurement_unit_id)
```

## Hallazgos / Inconsistencias

- ⚠️ **Dos `Employee`** distintos (`employee.model.ts` vs `admin.model.ts`). El primero es la "vista de sesión" (incluye `full_name`); el segundo es la "vista CRUD" con campos extendidos. No están unificados.
- ⚠️ `InventoryDetailItem.item_type` es `string` (no `ItemType`).
- ⚠️ `expected_value` es siempre `number` mientras los inputs (`suggested_value`, etc.) pueden ser `null`. Comentario en línea 61-62: `Computed: suggested_value − shrinkage + stock_received − units_sold`.
- ⚠️ `InventoryListItem.inventory_type` repite la unión literal en lugar de usar `InventoryType` importado.
- ❓ No hay enum/lista para `document_type`; los valores `'CC' | 'CE' | 'NUIP' | 'PP'` solo existen como `<option>` en `employee-list.component.ts:259-262`.
