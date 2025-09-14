import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../constants/app.constants';
import {
  ApiResponse,
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest
} from '../../interfaces/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtener empleados por tienda
   */
  getByStore(storeId: number): Observable<EmployeeResponse[]> {
    return this.http.get<EmployeeResponse[]>(`${this.baseUrl}${API_ENDPOINTS.EMPLOYEES.BASE}?store_id=${storeId}`);
  }

  /**
   * Obtener empleado por ID
   */
  getById(id: number): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.baseUrl}${API_ENDPOINTS.EMPLOYEES.BY_ID(id)}`);
  }

  /**
   * Crear nuevo empleado
   */
  create(employee: EmployeeCreateRequest): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.post<ApiResponse<EmployeeResponse>>(`${this.baseUrl}${API_ENDPOINTS.EMPLOYEES.BASE}`, employee);
  }

  /**
   * Actualizar empleado existente
   */
  update(id: number, employee: EmployeeUpdateRequest): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.put<ApiResponse<EmployeeResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.EMPLOYEES.BY_ID(id)}`,
      employee
    );
  }

  /**
   * Eliminar empleado
   */
  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.EMPLOYEES.BY_ID(id)}`);
  }
}
