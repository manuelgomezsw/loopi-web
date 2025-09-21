# 📢 Estándares de Notificaciones - Loopi Web

## 🎯 Objetivo

Este documento establece los patrones estándar para el manejo de notificaciones
en la aplicación Loopi Web, garantizando una experiencia de usuario consistente
y un código mantenible.

## ✅ Sistema Único: SnackBar (Material Design)

### 🚀 Servicio Principal

```typescript
import { NotificationService } from '../core/services/notification/notification.service';

// Inyección en componentes
private notificationService = inject(NotificationService);
```

### 📋 Tipos de Notificación

#### 1. **Success** - Operaciones exitosas

```typescript
this.notificationService.success('Empleado creado exitosamente');
this.notificationService.success('Turno asignado correctamente');
```

#### 2. **Error** - Errores y fallos

```typescript
this.notificationService.error('Error al cargar los datos');
this.notificationService.error('No se pudo guardar la información');
```

#### 3. **Warning** - Advertencias

```typescript
this.notificationService.warning('Los datos no están completos');
this.notificationService.warning('Sesión próxima a expirar');
```

#### 4. **Info** - Información general

```typescript
this.notificationService.info('Datos actualizados automáticamente');
this.notificationService.info('Nueva versión disponible');
```

## 🏗️ Patrones de Implementación

### 1. **Componentes con Store (NgRx)**

#### ✅ Patrón Recomendado:

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private store = inject(Store<AppState>);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  // Error observable privado
  private error$: Observable<string | null> = this.store.select(selectMyError);

  ngOnInit(): void {
    // Suscribirse a errores del store
    this.error$
      .pipe(
        filter(error => !!error),
        takeUntil(this.destroy$)
      )
      .subscribe(error => {
        this.notificationService.error(error!);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### ❌ Evitar:

```typescript
// NO usar divs de error en templates
<div *ngIf="error$ | async as error" class="error-container">
  {{ error }}
</div>
```

### 2. **Servicios HTTP Directos**

#### ✅ Patrón Recomendado:

```typescript
loadData(): void {
  this.myService.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.notificationService.success('Datos cargados exitosamente');
    },
    error: (error) => {
      console.error('Error loading data:', error); // Para debugging
      this.notificationService.error('Error al cargar los datos');
    }
  });
}
```

#### ❌ Evitar:

```typescript
// NO solo console.error sin notificación al usuario
error: error => {
  console.error('Error:', error); // Solo esto NO es suficiente
};
```

### 3. **Effects (NgRx)**

#### ✅ Patrón Recomendado:

```typescript
loadData$ = createEffect(() =>
  this.actions$.pipe(
    ofType(MyActions.loadData),
    switchMap(() =>
      this.myService.getData().pipe(
        map(data => MyActions.loadDataSuccess({ data })),
        catchError(error => {
          const errorMessage = extractBackendErrorMessage(error);
          return of(MyActions.loadDataFailure({ error: errorMessage }));
        })
      )
    )
  )
);

// Effect separado para manejar errores
handleError$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(MyActions.loadDataFailure),
      tap(({ error }) => {
        this.notificationService.error(error);
      })
    ),
  { dispatch: false }
);
```

## 🎨 Características del SnackBar

### ✨ Ventajas

- **Material Design compliant** - Diseño consistente
- **No ocupa espacio** - No empuja contenido existente
- **Auto-dismiss** - Se ocultan automáticamente
- **Stacking inteligente** - Maneja múltiples notificaciones
- **Posición fija** - Siempre en la misma ubicación
- **Acciones opcionales** - Botones en notificaciones

### ⚙️ Configuración Avanzada

```typescript
// Con opciones personalizadas
this.notificationService.error('Error crítico', {
  duration: 10000,
  showCloseButton: true
});

// Con acciones
this.notificationService.warning('Sesión expirando', {
  action: 'Renovar',
  onAction: () => this.renewSession()
});
```

## 🚫 Patrones Prohibidos

### ❌ NO Usar:

1. **Divs de error en templates**

   ```html
   <!-- PROHIBIDO -->
   <div *ngIf="error$ | async as error" class="error-message">{{ error }}</div>
   ```

2. **Solo console.error sin notificación**

   ```typescript
   // PROHIBIDO - Usuario no ve el error
   error: error => {
     console.error('Error:', error);
   };
   ```

3. **alert() o window.alert()**

   ```typescript
   // PROHIBIDO - No es profesional
   alert('Error occurred!');
   ```

4. **Sistema de Store UI personalizado**
   ```typescript
   // PROHIBIDO - Ya eliminado
   this.store.dispatch(addNotification({ ... }));
   ```

## 🔧 Manejo Global de Errores

### GlobalErrorHandler

El `GlobalErrorHandler` maneja automáticamente:

- **Errores HTTP** (401, 403, 404, 500, etc.)
- **Errores de red** (sin conexión)
- **Errores de JavaScript** (runtime errors)

```typescript
// Configurado automáticamente - NO requiere intervención manual
// Ubicación: src/app/core/handlers/global-error.handler.ts
```

## 📊 Casos de Uso Comunes

### 1. **Formularios**

```typescript
save(): void {
  if (this.form.invalid) {
    this.notificationService.error('Por favor completa todos los campos requeridos');
    return;
  }

  // Procesar formulario...
}
```

### 2. **Operaciones CRUD**

```typescript
// Crear
this.notificationService.success('Registro creado exitosamente');

// Actualizar
this.notificationService.success('Registro actualizado correctamente');

// Eliminar
this.notificationService.success('Registro eliminado exitosamente');

// Error en cualquier operación
this.notificationService.error('Error al procesar la solicitud');
```

### 3. **Validaciones de Contexto**

```typescript
if (!workContext) {
  this.notificationService.error(
    'No se ha seleccionado una tienda. Por favor, selecciona un contexto de trabajo.'
  );
  this.router.navigate(['/']);
  return;
}
```

## 🎯 Beneficios de la Estandarización

### ✅ Para Usuarios:

- **Experiencia consistente** - Todas las notificaciones se ven y comportan
  igual
- **Mejor UX** - No interrumpen el flujo de trabajo
- **Información clara** - Mensajes comprensibles y útiles

### ✅ Para Desarrolladores:

- **Código limpio** - Un solo patrón para seguir
- **Fácil mantenimiento** - Cambios centralizados
- **Testing simplificado** - Un solo sistema para probar
- **Menos bugs** - Patrón probado y estable

## 🚀 Migración de Código Legacy

### Antes (Sistema Dual):

```typescript
// ❌ Div de error
<div *ngIf="error$ | async as error" class="error-container">
  {{ error }}
</div>

// ❌ Solo console.error
error: (error) => {
  console.error('Error:', error);
}
```

### Después (Sistema Único):

```typescript
// ✅ SnackBar automático desde Store
ngOnInit(): void {
  this.error$.pipe(
    filter(error => !!error),
    takeUntil(this.destroy$)
  ).subscribe(error => {
    this.notificationService.error(error!);
  });
}

// ✅ SnackBar directo en servicios
error: (error) => {
  console.error('Error:', error); // Para debugging
  this.notificationService.error('Mensaje amigable para el usuario');
}
```

## 📝 Checklist de Implementación

### ✅ Para Nuevos Componentes:

- [ ] Importar `NotificationService`
- [ ] Inyectar servicio con `inject()`
- [ ] Usar métodos apropiados (`success`, `error`, `warning`, `info`)
- [ ] NO crear divs de error en templates
- [ ] Implementar `OnDestroy` si se suscribe a observables

### ✅ Para Componentes Existentes:

- [ ] Remover divs de error del HTML
- [ ] Eliminar estilos CSS de error
- [ ] Agregar suscripción a error$ del Store
- [ ] Reemplazar console.error con notificaciones
- [ ] Implementar gestión de memoria (`takeUntil`)

---

## 🎉 Resultado Final

**Sistema Unificado de Notificaciones:**

- ✅ **Un solo mecanismo** - SnackBar Material Design
- ✅ **Experiencia consistente** - Misma UX en toda la app
- ✅ **Código mantenible** - Patrón estándar documentado
- ✅ **Performance optimizada** - Sin código duplicado
- ✅ **Fácil testing** - Sistema centralizado

---

_Última actualización: Septiembre 2025_ _Versión: 1.0_
