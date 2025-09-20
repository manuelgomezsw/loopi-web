/**
 * Effects de Employee
 */

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { EmployeeResponse } from '../../core/interfaces/api.interfaces';
import { EmployeeService } from '../../core/services/employee/employee';
import { NotificationService } from '../../core/services/notification/notification.service';
import { extractBackendErrorMessage } from '../../core/utils/error-handler.utils';
import { AppState } from '../app.state';
import * as AuthActions from '../auth/auth.actions';
import { selectCurrentStore } from '../auth/auth.selectors';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);

  // Load Employees Effect - Connected to real API
  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      withLatestFrom(this.store.select(selectCurrentStore)),
      switchMap(([_action, currentStore]) => {
        // Verificar que hay una tienda seleccionada
        if (!currentStore?.id) {
          return of(
            EmployeeActions.loadEmployeesFailure({
              error: 'No hay tienda seleccionada. Por favor, selecciona una tienda.'
            })
          );
        }

        // Llamada real al API usando el storeId del contexto actual
        return this.employeeService.getByStore(currentStore.id).pipe(
          map(employees => {
            // Crear meta data básico (el API podría devolver esto en el futuro)
            const meta = {
              currentPage: 1,
              totalPages: 1,
              totalItems: employees.length,
              itemsPerPage: employees.length,
              hasNextPage: false,
              hasPreviousPage: false
            };

            return EmployeeActions.loadEmployeesSuccess({
              employees,
              meta
            });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = extractBackendErrorMessage(error);
            return of(EmployeeActions.loadEmployeesFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  // Create Employee Effect
  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      switchMap(action => {
        return this.employeeService.create(action.employee).pipe(
          map(response => {
            // El backend solo devuelve {"message": "Employee created"}
            console.warn('✅ Employee created successfully:', response);
            this.notificationService.success('Empleado creado correctamente');

            // No intentamos agregar el empleado al estado, solo marcamos como exitoso
            // El efecto reloadEmployeesAfterCreate$ se encargará de recargar la lista
            return EmployeeActions.createEmployeeSuccess({ employee: {} as EmployeeResponse });
          }),
          catchError(error => {
            // Log detallado del error
            console.error('❌ Error creating employee:', error);
            console.error('Error details:', {
              status: error.status,
              statusText: error.statusText,
              message: error.error?.message,
              errors: error.error?.errors,
              fullError: error.error
            });

            const errorMessage = extractBackendErrorMessage(error);
            this.notificationService.error(errorMessage);
            return of(EmployeeActions.createEmployeeFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  // Update Employee Effect
  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      switchMap(action =>
        this.employeeService.update(action.id, action.changes).pipe(
          map(response => {
            this.notificationService.success('Empleado actualizado correctamente');
            return EmployeeActions.updateEmployeeSuccess({ employee: response.data });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = extractBackendErrorMessage(error);
            this.notificationService.error(errorMessage);
            return of(EmployeeActions.updateEmployeeFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Delete Employee Effect
  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      switchMap(action =>
        this.employeeService.delete(action.id).pipe(
          map(() => {
            // Backend responde con status 204 y body vacío
            console.warn('✅ Employee deleted successfully');
            this.notificationService.success('Empleado eliminado correctamente');
            return EmployeeActions.deleteEmployeeSuccess({ id: action.id });
          }),
          catchError((error: HttpErrorResponse) => {
            // Backend responde con 4xx-5xx y { "error": "mensaje" }
            console.error('❌ Error deleting employee:', error);
            const errorMessage = extractBackendErrorMessage(error);
            this.notificationService.error(errorMessage);
            return of(EmployeeActions.deleteEmployeeFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Reload employees after successful deletion
  reloadEmployeesAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployeeSuccess),
      map(() => EmployeeActions.loadEmployees({}))
    )
  );

  // Load Employee by ID Effect
  loadEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployee),
      switchMap(action =>
        this.employeeService.getById(action.id).pipe(
          map(employee => EmployeeActions.loadEmployeeSuccess({ employee })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = extractBackendErrorMessage(error);
            return of(EmployeeActions.loadEmployeeFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Auto-load employees when context is selected
  loadEmployeesOnContextChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.selectContextSuccess),
      map(() => EmployeeActions.loadEmployees({}))
    )
  );

  // Reload employees after successful creation
  reloadEmployeesAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployeeSuccess),
      map(() => EmployeeActions.loadEmployees({}))
    )
  );

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
