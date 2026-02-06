import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { Employee, LoginRequest, LoginResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  private currentEmployee = signal<Employee | null>(null);

  readonly employee = this.currentEmployee.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentEmployee());
  readonly isAdmin = computed(() => this.currentEmployee()?.role === 'admin');
  readonly employeeName = computed(() => this.currentEmployee()?.name ?? '');

  constructor() {
    // Restore employee from storage on init
    const stored = this.storage.getEmployee();
    if (stored) {
      this.currentEmployee.set(stored);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.storage.setToken(response.token);
          this.storage.setEmployee(response.employee);
          this.currentEmployee.set(response.employee);
        })
      );
  }

  logout(): void {
    this.storage.clear();
    this.currentEmployee.set(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/employees/me`)
      .pipe(
        tap(employee => {
          this.storage.setEmployee(employee);
          this.currentEmployee.set(employee);
        })
      );
  }
}
