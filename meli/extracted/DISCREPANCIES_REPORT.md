# Discrepancies Report

**Generated**: 2026-04-30
**Mode**: FULL EXTRACTION
**Validation type**: Internal code consistency (no FuryMCP / OpenAPI to cross-validate)

## Severity Legend

- 🔴 **CRITICAL** — semantic conflict that can cause runtime errors or data corruption
- 🟡 **WARNING** — inconsistency that should be fixed but is non-blocking
- 🔵 **INFO** — observation worth documenting

---

## D-01 🔴 Two competing `Employee` interfaces

**Files**:
- `src/app/core/models/employee.model.ts:1-8` (session view, includes `full_name`, no extended fields)
- `src/app/core/models/admin.model.ts:159-173` (CRUD view, includes `document_type`, `document_number`, `phone`, `email`, `birth_date`, `active`, `created_at`, `updated_at`; **no `full_name`**)

**Symptom**: Components mix both views (`AdminLayoutComponent` uses session-view `full_name`; `EmployeeListComponent` rebuilds the full name with `name + ' ' + last_name`).

**Recommendation**: Define a single `Employee` interface with all fields, or split into `SessionEmployee extends Employee` to make the relationship explicit.

---

## D-02 🟡 `employeeGuard` is a stub

**File**: `src/app/core/guards/auth.guard.ts:49`

**Issue**: Returns `true` unconditionally; declared but never used in any route.

**Recommendation**: Either delete it or implement the role check it suggests (mirror `adminGuard`).

---

## D-03 🟡 `InventoryDetailItem.item_type` typed as `string` instead of `ItemType`

**File**: `src/app/core/models/admin.model.ts:54`

**Issue**: The literal union `'product' | 'supply'` (`ItemType`, line 91) is reused everywhere except in `InventoryDetailItem`, which loosens it to `string`.

**Recommendation**: Change to `item_type: ItemType`.

---

## D-04 🟡 `InventoryListItem.inventory_type` duplicates `InventoryType` literal

**File**: `src/app/core/models/admin.model.ts:21` (literal repeated) vs `src/app/core/models/inventory.model.ts:1` (canonical `InventoryType` alias).

**Recommendation**: Import and reuse `InventoryType` instead of repeating the literal union.

---

## D-05 🟡 `services/index.ts` does not re-export `AdminService`

**File**: `src/app/core/services/index.ts`

**Symptom**: All admin components import from `../../../core/services/admin.service` directly, while inventory/auth components use the barrel.

**Recommendation**: Add `export * from './admin.service';` to homogenize imports.

---

## D-06 🟡 `expected_value` always `number`, but its inputs may be `null`

**File**: `src/app/core/models/admin.model.ts:51-65`

**Detail**: `suggested_value`, `real_value`, `stock_received`, `units_sold`, `shrinkage` are `number | null`, but `expected_value` (their computed result) is `number`. The backend likely treats `null` as `0` when computing it.

**Recommendation**: Document the null-handling rule in `technical-spec.md`, or change the type to `number | null`.

---

## D-07 🟡 Search debounce implemented inconsistently

**Files**:
- `inventory-list.component.ts:183-189` — uses RxJS `Subject` + `debounceTime(300)`
- `item-list.component.ts`, `supplier-list.component.ts`, `employee-list.component.ts` — use manual `setTimeout(300)`

**Recommendation**: Pick one approach. RxJS-based is preferable for cancellation safety.

---

## D-08 🟡 `document_type` enumeration only declared in markup

**File**: `src/app/features/admin/employees/employee-list.component.ts:259-262` (`<option>` elements with `CC`, `CE`, `NUIP`, `PP`).

**Symptom**: No type-level enum exists; the model declares `document_type?: string`.

**Recommendation**: Promote to `DocumentType = 'CC' | 'CE' | 'NUIP' | 'PP'` in `admin.model.ts`.

---

## D-09 🔵 No `dataGroups` in service worker config

**File**: `ngsw-config.json`

**Observation**: The PWA caches static assets only. Decide whether API responses should ever be cached (offline mode for in-progress inventories, for example).

---

## D-10 🔵 No automated tests

**Observation**: Karma + Jasmine is configured but no `.spec.ts` files exist. Coverage is effectively 0%.

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟡 WARNING | 7 |
| 🔵 INFO | 2 |
| **Total** | **10** |

No phantom endpoints were detected (sole source is code).
