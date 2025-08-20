import {Routes} from '@angular/router';
import {HomeComponent} from './features/home/home';

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
