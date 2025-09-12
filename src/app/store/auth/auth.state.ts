/**
 * Estado de autenticación
 */

export interface AuthState {
  user: any | null;
  token: string | null;
  workContext: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  workContext: null,
  isAuthenticated: false,
  loading: false,
  error: null
};
