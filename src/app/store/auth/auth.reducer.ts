/**
 * Reducer de autenticación
 */

import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(
    AuthActions.login,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.loginSuccess,
    (state, { response }): AuthState => ({
      ...state,
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error
    })
  ),

  // Logout
  on(
    AuthActions.logout,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.logoutSuccess,
    (): AuthState => ({
      ...initialAuthState
    })
  ),

  on(
    AuthActions.logoutFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Context Selection
  on(
    AuthActions.selectContext,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.selectContextSuccess,
    (state, { workContext, token }): AuthState => ({
      ...state,
      workContext,
      token,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.selectContextFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error
    })
  ),

  // Token Management
  on(
    AuthActions.refreshToken,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.refreshTokenSuccess,
    (state, { token }): AuthState => ({
      ...state,
      token,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.refreshTokenFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error
    })
  ),

  on(
    AuthActions.tokenExpired,
    (): AuthState => ({
      ...initialAuthState
    })
  ),

  // Session Management
  on(
    AuthActions.loadStoredSession,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.sessionLoaded,
    (state, { user, token, workContext }): AuthState => ({
      ...state,
      user,
      token,
      workContext,
      isAuthenticated: true,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.sessionLoadFailure,
    (state): AuthState => ({
      ...state,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.clearAuthState,
    (): AuthState => ({
      ...initialAuthState
    })
  ),

  // User Updates
  on(
    AuthActions.updateUser,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null
    })
  ),

  on(
    AuthActions.updateUserSuccess,
    (state, { user }): AuthState => ({
      ...state,
      user,
      loading: false,
      error: null
    })
  ),

  on(
    AuthActions.updateUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error
    })
  )
);
