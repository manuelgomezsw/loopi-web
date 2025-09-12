import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions extends MatSnackBarConfig {
  type?: NotificationType;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, { 
      ...options, 
      type: 'success',
      panelClass: ['notification-success']
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, { 
      ...options, 
      type: 'error',
      duration: 7000, // Los errores se muestran más tiempo
      panelClass: ['notification-error']
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, { 
      ...options, 
      type: 'warning',
      panelClass: ['notification-warning']
    });
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    return this.show(message, { 
      ...options, 
      type: 'info',
      panelClass: ['notification-info']
    });
  }

  /**
   * Muestra una notificación genérica
   */
  show(message: string, options?: NotificationOptions): MatSnackBarRef<SimpleSnackBar> {
    const config = { 
      ...this.defaultConfig, 
      ...options 
    };

    const action = options?.showCloseButton ? 'Cerrar' : undefined;

    return this.snackBar.open(message, action, config);
  }

  /**
   * Cierra todas las notificaciones activas
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }

  /**
   * Muestra un error de validación de formulario
   */
  formError(fieldErrors: Record<string, string[]>): void {
    const firstError = Object.values(fieldErrors).flat()[0];
    if (firstError) {
      this.error(`Error en formulario: ${firstError}`);
    }
  }

  /**
   * Muestra un error de conexión
   */
  connectionError(): void {
    this.error('Error de conexión. Verifica tu internet e intenta nuevamente.', {
      showCloseButton: true,
      duration: 10000
    });
  }

  /**
   * Muestra un error de sesión expirada
   */
  sessionExpired(): void {
    this.warning('Tu sesión ha expirado. Serás redirigido al login.', {
      duration: 3000
    });
  }

  /**
   * Muestra confirmación de acción exitosa
   */
  actionSuccess(action: string): void {
    this.success(`${action} realizada exitosamente`);
  }
}
