import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AssignedShiftsService } from '../../../core/services/assigned-shifts/assigned-shifts';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { WorkContextService } from '../../../core/services/work-context/work-context';
import { AssignedShift } from '../../../model/assigned-shift';
import { DeleteShiftConfirmationDialogComponent } from '../../../shared/delete-shift-confirmation-dialog/delete-shift-confirmation-dialog.component';
import {
  ShiftActionsDialogComponent,
  ShiftActionsDialogData,
  ShiftActionsDialogResult
} from '../../../shared/shift-actions-dialog/shift-actions-dialog.component';
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
  private router = inject(Router);
  private dialog = inject(MatDialog);

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
      console.log('🎯 Turno clickeado:', event.shift);

      // Buscar la asignación completa usando el ID del shift
      const assignedShift = this.assignedShifts.find(as => as.id === event.shift!.id);
      if (!assignedShift) {
        this.notificationService.error('No se pudo encontrar la información del turno');
        return;
      }

      // Preparar datos para la modal
      const dialogData: ShiftActionsDialogData = {
        assignedShift,
        employeeName: event.shift.employeeName,
        shiftName: event.shift.shiftName,
        startTime: event.shift.startTime,
        endTime: event.shift.endTime
      };

      // Abrir modal de acciones
      const dialogRef = this.dialog.open(ShiftActionsDialogComponent, {
        width: '500px',
        maxWidth: '90vw',
        data: dialogData,
        disableClose: false,
        autoFocus: true
      });

      // Manejar resultado de la modal
      dialogRef.afterClosed().subscribe((result: ShiftActionsDialogResult) => {
        if (result) {
          this.handleShiftAction(result);
        }
      });
    }
  }

  onCalendarDayHover(_event: CalendarEvent): void {
    // Funcionalidad de hover en día disponible para futuras implementaciones
  }

  onCalendarShiftHover(_event: CalendarEvent): void {
    // Funcionalidad de hover en turno disponible para futuras implementaciones
  }

  private handleShiftAction(result: ShiftActionsDialogResult): void {
    console.log('🔄 Acción seleccionada:', result.action);
    switch (result.action) {
      case 'edit':
        this.editShiftAssignment(result.assignedShift);
        break;
      case 'delete':
        this.confirmDeleteShiftAssignment(result.assignedShift);
        break;
      case 'cancel':
        console.log('❌ Acción cancelada');
        break;
    }
  }

  private editShiftAssignment(assignedShift: AssignedShift): void {
    console.log('✏️ Editando asignación:', assignedShift.id);
    // Navegar al formulario de edición
    this.router.navigate(['/shifts/assign', assignedShift.id, 'edit']);
  }

  private confirmDeleteShiftAssignment(assignedShift: AssignedShift): void {
    const employeeName = `${assignedShift.user.first_name} ${assignedShift.user.last_name}`;
    console.log('🗑️ Solicitando confirmación para eliminar:', assignedShift.id);

    // Abrir modal de confirmación
    const dialogRef = this.dialog.open(DeleteShiftConfirmationDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: {
        assignedShift,
        employeeName,
        shiftName: assignedShift.shift.name
      },
      disableClose: false,
      autoFocus: true
    });

    // Manejar confirmación
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('✅ Confirmación recibida, eliminando...');
        this.deleteShiftAssignment(assignedShift);
      } else {
        console.log('❌ Eliminación cancelada');
      }
    });
  }

  private deleteShiftAssignment(assignedShift: AssignedShift): void {
    this.assignedShiftsService.delete(assignedShift.id).subscribe({
      next: () => {
        this.notificationService.success('Asignación de turno eliminada exitosamente');
        // Recargar los datos del calendario
        this.loadAssignedShifts();
      },
      error: error => {
        console.error('Error al eliminar asignación:', error);
        this.notificationService.error('Error al eliminar la asignación de turno');
      }
    });
  }
}
