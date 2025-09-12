import { TestBed } from '@angular/core/testing';
import { setupLocalStorageMock, TestDataFactory } from '../../../testing/test-utils';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;
  let mockLocalStorage: Storage;

  setupLocalStorageMock();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);
    mockLocalStorage = window.localStorage;
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  describe('setToken', () => {
    it('should store token with default expiration', () => {
      const token = 'test-token';

      service.setToken(token);

      expect(mockLocalStorage.getItem('loopi_auth_token')).toBeTruthy();
    });

    it('should store token with custom expiration', () => {
      const token = 'test-token';
      const expiresIn = 3600; // 1 hora

      service.setToken(token, expiresIn);

      const stored = service.getToken();
      expect(stored).toBe(token);
    });

    it('should encrypt stored data', () => {
      const token = 'test-token';

      service.setToken(token);

      const rawStored = mockLocalStorage.getItem('loopi_auth_token');
      expect(rawStored).not.toContain(token); // Debe estar encriptado
    });
  });

  describe('getToken', () => {
    it('should return valid token', () => {
      const token = 'test-token';
      service.setToken(token);

      const retrieved = service.getToken();

      expect(retrieved).toBe(token);
    });

    it('should return null for expired token', () => {
      const token = 'test-token';
      const expiresIn = -1; // Token ya expirado

      service.setToken(token, expiresIn);

      const retrieved = service.getToken();

      expect(retrieved).toBeNull();
      expect(mockLocalStorage.getItem('loopi_auth_token')).toBeNull();
    });

    it('should return null when no token exists', () => {
      const retrieved = service.getToken();

      expect(retrieved).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      mockLocalStorage.setItem('loopi_auth_token', 'corrupted-data');

      const retrieved = service.getToken();

      expect(retrieved).toBeNull();
      expect(mockLocalStorage.getItem('loopi_auth_token')).toBeNull();
    });
  });

  describe('hasValidToken', () => {
    it('should return true for valid token', () => {
      service.setToken('test-token');

      expect(service.hasValidToken()).toBe(true);
    });

    it('should return false for expired token', () => {
      service.setToken('test-token', -1);

      expect(service.hasValidToken()).toBe(false);
    });

    it('should return false when no token exists', () => {
      expect(service.hasValidToken()).toBe(false);
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should return remaining time for valid token', () => {
      const expiresIn = 3600; // 1 hora
      service.setToken('test-token', expiresIn);

      const remainingTime = service.getTokenExpirationTime();

      expect(remainingTime).toBeGreaterThan(3500);
      expect(remainingTime).toBeLessThanOrEqual(3600);
    });

    it('should return null for no token', () => {
      const remainingTime = service.getTokenExpirationTime();

      expect(remainingTime).toBeNull();
    });

    it('should return 0 for expired token', () => {
      service.setToken('test-token', -1);

      const remainingTime = service.getTokenExpirationTime();

      expect(remainingTime).toBeNull(); // Token expirado se limpia
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should return true when token expires in less than 5 minutes', () => {
      const expiresIn = 200; // 200 segundos (menos de 5 minutos)
      service.setToken('test-token', expiresIn);

      expect(service.isTokenExpiringSoon()).toBe(true);
    });

    it('should return false when token has more than 5 minutes', () => {
      const expiresIn = 400; // 400 segundos (más de 5 minutos)
      service.setToken('test-token', expiresIn);

      expect(service.isTokenExpiringSoon()).toBe(false);
    });

    it('should return false when no token exists', () => {
      expect(service.isTokenExpiringSoon()).toBe(false);
    });
  });

  describe('clearToken', () => {
    it('should remove token from storage', () => {
      service.setToken('test-token');

      service.clearToken();

      expect(service.getToken()).toBeNull();
      expect(mockLocalStorage.getItem('loopi_auth_token')).toBeNull();
    });
  });

  describe('refreshTokenExpiration', () => {
    it('should update expiration for existing token', () => {
      service.setToken('test-token', 1000);

      const success = service.refreshTokenExpiration(3600);

      expect(success).toBe(true);
      expect(service.getToken()).toBe('test-token');

      const newExpirationTime = service.getTokenExpirationTime();
      expect(newExpirationTime).toBeGreaterThan(3500);
    });

    it('should fail when no token exists', () => {
      const success = service.refreshTokenExpiration(3600);

      expect(success).toBe(false);
    });

    it('should handle corrupted data gracefully', () => {
      mockLocalStorage.setItem('loopi_auth_token', 'corrupted-data');

      const success = service.refreshTokenExpiration(3600);

      expect(success).toBe(false);
    });
  });

  describe('encryption/decryption', () => {
    it('should encrypt and decrypt data correctly', () => {
      const originalData = TestDataFactory.createTokenData();
      service.setToken(originalData.token);

      const retrieved = service.getToken();

      expect(retrieved).toBe(originalData.token);
    });

    it('should handle encryption errors gracefully', () => {
      // Simular datos corruptos
      mockLocalStorage.setItem('loopi_auth_token', 'invalid-encrypted-data');

      const token = service.getToken();

      expect(token).toBeNull();
    });
  });
});
