import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardFooter} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {StatusSelectComponent} from '../../../shared/status-select/status-select';
import {MatOption, MatSelect} from '@angular/material/select';
import {PageTitleComponent} from '../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-form',
  standalone: true,
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
    RouterLink,
    StatusSelectComponent,
    MatFormField,
    MatOption,
    MatSelect
  ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class EmployeeFormComponent {

}
