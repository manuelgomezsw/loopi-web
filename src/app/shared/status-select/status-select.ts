import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-status-select',
  templateUrl: './status-select.html',
  imports: [
    MatFormField,
    MatFormField,
    MatSelect,
    MatLabel,
    MatOption
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StatusSelectComponent),
      multi: true
    }
  ]
})
export class StatusSelectComponent implements ControlValueAccessor {
  value: boolean = true;

  // 🔁 Métodos del ControlValueAccessor
  onChange = (value: boolean) => {};
  onTouched = () => {};

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // opcional, si querés manejar el disable
  }

  // 🚀 Cuando cambia la selección
  updateValue(value: boolean): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
