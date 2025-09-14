import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

// Registrar el locale español
registerLocaleData(localeEs, 'es-ES');

bootstrapApplication(App, appConfig).catch(err => console.error(err));
