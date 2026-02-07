import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardData,
  InventoryListResult,
  InventoryFilter,
  InventoryDetailView,
  UpdateDetailRequest,
  Item,
  ItemListResult,
  ItemFilter,
  CreateItemRequest,
  UpdateItemRequest,
  Employee,
  EmployeeListResult,
  EmployeeFilter,
  CreateEmployeeRequest,
  UpdateEmployeeRequest
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  getDashboard(days: number = 3): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}/dashboard`, {
      params: { days: days.toString() }
    });
  }

  listInventories(filter: InventoryFilter = {}): Observable<InventoryListResult> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.page_size) params = params.set('page_size', filter.page_size.toString());
    if (filter.date_from) params = params.set('date_from', filter.date_from);
    if (filter.date_to) params = params.set('date_to', filter.date_to);
    if (filter.inventory_type) params = params.set('inventory_type', filter.inventory_type);
    if (filter.employee_id) params = params.set('employee_id', filter.employee_id.toString());
    if (filter.has_discrepancies !== undefined) {
      params = params.set('has_discrepancies', filter.has_discrepancies.toString());
    }

    return this.http.get<InventoryListResult>(`${this.baseUrl}/inventories`, { params });
  }

  getInventoryDetail(inventoryId: number): Observable<InventoryDetailView> {
    return this.http.get<InventoryDetailView>(`${this.baseUrl}/inventories/${inventoryId}`);
  }

  updateInventoryDetail(inventoryId: number, detailId: number, data: UpdateDetailRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/inventories/${inventoryId}/details/${detailId}`, data);
  }

  // --- Item Management ---

  listItems(filter: ItemFilter = {}): Observable<ItemListResult> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.page_size) params = params.set('page_size', filter.page_size.toString());
    if (filter.type) params = params.set('type', filter.type);
    if (filter.frequency) params = params.set('frequency', filter.frequency);
    if (filter.active !== undefined) params = params.set('active', filter.active.toString());
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<ItemListResult>(`${this.baseUrl}/items`, { params });
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/items/${id}`);
  }

  createItem(data: CreateItemRequest): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/items`, data);
  }

  updateItem(id: number, data: UpdateItemRequest): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/items/${id}`, data);
  }

  updateItemStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/items/${id}/status`, { active });
  }

  // --- Employee Management ---

  listEmployees(filter: EmployeeFilter = {}): Observable<EmployeeListResult> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.page_size) params = params.set('page_size', filter.page_size.toString());
    if (filter.role) params = params.set('role', filter.role);
    if (filter.active !== undefined) params = params.set('active', filter.active.toString());
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<EmployeeListResult>(`${this.baseUrl}/employees`, { params });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/employees/${id}`);
  }

  createEmployee(data: CreateEmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, data);
  }

  updateEmployee(id: number, data: UpdateEmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, data);
  }

  updateEmployeeStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/employees/${id}/status`, { active });
  }

  resetEmployeePassword(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/employees/${id}/reset-password`, {});
  }
}
