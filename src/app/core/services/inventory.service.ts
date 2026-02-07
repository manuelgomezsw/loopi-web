import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Inventory,
  SuggestedSchedule,
  InventoryItemsResponse,
  SaveDetailRequest,
  SaveDetailResponse,
  SaveSalesRequest,
  DiscrepanciesResponse,
  DiscrepancyItem,
  InventorySummary,
  CompleteInventoryResponse,
  CreateInventoryRequest,
  InventoryItem,
  InProgressInventoriesResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);

  // Current inventory state
  private currentInventory = signal<Inventory | null>(null);
  private currentItems = signal<InventoryItem[]>([]);
  private currentIndex = signal<number>(0);
  private requiresSalesFlag = signal<boolean>(false);

  // Discrepancy items for Phase 2
  private _discrepancyItems = signal<DiscrepancyItem[]>([]);
  private _discrepancyIndex = signal<number>(0);

  readonly inventory = this.currentInventory.asReadonly();
  readonly items = this.currentItems.asReadonly();
  readonly currentItemIndex = this.currentIndex.asReadonly();
  readonly requiresSales = this.requiresSalesFlag.asReadonly();
  readonly discrepancyItems = this._discrepancyItems.asReadonly();
  readonly discrepancyIndex = this._discrepancyIndex.asReadonly();

  getSuggestedSchedule(): Observable<SuggestedSchedule> {
    return this.http.get<SuggestedSchedule>(`${environment.apiUrl}/inventories/suggested-schedule`);
  }

  getLatestInventory(): Observable<{ inventory: Inventory | null }> {
    return this.http.get<{ inventory: Inventory | null }>(`${environment.apiUrl}/inventories/latest`);
  }

  getInProgressInventories(): Observable<InProgressInventoriesResponse> {
    return this.http.get<InProgressInventoriesResponse>(`${environment.apiUrl}/inventories/in-progress`);
  }

  createInventory(request: CreateInventoryRequest): Observable<Inventory> {
    return this.http.post<Inventory>(`${environment.apiUrl}/inventories`, request)
      .pipe(
        tap(inventory => this.currentInventory.set(inventory))
      );
  }

  getInventoryItems(inventoryId: number): Observable<InventoryItemsResponse> {
    return this.http.get<InventoryItemsResponse>(`${environment.apiUrl}/inventories/${inventoryId}/items`)
      .pipe(
        tap(response => {
          this.currentItems.set(response.items);
          this.requiresSalesFlag.set(response.requires_sales);
          // Find first incomplete item
          const firstIncomplete = response.items.findIndex(item => !item.is_complete);
          this.currentIndex.set(firstIncomplete >= 0 ? firstIncomplete : 0);
        })
      );
  }

  saveDetail(inventoryId: number, detail: SaveDetailRequest): Observable<SaveDetailResponse> {
    return this.http.post<SaveDetailResponse>(
      `${environment.apiUrl}/inventories/${inventoryId}/details`,
      detail
    ).pipe(
      tap(() => {
        // Update local state
        const items = this.currentItems();
        const index = items.findIndex(i => i.item_id === detail.item_id);
        if (index >= 0) {
          const updated = [...items];
          updated[index] = {
            ...updated[index],
            real_value: detail.real_value,
            is_complete: true
          };
          this.currentItems.set(updated);
        }
      })
    );
  }

  getDiscrepancies(inventoryId: number): Observable<DiscrepanciesResponse> {
    return this.http.get<DiscrepanciesResponse>(`${environment.apiUrl}/inventories/${inventoryId}/discrepancies`)
      .pipe(
        tap(response => {
          this._discrepancyItems.set(response.items);
          this._discrepancyIndex.set(0);
          this.requiresSalesFlag.set(response.requires_sales);
        })
      );
  }

  saveSales(inventoryId: number, sales: SaveSalesRequest): Observable<SaveDetailResponse> {
    return this.http.post<SaveDetailResponse>(
      `${environment.apiUrl}/inventories/${inventoryId}/sales`,
      sales
    ).pipe(
      tap(() => {
        // Update discrepancy items state
        const items = this._discrepancyItems();
        const index = items.findIndex(i => i.item_id === sales.item_id);
        if (index >= 0) {
          const updated = [...items];
          updated[index] = {
            ...updated[index],
            stock_received: sales.stock_received,
            units_sold: sales.units_sold
          };
          this._discrepancyItems.set(updated);
        }
      })
    );
  }

  getSummary(inventoryId: number): Observable<InventorySummary> {
    return this.http.get<InventorySummary>(`${environment.apiUrl}/inventories/${inventoryId}/summary`);
  }

  completeInventory(inventoryId: number): Observable<CompleteInventoryResponse> {
    return this.http.post<CompleteInventoryResponse>(
      `${environment.apiUrl}/inventories/${inventoryId}/complete`,
      {}
    ).pipe(
      tap(() => this.reset())
    );
  }

  // Navigation helpers for Phase 1 (physical count)
  nextItem(): void {
    const current = this.currentIndex();
    const items = this.currentItems();
    if (current < items.length - 1) {
      this.currentIndex.set(current + 1);
    }
  }

  previousItem(): void {
    const current = this.currentIndex();
    if (current > 0) {
      this.currentIndex.set(current - 1);
    }
  }

  setCurrentIndex(index: number): void {
    this.currentIndex.set(index);
  }

  getCurrentItem(): InventoryItem | null {
    const items = this.currentItems();
    const index = this.currentIndex();
    return items[index] ?? null;
  }

  isFirstItem(): boolean {
    return this.currentIndex() === 0;
  }

  isLastItem(): boolean {
    return this.currentIndex() === this.currentItems().length - 1;
  }

  getProgress(): { current: number; total: number; percentage: number } {
    const items = this.currentItems();
    const completed = items.filter(i => i.is_complete).length;
    return {
      current: completed,
      total: items.length,
      percentage: items.length > 0 ? (completed / items.length) * 100 : 0
    };
  }

  // Navigation helpers for Phase 2 (sales/purchases)
  nextDiscrepancyItem(): void {
    const current = this._discrepancyIndex();
    const items = this._discrepancyItems();
    if (current < items.length - 1) {
      this._discrepancyIndex.set(current + 1);
    }
  }

  previousDiscrepancyItem(): void {
    const current = this._discrepancyIndex();
    if (current > 0) {
      this._discrepancyIndex.set(current - 1);
    }
  }

  setDiscrepancyIndex(index: number): void {
    this._discrepancyIndex.set(index);
  }

  getCurrentDiscrepancyItem(): DiscrepancyItem | null {
    const items = this._discrepancyItems();
    const index = this._discrepancyIndex();
    return items[index] ?? null;
  }

  isFirstDiscrepancyItem(): boolean {
    return this._discrepancyIndex() === 0;
  }

  isLastDiscrepancyItem(): boolean {
    return this._discrepancyIndex() === this._discrepancyItems().length - 1;
  }

  getDiscrepancyProgress(): { current: number; total: number; percentage: number } {
    const items = this._discrepancyItems();
    const completed = items.filter(i => i.stock_received !== undefined || i.units_sold !== undefined).length;
    return {
      current: this._discrepancyIndex() + 1,
      total: items.length,
      percentage: items.length > 0 ? ((this._discrepancyIndex() + 1) / items.length) * 100 : 0
    };
  }

  hasDiscrepancies(): boolean {
    return this._discrepancyItems().length > 0;
  }

  reset(): void {
    this.currentInventory.set(null);
    this.currentItems.set([]);
    this.currentIndex.set(0);
    this._discrepancyItems.set([]);
    this._discrepancyIndex.set(0);
    this.requiresSalesFlag.set(false);
  }
}
