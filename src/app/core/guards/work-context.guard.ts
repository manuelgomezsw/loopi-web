import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {WorkContextService} from '../services/work-context/work-context';

export const WorkContextGuard: CanActivateFn = () => {
  const router = inject(Router);
  const contextService = inject(WorkContextService);

  const context = contextService.get(); // o contextService.context() si usás signal

  const hasContext = context?.franchiseId && context?.storeId;

  if (!hasContext) {
    return router.createUrlTree(['/auth/select-context']);
  }

  return true;
};
