import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { ROUTES } from '../constants/app.constants';

export const AuthGuard: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return router.createUrlTree([ROUTES.AUTH.LOGIN]);
      }
      return true;
    })
  );
};
