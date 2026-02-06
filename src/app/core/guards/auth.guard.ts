import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (storage.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (!storage.isLoggedIn()) {
    return true;
  }

  // Redirect based on role
  const employee = storage.getEmployee();
  if (employee?.role === 'admin') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/inventory']);
  }
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  // Non-admin users go to employee home
  router.navigate(['/inventory']);
  return false;
};

export const employeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Both admin and employee can access employee routes
  // But if admin, they might want to go to admin area instead
  // For now, allow both
  return true;
};
