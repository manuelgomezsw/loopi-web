/**
 * Tests para las utilidades de manejo de errores
 */

import { HttpErrorResponse } from '@angular/common/http';
import { createBackendErrorHandler, extractBackendErrorMessage, hasBackendErrorMessage } from './error-handler.utils';

describe('Error Handler Utils', () => {
  describe('extractBackendErrorMessage', () => {
    it('should extract backend error message from standard format', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: { error: 'end_time (07:00) must be after start_time (07:30)' }
      });

      const result = extractBackendErrorMessage(error);
      expect(result).toBe('end_time (07:00) must be after start_time (07:30)');
    });

    it('should handle string error format', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: 'Simple error message'
      });

      const result = extractBackendErrorMessage(error);
      expect(result).toBe('Simple error message');
    });

    it('should return generic message for unknown error format', () => {
      const error = new HttpErrorResponse({
        status: 500,
        error: null
      });

      const result = extractBackendErrorMessage(error);
      expect(result).toBe('Error interno del servidor.');
    });

    it('should handle 404 errors with generic message', () => {
      const error = new HttpErrorResponse({
        status: 404,
        error: {}
      });

      const result = extractBackendErrorMessage(error);
      expect(result).toBe('Recurso no encontrado.');
    });
  });

  describe('hasBackendErrorMessage', () => {
    it('should return true for valid backend error format', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: { error: 'Validation failed' }
      });

      expect(hasBackendErrorMessage(error)).toBe(true);
    });

    it('should return false for invalid format', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: { message: 'Different format' }
      });

      expect(hasBackendErrorMessage(error)).toBe(false);
    });

    it('should return false for empty error message', () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: { error: '' }
      });

      expect(hasBackendErrorMessage(error)).toBe(false);
    });
  });

  describe('createBackendErrorHandler', () => {
    it('should create a handler that extracts backend messages', () => {
      const handler = createBackendErrorHandler('Fallback message');
      const error = new HttpErrorResponse({
        status: 400,
        error: { error: 'Backend specific error' }
      });

      const result = handler(error);
      expect(result).toBe('Backend specific error');
    });

    it('should use fallback message when no backend message', () => {
      const handler = createBackendErrorHandler('Custom fallback');
      const error = new HttpErrorResponse({
        status: 500,
        error: null
      });

      const result = handler(error);
      expect(result).toBe('Custom fallback');
    });

    it('should use generic message when no fallback provided', () => {
      const handler = createBackendErrorHandler();
      const error = new HttpErrorResponse({
        status: 401,
        error: null
      });

      const result = handler(error);
      expect(result).toBe('No autorizado. Inicia sesión nuevamente.');
    });
  });
});
