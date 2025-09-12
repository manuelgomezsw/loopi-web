import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Franchise } from '../../../model/franchise';

@Injectable({ providedIn: 'root' })
export class FranchiseService {
  private baseUrl = `${environment.apiUrl}/franchises`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Franchise[]> {
    return this.http.get<Franchise[]>(`${this.baseUrl}`);
  }

  getById(franchiseID: number): Observable<Franchise> {
    return this.http.get<Franchise>(`${this.baseUrl}/${franchiseID}`);
  }

  create(franchise: Franchise): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/`, franchise);
  }
}
