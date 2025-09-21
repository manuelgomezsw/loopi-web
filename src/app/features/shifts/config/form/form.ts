import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTimepicker, MatTimepickerInput, MatTimepickerToggle } from '@angular/material/timepicker';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { extractBackendErrorMessage } from '../../../../core/utils/error-handler.utils';
import { Shift } from '../../../../model/shift';
import { LoadingProgressComponent } from '../../../../shared/loading-progress/loading-progress';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-shift-config-form',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    LoadingProgressComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class ShiftConfigFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shiftService = inject(ShiftService);
  private notificationService = inject(NotificationService);
  private workContextService = inject(WorkContextService);

  shiftId?: number;
  isEditMode = false;
  isLoading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    start_time: ['', [Validators.required, this.timeRangeValidator.bind(this)]],
    end_time: ['', [Validators.required, this.timeRangeValidator.bind(this)]],
    lunch_minutes: [60, Validators.required],
    store_id: [0, Validators.required], // Se establecerá desde el contexto
    working_days: [[] as string[], Validators.required] // Días laborales requeridos
  });

  // Opciones de días de la semana
  weekDays = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.shiftId = idParam ? Number(idParam) : undefined;
    this.isEditMode = !!this.shiftId && !isNaN(this.shiftId);

    // Establecer el store_id desde el contexto de trabajo
    const storeId: number = this.workContextService.getStoreId();
    if (storeId && !isNaN(storeId)) {
      this.form.patchValue({ store_id: storeId });
    } else {
      this.notificationService.error('No se ha seleccionado una tienda. Por favor, selecciona un contexto de trabajo.');
      this.router.navigate(['/']);
      return;
    }

    if (this.isEditMode) {
      this.loadShift();
    }
  }

  private loadShift(): void {
    if (!this.shiftId) return;

    this.isLoading = true;

    this.shiftService
      .getById(this.shiftId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = extractBackendErrorMessage(error);
          this.notificationService.error(errorMessage);
          this.router.navigate(['/shifts/config/list']);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(shift => {
        this.isLoading = false;

        if (shift) {
          // Mapear los datos del turno al formulario
          this.form.patchValue({
            name: shift.name,
            start_time: shift.start_time,
            end_time: shift.end_time,
            lunch_minutes: shift.lunch_minutes,
            store_id: shift.store_id,
            working_days: shift.working_days ?? []
          });

          console.warn('Turno cargado para edición:', shift);
        } else {
          this.notificationService.error('No se pudo cargar la información del turno');
          this.router.navigate(['/shifts/config/list']);
        }
      });
  }

  save(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;
    const formatTime = (date: Date | string): string => {
      if (typeof date === 'string') return date;
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const shift: Shift = {
      name: raw.name ?? '',
      start_time: formatTime(raw.start_time ?? new Date()),
      end_time: formatTime(raw.end_time ?? new Date()),
      lunch_minutes: raw.lunch_minutes ?? 0,
      store_id: raw.store_id ?? 1,
      working_days: raw.working_days ?? []
    };

    const action = this.isEditMode
      ? this.shiftService.update(this.shiftId as number, shift)
      : this.shiftService.create(shift);

    action
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = extractBackendErrorMessage(error);
          this.notificationService.error(errorMessage);
          return of(null);
        })
      )
      .subscribe(result => {
        if (result !== null) {
          const successMessage = this.isEditMode ? 'Turno actualizado exitosamente' : 'Turno creado exitosamente';
          this.notificationService.success(successMessage);
          this.router.navigate(['/shifts/config/list']);
        }
      });
  }

  // Validador personalizado para el rango de horas (6:00 AM - 9:00 PM)
  timeRangeValidator(control: { value: string | Date | null }) {
    if (!control.value) return null;

    let timeValue: Date;

    // Si es un string, convertir a Date
    if (typeof control.value === 'string') {
      const [hours, minutes] = control.value.split(':').map(Number);
      timeValue = new Date();
      timeValue.setHours(hours, minutes, 0, 0);
    } else if (control.value instanceof Date) {
      timeValue = control.value;
    } else {
      return null;
    }

    const hour = timeValue.getHours();

    // Validar que esté entre 6:00 AM (6) y 9:00 PM (21)
    if (hour < 6 || hour > 21) {
      return { timeRange: { message: 'La hora debe estar entre 6:00 AM y 9:00 PM' } };
    }

    return null;
  }
}
