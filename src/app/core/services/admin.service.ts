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
  UpdateEmployeeRequest,
  Category,
  CategoryListResult,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ReorderCategoriesRequest,
  Supplier,
  SupplierListResult,
  SupplierFilter,
  CreateSupplierRequest,
  UpdateSupplierRequest
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

  // --- Category Management ---

  listCategories(): Observable<CategoryListResult> {
    return this.http.get<CategoryListResult>(`${this.baseUrl}/categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, data);
  }

  updateCategory(id: number, data: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, data);
  }

  updateCategoryStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/categories/${id}/status`, { active });
  }

  reorderCategories(data: ReorderCategoriesRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/categories/reorder`, data);
  }

  // --- Supplier Management ---

  listSuppliers(filter: SupplierFilter = {}): Observable<SupplierListResult> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.page_size) params = params.set('page_size', filter.page_size.toString());
    if (filter.active !== undefined) params = params.set('active', filter.active.toString());
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<SupplierListResult>(`${this.baseUrl}/suppliers`, { params });
  }

  listAllActiveSuppliers(): Observable<{ suppliers: Supplier[]; total: number }> {
    return this.http.get<{ suppliers: Supplier[]; total: number }>(`${this.baseUrl}/suppliers/active`);
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/suppliers/${id}`);
  }

  createSupplier(data: CreateSupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/suppliers`, data);
  }

  updateSupplier(id: number, data: UpdateSupplierRequest): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.baseUrl}/suppliers/${id}`, data);
  }

  updateSupplierStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/suppliers/${id}/status`, { active });
  }
}
