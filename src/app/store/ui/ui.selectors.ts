/**
 * Selectores de UI
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UIState } from './ui.state';

// Feature selector
export const selectUIState = createFeatureSelector<UIState>('ui');

// Theme selectors
export const selectTheme = createSelector(selectUIState, (state: UIState) => state.theme);

// Sidebar selectors
export const selectSidebarOpen = createSelector(selectUIState, (state: UIState) => state.sidebarOpen);

// Language selectors
export const selectLanguage = createSelector(selectUIState, (state: UIState) => state.language);

// Loading selectors
export const selectGlobalLoading = createSelector(selectUIState, (state: UIState) => state.loading.global);

export const selectComponentLoading = (component: string) =>
  createSelector(selectUIState, (state: UIState) => state.loading.components[component] || false);

export const selectAnyLoading = createSelector(
  selectUIState,
  (state: UIState) => state.loading.global || Object.values(state.loading.components).some(loading => loading)
);

// Error selectors
export const selectGlobalError = createSelector(selectUIState, (state: UIState) => state.errors.global);

export const selectComponentError = (component: string) =>
  createSelector(selectUIState, (state: UIState) => state.errors.components[component] || null);

export const selectHasErrors = createSelector(
  selectUIState,
  (state: UIState) => !!state.errors.global || Object.keys(state.errors.components).length > 0
);

export const selectAllErrors = createSelector(selectUIState, (state: UIState) => {
  const errors: string[] = [];
  if (state.errors.global) {
    errors.push(state.errors.global);
  }
  errors.push(...Object.values(state.errors.components));
  return errors;
});

// Combined selectors
export const selectUIStatus = createSelector(
  selectGlobalLoading,
  selectGlobalError,
  selectAnyLoading,
  selectHasErrors,
  (globalLoading, globalError, anyLoading, hasErrors) => ({
    globalLoading,
    globalError,
    anyLoading,
    hasErrors,
    isReady: !globalLoading && !globalError
  })
);
