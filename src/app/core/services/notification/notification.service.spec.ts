import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { setupServiceTesting } from '../../../testing/test-utils';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let matSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockSnackBarRef: jasmine.SpyObj<MatSnackBarRef<any>>;

  setupServiceTesting();

  beforeEach(() => {
    mockSnackBarRef = jasmine.createSpyObj('MatSnackBarRef', ['dismiss']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open', 'dismiss']);
    snackBarSpy.open.and.returnValue(mockSnackBarRef);

    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
    matSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  describe('success', () => {
    it('should show success notification with correct styling', () => {
      const message = 'Operation successful';

      service.success(message);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-success']
        })
      );
    });

    it('should show success notification with close button when requested', () => {
      const message = 'Success message';

      service.success(message, { showCloseButton: true });

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        'Cerrar',
        jasmine.objectContaining({
          panelClass: ['notification-success']
        })
      );
    });
  });

  describe('error', () => {
    it('should show error notification with longer duration', () => {
      const message = 'Error occurred';

      service.error(message);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          duration: 7000,
          panelClass: ['notification-error']
        })
      );
    });

    it('should show error notification with custom options', () => {
      const message = 'Custom error';
      const options = { duration: 10000, showCloseButton: true };

      service.error(message, options);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        'Cerrar',
        jasmine.objectContaining({
          duration: 10000,
          panelClass: ['notification-error']
        })
      );
    });
  });

  describe('warning', () => {
    it('should show warning notification with correct styling', () => {
      const message = 'Warning message';

      service.warning(message);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-warning']
        })
      );
    });
  });

  describe('info', () => {
    it('should show info notification with correct styling', () => {
      const message = 'Information message';

      service.info(message);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-info']
        })
      );
    });
  });

  describe('show', () => {
    it('should show generic notification with default config', () => {
      const message = 'Generic message';

      service.show(message);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      );
    });

    it('should merge custom options with defaults', () => {
      const message = 'Custom message';
      const options = {
        duration: 3000,
        horizontalPosition: 'left' as const,
        panelClass: ['custom-class']
      };

      service.show(message, options);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        message,
        undefined,
        jasmine.objectContaining({
          duration: 3000,
          horizontalPosition: 'left',
          verticalPosition: 'top',
          panelClass: ['custom-class']
        })
      );
    });
  });

  describe('dismiss', () => {
    it('should dismiss all active notifications', () => {
      service.dismiss();

      expect(matSnackBar.dismiss).toHaveBeenCalled();
    });
  });

  describe('formError', () => {
    it('should show first validation error', () => {
      const fieldErrors = {
        email: ['Email is required', 'Email is invalid'],
        password: ['Password is required']
      };

      service.formError(fieldErrors);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Error en formulario: Email is required',
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-error']
        })
      );
    });

    it('should not show notification when no errors', () => {
      service.formError({});

      expect(matSnackBar.open).not.toHaveBeenCalled();
    });
  });

  describe('connectionError', () => {
    it('should show connection error with close button and extended duration', () => {
      service.connectionError();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Error de conexión. Verifica tu internet e intenta nuevamente.',
        'Cerrar',
        jasmine.objectContaining({
          duration: 10000,
          panelClass: ['notification-error']
        })
      );
    });
  });

  describe('sessionExpired', () => {
    it('should show session expired warning with short duration', () => {
      service.sessionExpired();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Tu sesión ha expirado. Serás redirigido al login.',
        undefined,
        jasmine.objectContaining({
          duration: 3000,
          panelClass: ['notification-warning']
        })
      );
    });
  });

  describe('actionSuccess', () => {
    it('should show success message for completed action', () => {
      const action = 'Guardado';

      service.actionSuccess(action);

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Guardado realizada exitosamente',
        undefined,
        jasmine.objectContaining({
          panelClass: ['notification-success']
        })
      );
    });
  });

  describe('integration', () => {
    it('should return SnackBarRef for further manipulation', () => {
      const result = service.success('Test message');

      expect(result).toBe(mockSnackBarRef);
    });

    it('should handle multiple notification types in sequence', () => {
      service.info('Info message');
      service.warning('Warning message');
      service.error('Error message');
      service.success('Success message');

      expect(matSnackBar.open).toHaveBeenCalledTimes(4);
    });
  });
});
