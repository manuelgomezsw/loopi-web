/**
 * Estado de turnos
 */

import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { CoverageInfo, ShiftResponse } from '../../core/interfaces/api.interfaces';

export interface ShiftPlanningState {
  currentDate: string;
  shifts: ShiftResponse[];
  coverage: CoverageInfo[];
  loading: boolean;
  error: string | null;
}

export interface ShiftState extends EntityState<ShiftResponse> {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  planning: ShiftPlanningState;
}

export const shiftAdapter: EntityAdapter<ShiftResponse> = createEntityAdapter<ShiftResponse>({
  selectId: (shift: ShiftResponse) => shift.id,
  sortComparer: (a: ShiftResponse, b: ShiftResponse) => {
    // Ordenar por fecha y luego por hora de inicio
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  }
});

export const initialShiftState: ShiftState = shiftAdapter.getInitialState({
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
});

export const {
  selectIds: selectShiftIds,
  selectEntities: selectShiftEntities,
  selectAll: selectAllShifts,
  selectTotal: selectShiftTotal
} = shiftAdapter.getSelectors();
