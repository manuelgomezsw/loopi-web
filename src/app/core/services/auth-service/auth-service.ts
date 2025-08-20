import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthService {
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('work-context');
  }
}
