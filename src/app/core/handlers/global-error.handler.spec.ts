import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error.handler';
import { NotificationService } from '../services/notification/notification.service';
import { TokenStorageService } from '../services/token-storage/token-storage.service';
import { setupServiceTesting, mockConsoleError } from '../../testing/test-utils';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;
  let tokenStorageService: jasmine.SpyObj<TokenStorageService>;

  setupServiceTesting();

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'error',
      'warning',
      'connectionError',
      'formError',
      'sessionExpired'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const tokenStorageSpy = jasmine.createSpyObj('TokenStorageService', ['clearToken']);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TokenStorageService, useValue: tokenStorageSpy }
      ]
    });

    handler = TestBed.inject(GlobalErrorHandler);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    tokenStorageService = TestBed.inject(TokenStorageService) as jasmine.SpyObj<TokenStorageService>;

    mockConsoleError();
  });

  describe('handleError', () => {
    it('should handle JavaScript errors', () => {
      const jsError = new Error('JavaScript error');

      handler.handleError(jsError);

      expect(console.error).toHaveBeenCalledWith('Error capturado por GlobalErrorHandler:', jsError);
    });

    it('should handle HTTP errors', () => {
      const httpError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error'
      });

      handler.handleError(httpError);

      expect(console.error).toHaveBeenCalledWith('Error capturado por GlobalErrorHandler:', httpError);
    });
  });

  describe('HTTP Error Handling', () => {
    describe('Network errors (status 0)', () => {
      it('should show connection error', () => {
        const networkError = new HttpErrorResponse({ status: 0 });

        handler.handleError(networkError);

        expect(notificationService.connectionError).toHaveBeenCalled();
      });
    });

    describe('Unauthorized (status 401)', () => {
      it('should clear token, show session expired message and redirect', () => {
        const unauthorizedError = new HttpErrorResponse({ status: 401 });
        jasmine.clock().install();

        handler.handleError(unauthorizedError);

        expect(tokenStorageService.clearToken).toHaveBeenCalled();
        expect(notificationService.sessionExpired).toHaveBeenCalled();

        jasmine.clock().tick(2000);
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);

        jasmine.clock().uninstall();
      });
    });

    describe('Forbidden (status 403)', () => {
      it('should show permission error', () => {
        const forbiddenError = new HttpErrorResponse({ status: 403 });

        handler.handleError(forbiddenError);

        expect(notificationService.error).toHaveBeenCalledWith('No tienes permisos para realizar esta acción');
      });
    });

    describe('Not Found (status 404)', () => {
      it('should show resource not found error', () => {
        const notFoundError = new HttpErrorResponse({ status: 404 });

        handler.handleError(notFoundError);

        expect(notificationService.error).toHaveBeenCalledWith('Recurso no encontrado');
      });
    });

    describe('Validation Error (status 422)', () => {
      it('should show form validation errors', () => {
        const validationError = new HttpErrorResponse({
          status: 422,
          error: {
            errors: {
              email: ['Email is required'],
              password: ['Password is too short']
            }
          }
        });

        handler.handleError(validationError);

        expect(notificationService.formError).toHaveBeenCalledWith({
          email: ['Email is required'],
          password: ['Password is too short']
        });
      });

      it('should show generic validation error when no specific errors', () => {
        const validationError = new HttpErrorResponse({
          status: 422,
          error: {}
        });

        handler.handleError(validationError);

        expect(notificationService.error).toHaveBeenCalledWith('Datos inválidos enviados');
      });
    });

    describe('Too Many Requests (status 429)', () => {
      it('should show rate limit warning', () => {
        const rateLimitError = new HttpErrorResponse({ status: 429 });

        handler.handleError(rateLimitError);

        expect(notificationService.warning).toHaveBeenCalledWith('Demasiadas peticiones. Intenta más tarde');
      });
    });

    describe('Server Errors (5xx)', () => {
      [500, 502, 503, 504].forEach(status => {
        it(`should show server error for status ${status}`, () => {
          const serverError = new HttpErrorResponse({ status });

          handler.handleError(serverError);

          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor. Intenta más tarde');
        });
      });
    });

    describe('Generic HTTP errors', () => {
      it('should show custom error message from response', () => {
        const customError = new HttpErrorResponse({
          status: 400,
          error: { message: 'Custom error message' }
        });

        handler.handleError(customError);

        expect(notificationService.error).toHaveBeenCalledWith('Custom error message');
      });

      it('should show generic error when no custom message', () => {
        const genericError = new HttpErrorResponse({
          status: 400,
          error: {}
        });

        handler.handleError(genericError);

        expect(notificationService.error).toHaveBeenCalledWith('Ha ocurrido un error inesperado');
      });
    });
  });

  describe('Client Error Handling', () => {
    beforeEach(() => {
      // Mock production detection
      spyOnProperty(window.location, 'hostname', 'get').and.returnValue('localhost');
    });

    it('should show detailed error in development', () => {
      const jsError = new Error('Development error');

      handler.handleError(jsError);

      expect(notificationService.error).toHaveBeenCalledWith(
        'Error de aplicación: Development error',
        jasmine.objectContaining({
          duration: 10000,
          showCloseButton: true
        })
      );
    });

    it('should show generic error in production', () => {
      spyOnProperty(window.location, 'hostname', 'get').and.returnValue('production.com');
      const jsError = new Error('Production error');

      handler.handleError(jsError);

      expect(notificationService.error).toHaveBeenCalledWith('Ha ocurrido un error inesperado');
    });
  });

  describe('Error Logging', () => {
    it('should log structured error information', () => {
      const error = new Error('Test error');
      spyOn(console, 'group');
      spyOn(console, 'groupEnd');

      handler.handleError(error);

      expect(console.group).toHaveBeenCalledWith('🚨 Error Details');
      expect(console.error).toHaveBeenCalledWith('Message:', 'Test error');
      expect(console.error).toHaveBeenCalledWith('Stack:', error.stack);
      expect(console.error).toHaveBeenCalledWith('URL:', window.location.href);
      expect(console.groupEnd).toHaveBeenCalled();
    });

    it('should log HTTP-specific information for HTTP errors', () => {
      const httpError = new HttpErrorResponse({
        status: 400,
        error: { message: 'Bad request' }
      });
      spyOn(console, 'group');
      spyOn(console, 'groupEnd');

      handler.handleError(httpError);

      expect(console.error).toHaveBeenCalledWith('HTTP Status:', 400);
      expect(console.error).toHaveBeenCalledWith('HTTP Error:', { message: 'Bad request' });
    });
  });
});
