/**
 * Estado global de la aplicación
 */

import { AbsenceState } from './absence/absence.state';
import { AuthState } from './auth/auth.state';
import { EmployeeState } from './employee/employee.state';
import { ShiftState } from './shift/shift.state';
import { UIState } from './ui/ui.state';

export interface AppState {
  auth: AuthState;
  employees: EmployeeState;
  shifts: ShiftState;
  absences: AbsenceState;
  ui: UIState;
}

export const initialAppState: AppState = {
  auth: {
    user: null,
    token: null,
    workContext: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  employees: {
    entities: {},
    ids: [],
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
      field: 'lastName',
      direction: 'asc'
    }
  },
  shifts: {
    entities: {},
    ids: [],
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
    planning: {
      currentDate: new Date().toISOString().split('T')[0],
      shifts: [],
      coverage: [],
      loading: false,
      error: null
    }
  },
  absences: {
    entities: {},
    ids: [],
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
    pendingApprovals: [],
    pendingApprovalsLoading: false
  },
  ui: {
    theme: 'light',
    sidebarOpen: true,
    language: 'es',
    loading: {
      global: false,
      components: {}
    },
    errors: {
      global: null,
      components: {}
    }
  }
};
