/**
 * Reducer de Employee
 */

import { createReducer, on } from '@ngrx/store';
import * as EmployeeActions from './employee.actions';
import { EmployeeState, employeeAdapter, initialEmployeeState } from './employee.state';

export const employeeReducer = createReducer(
  initialEmployeeState,

  // Load Employees
  on(
    EmployeeActions.loadEmployees,
    (state): EmployeeState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    EmployeeActions.loadEmployeesSuccess,
    (state, { employees, meta }): EmployeeState =>
      employeeAdapter.setAll(employees, {
        ...state,
        loading: false,
        error: null,
        pagination: meta
      })
  ),

  on(
    EmployeeActions.loadEmployeesFailure,
    (state, { error }): EmployeeState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Load Single Employee
  on(
    EmployeeActions.loadEmployee,
    (state): EmployeeState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    EmployeeActions.loadEmployeeSuccess,
    (state, { employee }): EmployeeState =>
      employeeAdapter.upsertOne(employee, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(
    EmployeeActions.loadEmployeeFailure,
    (state, { error }): EmployeeState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Create Employee
  on(
    EmployeeActions.createEmployee,
    (state): EmployeeState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    EmployeeActions.createEmployeeSuccess,
    (state): EmployeeState => ({
      ...state,
      loading: false,
      error: null
    })
  ),

  on(
    EmployeeActions.createEmployeeFailure,
    (state, { error }): EmployeeState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Update Employee
  on(
    EmployeeActions.updateEmployee,
    (state): EmployeeState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    EmployeeActions.updateEmployeeSuccess,
    (state, { employee }): EmployeeState =>
      employeeAdapter.upsertOne(employee, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(
    EmployeeActions.updateEmployeeFailure,
    (state, { error }): EmployeeState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Delete Employee
  on(
    EmployeeActions.deleteEmployee,
    (state): EmployeeState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    EmployeeActions.deleteEmployeeSuccess,
    (state, { id }): EmployeeState =>
      employeeAdapter.removeOne(id, {
        ...state,
        loading: false,
        error: null
      })
  ),

  on(
    EmployeeActions.deleteEmployeeFailure,
    (state, { error }): EmployeeState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Selection
  on(
    EmployeeActions.selectEmployee,
    (state, { id }): EmployeeState => ({
      ...state,
      selectedId: id
    })
  ),

  // Filters and Pagination
  on(
    EmployeeActions.setEmployeeFilters,
    (state, { filters }): EmployeeState => ({
      ...state,
      filters: { ...state.filters, ...filters }
    })
  ),

  on(
    EmployeeActions.setEmployeeSorting,
    (state, { field, direction }): EmployeeState => ({
      ...state,
      sorting: { field, direction }
    })
  ),

  on(
    EmployeeActions.setEmployeePage,
    (state, { page }): EmployeeState => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: page
      }
    })
  ),

  // Clear Actions
  on(
    EmployeeActions.clearEmployees,
    (): EmployeeState => ({
      ...initialEmployeeState
    })
  ),

  on(
    EmployeeActions.clearEmployeeErrors,
    (state): EmployeeState => ({
      ...state,
      error: null
    })
  )
);
