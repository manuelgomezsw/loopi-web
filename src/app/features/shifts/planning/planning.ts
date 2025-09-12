import { Component } from '@angular/core';
import { MonthNavigation } from './month-navigation/month-navigation';
import { ShiftTableComponent } from './shift-table/shift-table';
import { HoursCalculation } from './hours-calculation/hours-calculation';

@Component({
  selector: 'app-shift-planning',
  standalone: true,
  imports: [MonthNavigation, ShiftTableComponent, HoursCalculation],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class ShiftPlanningComponent {
  shiftData = [
    {
      employee: 'Valentina',
      shifts: ['Apertura', 'Intermedio']
    },
    {
      employee: 'Arnaldis',
      shifts: ['Intermedio', 'Cierre']
    },
    {
      employee: 'Sirelda',
      shifts: ['Cierre', 'Apertura']
    }
  ];

  hoveredEmployee: string | null = null;

  setHovered(employee: string | null) {
    this.hoveredEmployee = employee;
  }
}
