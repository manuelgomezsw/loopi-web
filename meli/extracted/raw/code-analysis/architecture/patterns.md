# Patrones detectados

> Cada patrón con al menos 2 ubicaciones de evidencia (`file:line`).

## 1. Standalone components (sin NgModule)

Toda la app usa `standalone: true`. No existen `*.module.ts`.
- `app.ts:6-7` (`standalone: true, imports: [RouterOutlet]`).
- `app/features/auth/login/login.component.ts:9-10`.
- `app/features/inventory/item-entry/item-entry.component.ts:10-11`.
- `app/features/admin/dashboard/dashboard.component.ts:10-11`.

## 2. Lazy loading con `loadComponent`/`loadChildren`

Cada feature se carga bajo demanda.
- `app/app.routes.ts:8` (`loadComponent: () => import(...)` para login).
- `app/app.routes.ts:15` (`loadChildren` para `adminRoutes`).
- `app/app.routes.ts:25, 29, 33, 37, 41, 45, 49, 58` (resto de rutas).
- `app/features/admin/admin.routes.ts:12, 16, 20, 24, 28, 32, 36`.

## 3. `inject()` en lugar de constructor injection

Todos los servicios y componentes usan la función `inject()`.
- `app/core/services/auth.service.ts:13-15`.
- `app/core/services/inventory.service.ts:26`.
- `app/features/admin/items/item-list.component.ts:341`.
- `app/core/interceptors/auth.interceptor.ts:10-11`.

## 4. Functional guards y functional interceptors

Migración completa a la API funcional de Angular.
- `auth.guard.ts:6, 18, 36, 49` (cuatro `CanActivateFn`).
- `auth.interceptor.ts:9` (`HttpInterceptorFn`).
- Registro en `app.config.ts:20` (`withInterceptors([authInterceptor])`).

## 5. Signals para estado, `computed` para derivados

Uso pervasivo de `signal()` + `computed()` en lugar de RxJS BehaviorSubject.
- `auth.service.ts:17-22` (`currentEmployee` signal + 4 computeds).
- `inventory.service.ts:29-47` (8 signals privadas + readonly + 2 fases).
- `item-entry.component.ts:23-42` (signals locales + computed sobre signals del servicio).
- `sales-entry.component.ts:25-60` (`expectedAdjustment` y `adjustmentBalance` computeds).

## 6. RxJS reservado para HTTP y debounce

`Observable` solo aparece en operaciones HTTP y debounce; `forkJoin` para cargas paralelas.
- `inventory/home/home.component.ts:30-44` (`forkJoin` de dos endpoints).
- `admin/items/item-list.component.ts:382-397` (`forkJoin` de 4).
- `admin/inventories/inventory-list.component.ts:183-189` (`Subject` + `debounceTime(300)`).
- `auth.service.ts:32-40` (`tap` para side-effects post-respuesta).

## 7. Template-driven forms con `[(ngModel)]` (no Reactive Forms)

`ReactiveFormsModule` no se importa en ningún componente. Todos los formularios usan `FormsModule` y `ngModel` con signals adyacentes.
- `auth/login/login.component.ts:11` (importa `FormsModule`) + uso en `.html` ❓ (no leído línea por línea).
- `admin/items/item-list.component.ts:21` + bindings `[(ngModel)]="formName"`, etc.
- `admin/employees/employee-list.component.ts:16` + `[(ngModel)]="formUsername"`, etc.
- `admin/categories/category-list.component.ts:11` + `[(ngModel)]="formData.name"`.

## 8. Token Bearer en `localStorage` + interceptor de errores 401

- `interceptors/auth.interceptor.ts:14-21` añade `Authorization: Bearer ${token}`.
- `interceptors/auth.interceptor.ts:25-30` limpia storage y redirige en 401 (excepto en `/auth/login`).
- `services/storage.service.ts:11-43` encapsula keys `'token'`, `'employee'`.

## 9. Convención de URL: `${environment.apiUrl}/<resource>`

- `auth.service.ts:33` (`/auth/login`).
- `inventory.service.ts:50, 54, 58, 62, 69, 84, 106, 122, 144, 148`.
- `admin.service.ts:41` define `baseUrl = ${apiUrl}/admin` y todos los endpoints usan ese prefijo.

## 10. Modales caseros con `signal<bool>` + backdrop click

Sin Angular Material, sin CDK Overlay. Patrón replicado:
- Backdrop con `(click)="closeModal()"` y panel sobre él.
- `admin/dashboard/dashboard.component.ts:113-190` (modal de inventario inicial).
- `admin/items/item-list.component.ts:194-336`.
- `admin/employees/employee-list.component.ts:201-380` (dos modales: crear/editar y reset).
- `admin/categories/category-list.component.ts:105-169`.
- `admin/suppliers/supplier-list.component.ts:154-263`.

## 11. Drag-and-drop con Angular CDK

Único uso del CDK (sin OverlayModule).
- `categories/category-list.component.ts:4` importa `CdkDragDrop, DragDropModule, moveItemInArray`.
- `categories/category-list.component.ts:11, 43-58` (`cdkDropList`, `cdkDrag`, `cdkDragHandle`).

## 12. Tabla + filtros + paginación replicada

Patrón consistente: filtros arriba, tabla con `@for`, paginación inferior; con búsqueda debounced.
- `admin/inventories/inventory-list.component.ts:17-162` (filtros y paginación).
- `admin/items/item-list.component.ts:99-191`.
- `admin/employees/employee-list.component.ts:81-198`.
- `admin/suppliers/supplier-list.component.ts:64-151`.

## 13. Toggle de estado optimista (con rollback)

Cambio local inmediato, persiste al backend; recarga si falla.
- `categories/category-list.component.ts:300-312`.
- `suppliers/supplier-list.component.ts:429-441`.
- `items/item-list.component.ts:460-466`.
- `employees/employee-list.component.ts:476-482`.

## 14. i18n manual ES con `Record<string, string>`

Sin `@angular/localize`. Mapeo en cada componente.
- `inventory/home/home.component.ts:64-83` (typeMap, scheduleMap).
- `inventory/summary/summary.component.ts:71-92`.
- `admin/inventories/inventory-list.component.ts:277-295`.
- `admin/inventories/inventory-detail.component.ts:322-340`.

## 15. Nueva sintaxis de control flow (`@if/@for/@empty`)

Ningún `*ngIf` ni `*ngFor` clásico. Todo migrado a la sintaxis de Angular 17+.
- `admin/dashboard/dashboard.component.ts:16, 28, 142, 152` (`@if`, `@for`).
- `admin/categories/category-list.component.ts:32, 47, 95` (`@if`, `@for`, `@empty`).
- `admin/inventories/inventory-list.component.ts:72, 92, 120` (`@if/@else if/@else`, `@for`).
- `admin/items/item-list.component.ts:101, 122, 287, 300`.
