import {Routes} from '@angular/router';
import {FranchiseFormComponent} from './franchises/form/form';
import {FranchiseListComponent} from './franchises/list/list';
import {StoreListComponent} from './stores/list/list';
import {StoreFormComponent} from './stores/form/form';

export const adminRoutes: Routes = [
  {path: 'franchises', component: FranchiseListComponent},
  {path: 'franchises/new', component: FranchiseFormComponent},
  {path: 'franchises/:id/edit', component: FranchiseFormComponent},
  {path: 'stores', component: StoreListComponent},
  {path: 'stores/new', component: StoreFormComponent},
  {path: 'stores/:id/edit', component: StoreFormComponent},
];
