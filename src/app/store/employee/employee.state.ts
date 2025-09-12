/**
 * Estado de empleados
 */

import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ApiMeta, EmployeeResponse, FilterState, SortState } from '../../core/interfaces/api.interfaces';

export interface EmployeeState extends EntityState<EmployeeResponse> {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  pagination: ApiMeta;
  filters: FilterState;
  sorting: SortState;
}

export const employeeAdapter: EntityAdapter<EmployeeResponse> = createEntityAdapter<EmployeeResponse>({
  selectId: (employee: EmployeeResponse) => employee.id,
  sortComparer: (a: EmployeeResponse, b: EmployeeResponse) => a.last_name.localeCompare(b.last_name)
});

export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  selectedId: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {},
  sorting: {
    field: 'last_name',
    direction: 'asc'
  }
});

// Entity selectors
export const {
  selectIds: selectEmployeeIds,
  selectEntities: selectEmployeeEntities,
  selectAll: selectAllEmployees,
  selectTotal: selectEmployeeTotal
} = employeeAdapter.getSelectors();
