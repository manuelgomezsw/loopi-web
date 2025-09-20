/**
 * Utilidades para manejo de errores del backend
 */

import { HttpErrorResponse } from '@angular/common/http';

/**
 * Interface para la estructura de error del backend
 */
export interface BackendErrorResponse {
  error: string;
}

/**
 * Extrae el mensaje de error específico del backend
 * @param error - Error HTTP response del backend
 * @returns Mensaje de error específico o mensaje genérico si no se puede extraer
 */
export function extractBackendErrorMessage(error: HttpErrorResponse): string {
  // Verificar si el error tiene la estructura esperada del backend
  if (error.error && typeof error.error === 'object' && 'error' in error.error) {
    const backendError = error.error as BackendErrorResponse;
    return backendError.error;
  }

  // Fallback para otros formatos de error
  if (error.error && typeof error.error === 'string') {
    return error.error;
  }

  // Mensaje genérico basado en el status code
  return getGenericErrorMessage(error.status);
}

/**
 * Obtiene un mensaje genérico basado en el código de estado HTTP
 * @param status - Código de estado HTTP
 * @returns Mensaje genérico apropiado
 */
function getGenericErrorMessage(status: number): string {
  switch (status) {
    case 0:
      return 'Error de conexión. Verifica tu conexión a internet.';
    case 400:
      return 'Solicitud inválida. Verifica los datos enviados.';
    case 401:
      return 'No autorizado. Inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 409:
      return 'Conflicto con el estado actual del recurso.';
    case 422:
      return 'Datos de entrada inválidos.';
    case 429:
      return 'Demasiadas peticiones. Intenta más tarde.';
    case 500:
      return 'Error interno del servidor.';
    case 502:
      return 'Error de gateway. El servidor no está disponible.';
    case 503:
      return 'Servicio no disponible temporalmente.';
    case 504:
      return 'Tiempo de espera agotado.';
    default:
      return 'Ha ocurrido un error inesperado.';
  }
}

/**
 * Verifica si un error HTTP contiene un mensaje específico del backend
 * @param error - Error HTTP response
 * @returns true si contiene mensaje específico del backend
 */
export function hasBackendErrorMessage(error: HttpErrorResponse): boolean {
  return !!(
    error.error &&
    typeof error.error === 'object' &&
    'error' in error.error &&
    typeof error.error.error === 'string' &&
    error.error.error.trim().length > 0
  );
}

/**
 * Crea un manejador de error estándar que extrae mensajes del backend
 * @param fallbackMessage - Mensaje de fallback si no se puede extraer del backend
 * @returns Función que maneja el error y retorna el mensaje apropiado
 */
export function createBackendErrorHandler(fallbackMessage?: string) {
  return (error: HttpErrorResponse): string => {
    if (hasBackendErrorMessage(error)) {
      return extractBackendErrorMessage(error);
    }

    return fallbackMessage ?? getGenericErrorMessage(error.status);
  };
}
