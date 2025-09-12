import { Routes } from '@angular/router';
import { ShiftConfigFormComponent } from './form/form';
import { ShiftConfigListComponent } from './list/list';

export const shiftConfigRoutes: Routes = [
  { path: 'list', component: ShiftConfigListComponent },
  { path: 'new', component: ShiftConfigFormComponent },
  { path: ':id/edit', component: ShiftConfigFormComponent }
];
