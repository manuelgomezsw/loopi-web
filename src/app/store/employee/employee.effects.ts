/**
 * Effects de Employee
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, tap } from 'rxjs/operators';

// import { EmployeeService } from '../../core/services/employee/employee';
import { NotificationService } from '../../core/services/notification/notification.service';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  // private employeeService = inject(EmployeeService); // TODO: Uncomment when EmployeeService is available
  private notificationService = inject(NotificationService);

  // Load Employees Effect (placeholder - requires EmployeeService implementation)
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      exhaustMap(action => {
        // TODO: Implement actual service call when EmployeeService is available
        // For now, return mock data
        const mockEmployees = [
          {
            id: 1,
            employeeNumber: 'EMP001',
            firstName: 'Juan',
            lastName: 'Pérez',
            fullName: 'Juan Pérez',
            email: 'juan.perez@empresa.com',
            phone: '123456789',
            position: 'Vendedor',
            department: 'Ventas',
            status: 'ACTIVE' as any,
            type: 'FULL_TIME' as any,
            hireDate: '2023-01-15',
            storeId: 1,
            store: {
              id: 1,
              name: 'Tienda Central',
              code: 'TC001',
              address: 'Av. Principal 123',
              phone: '987654321',
              email: 'central@empresa.com',
              franchiseId: 1,
              franchise: {
                id: 1,
                name: 'Franquicia Principal',
                code: 'FP001',
                isActive: true,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
              },
              isActive: true,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            },
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2023-01-15T00:00:00Z'
          }
        ];

        return of(
          EmployeeActions.loadEmployeesSuccess({
            employees: mockEmployees,
            meta: {
              currentPage: 1,
              totalPages: 1,
              totalItems: 1,
              itemsPerPage: 10,
              hasNextPage: false,
              hasPreviousPage: false
            }
          })
        );
      })
    )
  );

  // Placeholder effects - will be implemented when EmployeeService is available
  // TODO: Implement these effects when service is ready

  // Error Handling Effect
  loadEmployeesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EmployeeActions.loadEmployeesFailure),
        tap(({ error }) => {
          this.notificationService.error(error);
        })
      ),
    { dispatch: false }
  );
}
