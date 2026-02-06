import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inventories',
        loadComponent: () => import('./inventories/inventory-list.component').then(m => m.InventoryListComponent)
      },
      {
        path: 'inventories/:inventoryID',
        loadComponent: () => import('./inventories/inventory-detail.component').then(m => m.InventoryDetailComponent)
      },
      {
        path: 'items',
        loadComponent: () => import('./items/item-list.component').then(m => m.ItemListComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./employees/employee-list.component').then(m => m.EmployeeListComponent)
      }
    ]
  }
];
