// Dashboard models
export interface DashboardStats {
  today_inventories: number;
  with_discrepancies: number;
  without_discrepancies: number;
  pending_inventories: number;
}

export interface DashboardData {
  stats: DashboardStats;
}

// Inventory list models
export interface CreateInitialInventoryRequest {
  responsible_id: number;
}

export interface InventoryListItem {
  id: number;
  inventory_date: string;
  inventory_type: 'daily' | 'weekly' | 'monthly' | 'initial';
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
  shrinkage: number | null;
  /** Computed: suggested_value − shrinkage + stock_received − units_sold; used for discrepancy. */
  expected_value: number;
  difference: number;
  has_discrepancy: boolean;
}

export interface InventoryDetailView {
  id: number;
  inventory_date: string;
  inventory_type: 'daily' | 'weekly' | 'monthly' | 'initial';
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
  suggested_value?: number;
  real_value?: number;
  stock_received?: number;
  units_sold?: number;
  shrinkage?: number;
}

// Item models
export type ItemType = 'product' | 'supply';
export type InventoryFrequency = 'daily' | 'weekly' | 'monthly';

export interface MeasurementUnit {
  id: number;
  code: string;
  name: string;
}

export interface Item {
  id: number;
  type: ItemType;
  name: string;
  active: boolean;
  inventory_frequency: InventoryFrequency;
  category_id: number;
  supplier_id?: number;
  cost: number;
  measurement_unit_id: number;
  created_at: string;
  updated_at: string;
  category?: { id: number; name: string };
  supplier?: { id: number; business_name: string };
  measurement_unit?: MeasurementUnit;
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
  category_id: number;
  supplier_id?: number;
  cost: number;
  measurement_unit_id: number;
  add_to_active_inventories?: boolean;
}

export interface UpdateItemRequest {
  type: ItemType;
  name: string;
  inventory_frequency: InventoryFrequency;
  active: boolean;
  category_id: number;
  supplier_id?: number;
  cost: number;
  measurement_unit_id: number;
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

// Category models
export interface Category {
  id: number;
  name: string;
  display_order: number;
  active: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResult {
  categories: Category[];
  total: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
  active: boolean;
}

export interface CategoryOrderItem {
  id: number;
  display_order: number;
}

export interface ReorderCategoriesRequest {
  orders: CategoryOrderItem[];
}

// Supplier models
export interface Supplier {
  id: number;
  business_name: string;
  tax_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  active: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierListResult {
  suppliers: Supplier[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SupplierFilter {
  active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateSupplierRequest {
  business_name: string;
  tax_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
}

export interface UpdateSupplierRequest {
  business_name: string;
  tax_id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  active: boolean;
}
