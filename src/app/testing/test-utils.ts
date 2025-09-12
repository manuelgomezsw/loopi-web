import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Configuración base para tests que necesitan HTTP
 */
export function setupHttpTesting() {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ]
    });
  });

  return {
    getHttpController: () => TestBed.inject(HttpTestingController),
    tearDown: () => {
      const httpController = TestBed.inject(HttpTestingController);
      httpController.verify();
    }
  };
}

/**
 * Configuración base para tests que necesitan router
 */
export function setupRouterTesting(routes: any[] = []) {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatSnackBarModule,
        NoopAnimationsModule
      ]
    });
  });
}

/**
 * Configuración completa para tests de servicios
 */
export function setupServiceTesting() {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ]
    });
  });

  return {
    getHttpController: () => TestBed.inject(HttpTestingController),
    tearDown: () => {
      const httpController = TestBed.inject(HttpTestingController);
      httpController.verify();
    }
  };
}

/**
 * Mock para localStorage
 */
export class MockLocalStorage {
  private store: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * Configurar mock de localStorage
 */
export function setupLocalStorageMock(): MockLocalStorage {
  const mockLocalStorage = new MockLocalStorage();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    mockLocalStorage.clear();
  });

  return mockLocalStorage;
}

/**
 * Componente dummy para tests de routing
 */
@Component({
  template: '<div>Test Component</div>'
})
export class TestComponent {}

/**
 * Utilidades para crear datos de prueba
 */
export class TestDataFactory {

  static createLoginResponse(overrides: Partial<any> = {}) {
    return {
      token: 'mock-jwt-token',
      expiresIn: 3600,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      },
      ...overrides
    };
  }

  static createTokenData(overrides: Partial<any> = {}) {
    return {
      token: 'mock-jwt-token',
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
      ...overrides
    };
  }

  static createWorkContext(overrides: Partial<any> = {}) {
    return {
      franchiseID: 1,
      storeID: 1,
      franchiseName: 'Test Franchise',
      storeName: 'Test Store',
      ...overrides
    };
  }

  static createCredentials(overrides: Partial<any> = {}) {
    return {
      email: 'test@example.com',
      password: 'password123',
      ...overrides
    };
  }
}

/**
 * Matcher personalizado para verificar llamadas HTTP
 */
export function expectHttpCall(
  httpController: HttpTestingController,
  method: string,
  url: string,
  responseData?: any,
  status: number = 200
) {
  const req = httpController.expectOne(url);
  expect(req.request.method).toBe(method);

  if (responseData !== undefined) {
    req.flush(responseData, { status, statusText: 'OK' });
  }

  return req;
}

/**
 * Esperar un tiempo específico en tests asíncronos
 */
export function wait(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock para console.error en tests
 */
export function mockConsoleError(): jasmine.Spy {
  return spyOn(console, 'error').and.stub();
}

/**
 * Mock para console.log en tests
 */
export function mockConsoleLog(): jasmine.Spy {
  return spyOn(console, 'log').and.stub();
}
