import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { debugInterceptor } from './core/interceptors/debug.interceptor';

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
    }
  ]
};
