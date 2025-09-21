import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { EmployeeResponse } from '../../../../core/interfaces/api.interfaces';
import { AssignedShiftRequest, AssignedShiftsService } from '../../../../core/services/assigned-shifts/assigned-shifts';
import { EmployeeService } from '../../../../core/services/employee/employee';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { extractBackendErrorMessage } from '../../../../core/utils/error-handler.utils';
import { AssignedShift } from '../../../../model/assigned-shift';
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
  private route = inject(ActivatedRoute);

  storeId!: number;
  shifts: Shift[] = [];
  employees: EmployeeResponse[] = [];
  isLoading = false;
  isEditMode = false;
  assignmentId: number | null = null;
  currentAssignment: AssignedShift | null = null;

  form = this.fb.group({
    shift_id: [null, Validators.required],
    employee_id: [null, Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required]
  });

  ngOnInit(): void {
    this.storeId = this.contextService.getStoreId();

    // Verificar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.assignmentId = +params['id'];
        this.loadAssignmentForEdit();
      }
    });

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

  loadAssignmentForEdit(): void {
    if (!this.assignmentId) return;

    this.assignedShiftsService.getById(this.assignmentId).subscribe({
      next: assignment => {
        this.currentAssignment = assignment as any; // Convertir AssignedShiftResponse a AssignedShift
        this.populateForm(assignment);
      },
      error: error => {
        console.error('Error al cargar la asignación:', error);
        this.notificationService.error('Error al cargar la asignación');
        this.router.navigate(['/shifts']);
      }
    });
  }

  private populateForm(assignment: any): void {
    // Convertir fechas ISO a formato de input date (YYYY-MM-DD)
    const startDate = this.convertISOToDateInput(assignment.start_date);
    const endDate = this.convertISOToDateInput(assignment.end_date);

    this.form.patchValue({
      employee_id: assignment.user_id,
      shift_id: assignment.shift_id,
      start_date: startDate,
      end_date: endDate
    });
  }

  private convertISOToDateInput(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  save(): void {
    if (this.form.invalid) {
      this.notificationService.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (this.isLoading) return;

    const formData = this.form.value;

    // Convertir fechas a formato ISO con tiempo
    const startDate = new Date(`${formData.start_date}T00:00:00Z`);
    const endDate = new Date(`${formData.end_date}T23:59:59Z`);

    const assignmentData: AssignedShiftRequest = {
      user_id: formData.employee_id!,
      shift_id: formData.shift_id!,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };

    this.isLoading = true;

    const operation =
      this.isEditMode && this.assignmentId
        ? this.assignedShiftsService.updateAssignment(this.assignmentId, assignmentData)
        : this.assignedShiftsService.create(assignmentData);

    operation
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
          const successMessage = this.isEditMode
            ? 'Asignación actualizada exitosamente'
            : 'Turno asignado exitosamente';
          this.notificationService.success(successMessage);
          this.router.navigate(['/shifts']);
        }
      });
  }
}
