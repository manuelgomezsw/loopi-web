/**
 * Effects de autenticación
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';

import { ROUTES } from '../../core/constants/app.constants';
import { AuthService } from '../../core/services/auth/auth-service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { TokenStorageService } from '../../core/services/token-storage/token-storage.service';
import { WorkContextService } from '../../core/services/work-context/work-context';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private workContextService: WorkContextService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => {
            // El AuthService ya almacena el token
            return AuthActions.loginSuccess({ response });
          }),
          catchError(error => {
            const errorMessage = error.error?.message || 'Error de autenticación';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Login Success Effect
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        this.notificationService.success('Inicio de sesión exitoso');
        this.router.navigate([ROUTES.AUTH.SELECT_CONTEXT]);
      })
    ),
    { dispatch: false }
  );

  // Login Failure Effect
  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        this.notificationService.error(error);
      })
    ),
    { dispatch: false }
  );

  // Select Context Effect
  selectContext$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.selectContext),
      exhaustMap(action =>
        this.authService.selectContext(action.context).pipe(
          map(response => {
            // Crear el work context compatible con la interfaz existente
            const workContext = {
              franchiseID: action.context.franchise_id,
              storeID: action.context.store_id,
              franchiseName: '', // Se debe obtener del response o servicio
              storeName: '' // Se debe obtener del response o servicio
            };

            // Almacenar en el servicio
            this.workContextService.set(workContext);

            return AuthActions.selectContextSuccess({
              workContext,
              token: response.token
            });
          }),
          catchError(error => {
            const errorMessage = error.error?.message || 'Error al seleccionar contexto';
            return of(AuthActions.selectContextFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Select Context Success Effect
  selectContextSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.selectContextSuccess),
      tap(() => {
        this.notificationService.success('Contexto seleccionado correctamente');
        this.router.navigate([ROUTES.HOME]);
      })
    ),
    { dispatch: false }
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        of(this.authService.logout()).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => {
            const errorMessage = error.error?.message || 'Error durante el logout';
            return of(AuthActions.logoutFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Logout Success Effect
  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.notificationService.info('Sesión cerrada correctamente');
        this.router.navigate([ROUTES.AUTH.LOGIN]);
      })
    ),
    { dispatch: false }
  );

  // Refresh Token Effect
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(response => AuthActions.refreshTokenSuccess({
            token: response.token,
            expiresIn: response.expiresIn || 3600
          })),
          catchError(() =>
            of(AuthActions.tokenExpired())
          )
        )
      )
    )
  );

  // Token Expired Effect
  tokenExpired$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.tokenExpired),
      tap(() => {
        this.notificationService.sessionExpired();
        this.router.navigate([ROUTES.AUTH.LOGIN]);
      })
    ),
    { dispatch: false }
  );

  // Load Stored Session Effect
  loadStoredSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadStoredSession),
      switchMap(() => {
        const token = this.tokenStorage.getToken();
        const workContext = this.workContextService.get();

        if (token && this.tokenStorage.hasValidToken()) {
          // Simular user info - en un caso real se obtendría del token o API
          const user = {
            id: 1,
            email: 'user@example.com',
            name: 'Usuario Prueba'
          };

          return of(AuthActions.sessionLoaded({ user, token, workContext }));
        } else {
          return of(AuthActions.sessionLoadFailure());
        }
      }),
      catchError(() => of(AuthActions.sessionLoadFailure()))
    )
  );

  // Session Load Failure Effect
  sessionLoadFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sessionLoadFailure),
      tap(() => {
        // Limpiar cualquier dato residual
        this.tokenStorage.clearToken();
        this.workContextService.clear();
      })
    ),
    { dispatch: false }
  );
}
