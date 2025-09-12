/**
 * Constantes globales de la aplicación
 */

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'Loopi Web',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de gestión de empleados y horarios'
} as const;

// URLs y endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CONTEXT: '/auth/context'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile'
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: number) => `/employees/${id}`,
    BY_STORE: (storeId: number) => `/employees?store_id=${storeId}`
  },
  SHIFTS: {
    BASE: '/shifts',
    BY_ID: (id: number) => `/shifts/${id}`,
    BY_EMPLOYEE: (employeeId: number) => `/shifts?employee_id=${employeeId}`,
    BY_DATE: (date: string) => `/shifts?date=${date}`,
    PLANNING: '/shifts/planning'
  },
  ABSENCES: {
    BASE: '/absences',
    BY_ID: (id: number) => `/absences/${id}`,
    BY_EMPLOYEE: (employeeId: number) => `/absences?employee_id=${employeeId}`,
    APPROVE: (id: number) => `/absences/${id}/approve`,
    REJECT: (id: number) => `/absences/${id}/reject`
  },
  FRANCHISES: {
    BASE: '/franchises',
    BY_ID: (id: number) => `/franchises/${id}`,
    STORES: (franchiseId: number) => `/franchises/${franchiseId}/stores`
  },
  STORES: {
    BASE: '/stores',
    BY_ID: (id: number) => `/stores/${id}`,
    EMPLOYEES: (storeId: number) => `/stores/${storeId}/employees`
  }
} as const;

// Configuración de HTTP
export const HTTP_CONFIG = {
  TIMEOUT: {
    DEFAULT: 10000,
    UPLOAD: 30000,
    DOWNLOAD: 60000
  },
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    ACCEPT: 'application/json'
  }
} as const;

// Configuración de almacenamiento
export const STORAGE_KEYS = {
  TOKEN: 'loopi_auth_token',
  WORK_CONTEXT: 'work-context',
  USER_PREFERENCES: 'user-preferences',
  THEME: 'theme-preference',
  LANGUAGE: 'language-preference'
} as const;

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    INFO: 5000,
    WARNING: 7000,
    ERROR: 10000
  },
  POSITION: {
    HORIZONTAL: 'right',
    VERTICAL: 'top'
  }
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

// Configuración de validación
export const VALIDATION_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  EMAIL: {
    MAX_LENGTH: 254
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15
  }
} as const;

// Configuración de fecha y hora
export const DATE_CONFIG = {
  FORMATS: {
    DATE: 'yyyy-MM-dd',
    TIME: 'HH:mm',
    DATETIME: 'yyyy-MM-dd HH:mm',
    DISPLAY_DATE: 'dd/MM/yyyy',
    DISPLAY_DATETIME: 'dd/MM/yyyy HH:mm'
  },
  WORKING_HOURS: {
    START: '08:00',
    END: '22:00',
    BREAK_DURATION: 30 // minutos
  }
} as const;

// Rutas de la aplicación
export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    SELECT_CONTEXT: '/auth/select-context'
  },
  HOME: '/home',
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees/new',
    EDIT: (id: number) => `/employees/${id}/edit`,
    VIEW: (id: number) => `/employees/${id}`
  },
  SHIFTS: {
    PLANNING: '/shifts/planning',
    CONFIG: '/shifts/config',
    ABSENCES: '/shifts/absences'
  },
  ADMIN: {
    FRANCHISES: '/admin/franchises',
    STORES: '/admin/stores'
  }
} as const;

// Mensajes del sistema
export const MESSAGES = {
  SUCCESS: {
    SAVE: 'Datos guardados exitosamente',
    UPDATE: 'Datos actualizados exitosamente',
    DELETE: 'Elemento eliminado exitosamente',
    LOGIN: 'Inicio de sesión exitoso',
    LOGOUT: 'Sesión cerrada exitosamente'
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu internet',
    UNAUTHORIZED: 'No autorizado. Inicia sesión nuevamente',
    FORBIDDEN: 'No tienes permisos para esta acción',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION: 'Datos inválidos. Revisa los campos',
    SESSION_EXPIRED: 'Tu sesión ha expirado'
  },
  CONFIRMATION: {
    DELETE: '¿Estás seguro de que quieres eliminar este elemento?',
    LOGOUT: '¿Estás seguro de que quieres cerrar sesión?',
    DISCARD_CHANGES: '¿Descartar los cambios realizados?'
  }
} as const;

// Configuración de roles y permisos
export const PERMISSIONS = {
  EMPLOYEES: {
    CREATE: 'employees:create',
    READ: 'employees:read',
    UPDATE: 'employees:update',
    DELETE: 'employees:delete'
  },
  SHIFTS: {
    CREATE: 'shifts:create',
    READ: 'shifts:read',
    UPDATE: 'shifts:update',
    DELETE: 'shifts:delete',
    PLAN: 'shifts:plan'
  },
  ABSENCES: {
    CREATE: 'absences:create',
    READ: 'absences:read',
    UPDATE: 'absences:update',
    DELETE: 'absences:delete',
    APPROVE: 'absences:approve'
  },
  ADMIN: {
    FRANCHISES: 'admin:franchises',
    STORES: 'admin:stores',
    USERS: 'admin:users',
    SETTINGS: 'admin:settings'
  }
} as const;

// Configuración de regex para validaciones
export const REGEX_PATTERNS = {
  EMAIL:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  PHONE: /^[+]?[(]?[\d\s\-\(\)]{10,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ONLY_LETTERS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ONLY_NUMBERS: /^\d+$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
} as const;
