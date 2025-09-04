import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {Shift} from '../../../model/shift';

@Injectable({ providedIn: 'root' })
export class ShiftService {
  private apiUrl = `${environment.apiUrl}/shifts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  getById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.apiUrl}?id=${id}`);
  }

  create(shift: Shift): Observable<any> {
    return this.http.post(this.apiUrl, shift);
  }

  update(id: number, shift: Shift): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, shift);
  }
}
