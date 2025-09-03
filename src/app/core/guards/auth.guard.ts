import {inject} from '@angular/core';
import {CanActivateChildFn, Router} from '@angular/router';

export const AuthGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);

  const isLoggedIn = !!localStorage.getItem('token');

  if (!isLoggedIn) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
