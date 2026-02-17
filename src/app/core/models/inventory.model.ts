export type InventoryType = 'daily' | 'weekly' | 'monthly' | 'initial';
export type Schedule = 'opening' | 'noon' | 'closing';
export type InventoryStatus = 'in_progress' | 'completed';

export interface Inventory {
  id: number;
  inventory_date: string;
  inventory_type: InventoryType;
  schedule?: Schedule;
  status: InventoryStatus;
  responsible_id: number;
  started_at: string;
  completed_at?: string;
}

export interface SuggestedSchedule {
  inventory_type: InventoryType;
  schedule?: Schedule;
  date: string;
}

export interface InventoryItem {
  item_id: number;
  name: string;
  category_name?: string;
  suggested_value?: number;
  real_value?: number;
  stock_received?: number;
  units_sold?: number;
  is_complete: boolean;
}

export interface InventoryItemsResponse {
  inventory_id: number;
  inventory_type: InventoryType;
  schedule?: Schedule;
  date: string;
  requires_sales: boolean;
  requires_purchases_only: boolean;
  total_items: number;
  completed_items: number;
  items: InventoryItem[];
}

export interface SaveDetailRequest {
  item_id: number;
  real_value: number;
}

export interface SaveDetailResponse {
  saved: boolean;
  suggested_value?: number;
}

export interface SaveSalesRequest {
  item_id: number;
  stock_received?: number;
  units_sold?: number;
}

export interface DiscrepancyItem {
  item_id: number;
  name: string;
  suggested_value: number;
  real_value: number;
  difference: number;
  stock_received?: number;
  units_sold?: number;
}

export interface DiscrepanciesResponse {
  inventory_id: number;
  inventory_type: InventoryType;
  schedule?: Schedule;
  date: string;
  requires_sales: boolean;
  requires_purchases_only: boolean;
  total_items: number;
  has_discrepancies: boolean;
  items: DiscrepancyItem[];
}

export interface InventorySummaryItem {
  item_id: number;
  name: string;
  suggested_value: number;
  real_value: number;
  difference: number;
  has_discrepancy: boolean;
  stock_received?: number;
  units_sold?: number;
}

export interface InventorySummary {
  inventory_id: number;
  inventory_type: InventoryType;
  schedule?: Schedule;
  date: string;
  requires_purchases_only: boolean;
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
  inventory_type: InventoryType;
  schedule?: Schedule;
  date: string;
}

export interface InProgressInventory {
  id: number;
  inventory_date: string;
  inventory_type: InventoryType;
  schedule?: Schedule;
  started_at: string;
}

export interface InProgressInventoriesResponse {
  inventories: InProgressInventory[];
  count: number;
}
