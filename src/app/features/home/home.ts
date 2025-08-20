import {Component} from '@angular/core';
import {LoginFormComponent} from '../auth/login-form/login-form';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoginFormComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

}
