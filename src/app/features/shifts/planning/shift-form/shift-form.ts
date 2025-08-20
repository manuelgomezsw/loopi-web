import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardFooter} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {MatOption, MatSelect} from '@angular/material/select';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';

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
export class ShiftFormComponent {

}
