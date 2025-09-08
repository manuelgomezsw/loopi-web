import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardFooter} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {MatOption, MatSelect} from '@angular/material/select';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';
import {ShiftService} from '../../../../core/services/shift/shift';
import {WorkContextService} from '../../../../core/services/work-context/work-context';
import {EmployeeService} from '../../../../core/services/employee/employee';
import {CalendarService} from '../../../../core/services/calendar/calendar';
import {Shift} from '../../../../model/shift';
import {Employee} from '../../../../model/employee';
import {MonthSummary} from '../../../../model/month-summary';
import {ProjectedHours} from '../../../../model/projected-hours';

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
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    RouterLink,
    MatFormField,
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

  storeId!: number;
  shifts: Shift[] = [];
  employees: Employee[] = [];
  monthSummary: MonthSummary | null = null;
  projectedHours: ProjectedHours | null = null;
  months: string[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    period: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    lunch_minutes: [60, Validators.required],
    is_active: [true, Validators.required],
    month: ['', Validators.required],
    shift_id: [null, Validators.required]
  });

  ngOnInit(): void {
    this.storeId = this.contextService.getStoreId();
    this.generateMonthOptions();
    this.loadShiftsAndEmployees();

    this.form.get('month')?.valueChanges.subscribe(() => {
      this.loadMonthSummary();
      this.updateProjection();
    });

    this.form.get('shift_id')?.valueChanges.subscribe(() => {
      this.updateProjection();
    });
  }

  generateMonthOptions(): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    this.months = Array.from({length: 12}, (_, i) => {
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

  updateProjection(): void {
    const {month, shift_id} = this.form.value;
    if (!month || !shift_id) return;

    const [year, monthNum] = month.split('-');

    this.shiftService.previewHours({
      shift_id,
      year: +year,
      month: +monthNum
    }).subscribe(result => {
      this.projectedHours = result;
    });
  }

  save(): void {
    if (this.form.invalid) return;

    // aquí irá la lógica para guardar la asignación de turnos, aún no definida
    console.log('Guardar', this.form.value);
  }
}
