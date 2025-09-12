import {inject} from '@angular/core';
import {CanActivateChildFn, Router} from '@angular/router';
import {AuthService} from '../services/auth/auth-service';

export const AuthGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificar autenticación usando el nuevo servicio
  const isAuthenticated = authService.checkAuthStatus();

  if (!isAuthenticated) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
