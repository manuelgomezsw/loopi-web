import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EmployeeResponse } from '../../../../core/interfaces/api.interfaces';
import { AssignedShiftRequest, AssignedShiftsService } from '../../../../core/services/assigned-shifts/assigned-shifts';
import { EmployeeService } from '../../../../core/services/employee/employee';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { extractBackendErrorMessage } from '../../../../core/utils/error-handler.utils';
import { Shift } from '../../../../model/shift';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-shift-form',
  imports: [
    PageTitleComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './shift-form.html',
  styleUrl: './shift-form.css'
})
export class ShiftAssignFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shiftService = inject(ShiftService);
  private employeeService = inject(EmployeeService);
  private assignedShiftsService = inject(AssignedShiftsService);
  private contextService = inject(WorkContextService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  storeId!: number;
  shifts: Shift[] = [];
  employees: EmployeeResponse[] = [];
  isLoading = false;

  form = this.fb.group({
    shift_id: [null, Validators.required],
    employee_id: [null, Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required]
  });

  ngOnInit(): void {
    this.storeId = this.contextService.getStoreId();
    this.loadShiftsAndEmployees();
  }

  loadShiftsAndEmployees(): void {
    this.shiftService.getByStore(this.storeId).subscribe(shifts => {
      this.shifts = shifts;
    });

    this.employeeService.getByStore(this.storeId).subscribe(employees => {
      this.employees = employees;
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.notificationService.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (this.isLoading) return;

    const formData = this.form.value;

    // Convertir fechas a formato ISO con tiempo
    const startDate = new Date(formData.start_date + 'T00:00:00Z');
    const endDate = new Date(formData.end_date + 'T23:59:59Z');

    const assignmentData: AssignedShiftRequest = {
      user_id: formData.employee_id!,
      shift_id: formData.shift_id!,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };

    this.isLoading = true;

    this.assignedShiftsService
      .create(assignmentData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = extractBackendErrorMessage(error);
          this.notificationService.error(errorMessage);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(result => {
        this.isLoading = false;

        if (result) {
          this.notificationService.success('Turno asignado exitosamente');
          this.router.navigate(['/shifts/planning']);
        }
      });
  }
}
