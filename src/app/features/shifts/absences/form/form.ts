import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-absence-form',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatInput,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardFooter,
    MatButton,
    RouterLink,
    MatHint
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class AbsenceFormComponent implements OnInit {
  form: FormGroup;

  employees = [
    { id: 1, name: 'Valentina' },
    { id: 2, name: 'Arnaldis' },
    { id: 3, name: 'Sirelda' }
  ];

  types = [
    { value: 'incapacidad', label: 'Incapacidad' },
    { value: 'permiso', label: 'Permiso no remunerado' },
    { value: 'ausencia', label: 'Ausencia' },
    { value: 'horas_no_laboradas', label: 'Horas no laboradas' }
  ];

  ngOnInit() {}

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      employeeId: [null, Validators.required],
      date: [null, Validators.required],
      type: [null, Validators.required],
      hours: [null],
      comment: ['']
    });
  }

  save(): void {
    if (this.form.valid) {
    }
  }
}
