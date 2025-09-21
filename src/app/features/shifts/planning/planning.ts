import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AssignedShiftsService } from '../../../core/services/assigned-shifts/assigned-shifts';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { WorkContextService } from '../../../core/services/work-context/work-context';
import { AssignedShift } from '../../../model/assigned-shift';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { CalendarEvent } from './calendar-view/interfaces/calendar-day.interface';

@Component({
  selector: 'app-shift-planning',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, CalendarViewComponent],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class ShiftPlanningComponent implements OnInit {
  private assignedShiftsService = inject(AssignedShiftsService);
  private workContextService = inject(WorkContextService);
  private notificationService = inject(NotificationService);

  // Datos del calendario
  assignedShifts: AssignedShift[] = [];

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  isLoading = false;

  ngOnInit(): void {
    this.loadAssignedShifts();
  }

  onMonthChange(month: number, year: number): void {
    this.selectedMonth = month;
    this.selectedYear = year;
    this.loadAssignedShifts();
  }

  private loadAssignedShifts(): void {
    const storeId = this.workContextService.getStoreId();

    if (!storeId) {
      console.warn('No se encontró store_id en el contexto de trabajo');
      return;
    }

    this.isLoading = true;

    this.assignedShiftsService.getByStoreAndMonth(storeId, this.selectedYear, this.selectedMonth).subscribe({
      next: (assignedShifts: AssignedShift[]) => {
        this.assignedShifts = assignedShifts;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error al cargar turnos asignados:', error);
        this.notificationService.error('Error al cargar los turnos asignados');
        this.assignedShifts = [];
        this.isLoading = false;
      }
    });
  }

  // Eventos del calendario
  onCalendarDayClick(_event: CalendarEvent): void {
    // Funcionalidad de click en día disponible para futuras implementaciones
  }

  onCalendarShiftClick(event: CalendarEvent): void {
    if (event.shift) {
      console.warn('Turno clickeado:', event.shift);
      // TODO: Implementar acción al hacer click en turno (ej: editar)
    }
  }

  onCalendarDayHover(_event: CalendarEvent): void {
    // Funcionalidad de hover en día disponible para futuras implementaciones
  }

  onCalendarShiftHover(_event: CalendarEvent): void {
    // Funcionalidad de hover en turno disponible para futuras implementaciones
  }
}
