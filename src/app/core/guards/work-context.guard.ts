import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

export const WorkContextGuard: CanActivateFn = () => {
  const router = inject(Router);
  const workContext = JSON.parse(localStorage.getItem('work-context') || '{}');

  const hasFranchise = !!workContext.franchiseID;
  const hasStore = !!workContext.storeID;

  if (hasFranchise && hasStore) {
    return true;
  }

  return router.parseUrl('/auth/select-context');
};
