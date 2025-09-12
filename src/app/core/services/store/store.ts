import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private baseUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}`);
  }

  getById(storeID: number): Observable<Store> {
    return this.http.get<Store>(`${this.baseUrl}/${storeID}`);
  }

  getByFranchiseId(franchiseID: number): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseUrl}/franchise/${franchiseID}`);
  }

  create(store: Store): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/`, store);
  }
}
