/**
 * Selectores de Employee
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EmployeeState,
  selectAllEmployees,
  selectEmployeeEntities,
  selectEmployeeIds,
  selectEmployeeTotal
} from './employee.state';

// Feature selector
export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

// Entity selectors
export const selectAllEmployeesFromState = createSelector(selectEmployeeState, selectAllEmployees);

export const selectEmployeeEntitiesFromState = createSelector(selectEmployeeState, selectEmployeeEntities);

export const selectEmployeeIdsFromState = createSelector(selectEmployeeState, selectEmployeeIds);

export const selectEmployeeTotalFromState = createSelector(selectEmployeeState, selectEmployeeTotal);

// Basic selectors
export const selectEmployeeLoading = createSelector(selectEmployeeState, (state: EmployeeState) => state.loading);

export const selectEmployeeError = createSelector(selectEmployeeState, (state: EmployeeState) => state.error);

export const selectSelectedEmployeeId = createSelector(selectEmployeeState, (state: EmployeeState) => state.selectedId);

export const selectEmployeePagination = createSelector(selectEmployeeState, (state: EmployeeState) => state.pagination);

export const selectEmployeeFilters = createSelector(selectEmployeeState, (state: EmployeeState) => state.filters);

export const selectEmployeeSorting = createSelector(selectEmployeeState, (state: EmployeeState) => state.sorting);

// Composed selectors
export const selectSelectedEmployee = createSelector(
  selectEmployeeEntitiesFromState,
  selectSelectedEmployeeId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

export const selectEmployeeById = (id: number) =>
  createSelector(selectEmployeeEntitiesFromState, entities => entities[id] || null);

export const selectActiveEmployees = createSelector(selectAllEmployeesFromState, employees =>
  employees.filter(employee => employee.is_active === true)
);

export const selectEmployeesByStore = (storeId: number) =>
  createSelector(selectAllEmployeesFromState, employees => employees.filter(employee => employee.store_id === storeId));

export const selectEmployeesByPosition = (position: string) =>
  createSelector(selectAllEmployeesFromState, employees =>
    employees.filter(employee => employee.position === position)
  );

// Search and Filter selectors
export const selectFilteredEmployees = createSelector(
  selectAllEmployeesFromState,
  selectEmployeeFilters,
  (employees, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return employees;
    }

    return employees.filter(employee => {
      // Text search
      if (filters['search']) {
        const searchTerm = filters['search'].toLowerCase();
        const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
        const email = employee.email.toLowerCase();

        if (!fullName.includes(searchTerm) && !email.includes(searchTerm)) {
          return false;
        }
      }

      // Active filter
      if (filters['isActive'] !== undefined && employee.is_active !== filters['isActive']) {
        return false;
      }

      // Store filter
      if (filters['storeId'] && employee.store_id !== filters['storeId']) {
        return false;
      }

      // Position filter
      if (filters['position'] && employee.position !== filters['position']) {
        return false;
      }

      return true;
    });
  }
);

export const selectSortedEmployees = createSelector(
  selectFilteredEmployees,
  selectEmployeeSorting,
  (employees, sorting) => {
    if (!sorting.field) {
      return employees;
    }

    return [...employees].sort((a, b) => {
      const aValue = (a as any)[sorting.field];
      const bValue = (b as any)[sorting.field];

      if (aValue < bValue) {
        return sorting.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sorting.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
);

// Eliminar selector de departamentos ya que no existe en el nuevo modelo

export const selectEmployeePositions = createSelector(selectAllEmployeesFromState, employees => {
  const positions = new Set(employees.map(e => e.position));
  return Array.from(positions).sort();
});
