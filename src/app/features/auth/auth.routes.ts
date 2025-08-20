import {Routes} from '@angular/router';
import {SelectContextComponent} from './select-context/select-context';
import {LoginFormComponent} from './login-form/login-form';

export const authRoutes: Routes = [
  {path: 'login', component: LoginFormComponent},
  {path: 'select-context', component: SelectContextComponent}
];
