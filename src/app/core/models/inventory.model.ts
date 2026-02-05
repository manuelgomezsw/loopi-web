export type Schedule = 'opening' | 'noon' | 'closing' | 'weekly' | 'monthly';
export type InventoryStatus = 'in_progress' | 'completed';

export interface Inventory {
  id: number;
  inventory_date: string;
  schedule: Schedule;
  status: InventoryStatus;
  responsible_id: number;
  started_at: string;
  completed_at?: string;
}

export interface SuggestedSchedule {
  schedule: Schedule;
  date: string;
}

export interface InventoryItem {
  item_id: number;
  name: string;
  suggested_value?: number;
  real_value?: number;
  stock_received?: number;
  units_sold?: number;
  requires_sales: boolean;
  is_complete: boolean;
}

export interface InventoryItemsResponse {
  inventory_id: number;
  schedule: Schedule;
  date: string;
  total_items: number;
  completed_items: number;
  items: InventoryItem[];
}

export interface SaveDetailRequest {
  item_id: number;
  real_value: number;
  stock_received?: number;
  units_sold?: number;
}

export interface SaveDetailResponse {
  saved: boolean;
  suggested_value?: number;
}

export interface InventorySummaryItem {
  item_id: number;
  name: string;
  suggested_value: number;
  real_value: number;
  difference: number;
  has_discrepancy: boolean;
}

export interface InventorySummary {
  inventory_id: number;
  schedule: Schedule;
  date: string;
  total_items: number;
  items_with_issues: number;
  items: InventorySummaryItem[];
  can_complete: boolean;
  missing_items: number;
}

export interface CompleteInventoryResponse {
  completed: boolean;
  issues_created: number;
}

export interface CreateInventoryRequest {
  schedule: Schedule;
  date: string;
}
