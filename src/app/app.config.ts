import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { debugInterceptor } from './core/interceptors/debug.interceptor';

// NgRx
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { EmployeeEffects } from './store/employee/employee.effects';
import { employeeReducer } from './store/employee/employee.reducer';
import { uiReducer } from './store/ui/ui.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor,
      ...(environment.enableDebugMode ? [debugInterceptor] : [])
    ])),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },

    // NgRx Store
    provideStore({
      auth: authReducer,
      employees: employeeReducer,
      ui: uiReducer
    }),

    // NgRx Effects
    provideEffects([AuthEffects, EmployeeEffects]),

    // NgRx Router Store
    provideRouterStore(),

    // NgRx DevTools (solo en desarrollo)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
      name: 'Loopi Web DevTools'
    })
  ]
};
