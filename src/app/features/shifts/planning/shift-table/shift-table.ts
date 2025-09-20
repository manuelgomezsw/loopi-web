import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
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
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';
import { EmployeeShift } from '../../../../model/employee-shift';

@Component({
  selector: 'app-shift-table',
  standalone: true,
  imports: [
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
export class ShiftTableComponent implements OnInit {
  @Input() data: EmployeeShift[] = [];
  @Input() selectedMonth: number = new Date().getMonth() + 1;
  @Input() selectedYear: number = new Date().getFullYear();
  @Output() editAssignment = new EventEmitter<EmployeeShift>();
  @Output() deleteAssignment = new EventEmitter<EmployeeShift>();

  columnsToDisplay: string[] = ['employee', 'shift', 'start_date', 'end_date', 'actions'];

  // Datos mock para evaluación de UX
  mockData: EmployeeShift[] = [
    {
      id: 1,
      employee: {
        id: 1,
        first_name: 'Juan',
        last_name: 'Pérez',
        full_name: 'Juan Pérez'
      },
      shift: {
        id: 1,
        name: 'Mañana',
        start_time: '08:00',
        end_time: '16:00'
      },
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      month: 1,
      year: 2024
    },
    {
      id: 2,
      employee: {
        id: 2,
        first_name: 'María',
        last_name: 'González',
        full_name: 'María González'
      },
      shift: {
        id: 2,
        name: 'Tarde',
        start_time: '14:00',
        end_time: '22:00'
      },
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      month: 1,
      year: 2024
    },
    {
      id: 3,
      employee: {
        id: 3,
        first_name: 'Carlos',
        last_name: 'Rodríguez',
        full_name: 'Carlos Rodríguez'
      },
      shift: {
        id: 3,
        name: 'Noche',
        start_time: '22:00',
        end_time: '06:00'
      },
      start_date: '2024-01-15',
      end_date: '2024-01-31',
      month: 1,
      year: 2024
    }
  ];

  ngOnInit(): void {
    // Usar datos mock si no hay datos reales
    if (this.data.length === 0) {
      this.data = this.mockData;
    }
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
