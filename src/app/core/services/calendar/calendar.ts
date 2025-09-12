import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MonthSummary } from '../../../model/month-summary';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/calendar`;

  constructor(private http: HttpClient) {}

  getMonthSummary(year: number, month: number): Observable<MonthSummary> {
    return this.http.get<MonthSummary>(`${this.apiUrl}/month-summary?year=${year}&month=${month}`);
  }
}
