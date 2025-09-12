/**
 * Acciones de Employee
 */

import { createAction, props } from '@ngrx/store';
import {
  ApiMeta,
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest,
  FilterRequest
} from '../../core/interfaces/api.interfaces';

// Load Actions
export const loadEmployees = createAction('[Employee] Load Employees', props<{ filters?: FilterRequest }>());

export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: EmployeeResponse[]; meta: ApiMeta }>()
);

export const loadEmployeesFailure = createAction('[Employee] Load Employees Failure', props<{ error: string }>());

// Load Single Employee
export const loadEmployee = createAction('[Employee] Load Employee', props<{ id: number }>());

export const loadEmployeeSuccess = createAction(
  '[Employee] Load Employee Success',
  props<{ employee: EmployeeResponse }>()
);

export const loadEmployeeFailure = createAction('[Employee] Load Employee Failure', props<{ error: string }>());

// Create Actions
export const createEmployee = createAction('[Employee] Create Employee', props<{ employee: EmployeeCreateRequest }>());

export const createEmployeeSuccess = createAction(
  '[Employee] Create Employee Success',
  props<{ employee: EmployeeResponse }>()
);

export const createEmployeeFailure = createAction('[Employee] Create Employee Failure', props<{ error: string }>());

// Update Actions
export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ id: number; changes: EmployeeUpdateRequest }>()
);

export const updateEmployeeSuccess = createAction(
  '[Employee] Update Employee Success',
  props<{ employee: EmployeeResponse }>()
);

export const updateEmployeeFailure = createAction('[Employee] Update Employee Failure', props<{ error: string }>());

// Delete Actions
export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ id: number }>());

export const deleteEmployeeSuccess = createAction('[Employee] Delete Employee Success', props<{ id: number }>());

export const deleteEmployeeFailure = createAction('[Employee] Delete Employee Failure', props<{ error: string }>());

// Selection Actions
export const selectEmployee = createAction('[Employee] Select Employee', props<{ id: number | null }>());

// Filter and Pagination Actions
export const setEmployeeFilters = createAction('[Employee] Set Filters', props<{ filters: any }>());

export const setEmployeeSorting = createAction(
  '[Employee] Set Sorting',
  props<{ field: string; direction: 'asc' | 'desc' }>()
);

export const setEmployeePage = createAction('[Employee] Set Page', props<{ page: number }>());

// Clear Actions
export const clearEmployees = createAction('[Employee] Clear Employees');

export const clearEmployeeErrors = createAction('[Employee] Clear Errors');
