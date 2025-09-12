/**
 * Selectores de autenticación
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectToken = createSelector(selectAuthState, (state: AuthState) => state.token);

export const selectWorkContext = createSelector(selectAuthState, (state: AuthState) => state.workContext);

export const selectIsAuthenticated = createSelector(selectAuthState, (state: AuthState) => state.isAuthenticated);

export const selectAuthLoading = createSelector(selectAuthState, (state: AuthState) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);

// Composed selectors
export const selectUserRole = createSelector(selectUser, user => user?.role ?? null);

export const selectUserPermissions = createSelector(selectUser, user => user?.permissions ?? []);

export const selectUserFullName = createSelector(selectUser, user => user?.fullName ?? '');

export const selectCurrentFranchise = createSelector(selectWorkContext, workContext =>
  workContext
    ? {
        id: workContext.franchiseId,
        name: workContext.franchiseName
      }
    : null
);

export const selectCurrentStore = createSelector(selectWorkContext, workContext =>
  workContext
    ? {
        id: workContext.storeId,
        name: workContext.storeName
      }
    : null
);

export const selectWorkContextPermissions = createSelector(
  selectWorkContext,
  workContext => workContext?.permissions ?? []
);

export const selectHasWorkContext = createSelector(selectWorkContext, workContext => !!workContext);

export const selectIsUserInRole = (role: string) => createSelector(selectUserRole, userRole => userRole === role);

export const selectHasPermission = (permission: string) =>
  createSelector(
    selectUserPermissions,
    selectWorkContextPermissions,
    (userPermissions, contextPermissions) =>
      userPermissions.includes(permission) ?? contextPermissions.includes(permission)
  );

export const selectHasAnyPermission = (permissions: string[]) =>
  createSelector(selectUserPermissions, selectWorkContextPermissions, (userPermissions, contextPermissions) => {
    const allPermissions = [...userPermissions, ...contextPermissions];
    return permissions.some(permission => allPermissions.includes(permission));
  });

export const selectAuthenticationStatus = createSelector(
  selectIsAuthenticated,
  selectHasWorkContext,
  selectAuthLoading,
  selectAuthError,
  (isAuthenticated, hasWorkContext, loading, error) => ({
    isAuthenticated,
    hasWorkContext,
    loading,
    error,
    isFullyAuthenticated: isAuthenticated && hasWorkContext
  })
);

export const selectCanAccessRoute = (requiredPermissions: string[]) =>
  createSelector(
    selectIsAuthenticated,
    selectHasWorkContext,
    selectUserPermissions,
    selectWorkContextPermissions,
    (isAuthenticated, hasWorkContext, userPermissions, contextPermissions) => {
      if (!isAuthenticated || !hasWorkContext) {
        return false;
      }

      if (requiredPermissions.length === 0) {
        return true;
      }

      const allPermissions = [...userPermissions, ...contextPermissions];
      return requiredPermissions.every(permission => allPermissions.includes(permission));
    }
  );
