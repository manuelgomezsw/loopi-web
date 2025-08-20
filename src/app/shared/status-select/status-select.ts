import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';

@Component({
  selector: 'app-status-select',
  standalone: true,
  templateUrl: './status-select.html',
  styleUrls: ['./status-select.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class StatusSelectComponent {
  @Input() label: string = 'Estado';
  @Input() value: boolean | null = null;
  @Output() valueChange = new EventEmitter<boolean>();

  updateValue(value: boolean) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
