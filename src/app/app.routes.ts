import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { MainLayoutComponent } from './shared/main-layout/main-layout';
import { AuthGuard } from './core/guards/auth.guard';
import { WorkContextGuard } from './core/guards/work-context.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard, WorkContextGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employees/employee.routes').then(e => e.employeeRoutes)
      },
      {
        path: 'shifts',
        loadChildren: () => import('./features/shifts/shift.routes').then(m => m.shiftRoutes)
      }
    ]
  }
];
