import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-month-navigation',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './month-navigation.html',
  styleUrl: './month-navigation.css'
})
export class MonthNavigation {
  @Input() hoveredEmployee: string | null = null;
  @Output() hoverChange = new EventEmitter<string | null>();
  currentMonth = new Date();

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
  }
}
