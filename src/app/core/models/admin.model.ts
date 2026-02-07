// Dashboard models
export interface DashboardStats {
  today_inventories: number;
  with_discrepancies: number;
  without_discrepancies: number;
  pending_inventories: number;
}

export interface DiscrepancySummary {
  inventory_id: number;
  item_id: number;
  item_name: string;
  expected_value: number;
  actual_value: number;
  difference: number;
  inventory_date: string;
  inventory_type: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_discrepancies: DiscrepancySummary[];
}

// Inventory list models
export interface InventoryListItem {
  id: number;
  inventory_date: string;
  inventory_type: 'daily' | 'weekly' | 'monthly';
  schedule?: 'opening' | 'noon' | 'closing';
  status: 'in_progress' | 'completed';
  employee_id: number;
  employee_name: string;
  total_items: number;
  items_with_diff: number;
  started_at: string;
  completed_at?: string;
}

export interface InventoryListResult {
  items: InventoryListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface InventoryFilter {
  date_from?: string;
  date_to?: string;
  inventory_type?: string;
  employee_id?: number;
  has_discrepancies?: boolean;
  page?: number;
  page_size?: number;
}

// Inventory detail models
export interface InventoryDetailItem {
  detail_id: number;
  item_id: number;
  item_name: string;
  item_type: string;
  suggested_value: number | null;
  real_value: number | null;
  stock_received: number | null;
  units_sold: number | null;
  difference: number;
  has_discrepancy: boolean;
}

export interface InventoryDetailView {
  id: number;
  inventory_date: string;
  inventory_type: 'daily' | 'weekly' | 'monthly';
  schedule?: 'opening' | 'noon' | 'closing';
  status: 'in_progress' | 'completed';
  employee_id: number;
  employee_name: string;
  started_at: string;
  completed_at?: string;
  total_items: number;
  items_with_diff: number;
  details: InventoryDetailItem[];
}

export interface UpdateDetailRequest {
  real_value?: number;
  stock_received?: number;
  units_sold?: number;
}

// Item models
export type ItemType = 'product' | 'supply';
export type InventoryFrequency = 'daily' | 'weekly' | 'monthly';

export interface Item {
  id: number;
  type: ItemType;
  name: string;
  active: boolean;
  inventory_frequency: InventoryFrequency;
  created_at: string;
  updated_at: string;
}

export interface ItemListResult {
  items: Item[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ItemFilter {
  type?: ItemType;
  frequency?: InventoryFrequency;
  active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateItemRequest {
  type: ItemType;
  name: string;
  inventory_frequency: InventoryFrequency;
}

export interface UpdateItemRequest {
  type: ItemType;
  name: string;
  inventory_frequency: InventoryFrequency;
  active: boolean;
}

// Employee models
export type EmployeeRole = 'employee' | 'admin';

export interface Employee {
  id: number;
  username: string;
  name: string;
  last_name: string;
  document_type?: string;
  document_number?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  role: EmployeeRole;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeListResult {
  employees: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface EmployeeFilter {
  role?: EmployeeRole;
  active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateEmployeeRequest {
  username: string;
  password: string;
  name: string;
  last_name: string;
  document_type?: string;
  document_number?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  role: EmployeeRole;
}

export interface UpdateEmployeeRequest {
  username: string;
  name: string;
  last_name: string;
  document_type?: string;
  document_number?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  role: EmployeeRole;
  active: boolean;
}
