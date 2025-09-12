import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TokenStorageService} from '../token-storage/token-storage.service';
import {WorkContextService} from '../work-context/work-context';

export interface LoginResponse {
  token: string;
  expiresIn?: number;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface ContextResponse {
  token: string;
  expiresIn?: number;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  private tokenStorage = inject(TokenStorageService);
  private workContextService = inject(WorkContextService);
  
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  /**
   * Realiza el login del usuario
   */
  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Almacenar token de forma segura
          this.tokenStorage.setToken(response.token, response.expiresIn);
        })
      );
  }

  /**
   * Selecciona el contexto de trabajo (franquicia/tienda)
   */
  selectContext(context: { franchise_id: number; store_id: number }): Observable<ContextResponse> {
    return this.http.post<ContextResponse>(`${this.baseUrl}/context`, context)
      .pipe(
        tap(response => {
          // Actualizar token con el contexto seleccionado
          this.tokenStorage.setToken(response.token, response.expiresIn);
        })
      );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    // Limpiar token
    this.tokenStorage.clearToken();
    
    // Limpiar contexto de trabajo
    this.workContextService.clear();

    // Opcional: notificar al backend sobre el logout
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
      error: () => {
        // Ignorar errores en logout - la limpieza local ya se hizo
      }
    });
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isLoggedIn(): boolean {
    return this.tokenStorage.hasValidToken();
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  /**
   * Verifica si el token expirará pronto
   */
  isTokenExpiringSoon(): boolean {
    return this.tokenStorage.isTokenExpiringSoon();
  }

  /**
   * Obtiene el tiempo restante del token en segundos
   */
  getTokenExpirationTime(): number | null {
    return this.tokenStorage.getTokenExpirationTime();
  }

  /**
   * Refresca el token actual (si el backend lo soporta)
   */
  refreshToken(): Observable<ContextResponse> {
    return this.http.post<ContextResponse>(`${this.baseUrl}/refresh`, {})
      .pipe(
        tap(response => {
          this.tokenStorage.setToken(response.token, response.expiresIn);
        })
      );
  }

  /**
   * Verifica si el usuario está autenticado y el token es válido
   */
  checkAuthStatus(): boolean {
    const isValid = this.isLoggedIn();
    
    if (!isValid) {
      // Limpiar cualquier dato residual
      this.logout();
    }
    
    return isValid;
  }
}
