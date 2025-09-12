import { Component, Input } from '@angular/core';
import { FormHeaderMode } from '../enums/form-header.component';

@Component({
  selector: 'app-page-title',
  standalone: true,
  imports: [],
  templateUrl: './page-title-component.html',
  styleUrl: './page-title-component.css'
})
export class PageTitleComponent {
  @Input() mode: FormHeaderMode = FormHeaderMode.None;
  @Input() entityName: string = '';

  formHeaderEnum = FormHeaderMode;
}
