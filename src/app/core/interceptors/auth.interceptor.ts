import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  // Obtener token de forma segura
  const token = tokenStorage.getToken();

  // Solo agregar token si existe y la request no es para auth
  if (token && !isAuthRequest(req)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

/**
 * Verifica si la request es para autenticación
 */
function isAuthRequest(req: HttpRequest<any>): boolean {
  return (
    req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/forgot-password')
  );
}
