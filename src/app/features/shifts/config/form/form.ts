import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardFooter} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {StatusSelectComponent} from '../../../../shared/status-select/status-select';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';

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
export class ShiftConfigFormComponent {

}
