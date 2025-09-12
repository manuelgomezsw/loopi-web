import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { selectHasWorkContext } from '../../store/auth/auth.selectors';
import { ROUTES } from '../constants/app.constants';

export const WorkContextGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return store.select(selectHasWorkContext).pipe(
    take(1),
    map(hasWorkContext => {
      if (!hasWorkContext) {
        return router.parseUrl(ROUTES.AUTH.SELECT_CONTEXT);
      }
      return true;
    })
  );
};
