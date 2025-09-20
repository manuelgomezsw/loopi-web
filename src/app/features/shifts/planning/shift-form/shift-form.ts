import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EmployeeResponse } from '../../../../core/interfaces/api.interfaces';
import { EmployeeService } from '../../../../core/services/employee/employee';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
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
  private contextService = inject(WorkContextService);
  private notificationService = inject(NotificationService);

  storeId!: number;
  shifts: Shift[] = [];
  employees: EmployeeResponse[] = [];

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

    const formData = this.form.value;
    const assignmentData = {
      employee_id: formData.employee_id,
      shift_id: formData.shift_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      store_id: this.storeId
    };

    console.warn('Datos de asignación preparados:', assignmentData);
    this.notificationService.info('Formulario listo para POST al backend. Datos preparados.');

    // TODO: Implementar llamada POST al backend
    // this.shiftAssignmentService.create(assignmentData).subscribe(...)
  }
}
