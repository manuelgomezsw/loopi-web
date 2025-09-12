/**
 * Estado de ausencias
 */

import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { AbsenceResponse, ApiMeta } from '../../core/interfaces/api.interfaces';

export interface AbsenceState extends EntityState<AbsenceResponse> {
  selectedId: number | null;
  loading: boolean;
  error: string | null;
  pagination: ApiMeta;
  pendingApprovals: AbsenceResponse[];
  pendingApprovalsLoading: boolean;
}

export const absenceAdapter: EntityAdapter<AbsenceResponse> = createEntityAdapter<AbsenceResponse>({
  selectId: (absence: AbsenceResponse) => absence.id,
  sortComparer: (a: AbsenceResponse, b: AbsenceResponse) => {
    // Ordenar por fecha de creación (más recientes primero)
    return b.createdAt.localeCompare(a.createdAt);
  }
});

export const initialAbsenceState: AbsenceState = absenceAdapter.getInitialState({
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
});

export const {
  selectIds: selectAbsenceIds,
  selectEntities: selectAbsenceEntities,
  selectAll: selectAllAbsences,
  selectTotal: selectAbsenceTotal
} = absenceAdapter.getSelectors();
