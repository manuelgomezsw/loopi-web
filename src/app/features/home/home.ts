import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

}
