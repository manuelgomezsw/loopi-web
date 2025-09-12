import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification/notification.service';
import { TokenStorageService } from '../services/token-storage/token-storage.service';

export interface ErrorInfo {
  message: string;
  stack?: string;
  url?: string;
  timestamp: number;
  userId?: string;
  userAgent: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notification = inject(NotificationService);
  private router = inject(Router);
  private tokenStorage = inject(TokenStorageService);

  handleError(error: any): void {
    console.error('Error capturado por GlobalErrorHandler:', error);

    // Log estructurado del error
    this.logError(error);

    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleClientError(error);
    }
  }

  /**
   * Maneja errores HTTP específicos
   */
  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        // Error de red/conexión
        this.notification.connectionError();
        break;
        
      case 401:
        // No autorizado - limpiar sesión y redirigir
        this.handleUnauthorized();
        break;
        
      case 403:
        // Prohibido
        this.notification.error('No tienes permisos para realizar esta acción');
        break;
        
      case 404:
        // No encontrado
        this.notification.error('Recurso no encontrado');
        break;
        
      case 422:
        // Error de validación
        if (error.error?.errors) {
          this.notification.formError(error.error.errors);
        } else {
          this.notification.error('Datos inválidos enviados');
        }
        break;
        
      case 429:
        // Demasiadas peticiones
        this.notification.warning('Demasiadas peticiones. Intenta más tarde');
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        // Errores del servidor
        this.notification.error('Error del servidor. Intenta más tarde');
        break;
        
      default:
        // Error genérico
        const message = error.error?.message || 'Ha ocurrido un error inesperado';
        this.notification.error(message);
    }
  }

  /**
   * Maneja errores del cliente (JavaScript)
   */
  private handleClientError(error: Error): void {
    // En desarrollo, mostrar el error completo
    if (!this.isProduction()) {
      this.notification.error(`Error de aplicación: ${error.message}`, {
        duration: 10000,
        showCloseButton: true
      });
    } else {
      // En producción, mostrar mensaje genérico
      this.notification.error('Ha ocurrido un error inesperado');
    }
  }

  /**
   * Maneja errores de autorización
   */
  private handleUnauthorized(): void {
    this.tokenStorage.clearToken();
    this.notification.sessionExpired();
    
    // Redirigir al login después de un pequeño delay
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 2000);
  }

  /**
   * Registra el error de forma estructurada
   */
  private logError(error: any): void {
    const errorInfo: ErrorInfo = {
      message: error.message || 'Error desconocido',
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };

    // En un entorno real, esto se enviaría a un servicio de logging como Sentry
    console.group('🚨 Error Details');
    console.error('Message:', errorInfo.message);
    console.error('Stack:', errorInfo.stack);
    console.error('URL:', errorInfo.url);
    console.error('Timestamp:', new Date(errorInfo.timestamp).toISOString());
    console.error('User Agent:', errorInfo.userAgent);
    
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Status:', error.status);
      console.error('HTTP Error:', error.error);
    }
    
    console.groupEnd();

    // TODO: Enviar a servicio de logging externo en producción
    // this.sendToLoggingService(errorInfo);
  }

  /**
   * Verifica si estamos en producción
   */
  private isProduction(): boolean {
    // Asumimos que window.location.hostname nos da la info necesaria
    return !window.location.hostname.includes('localhost');
  }

  /**
   * Método para enviar errores a servicio externo (futuro)
   */
  private sendToLoggingService(errorInfo: ErrorInfo): void {
    // Implementar integración con Sentry, LogRocket, etc.
    // fetch('/api/errors', {
    //   method: 'POST',
    //   body: JSON.stringify(errorInfo)
    // });
  }
}
