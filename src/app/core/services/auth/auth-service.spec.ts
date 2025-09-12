import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginResponse, ContextResponse } from './auth-service';
import { TokenStorageService } from '../token-storage/token-storage.service';
import { WorkContextService } from '../work-context/work-context';
import { setupServiceTesting, TestDataFactory, expectHttpCall } from '../../../testing/test-utils';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenStorageService: jasmine.SpyObj<TokenStorageService>;
  let workContextService: jasmine.SpyObj<WorkContextService>;
  
  const testUtils = setupServiceTesting();

  beforeEach(() => {
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', [
      'setToken', 'getToken', 'hasValidToken', 'clearToken', 'isTokenExpiringSoon', 'getTokenExpirationTime'
    ]);
    const workContextSpy = jasmine.createSpyObj('WorkContextService', ['clear']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStorageService, useValue: tokenStorageSpy },
        { provide: WorkContextService, useValue: workContextSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpController = testUtils.getHttpController();
    tokenStorageService = TestBed.inject(TokenStorageService) as jasmine.SpyObj<TokenStorageService>;
    workContextService = TestBed.inject(WorkContextService) as jasmine.SpyObj<WorkContextService>;
  });

  afterEach(() => {
    testUtils.tearDown();
  });

  describe('login', () => {
    it('should login successfully and store token', () => {
      const credentials = TestDataFactory.createCredentials();
      const loginResponse = TestDataFactory.createLoginResponse();

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(loginResponse);
        expect(tokenStorageService.setToken).toHaveBeenCalledWith(
          loginResponse.token, 
          loginResponse.expiresIn
        );
      });

      expectHttpCall(
        httpController, 
        'POST', 
        `${environment.apiUrl}/auth/login`, 
        loginResponse
      );
    });

    it('should handle login error', () => {
      const credentials = TestDataFactory.createCredentials();

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(tokenStorageService.setToken).not.toHaveBeenCalled();
        }
      });

      const req = httpController.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('selectContext', () => {
    it('should select context successfully and update token', () => {
      const context = { franchise_id: 1, store_id: 1 };
      const contextResponse: ContextResponse = { token: 'new-token', expiresIn: 3600 };

      service.selectContext(context).subscribe(response => {
        expect(response).toEqual(contextResponse);
        expect(tokenStorageService.setToken).toHaveBeenCalledWith(
          contextResponse.token, 
          contextResponse.expiresIn
        );
      });

      expectHttpCall(
        httpController,
        'POST',
        `${environment.apiUrl}/auth/context`,
        contextResponse
      );
    });
  });

  describe('logout', () => {
    it('should clear token and work context', () => {
      service.logout();

      expect(tokenStorageService.clearToken).toHaveBeenCalled();
      expect(workContextService.clear).toHaveBeenCalled();

      // Verificar que se llama al endpoint de logout
      expectHttpCall(
        httpController,
        'POST',
        `${environment.apiUrl}/auth/logout`,
        {}
      );
    });

    it('should handle logout backend error gracefully', () => {
      service.logout();

      const req = httpController.expectOne(`${environment.apiUrl}/auth/logout`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      // Debería limpiar localmente aunque falle el backend
      expect(tokenStorageService.clearToken).toHaveBeenCalled();
      expect(workContextService.clear).toHaveBeenCalled();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when has valid token', () => {
      tokenStorageService.hasValidToken.and.returnValue(true);

      const result = service.isLoggedIn();

      expect(result).toBe(true);
      expect(tokenStorageService.hasValidToken).toHaveBeenCalled();
    });

    it('should return false when no valid token', () => {
      tokenStorageService.hasValidToken.and.returnValue(false);

      const result = service.isLoggedIn();

      expect(result).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token from storage service', () => {
      const expectedToken = 'test-token';
      tokenStorageService.getToken.and.returnValue(expectedToken);

      const token = service.getToken();

      expect(token).toBe(expectedToken);
      expect(tokenStorageService.getToken).toHaveBeenCalled();
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should delegate to token storage service', () => {
      tokenStorageService.isTokenExpiringSoon.and.returnValue(true);

      const result = service.isTokenExpiringSoon();

      expect(result).toBe(true);
      expect(tokenStorageService.isTokenExpiringSoon).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      const refreshResponse: ContextResponse = { token: 'refreshed-token', expiresIn: 3600 };

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(refreshResponse);
        expect(tokenStorageService.setToken).toHaveBeenCalledWith(
          refreshResponse.token, 
          refreshResponse.expiresIn
        );
      });

      expectHttpCall(
        httpController,
        'POST',
        `${environment.apiUrl}/auth/refresh`,
        refreshResponse
      );
    });
  });

  describe('checkAuthStatus', () => {
    it('should return true for valid authentication', () => {
      tokenStorageService.hasValidToken.and.returnValue(true);

      const result = service.checkAuthStatus();

      expect(result).toBe(true);
    });

    it('should logout and return false for invalid authentication', () => {
      tokenStorageService.hasValidToken.and.returnValue(false);
      spyOn(service, 'logout');

      const result = service.checkAuthStatus();

      expect(result).toBe(false);
      expect(service.logout).toHaveBeenCalled();
    });
  });
});
