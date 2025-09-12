export const environment = {
  production: true,
  apiUrl: 'https://api.tuservidor.com',

  // Configuración de debugging deshabilitada en producción
  enableDebugMode: false,
  enableConsoleLogging: false,
  enableDetailedErrors: false,
  enablePerformanceLogging: false,

  // Configuración de producción
  httpTimeout: 10000,
  retryAttempts: 2,

  // Configuración de seguridad para producción
  bypassTokenValidation: false,
  allowInsecureConnections: false,

  // Feature flags para producción
  features: {
    enableMockData: false,
    enableTestingMode: false,
    showDebugInfo: false,
    enableHotReload: false
  },

  // Configuración de logging para producción
  logLevels: {
    console: 'error',
    network: 'warn',
    errors: 'error',
    performance: 'silent'
  }
};
