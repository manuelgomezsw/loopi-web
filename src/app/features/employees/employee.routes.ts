import { Routes } from '@angular/router';
import { EmployeeFormComponent } from './form/form';
import { EmployeeListComponent } from './list/list';

export const employeeRoutes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'new', component: EmployeeFormComponent },
  { path: ':id', component: EmployeeFormComponent }
];
