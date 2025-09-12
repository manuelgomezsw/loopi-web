/**
 * Estado de UI
 */

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
}

export interface LoadingState {
  global: boolean;
  components: Record<string, boolean>;
}

export interface ErrorState {
  global: string | null;
  components: Record<string, string>;
}

export interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  language: 'es' | 'en';
  notifications: NotificationItem[];
  loading: LoadingState;
  errors: ErrorState;
}

export const initialUIState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  language: 'es',
  notifications: [],
  loading: {
    global: false,
    components: {}
  },
  errors: {
    global: null,
    components: {}
  }
};
