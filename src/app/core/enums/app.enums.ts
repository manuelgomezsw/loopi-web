/**
 * Enums globales de la aplicación
 */

// Estados de empleados
export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED'
}

// Tipos de empleados
export enum EmployeeType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACTOR = 'CONTRACTOR',
  INTERN = 'INTERN'
}

// Estados de turnos
export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

// Tipos de turnos
export enum ShiftType {
  OPENING = 'OPENING',
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  CLOSING = 'CLOSING',
  OVERNIGHT = 'OVERNIGHT'
}

// Estados de ausencias
export enum AbsenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

// Tipos de ausencias
export enum AbsenceType {
  VACATION = 'VACATION',
  SICK_LEAVE = 'SICK_LEAVE',
  PERSONAL_LEAVE = 'PERSONAL_LEAVE',
  MATERNITY_LEAVE = 'MATERNITY_LEAVE',
  PATERNITY_LEAVE = 'PATERNITY_LEAVE',
  EMERGENCY_LEAVE = 'EMERGENCY_LEAVE',
  UNPAID_LEAVE = 'UNPAID_LEAVE'
}

// Roles de usuario
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  FRANCHISE_ADMIN = 'FRANCHISE_ADMIN',
  STORE_MANAGER = 'STORE_MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  EMPLOYEE = 'EMPLOYEE'
}

// Estados de usuario
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  BLOCKED = 'BLOCKED'
}

// Días de la semana
export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

// Tipos de notificación
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

// Niveles de logging
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

// Estados de operaciones asíncronas
export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// Métodos HTTP
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// Tipos de entidad
export enum EntityType {
  EMPLOYEE = 'EMPLOYEE',
  SHIFT = 'SHIFT',
  ABSENCE = 'ABSENCE',
  FRANCHISE = 'FRANCHISE',
  STORE = 'STORE',
  USER = 'USER'
}

// Acciones de auditoría
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  VIEW = 'VIEW',
  EXPORT = 'EXPORT'
}

// Tipos de configuración
export enum ConfigurationType {
  SHIFT_TEMPLATES = 'SHIFT_TEMPLATES',
  WORKING_HOURS = 'WORKING_HOURS',
  HOLIDAYS = 'HOLIDAYS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  PERMISSIONS = 'PERMISSIONS'
}

// Estados de sincronización
export enum SyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT'
}

// Prioridades
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Formatos de exportación
export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON'
}

// Tipos de filtro
export enum FilterType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  MULTISELECT = 'MULTISELECT'
}

// Operadores de filtro
export enum FilterOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  IS_NULL = 'IS_NULL',
  IS_NOT_NULL = 'IS_NOT_NULL'
}

// Tipos de gráfico para reportes
export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  DOUGHNUT = 'DOUGHNUT',
  AREA = 'AREA',
  SCATTER = 'SCATTER'
}

// Períodos de tiempo para reportes
export enum TimePeriod {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
  CUSTOM = 'CUSTOM'
}
