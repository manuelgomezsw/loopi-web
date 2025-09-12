# Lineamientos de Notificaciones - Loopi Web

## 📖 Guía de Uso del Sistema de Notificaciones

Este documento establece los lineamientos para el uso consistente del sistema de
notificaciones en la aplicación Loopi Web, basado en Material Design Snackbars.

## 🚀 Principio Fundamental

**TODA información que se entregue al usuario DEBE ser mediante snackbar.**

❌ **NO usar:**

- `alert()`
- `confirm()` (usar MatDialog)
- `console.log()` para información del usuario
- `console.error()` para errores del usuario

✅ **SÍ usar:**

- `NotificationService` para todas las notificaciones
- MatDialog para confirmaciones importantes
- `console.*` solo para debugging/desarrollo

## 🛠️ Implementación

### 1. Importación del Servicio

```typescript
import { NotificationService } from '../core/services/notification/notification.service';

@Component({...})
export class MiComponente {
  private notificationService = inject(NotificationService);
}
```

### 2. Tipos de Notificaciones

#### ✅ Éxito (`success`)

```typescript
// Operaciones completadas exitosamente
this.notificationService.success('Empleado guardado correctamente');
this.notificationService.success('Datos sincronizados');
```

#### ❌ Error (`error`)

```typescript
// Errores que requieren atención del usuario
this.notificationService.error('No se pudo guardar el empleado');
this.notificationService.error('Error de conexión');
```

#### ⚠️ Advertencia (`warning`)

```typescript
// Situaciones que requieren precaución
this.notificationService.warning('Los datos no están sincronizados');
this.notificationService.warning('Sesión a punto de expirar');
```

#### ℹ️ Información (`info`)

```typescript
// Información general para el usuario
this.notificationService.info('Solicitud enviada');
this.notificationService.info('Funcionalidad en desarrollo');
```

### 3. Opciones Avanzadas

```typescript
// Con botón de cerrar
this.notificationService.error('Error crítico', {
  showCloseButton: true
});

// Duración personalizada
this.notificationService.info('Mensaje importante', {
  duration: 10000 // 10 segundos
});

// Sin duración (manual)
this.notificationService.warning('Revisar configuración', {
  duration: 0,
  showCloseButton: true
});
```

## 📋 Casos de Uso Específicos

### Formularios

```typescript
save(): void {
  if (this.form.invalid) {
    this.notificationService.warning('Por favor revisa los campos marcados');
    return;
  }

  this.service.save(this.form.value).subscribe({
    next: () => this.notificationService.success('Guardado correctamente'),
    error: () => this.notificationService.error('Error al guardar')
  });
}
```

### Operaciones de Red

```typescript
loadData(): void {
  this.service.getData().subscribe({
    next: (data) => {
      // Solo notificar si es importante para el usuario
      if (data.length === 0) {
        this.notificationService.info('No hay datos disponibles');
      }
    },
    error: () => this.notificationService.error('Error al cargar datos')
  });
}
```

### Confirmaciones (usar MatDialog)

```typescript
delete(): void {
  // ❌ NO hacer: if (confirm('¿Estás seguro?'))

  // ✅ SÍ hacer:
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { message: '¿Estás seguro de eliminar este elemento?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.delete().subscribe({
        next: () => this.notificationService.success('Eliminado correctamente'),
        error: () => this.notificationService.error('Error al eliminar')
      });
    }
  });
}
```

## 🎨 Estilos Personalizados

Los snackbars tienen estilos personalizados definidos en
`src/styles/notification-styles.css`:

- **Success**: Verde (#4caf50)
- **Error**: Rojo (#f44336)
- **Warning**: Naranja (#ff9800)
- **Info**: Azul (#2196f3)

## ⚡ Performance y UX

### Buenas Prácticas

```typescript
// ✅ Específico y útil
this.notificationService.success('3 empleados agregados');

// ❌ Genérico y molesto
this.notificationService.info('Operación completada');
```

### Evitar Spam

```typescript
// ✅ Agrupar notificaciones relacionadas
private lastNotification = '';

notify(message: string): void {
  if (this.lastNotification !== message) {
    this.notificationService.info(message);
    this.lastNotification = message;
  }
}
```

## 🔧 Configuración Global

El servicio está configurado globalmente con:

- **Duración**: 5 segundos por defecto
- **Posición**: Top-right
- **Estilos**: Material Design
- **Accesibilidad**: Compatible con screen readers

## 📱 Responsive

Los snackbars son completamente responsive y se adaptan a:

- Móviles
- Tablets
- Desktop

## 🧪 Testing

```typescript
// En tests
expect(notificationService.success).toHaveBeenCalledWith('Mensaje esperado');
```

## 🚫 Reglas de ESLint

Se recomienda agregar estas reglas para evitar usos incorrectos:

```json
{
  "rules": {
    "no-alert": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## 📚 Ejemplos de Migración

### Antes (❌)

```typescript
alert('Error al guardar');
console.log('Usuario creado');
if (confirm('¿Eliminar?')) { ... }
```

### Después (✅)

```typescript
this.notificationService.error('Error al guardar');
this.notificationService.success('Usuario creado correctamente');
// Usar MatDialog para confirmaciones
```

## 🎯 Objetivos

1. **Consistencia**: Todas las notificaciones usan el mismo sistema
2. **UX**: Mejor experiencia de usuario con Material Design
3. **Accesibilidad**: Compatible con tecnologías asistivas
4. **Mantenibilidad**: Código más limpio y testeable

---

## 📞 Soporte

Para preguntas sobre el sistema de notificaciones, consultar:

- Este documento
- `src/app/core/services/notification/notification.service.ts`
- `src/styles/notification-styles.css`
- Tests en `src/app/core/services/notification/notification.service.spec.ts`

**Fecha de última actualización**: Septiembre 2025
