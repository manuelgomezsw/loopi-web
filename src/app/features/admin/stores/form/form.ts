import {Component} from '@angular/core';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter} from "@angular/material/card";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {StatusSelectComponent} from "../../../../shared/status-select/status-select";

@Component({
  selector: 'app-form',
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
    MatFormField
  ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class StoreFormComponent {

}
