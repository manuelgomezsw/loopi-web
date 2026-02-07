import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';
const EMPLOYEE_KEY = 'employee';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  setEmployee(employee: any): void {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employee));
  }

  getEmployee(): any | null {
    const data = localStorage.getItem(EMPLOYEE_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeEmployee(): void {
    localStorage.removeItem(EMPLOYEE_KEY);
  }

  clear(): void {
    this.removeToken();
    this.removeEmployee();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
