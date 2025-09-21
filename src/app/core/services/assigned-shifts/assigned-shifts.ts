import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AssignedShift } from '../../../model/assigned-shift';

export interface AssignedShiftRequest {
  user_id: number;
  shift_id: number;
  start_date: string; // ISO string format
  end_date: string; // ISO string format
}

export interface AssignedShiftResponse {
  id: number;
  user_id: number;
  shift_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class AssignedShiftsService {
  private apiUrl = `${environment.apiUrl}/assigned-shifts`;

  constructor(private http: HttpClient) {}

  create(assignmentData: AssignedShiftRequest): Observable<AssignedShiftResponse> {
    return this.http.post<AssignedShiftResponse>(this.apiUrl, assignmentData);
  }

  getAll(): Observable<AssignedShiftResponse[]> {
    return this.http.get<AssignedShiftResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<AssignedShiftResponse> {
    return this.http.get<AssignedShiftResponse>(`${this.apiUrl}/${id}`);
  }

  update(id: number, assignmentData: Partial<AssignedShiftRequest>): Observable<AssignedShiftResponse> {
    return this.http.put<AssignedShiftResponse>(`${this.apiUrl}/${id}`, assignmentData);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getByStoreAndMonth(storeId: number, year: number, month: number): Observable<AssignedShift[]> {
    return this.http.get<AssignedShift[]>(`${this.apiUrl}/store/${storeId}/month?year=${year}&month=${month}`);
  }

  updateAssignment(id: number, assignmentData: AssignedShiftRequest): Observable<AssignedShiftResponse> {
    return this.http.put<AssignedShiftResponse>(`${this.apiUrl}/${id}`, assignmentData);
  }
}
