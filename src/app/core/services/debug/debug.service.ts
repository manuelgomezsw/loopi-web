import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  source?: string;
  stackTrace?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  private logs: LogEntry[] = [];
  private readonly maxLogEntries = 1000;

  constructor() {
    if (environment.enableDebugMode) {
      this.enableGlobalDebugging();
    }
  }

  /**
   * Habilita debugging global en el navegador
   */
  private enableGlobalDebugging(): void {
    // Hacer el servicio accesible globalmente para debugging
    (window as any)['debug'] = {
      service: this,
      logs: () => this.getLogs(),
      clear: () => this.clearLogs(),
      export: () => this.exportLogs(),
      performance: () => this.getPerformanceInfo(),
      environment: environment
    };

    this.info('DebugService', 'Debug mode enabled. Use window.debug for debugging utilities');
  }

  /**
   * Log nivel debug
   */
  debug(category: string, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  /**
   * Log nivel info
   */
  info(category: string, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  /**
   * Log nivel warning
   */
  warn(category: string, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  /**
   * Log nivel error
   */
  error(category: string, message: string, data?: any, error?: Error): void {
    this.log('error', category, message, data, error?.stack);
  }

  /**
   * Log de performance
   */
  performance(category: string, operation: string, duration: number, data?: any): void {
    if (environment.enablePerformanceLogging) {
      this.log('info', `${category}:Performance`, `${operation} completed in ${duration}ms`, data);
    }
  }

  /**
   * Wrapper para medir performance de operaciones
   */
  measurePerformance<T>(category: string, operation: string, fn: () => T): T {
    if (!environment.enablePerformanceLogging) {
      return fn();
    }

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.performance(category, operation, duration);
    return result;
  }

  /**
   * Wrapper async para medir performance
   */
  async measurePerformanceAsync<T>(category: string, operation: string, fn: () => Promise<T>): Promise<T> {
    if (!environment.enablePerformanceLogging) {
      return fn();
    }

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.performance(category, operation, duration);
    return result;
  }

  /**
   * Log interno
   */
  private log(level: LogLevel, category: string, message: string, data?: any, stackTrace?: string): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data,
      source: this.getSource(),
      stackTrace
    };

    this.addLogEntry(entry);

    if (this.shouldLogToConsole(level)) {
      this.logToConsole(entry);
    }
  }

  /**
   * Agregar entrada al log interno
   */
  private addLogEntry(entry: LogEntry): void {
    this.logs.push(entry);

    // Mantener solo las últimas entradas
    if (this.logs.length > this.maxLogEntries) {
      this.logs.splice(0, this.logs.length - this.maxLogEntries);
    }
  }

  /**
   * Verificar si se debe loggear al console
   */
  private shouldLogToConsole(level: LogLevel): boolean {
    if (!environment.enableConsoleLogging) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevel = environment.logLevels.console as LogLevel;
    const currentLevelIndex = levels.indexOf(configLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Escribir al console del navegador
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`;

    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
      case 'info':
        if (entry.data !== undefined) {
          console.log(message, entry.data);
        } else {
          console.log(message);
        }
        break;
      case 'warn':
        if (entry.data !== undefined) {
          console.warn(message, entry.data);
        } else {
          console.warn(message);
        }
        break;
      case 'error':
        if (entry.data !== undefined) {
          console.error(message, entry.data);
        } else {
          console.error(message);
        }
        break;
    }

    if (entry.stackTrace && environment.enableDetailedErrors) {
      console.groupCollapsed(`Stack trace for: ${entry.message}`);
      console.error(entry.stackTrace);
      console.groupEnd();
    }
  }

  /**
   * Obtener información de origen
   */
  private getSource(): string {
    if (!environment.enableDetailedErrors) return '';

    const stack = new Error().stack;
    const lines = stack?.split('\n') || [];

    // Buscar la primera línea que no sea del DebugService
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line && !line.includes('DebugService') && !line.includes('at new')) {
        return line.trim();
      }
    }

    return '';
  }

  /**
   * Obtener todos los logs
   */
  getLogs(level?: LogLevel, category?: string): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category.includes(category));
    }

    return filteredLogs;
  }

  /**
   * Limpiar logs
   */
  clearLogs(): void {
    this.logs = [];
    this.info('DebugService', 'Logs cleared');
  }

  /**
   * Exportar logs como JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Obtener información de performance del navegador
   */
  getPerformanceInfo(): any {
    if (!('performance' in window)) return {};

    return {
      navigation: performance.getEntriesByType('navigation')[0],
      memory: (performance as any).memory,
      timing: performance.timing,
      now: performance.now()
    };
  }

  /**
   * Crear un grupo de logs
   */
  group(title: string): void {
    if (environment.enableConsoleLogging) {
      console.group(title);
    }
  }

  /**
   * Terminar grupo de logs
   */
  groupEnd(): void {
    if (environment.enableConsoleLogging) {
      console.groupEnd();
    }
  }

  /**
   * Log de tabla para arrays/objetos
   */
  table(category: string, data: any): void {
    if (environment.enableConsoleLogging) {
      console.group(`[TABLE] ${category}`);
      console.table(data);
      console.groupEnd();
    }

    this.debug(category, 'Table data logged', data);
  }

  /**
   * Marcar un punto en el timeline del navegador
   */
  mark(name: string): void {
    if (environment.enablePerformanceLogging && 'performance' in window && performance.mark) {
      performance.mark(name);
      this.debug('Performance', `Mark set: ${name}`);
    }
  }

  /**
   * Medir tiempo entre dos marks
   */
  measure(name: string, startMark: string, endMark: string): void {
    if (environment.enablePerformanceLogging && 'performance' in window && performance.measure) {
      performance.measure(name, startMark, endMark);
      this.debug('Performance', `Measure created: ${name}`);
    }
  }
}
