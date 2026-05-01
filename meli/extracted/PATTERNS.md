# PATTERNS.md — loopi-web

**Generado**: 2026-04-30
**Modo**: Reverse-engineering FULL
**Repositorio**: ~35 TS files (medium). Máx. patrones: 20.
**Idioma**: Español. Términos técnicos en inglés.

---

## P-01 — Standalone components sin NgModule

**Categoría**: Angular / Arquitectura

**Evidencia**:
- `src/app/app.ts:6-7` (`standalone: true, imports: [RouterOutlet]`)
- `src/app/features/auth/login/login.component.ts:9-10`
- `src/app/features/inventory/item-entry/item-entry.component.ts:10-11`
- `src/app/features/admin/dashboard/dashboard.component.ts:10-11`
- `src/app/features/admin/categories/category-list.component.ts:7-8`

**Ejemplo**:
```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent { … }
```

**Cuándo usar**: Siempre. No crear NgModules. Importar dependencias directamente en el decorador.

---

## P-02 — Lazy loading con `loadComponent` / `loadChildren`

**Categoría**: Angular / Routing

**Evidencia**:
- `src/app/app.routes.ts:8` (`loadComponent` para `/login`)
- `src/app/app.routes.ts:15` (`loadChildren` para `/admin/**`)
- `src/app/app.routes.ts:25, 29, 33, 37, 41, 45, 49, 58` (rutas de inventario)
- `src/app/features/admin/admin.routes.ts:12, 16, 20, 24, 28, 32, 36`

**Ejemplo**:
```typescript
{
  path: 'login',
  canActivate: [publicGuard],
  loadComponent: () =>
    import('./features/auth/login/login.component')
      .then(m => m.LoginComponent),
},
```

**Cuándo usar**: Toda ruta nueva debe usar lazy loading. Nunca importar componentes directamente en las rutas.

---

## P-03 — `inject()` en lugar de constructor injection

**Categoría**: Angular / DI

**Evidencia**:
- `src/app/core/services/auth.service.ts:13-15`
- `src/app/core/services/inventory.service.ts:26`
- `src/app/features/admin/items/item-list.component.ts:341`
- `src/app/core/interceptors/auth.interceptor.ts:10-11`

**Ejemplo**:
```typescript
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
}
```

**Cuándo usar**: Siempre. Nunca usar inyección por constructor.

---

## P-04 — Functional guards y functional interceptors

**Categoría**: Angular / Seguridad

**Evidencia**:
- `src/app/core/guards/auth.guard.ts:6` (`authGuard: CanActivateFn`)
- `src/app/core/guards/auth.guard.ts:18, 36, 49` (otros 3 guards)
- `src/app/core/interceptors/auth.interceptor.ts:9` (`HttpInterceptorFn`)
- `src/app/app.config.ts:20` (`withInterceptors([authInterceptor])`)

**Ejemplo**:
```typescript
export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router  = inject(Router);
  return storage.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
```

**Cuándo usar**: Toda protección de ruta o transformación de request HTTP.

---

## P-05 — Signals para estado, `computed()` para derivados

**Categoría**: Angular / Estado reactivo

**Evidencia**:
- `src/app/core/services/auth.service.ts:17-22` (4 signals + 3 computeds)
- `src/app/core/services/inventory.service.ts:29-47` (8 signals)
- `src/app/features/inventory/item-entry/item-entry.component.ts:23-42` (signals locales + computeds)
- `src/app/features/inventory/sales-entry/sales-entry.component.ts:25-60` (`expectedAdjustment`, `adjustmentBalance`)

**Ejemplo**:
```typescript
private currentEmployee = signal<Employee | null>(null);
readonly isLoggedIn  = computed(() => !!this.currentEmployee());
readonly isAdmin     = computed(() => this.currentEmployee()?.role === 'admin');
readonly employeeName = computed(() => this.currentEmployee()?.name ?? '');
```

**Cuándo usar**: Todo estado local de servicio o componente. Usar `computed()` para valores derivados. Nunca usar `BehaviorSubject` ni `Subject` para estado UI.

---

## P-06 — RxJS reservado para HTTP y debounce

**Categoría**: Angular / Reactividad

**Evidencia**:
- `src/app/features/inventory/home/home.component.ts:30-44` (`forkJoin` de 2 endpoints)
- `src/app/features/admin/items/item-list.component.ts:382-397` (`forkJoin` de 4 endpoints)
- `src/app/features/admin/inventories/inventory-list.component.ts:183-189` (`Subject` + `debounceTime(300)`)
- `src/app/core/services/auth.service.ts:32-40` (`tap` para side-effects post-login)

**Ejemplo**:
```typescript
// Carga paralela de recursos
forkJoin({
  categories:       this.adminService.listCategories(),
  suppliers:        this.adminService.listAllActiveSuppliers(),
  measurementUnits: this.adminService.listMeasurementUnits(),
  activeCount:      this.adminService.getActiveInventoriesCount(),
}).subscribe(({ categories, suppliers, measurementUnits, activeCount }) => { … });
```

**Cuándo usar**: HTTP calls (siempre retornan `Observable<T>`), carga paralela (`forkJoin`), y debounce de inputs. No usar para estado en memoria.

---

## P-07 — Template-driven forms con `[(ngModel)]`

**Categoría**: Angular / Formularios

**Evidencia**:
- `src/app/features/auth/login/login.component.ts:11` (importa `FormsModule`)
- `src/app/features/admin/items/item-list.component.ts:21` + bindings `[(ngModel)]`
- `src/app/features/admin/employees/employee-list.component.ts:16` + bindings `[(ngModel)]`
- `src/app/features/admin/categories/category-list.component.ts:11` + `[(ngModel)]="formData.name"`

**Cuándo usar**: Todos los formularios usan `FormsModule`. No usar `ReactiveFormsModule` (no está instalado).

---

## P-08 — Bearer token en `localStorage` con interceptor de errores 401

**Categoría**: Seguridad / HTTP

**Evidencia**:
- `src/app/core/interceptors/auth.interceptor.ts:14-21` (inyección del header)
- `src/app/core/interceptors/auth.interceptor.ts:25-30` (manejo del 401)
- `src/app/core/services/storage.service.ts:11-43` (encapsula claves `'token'` y `'employee'`)

**Ejemplo**:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        inject(StorageService).clear();
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
```

**Cuándo usar**: Cualquier request HTTP ya incluye el token automáticamente. Para rutas públicas (solo `/auth/login`), el interceptor no borra la sesión en 401.

---

## P-09 — Convención de URL: `${environment.apiUrl}/<recurso>`

**Categoría**: HTTP / Configuración

**Evidencia**:
- `src/app/core/services/auth.service.ts:33` (`/auth/login`)
- `src/app/core/services/inventory.service.ts:50, 54, 58, 62, 69, 84, 106, 122, 144, 148`
- `src/app/core/services/admin.service.ts:41` (`baseUrl = ${apiUrl}/admin`)

**Cuándo usar**: Siempre construir URLs como `` `${environment.apiUrl}/ruta` ``. El adminService define `baseUrl` propio con `/admin`. No hardcodear URLs de producción.

---

## P-10 — Modal casero con `signal<boolean>` + backdrop click

**Categoría**: UI / Interacción

**Evidencia**:
- `src/app/features/admin/dashboard/dashboard.component.ts:113-190` (modal inventario inicial)
- `src/app/features/admin/items/item-list.component.ts:194-336`
- `src/app/features/admin/employees/employee-list.component.ts:201-380` (dos modales)
- `src/app/features/admin/categories/category-list.component.ts:105-169`
- `src/app/features/admin/suppliers/supplier-list.component.ts:154-263`

**Ejemplo**:
```typescript
showModal = signal(false);
openModal()  { this.showModal.set(true);  }
closeModal() { this.showModal.set(false); }
```
```html
@if (showModal()) {
  <div class="fixed inset-0 bg-black/50 z-40" (click)="closeModal()"></div>
  <div class="fixed z-50 ..."><!-- contenido --></div>
}
```

**Cuándo usar**: Cualquier diálogo o modal en admin. No usar CDK Overlay (no está configurado).

---

## P-11 — Toggle de estado optimista con rollback

**Categoría**: UI / Estado

**Evidencia**:
- `src/app/features/admin/categories/category-list.component.ts:300-312`
- `src/app/features/admin/suppliers/supplier-list.component.ts:429-441`
- `src/app/features/admin/items/item-list.component.ts:460-466`
- `src/app/features/admin/employees/employee-list.component.ts:476-482`

**Ejemplo**:
```typescript
toggleStatus(item: Item) {
  item.active = !item.active;          // optimistic update
  this.adminService.updateItemStatus(item.id, item.active)
    .subscribe({ error: () => item.active = !item.active }); // rollback
}
```

**Cuándo usar**: Toggles de estado activo/inactivo. El cambio se refleja inmediatamente; se revierte si el servidor responde con error.

---

## P-12 — Tabla + filtros + paginación (patrón CRUD estándar)

**Categoría**: UI / Admin

**Evidencia**:
- `src/app/features/admin/inventories/inventory-list.component.ts:17-162`
- `src/app/features/admin/items/item-list.component.ts:99-191`
- `src/app/features/admin/employees/employee-list.component.ts:81-198`
- `src/app/features/admin/suppliers/supplier-list.component.ts:64-151`

**Estructura**:
```
Signals: items[], total, currentPage, totalPages, loading
Filtros: variables planas (string/boolean/number)
Debounce: Subject + debounceTime(300) para búsqueda por texto
Paginación: prevPage() / nextPage() / goToPage(n)
```

**Cuándo usar**: Toda vista CRUD admin. Los filtros se envían como `HttpParams` en `AdminService`.

---

## P-13 — Drag-and-drop con Angular CDK (solo categorías)

**Categoría**: UI / Interacción

**Evidencia**:
- `src/app/features/admin/categories/category-list.component.ts:4` (importa `CdkDragDrop, DragDropModule, moveItemInArray`)
- `src/app/features/admin/categories/category-list.component.ts:11, 43-58` (decoradores `cdkDropList`, `cdkDrag`, `cdkDragHandle`)

**Cuándo usar**: Reordenamiento de listas. Único uso de CDK en la app. Al soltar, recalcular `display_order` y llamar `POST /admin/categories/reorder`.

---

## P-14 — i18n manual ES con `Record<string, string>`

**Categoría**: UI / Localización

**Evidencia**:
- `src/app/features/inventory/home/home.component.ts:64-83` (`typeMap`, `scheduleMap`)
- `src/app/features/inventory/summary/summary.component.ts:71-92`
- `src/app/features/admin/inventories/inventory-list.component.ts:277-295`
- `src/app/features/admin/inventories/inventory-detail.component.ts:322-340`

**Ejemplo**:
```typescript
readonly typeMap: Record<string, string> = {
  daily:   'Diario',
  weekly:  'Semanal',
  monthly: 'Mensual',
  initial: 'Inicial',
};
readonly scheduleMap: Record<string, string> = {
  opening: 'Apertura',
  noon:    'Mediodía',
  closing: 'Cierre',
};
```

**Cuándo usar**: Traducción de valores de enum a etiquetas UI. No usar `@angular/localize` (no está configurado).

---

## P-15 — Nueva sintaxis de control flow Angular 17+ (`@if/@for/@empty`)

**Categoría**: Angular / Templates

**Evidencia**:
- `src/app/features/admin/dashboard/dashboard.component.ts:16, 28, 142, 152`
- `src/app/features/admin/categories/category-list.component.ts:32, 47, 95`
- `src/app/features/admin/inventories/inventory-list.component.ts:72, 92, 120`
- `src/app/features/admin/items/item-list.component.ts:101, 122, 287, 300`

**Ejemplo**:
```html
@if (loading()) {
  <div class="spinner">...</div>
} @else if (items().length === 0) {
  <p>Sin resultados</p>
} @else {
  @for (item of items(); track item.id) {
    <tr>...</tr>
  } @empty {
    <tr><td>Lista vacía</td></tr>
  }
}
```

**Cuándo usar**: Siempre. No usar `*ngIf`, `*ngFor` ni `*ngSwitch` clásicos.
