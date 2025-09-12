export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',

  // Configuración de debugging
  enableDebugMode: true,
  enableConsoleLogging: true,
  enableDetailedErrors: true,
  enablePerformanceLogging: true,

  // Configuración de desarrollo
  httpTimeout: 30000,
  retryAttempts: 3,

  // Configuración de seguridad para desarrollo
  bypassTokenValidation: false,
  allowInsecureConnections: true,

  // Feature flags para desarrollo
  features: {
    enableMockData: false,
    enableTestingMode: true,
    showDebugInfo: true,
    enableHotReload: true
  },

  // Configuración de logging
  logLevels: {
    console: 'debug',
    network: 'info',
    errors: 'error',
    performance: 'warn'
  }
};
