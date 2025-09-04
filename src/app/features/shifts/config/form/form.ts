import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardFooter} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {StatusSelectComponent} from '../../../../shared/status-select/status-select';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';
import {ShiftService} from '../../../../core/services/shift/shift';
import {Shift} from '../../../../model/shift';

@Component({
  selector: 'app-shift-config-form',
  standalone:true,
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
    RouterLink,
    MatFormField,
    StatusSelectComponent,
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

  shiftId?: number;
  form = this.fb.group({
    name: ['', Validators.required],
    period: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    lunch_minutes: [60, Validators.required],
    is_active: [true, Validators.required],
    store_id: [1, Validators.required] // temporal mientras no esté el context
  });

  ngOnInit(): void {
    this.shiftId = Number(this.route.snapshot.queryParamMap.get('shift_id'));
    if (this.shiftId) {
      this.shiftService.getById(this.shiftId).subscribe(shift => {
        this.form.patchValue(shift);
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;
    const formatTime = (date: Date | string): string => {
      if (typeof date === 'string') return date;
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    };

    const shift: Shift = {
      name: raw.name ?? '',
      period: (raw.period ?? 'semanal') as 'semanal' | 'quincenal' | 'mensual',
      start_time: formatTime(raw.start_time ?? new Date()),
      end_time: formatTime(raw.end_time ?? new Date()),
      lunch_minutes: raw.lunch_minutes ?? 0,
      is_active: raw.is_active ?? true,
      store_id: raw.store_id ?? 1
    };

    const action = this.shiftId
      ? this.shiftService.update(this.shiftId, shift)
      : this.shiftService.create(shift);

    action.subscribe(() => this.router.navigate(['/shifts/config/list']));
  }
}
