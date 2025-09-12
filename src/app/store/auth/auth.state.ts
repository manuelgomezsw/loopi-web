/**
 * Estado de autenticación
 */

import { WorkContext } from '../../model/work-context';

export interface AuthState {
  user: any | null;
  token: string | null;
  workContext: WorkContext | null;
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
