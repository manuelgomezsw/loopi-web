import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Store as StoreModel } from '../../../model/store';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private baseUrl = `${environment.apiUrl}/stores`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StoreModel[]> {
    return this.http.get<StoreModel[]>(`${this.baseUrl}`);
  }

  getById(storeID: number): Observable<StoreModel> {
    return this.http.get<StoreModel>(`${this.baseUrl}/${storeID}`);
  }

  getByFranchiseId(franchiseID: number): Observable<StoreModel[]> {
    return this.http.get<StoreModel[]>(`${this.baseUrl}/franchise/${franchiseID}`);
  }

  create(store: StoreModel): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/`, store);
  }
}
