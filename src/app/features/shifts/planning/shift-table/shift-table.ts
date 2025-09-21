import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AssignedShiftsService } from '../../../../core/services/assigned-shifts/assigned-shifts';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { AssignedShift } from '../../../../model/assigned-shift';
import { EmployeeShift } from '../../../../model/employee-shift';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-shift-table',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    MatCard,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatTooltip,
    DatePipe
  ],
  templateUrl: './shift-table.html',
  styleUrl: './shift-table.css'
})
export class ShiftTableComponent implements OnInit, OnChanges {
  @Input() data: EmployeeShift[] = [];
  @Input() selectedMonth: number = new Date().getMonth() + 1;
  @Input() selectedYear: number = new Date().getFullYear();
  @Output() editAssignment = new EventEmitter<EmployeeShift>();
  @Output() deleteAssignment = new EventEmitter<EmployeeShift>();

  private assignedShiftsService = inject(AssignedShiftsService);
  private workContextService = inject(WorkContextService);

  columnsToDisplay: string[] = ['employee', 'shift', 'start_date', 'end_date', 'actions'];
  isLoading = false;

  ngOnInit(): void {
    this.loadAssignedShifts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] || changes['selectedYear']) {
      this.loadAssignedShifts();
    }
  }

  private loadAssignedShifts(): void {
    const storeId = this.workContextService.getStoreId();

    if (!storeId) {
      console.warn('No se encontró store_id en el contexto de trabajo');
      // Si no hay contexto, limpiar datos
      this.data = [];
      return;
    }

    this.isLoading = true;

    this.assignedShiftsService.getByStoreAndMonth(storeId, this.selectedYear, this.selectedMonth).subscribe({
      next: (assignedShifts: AssignedShift[]) => {
        this.data = this.convertAssignedShiftsToEmployeeShifts(assignedShifts);
        this.isLoading = false;
      },
      error: error => {
        console.error('Error al cargar turnos asignados:', error);
        // En caso de error, limpiar datos para mostrar mensaje de "sin datos"
        this.data = [];
        this.isLoading = false;
      }
    });
  }

  private convertAssignedShiftsToEmployeeShifts(assignedShifts: AssignedShift[]): EmployeeShift[] {
    return assignedShifts.map(assigned => ({
      id: assigned.id,
      employee: {
        id: assigned.user.id,
        first_name: assigned.user.first_name,
        last_name: assigned.user.last_name,
        full_name: `${assigned.user.first_name} ${assigned.user.last_name}`
      },
      shift: {
        id: assigned.shift.id,
        name: assigned.shift.name,
        start_time: assigned.shift.start_time,
        end_time: assigned.shift.end_time
      },
      start_date: assigned.start_date,
      end_date: assigned.end_date,
      month: this.selectedMonth,
      year: this.selectedYear
    }));
  }

  getColumnLabel(col: string): string {
    const labels: Record<string, string> = {
      employee: 'Empleado',
      shift: 'Turno',
      start_date: 'Fecha Inicio',
      end_date: 'Fecha Fin',
      actions: 'Acciones'
    };
    return labels[col] || col;
  }

  onEditAssignment(assignment: EmployeeShift): void {
    this.editAssignment.emit(assignment);
  }

  onDeleteAssignment(assignment: EmployeeShift): void {
    this.deleteAssignment.emit(assignment);
  }
}
