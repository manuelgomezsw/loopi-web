import {Routes} from '@angular/router';
import {ShiftPlanningComponent} from './planning/planning';
import {ShiftFormComponent} from './planning/shift-form/shift-form';

export const shiftRoutes: Routes = [
  {path: '', component: ShiftPlanningComponent},
  {path: 'assign', component: ShiftFormComponent},
  {
    path: 'absence',
    loadChildren: () => import('./absences/absences.routes').then(m => m.absencesRoutes)
  },
  {
    path: 'config',
    loadChildren: () => import('./config/shift.config.routes').then((m) => m.shiftConfigRoutes)
  }
];
