/**
 * Estado de UI
 */

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
  loading: LoadingState;
  errors: ErrorState;
}

export const initialUIState: UIState = {
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
};
