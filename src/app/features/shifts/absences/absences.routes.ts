import { Routes } from '@angular/router';
import { AbsenceFormComponent } from './form/form';
import { AbsenceListComponent } from './list/list';

export const absencesRoutes: Routes = [
  { path: 'list', component: AbsenceListComponent },
  { path: 'new', component: AbsenceFormComponent },
  { path: ':id/edit', component: AbsenceFormComponent }
];
