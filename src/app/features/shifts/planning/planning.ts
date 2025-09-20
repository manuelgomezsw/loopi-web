import { Component } from '@angular/core';
import { MonthNavigation } from './month-navigation/month-navigation';
import { ShiftTableComponent } from './shift-table/shift-table';
import { HoursCalculation } from './hours-calculation/hours-calculation';
import { EmployeeShift } from '../../../model/employee-shift';

@Component({
  selector: 'app-shift-planning',
  standalone: true,
  imports: [MonthNavigation, ShiftTableComponent, HoursCalculation],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class ShiftPlanningComponent {
  // Los datos ahora se manejan directamente en shift-table con mock data
  shiftData: EmployeeShift[] = [];

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  onEditAssignment(assignment: EmployeeShift): void {
    console.warn('Editar asignación:', assignment);
    // TODO: Implementar navegación al formulario de edición
    // this.router.navigate(['/shifts/planning/assign', assignment.id]);
  }

  onDeleteAssignment(assignment: EmployeeShift): void {
    console.warn('Eliminar asignación:', assignment);
    // TODO: Implementar confirmación y eliminación
    // Mostrar dialog de confirmación y eliminar la asignación
  }

  onMonthChange(month: number, year: number): void {
    this.selectedMonth = month;
    this.selectedYear = year;
    console.warn('Mes cambiado:', { month, year });
    // TODO: Cargar datos del mes seleccionado
  }
}
