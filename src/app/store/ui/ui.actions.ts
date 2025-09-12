/**
 * Acciones de UI
 */

import { createAction, props } from '@ngrx/store';
import { NotificationItem } from './ui.state';

// Theme Actions
export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: 'light' | 'dark' | 'auto' }>()
);

// Sidebar Actions
export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const setSidebarState = createAction(
  '[UI] Set Sidebar State',
  props<{ open: boolean }>()
);

// Language Actions
export const setLanguage = createAction(
  '[UI] Set Language',
  props<{ language: 'es' | 'en' }>()
);

// Notification Actions
export const addNotification = createAction(
  '[UI] Add Notification',
  props<{ notification: Omit<NotificationItem, 'id' | 'timestamp'> }>()
);

export const removeNotification = createAction(
  '[UI] Remove Notification',
  props<{ id: string }>()
);

export const clearAllNotifications = createAction('[UI] Clear All Notifications');

// Loading Actions
export const setGlobalLoading = createAction(
  '[UI] Set Global Loading',
  props<{ loading: boolean }>()
);

export const setComponentLoading = createAction(
  '[UI] Set Component Loading',
  props<{ component: string; loading: boolean }>()
);

export const clearComponentLoading = createAction(
  '[UI] Clear Component Loading',
  props<{ component: string }>()
);

// Error Actions
export const setGlobalError = createAction(
  '[UI] Set Global Error',
  props<{ error: string | null }>()
);

export const setComponentError = createAction(
  '[UI] Set Component Error',
  props<{ component: string; error: string }>()
);

export const clearComponentError = createAction(
  '[UI] Clear Component Error',
  props<{ component: string }>()
);

export const clearAllErrors = createAction('[UI] Clear All Errors');
