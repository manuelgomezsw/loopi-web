import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardData,
  InventoryListResult,
  InventoryFilter,
  InventoryDetailView,
  UpdateDetailRequest
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
}
