import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatError, MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest
} from '../../../core/interfaces/api.interfaces';
import { WorkContextService } from '../../../core/services/work-context/work-context';
import { LoadingProgressComponent } from '../../../shared/loading-progress/loading-progress';
import { PageTitleComponent } from '../../../shared/page-title-component/page-title-component';
import { AppState } from '../../../store/app.state';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import { selectEmployeeById, selectEmployeeLoading } from '../../../store/employee/employee.selectors';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    PageTitleComponent,
    LoadingProgressComponent,
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatOption,
    MatSelect,
    MatCheckbox
  ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store<AppState>);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private workContextService = inject(WorkContextService);
  private destroy$ = new Subject<void>();

  employeeId: number | null = null;
  isEditMode = false;
  isLoading$: Observable<boolean> = this.store.select(selectEmployeeLoading);

  // Opciones para selects
  documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' },
    { value: 'PTP', label: 'Permisos especiales' }
  ];

  // DatePicker configuration
  maxBirthDate = new Date(); // No permitir fechas futuras
  defaultBirthDate = new Date(1990, 0, 1); // Fecha por defecto: 1 de enero de 1990

  // Formulario reactivo - Coincide con el backend loopi-api
  employeeForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    document_type: ['CC', Validators.required],
    document_number: ['', [Validators.required, Validators.minLength(6)]],
    birthdate: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    position: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(0)]],
    is_active: [true]
  });

  ngOnInit(): void {
    // Obtener ID del empleado de la ruta (si existe)
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.employeeId = params['id'] ? +params['id'] : null;
      this.isEditMode = !!this.employeeId;

      if (this.isEditMode && this.employeeId) {
        this.loadEmployee(this.employeeId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEmployee(id: number): void {
    // Cargar empleado para editar
    this.store.dispatch(EmployeeActions.loadEmployee({ id }));

    // Suscribirse a los cambios del empleado
    this.store
      .select(selectEmployeeById(id))
      .pipe(
        takeUntil(this.destroy$),
        filter(employee => !!employee)
      )
      .subscribe(employee => {
        this.populateForm(employee!);
      });
  }

  private populateForm(employee: EmployeeResponse): void {
    this.employeeForm.patchValue({
      first_name: employee.first_name,
      last_name: employee.last_name,
      document_type: employee.document_type,
      document_number: employee.document_number,
      birthdate: employee.birthdate,
      phone: employee.phone,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      is_active: employee.is_active
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    const workContext = this.workContextService.get();

    if (!workContext) {
      console.error('❌ No work context available');
      return;
    }

    if (this.isEditMode && this.employeeId) {
      // Actualizar empleado existente
      const updateData: EmployeeUpdateRequest = {
        first_name: formValue.first_name!,
        last_name: formValue.last_name!,
        document_type: formValue.document_type!,
        document_number: formValue.document_number!,
        birthdate: formValue.birthdate!,
        phone: formValue.phone!,
        email: formValue.email!,
        position: formValue.position!,
        salary: formValue.salary!,
        is_active: formValue.is_active!
      };

      this.store.dispatch(
        EmployeeActions.updateEmployee({
          id: this.employeeId,
          changes: updateData
        })
      );
    } else {
      // Crear nuevo empleado
      const createData: EmployeeCreateRequest = {
        first_name: formValue.first_name!,
        last_name: formValue.last_name!,
        document_type: formValue.document_type!,
        document_number: formValue.document_number!,
        birthdate: formValue.birthdate!,
        phone: formValue.phone!,
        email: formValue.email!,
        position: formValue.position!,
        salary: formValue.salary!,
        is_active: formValue.is_active!,
        store_id: workContext.storeID
      };

      this.store.dispatch(EmployeeActions.createEmployee({ employee: createData }));
    }

    // Navegar de vuelta a la lista después de guardar
    this.router.navigate(['/employees']);
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helpers para validación en template
  hasFieldError(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} es requerido`;
    }

    if (field?.hasError('email')) {
      return 'Email debe tener un formato válido';
    }

    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} es muy corto`;
    }

    if (field?.hasError('pattern')) {
      return `${this.getFieldLabel(fieldName)} tiene un formato inválido`;
    }

    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} no puede tener más de ${maxLength} caracteres`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      first_name: 'Nombres',
      last_name: 'Apellidos',
      document_type: 'Tipo de documento',
      document_number: 'Número de documento',
      birthdate: 'Fecha de nacimiento',
      phone: 'Teléfono',
      email: 'Email',
      position: 'Cargo',
      salary: 'Salario',
      is_active: 'Activo'
    };
    return labels[fieldName] || fieldName;
  }
}
