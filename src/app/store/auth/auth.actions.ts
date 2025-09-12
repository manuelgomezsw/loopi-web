/**
 * Acciones de autenticación
 */

import { createAction, props } from '@ngrx/store';
import { LoginResponse } from '../../core/services/auth/auth-service';

// Login Actions
export const login = createAction('[Auth] Login', props<{ credentials: { email: string; password: string } }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ response: LoginResponse }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

// Context Selection Actions
export const selectContext = createAction(
  '[Auth] Select Context',
  props<{ context: { franchise_id: number; store_id: number } }>()
);

export const selectContextSuccess = createAction(
  '[Auth] Select Context Success',
  props<{ workContext: any; token: string }>()
);

export const selectContextFailure = createAction('[Auth] Select Context Failure', props<{ error: string }>());

// Token Management Actions
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; expiresIn: number }>()
);

export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure', props<{ error: string }>());

export const checkTokenExpiration = createAction('[Auth] Check Token Expiration');

export const tokenExpired = createAction('[Auth] Token Expired');

// Session Management Actions
export const loadStoredSession = createAction('[Auth] Load Stored Session');

export const sessionLoaded = createAction(
  '[Auth] Session Loaded',
  props<{ user: any; token: string; workContext: any }>()
);

export const sessionLoadFailure = createAction('[Auth] Session Load Failure');

export const clearAuthState = createAction('[Auth] Clear Auth State');

// User Actions
export const updateUser = createAction('[Auth] Update User', props<{ user: any }>());

export const updateUserSuccess = createAction('[Auth] Update User Success', props<{ user: any }>());

export const updateUserFailure = createAction('[Auth] Update User Failure', props<{ error: string }>());
