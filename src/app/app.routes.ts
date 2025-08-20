import {Routes} from '@angular/router';
import {HomeComponent} from './features/home/home';
import {authRoutes} from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes)
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employee.routes').then((e) => e.employeeRoutes)
  },
  {
    path: 'shifts',
    loadChildren: () => import('./features/shifts/shift.routes').then((m) => m.shiftRoutes)
  }
];
