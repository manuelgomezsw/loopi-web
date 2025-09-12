import { environment } from '../../../environments/environment';

/**
 * Decorator para logging automático de métodos
 */
export function LogMethod(category?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    if (!environment.enableDebugMode) return descriptor;

    const method = descriptor.value;
    const className = target.constructor.name;
    const logCategory = category || className;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();

      console.log(`[${logCategory}] Calling ${propertyName}`, args);

      try {
        const result = method.apply(this, args);

        // Si es una promesa, loggear cuando se resuelva
        if (result && typeof result.then === 'function') {
          return result
            .then((res: any) => {
              const duration = performance.now() - startTime;
              console.log(`[${logCategory}] ${propertyName} completed in ${duration.toFixed(2)}ms`, res);
              return res;
            })
            .catch((error: any) => {
              const duration = performance.now() - startTime;
              console.error(`[${logCategory}] ${propertyName} failed after ${duration.toFixed(2)}ms`, error);
              throw error;
            });
        } else {
          const duration = performance.now() - startTime;
          console.log(`[${logCategory}] ${propertyName} completed in ${duration.toFixed(2)}ms`, result);
          return result;
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        console.error(`[${logCategory}] ${propertyName} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Decorator para tracking de performance
 */
export function TrackPerformance(threshold: number = 100) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    if (!environment.enablePerformanceLogging) return descriptor;

    const method = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = function (...args: any[]) {
      const startTime = performance.now();
      const markStart = `${className}.${propertyName}-start`;
      const markEnd = `${className}.${propertyName}-end`;
      const measureName = `${className}.${propertyName}`;

      if ('performance' in window && performance.mark) {
        performance.mark(markStart);
      }

      const result = method.apply(this, args);

      const logPerformance = (duration: number) => {
        if ('performance' in window && performance.mark && performance.measure) {
          performance.mark(markEnd);
          performance.measure(measureName, markStart, markEnd);
        }

        if (duration > threshold) {
          console.warn(
            `[PERFORMANCE] ${className}.${propertyName} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
          );
        }
      };

      if (result && typeof result.then === 'function') {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          logPerformance(duration);
        });
      } else {
        const duration = performance.now() - startTime;
        logPerformance(duration);
        return result;
      }
    };

    return descriptor;
  };
}

/**
 * Utilidad para debugging de componentes Angular
 */
export class ComponentDebugger {
  private static instance: ComponentDebugger;
  private components: Map<string, any> = new Map();

  static getInstance(): ComponentDebugger {
    if (!ComponentDebugger.instance) {
      ComponentDebugger.instance = new ComponentDebugger();
    }
    return ComponentDebugger.instance;
  }

  /**
   * Registra un componente para debugging
   */
  registerComponent(name: string, component: any): void {
    if (!environment.enableDebugMode) return;

    this.components.set(name, component);

    // Hacer componente accesible globalmente
    if (!(window as any)['components']) {
      (window as any)['components'] = {};
    }
    (window as any)['components'][name] = component;

    console.log(`[COMPONENT] ${name} registered for debugging`);
  }

  /**
   * Obtiene un componente registrado
   */
  getComponent(name: string): any {
    return this.components.get(name);
  }

  /**
   * Lista todos los componentes registrados
   */
  listComponents(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Limpia todos los componentes registrados
   */
  clear(): void {
    this.components.clear();
    if ((window as any)['components']) {
      delete (window as any)['components'];
    }
  }
}

/**
 * Utilidades para debugging de estado
 */
export class StateDebugger {
  /**
   * Compara dos objetos y muestra las diferencias
   */
  static diffStates(oldState: any, newState: any, label?: string): void {
    if (!environment.enableDebugMode) return;

    const prefix = label ? `[STATE:${label}]` : '[STATE]';

    console.group(`${prefix} State Change`);
    console.log('Previous:', oldState);
    console.log('Current:', newState);

    const differences = this.getObjectDifferences(oldState, newState);
    if (differences.length > 0) {
      console.log('Changes:', differences);
    } else {
      console.log('No changes detected');
    }

    console.groupEnd();
  }

  /**
   * Obtiene las diferencias entre dos objetos
   */
  private static getObjectDifferences(obj1: any, obj2: any, path: string = ''): any[] {
    const differences: any[] = [];

    // Verificar propiedades en obj2
    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in obj1)) {
        differences.push({ path: currentPath, type: 'added', value: obj2[key] });
      } else if (obj1[key] !== obj2[key]) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          differences.push(...this.getObjectDifferences(obj1[key], obj2[key], currentPath));
        } else {
          differences.push({
            path: currentPath,
            type: 'changed',
            oldValue: obj1[key],
            newValue: obj2[key]
          });
        }
      }
    }

    // Verificar propiedades eliminadas
    for (const key in obj1) {
      if (!(key in obj2)) {
        const currentPath = path ? `${path}.${key}` : key;
        differences.push({ path: currentPath, type: 'removed', value: obj1[key] });
      }
    }

    return differences;
  }
}

/**
 * Utilidad para debugging de formularios
 */
export class FormDebugger {
  /**
   * Debugging completo de FormGroup
   */
  static debugForm(form: any, label?: string): void {
    if (!environment.enableDebugMode) return;

    const prefix = label ? `[FORM:${label}]` : '[FORM]';

    console.group(`${prefix} Form Debug`);
    console.log('Form valid:', form.valid);
    console.log('Form value:', form.value);
    console.log('Form errors:', this.getFormErrors(form));
    console.log('Form status:', form.status);
    console.log('Form dirty:', form.dirty);
    console.log('Form touched:', form.touched);
    console.groupEnd();
  }

  /**
   * Obtiene todos los errores del formulario
   */
  private static getFormErrors(form: any): any {
    const errors: any = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control.errors) {
        errors[key] = control.errors;
      }
    });

    return Object.keys(errors).length > 0 ? errors : null;
  }
}

/**
 * Función helper para crear objetos proxy que loggean el acceso a propiedades
 */
export function createDebugProxy<T extends object>(obj: T, label: string): T {
  if (!environment.enableDebugMode) return obj;

  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      console.log(`[PROXY:${label}] Property accessed: ${String(prop)}`, value);
      return value;
    },
    set(target, prop, value, receiver) {
      console.log(`[PROXY:${label}] Property set: ${String(prop)}`, value);
      return Reflect.set(target, prop, value, receiver);
    }
  });
}
