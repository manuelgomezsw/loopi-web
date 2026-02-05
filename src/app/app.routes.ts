import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/inventory/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'inventory',
    canActivate: [authGuard],
    children: [
      {
        path: 'schedule',
        loadComponent: () => import('./features/inventory/schedule-select/schedule-select.component').then(m => m.ScheduleSelectComponent)
      },
      {
        path: ':id/item',
        loadComponent: () => import('./features/inventory/item-entry/item-entry.component').then(m => m.ItemEntryComponent)
      },
      {
        path: ':id/review',
        loadComponent: () => import('./features/inventory/discrepancy-review/discrepancy-review.component').then(m => m.DiscrepancyReviewComponent)
      },
      {
        path: ':id/sales',
        loadComponent: () => import('./features/inventory/sales-entry/sales-entry.component').then(m => m.SalesEntryComponent)
      },
      {
        path: ':id/summary',
        loadComponent: () => import('./features/inventory/summary/summary.component').then(m => m.SummaryComponent)
      },
      {
        path: ':id/confirmation',
        loadComponent: () => import('./features/inventory/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
