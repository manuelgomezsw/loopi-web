import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth/auth-service';
import {NotificationService} from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  isLoading = false;
  hidePassword = true;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      this.notification.warning('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    const credentials = {
      email: this.form.value.email!,
      password: this.form.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.notification.success('¡Bienvenido! Inicio de sesión exitoso');
        this.router.navigate(['/auth/select-context']);
      },
      error: (error) => {
        // El GlobalErrorHandler ya maneja el error HTTP
        // Solo necesitamos resetear el loading
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName === 'email' ? 'Email' : 'Contraseña'} es requerido`;
    }
    
    if (field?.hasError('email')) {
      return 'Email debe tener un formato válido';
    }
    
    if (field?.hasError('minlength')) {
      return 'Contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
