import {Routes} from '@angular/router';
import {EmployeeListComponent} from './list/list';
import {EmployeeFormComponent} from './form/form';

export const employeeRoutes: Routes = [
  {path: '', component: EmployeeListComponent},
  {path: 'new', component: EmployeeFormComponent},
  {path: ':id/edit', component: EmployeeFormComponent},
];
