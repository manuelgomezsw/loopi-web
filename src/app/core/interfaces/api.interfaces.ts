/**
 * Interfaces para respuestas de API
 */

import {
    AbsenceStatus,
    AbsenceType,
    EmployeeStatus,
    EmployeeType,
    LoadingState,
    ShiftStatus,
    ShiftType,
    SyncStatus,
    UserRole,
    UserStatus
} from '../enums/app.enums';

// Respuesta base de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: ApiMeta;
}

// Metadatos de respuestas paginadas
export interface ApiMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Respuesta de error de la API
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  path?: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: UserInfo;
}

// Información de usuario
export interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  workContext?: WorkContextInfo;
  createdAt: string;
  updatedAt: string;
}

// Contexto de trabajo
export interface WorkContextInfo {
  franchiseID: number;  // Mantenemos la compatibilidad con la interfaz existente
  franchiseId: number;  // Nueva propiedad para consistencia
  franchiseName: string;
  storeID: number;      // Mantenemos la compatibilidad con la interfaz existente
  storeId: number;      // Nueva propiedad para consistencia
  storeName: string;
  permissions: string[];
}

// Empleado
export interface EmployeeResponse {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: EmployeeStatus;
  type: EmployeeType;
  hireDate: string;
  terminationDate?: string;
  hourlyRate?: number;
  weeklyHours?: number;
  storeId: number;
  store: StoreInfo;
  user?: UserInfo;
  createdAt: string;
  updatedAt: string;
}

// Lista de empleados
export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  meta: ApiMeta;
}

// Información de tienda
export interface StoreInfo {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  franchiseId: number;
  franchise: FranchiseInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Información de franquicia
export interface FranchiseInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Turno
export interface ShiftResponse {
  id: number;
  employeeId: number;
  employee: EmployeeResponse;
  storeId: number;
  store: StoreInfo;
  date: string;
  startTime: string;
  endTime: string;
  plannedHours: number;
  actualHours?: number;
  status: ShiftStatus;
  type: ShiftType;
  position: string;
  notes?: string;
  checkInTime?: string;
  checkOutTime?: string;
  isOvertime: boolean;
  overtimeHours?: number;
  createdAt: string;
  updatedAt: string;
}

// Lista de turnos
export interface ShiftListResponse {
  shifts: ShiftResponse[];
  meta: ApiMeta;
}

// Planificación de turnos
export interface ShiftPlanningResponse {
  date: string;
  shifts: ShiftResponse[];
  totalHours: number;
  totalEmployees: number;
  coverage: CoverageInfo[];
}

// Información de cobertura
export interface CoverageInfo {
  timeSlot: string;
  requiredEmployees: number;
  scheduledEmployees: number;
  isUnderstaffed: boolean;
  positions: PositionCoverage[];
}

// Cobertura por posición
export interface PositionCoverage {
  position: string;
  required: number;
  scheduled: number;
  employees: EmployeeResponse[];
}

// Ausencia
export interface AbsenceResponse {
  id: number;
  employeeId: number;
  employee: EmployeeResponse;
  type: AbsenceType;
  status: AbsenceStatus;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  description?: string;
  approvedBy?: number;
  approver?: UserInfo;
  approvedAt?: string;
  rejectionReason?: string;
  isPaid: boolean;
  documents?: DocumentInfo[];
  createdAt: string;
  updatedAt: string;
}

// Lista de ausencias
export interface AbsenceListResponse {
  absences: AbsenceResponse[];
  meta: ApiMeta;
}

// Información de documento
export interface DocumentInfo {
  id: number;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Resumen de horas
export interface HoursSummaryResponse {
  period: string;
  employee?: EmployeeResponse;
  totalScheduledHours: number;
  totalWorkedHours: number;
  overtimeHours: number;
  absenceHours: number;
  availableHours: number;
  utilization: number;
  details: HoursDetail[];
}

// Detalle de horas
export interface HoursDetail {
  date: string;
  day: string;
  scheduledHours: number;
  workedHours: number;
  overtime: number;
  absence?: AbsenceInfo;
  shifts: ShiftSummary[];
}

// Información de ausencia en resumen
export interface AbsenceInfo {
  type: AbsenceType;
  hours: number;
  status: AbsenceStatus;
}

// Resumen de turno
export interface ShiftSummary {
  id: number;
  startTime: string;
  endTime: string;
  hours: number;
  position: string;
  status: ShiftStatus;
}

// Configuración de turno
export interface ShiftConfigResponse {
  id: number;
  name: string;
  description: string;
  storeId: number;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  positions: string[];
  maxEmployees: number;
  minEmployees: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Estadísticas del dashboard
export interface DashboardStatsResponse {
  totalEmployees: number;
  activeEmployees: number;
  todayShifts: number;
  pendingAbsences: number;
  thisWeekHours: number;
  utilizationRate: number;
  recentActivity: ActivityItem[];
  upcomingShifts: ShiftResponse[];
  pendingApprovals: AbsenceResponse[];
}

// Elemento de actividad
export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  entityType?: string;
  entityId?: number;
}

// Estado de carga
export interface LoadingStateInfo {
  state: LoadingState;
  error?: string;
  lastUpdated?: string;
}

// Estado de entidad
export interface EntityState<T> {
  data: T | null;
  loading: LoadingStateInfo;
  cache: Map<string, T>;
  syncStatus: SyncStatus;
}

// Lista con estado
export interface ListState<T> {
  items: T[];
  loading: LoadingStateInfo;
  pagination: ApiMeta;
  filters: FilterState;
  sorting: SortState;
}

// Estado de filtro
export interface FilterState {
  [key: string]: any;
}

// Estado de ordenación
export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// Solicitud de filtros
export interface FilterRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Solicitud de creación/actualización
export interface CreateUpdateRequest<T> {
  data: Partial<T>;
  options?: {
    returnUpdated?: boolean;
    validateOnly?: boolean;
  };
}

// Respuesta de validación
export interface ValidationResponse {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings?: Record<string, string[]>;
}
