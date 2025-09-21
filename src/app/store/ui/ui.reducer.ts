/**
 * Reducer de UI
 */

import { createReducer, on } from '@ngrx/store';
import * as UIActions from './ui.actions';
import { UIState, initialUIState } from './ui.state';

export const uiReducer = createReducer(
  initialUIState,

  // Theme
  on(
    UIActions.setTheme,
    (state, { theme }): UIState => ({
      ...state,
      theme
    })
  ),

  // Sidebar
  on(
    UIActions.toggleSidebar,
    (state): UIState => ({
      ...state,
      sidebarOpen: !state.sidebarOpen
    })
  ),

  on(
    UIActions.setSidebarState,
    (state, { open }): UIState => ({
      ...state,
      sidebarOpen: open
    })
  ),

  // Language
  on(
    UIActions.setLanguage,
    (state, { language }): UIState => ({
      ...state,
      language
    })
  ),

  // Loading
  on(
    UIActions.setGlobalLoading,
    (state, { loading }): UIState => ({
      ...state,
      loading: {
        ...state.loading,
        global: loading
      }
    })
  ),

  on(
    UIActions.setComponentLoading,
    (state, { component, loading }): UIState => ({
      ...state,
      loading: {
        ...state.loading,
        components: {
          ...state.loading.components,
          [component]: loading
        }
      }
    })
  ),

  on(UIActions.clearComponentLoading, (state, { component }): UIState => {
    const newComponents = { ...state.loading.components };
    delete newComponents[component];

    return {
      ...state,
      loading: {
        ...state.loading,
        components: newComponents
      }
    };
  }),

  // Errors
  on(
    UIActions.setGlobalError,
    (state, { error }): UIState => ({
      ...state,
      errors: {
        ...state.errors,
        global: error
      }
    })
  ),

  on(
    UIActions.setComponentError,
    (state, { component, error }): UIState => ({
      ...state,
      errors: {
        ...state.errors,
        components: {
          ...state.errors.components,
          [component]: error
        }
      }
    })
  ),

  on(UIActions.clearComponentError, (state, { component }): UIState => {
    const newComponents = { ...state.errors.components };
    delete newComponents[component];

    return {
      ...state,
      errors: {
        ...state.errors,
        components: newComponents
      }
    };
  }),

  on(
    UIActions.clearAllErrors,
    (state): UIState => ({
      ...state,
      errors: {
        global: null,
        components: {}
      }
    })
  )
);
