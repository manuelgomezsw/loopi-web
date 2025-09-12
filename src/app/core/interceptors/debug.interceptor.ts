import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DebugService } from '../services/debug/debug.service';

export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  const debugService = inject(DebugService);

  if (!environment.enableDebugMode) {
    return next(req);
  }

  const startTime = performance.now();
  const requestId = generateRequestId();

  // Log de request saliente
  debugService.debug('HTTP:Request', `${req.method} ${req.url}`, {
    requestId,
    method: req.method,
    url: req.url,
    headers: getLoggableHeaders(req),
    body: getLoggableBody(req)
  });

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const duration = performance.now() - startTime;

          // Log de response exitosa
          debugService.debug('HTTP:Response', `${req.method} ${req.url} - ${event.status}`, {
            requestId,
            method: req.method,
            url: req.url,
            status: event.status,
            statusText: event.statusText,
            duration: `${duration.toFixed(2)}ms`,
            headers: getLoggableResponseHeaders(event),
            bodySize: getResponseSize(event)
          });

          // Log de performance si es lenta
          if (duration > 1000) {
            debugService.warn('HTTP:Performance', `Slow request detected: ${req.method} ${req.url}`, {
              requestId,
              duration: `${duration.toFixed(2)}ms`,
              threshold: '1000ms'
            });
          }
        }
      },
      error: error => {
        const duration = performance.now() - startTime;

        if (error instanceof HttpErrorResponse) {
          // Log de error HTTP
          debugService.error('HTTP:Error', `${req.method} ${req.url} - ${error.status}`, {
            requestId,
            method: req.method,
            url: req.url,
            status: error.status,
            statusText: error.statusText,
            duration: `${duration.toFixed(2)}ms`,
            errorMessage: error.message,
            errorBody: error.error
          });
        } else {
          // Log de error de red u otro tipo
          debugService.error('HTTP:NetworkError', `${req.method} ${req.url} - Network Error`, {
            requestId,
            method: req.method,
            url: req.url,
            duration: `${duration.toFixed(2)}ms`,
            error: error.message || 'Unknown network error'
          });
        }
      }
    })
  );
};

/**
 * Genera un ID único para la request
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene headers seguros para logging (sin información sensible)
 */
function getLoggableHeaders(req: HttpRequest<any>): Record<string, string> {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
  const headers: Record<string, string> = {};

  req.headers.keys().forEach(key => {
    const lowerKey = key.toLowerCase();
    if (!sensitiveHeaders.includes(lowerKey)) {
      headers[key] = req.headers.get(key) || '';
    } else {
      headers[key] = '[REDACTED]';
    }
  });

  return headers;
}

/**
 * Obtiene el body de forma segura para logging
 */
function getLoggableBody(req: HttpRequest<any>): any {
  if (!req.body) return null;

  // Si es un objeto, filtrar campos sensibles
  if (typeof req.body === 'object') {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential'];
    const safebody = { ...req.body };

    sensitiveFields.forEach(field => {
      if (safebody[field]) {
        safebody[field] = '[REDACTED]';
      }
    });

    return safebody;
  }

  // Para otros tipos, no loggear si podría contener info sensible
  if (typeof req.body === 'string' && req.body.length > 1000) {
    return '[LARGE_BODY]';
  }

  return req.body;
}

/**
 * Obtiene headers de response seguros para logging
 */
function getLoggableResponseHeaders(response: HttpResponse<any>): Record<string, string> {
  const headers: Record<string, string> = {};

  response.headers.keys().forEach(key => {
    headers[key] = response.headers.get(key) || '';
  });

  return headers;
}

/**
 * Calcula el tamaño aproximado de la response
 */
function getResponseSize(response: HttpResponse<any>): string {
  if (!response.body) return '0 B';

  const size = JSON.stringify(response.body).length;

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}
