import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { EmployeeResponse } from '../../../../core/interfaces/api.interfaces';
import { CalendarService } from '../../../../core/services/calendar/calendar';
import { EmployeeService } from '../../../../core/services/employee/employee';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { MonthSummary } from '../../../../model/month-summary';
import { Shift } from '../../../../model/shift';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';
// import { HoursCalculationComponent } from '../hours-calculation/hours-calculation';

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
  private calendarService = inject(CalendarService);
  private contextService = inject(WorkContextService);
  private notificationService = inject(NotificationService);

  storeId!: number;
  shifts: Shift[] = [];
  employees: EmployeeResponse[] = [];
  monthSummary: MonthSummary | null = null;
  months: string[] = [];

  form = this.fb.group({
    month: ['', Validators.required],
    shift_id: [null, Validators.required],
    employee_id: [null, Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required]
  });

  ngOnInit(): void {
    this.storeId = this.contextService.getStoreId();
    this.generateMonthOptions();
    this.loadShiftsAndEmployees();

    this.form.get('month')?.valueChanges.subscribe(() => {
      this.loadMonthSummary();
    });
  }

  generateMonthOptions(): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    this.months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      return `${currentYear}-${month}`;
    });
  }

  loadShiftsAndEmployees(): void {
    this.shiftService.getByStore(this.storeId).subscribe(shifts => {
      this.shifts = shifts;
    });

    this.employeeService.getByStore(this.storeId).subscribe(employees => {
      this.employees = employees;
    });
  }

  loadMonthSummary(): void {
    const value = this.form.value.month;
    if (!value) return;

    const [year, month] = value.split('-'); // ej: '2025-08'

    this.calendarService.getMonthSummary(+year, +month).subscribe(summary => {
      this.monthSummary = summary;
    });
  }

  save(): void {
    if (this.form.invalid) return;

    // aquí irá la lógica para guardar la asignación de turnos, aún no definida
    this.notificationService.info('Formulario listo para guardar. Funcionalidad en desarrollo.');
    // TODO: Implementar lógica de guardado real
  }
}
