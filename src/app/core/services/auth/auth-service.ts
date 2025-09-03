import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
  }

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials);
  }

  selectContext(context: { franchise_id: number; store_id: number }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/context`, context);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('work-context');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
