import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { ShiftService } from '../../../../core/services/shift/shift';
import { Shift } from '../../../../model/shift';
import { LoadingProgressComponent } from '../../../../shared/loading-progress/loading-progress';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';
import { TimeFormatPipe } from '../../../../shared/time-format-pipe';

@Component({
  selector: 'app-shift-list',
  imports: [
    PageTitleComponent,
    LoadingProgressComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    RouterLink,
    MatHeaderCellDef,
    TitleCasePipe,
    TimeFormatPipe
  ],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class ShiftConfigListComponent implements OnInit {
  columnsToDisplay = ['shift', 'startTime', 'endTime', 'lunchTime', 'workDays', 'actions'];

  shifts: Shift[] = [];
  loading = false;
  error = '';

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.fetchShifts();
  }

  fetchShifts(): void {
    this.loading = true;
    this.shiftService.getAll().subscribe({
      next: data => {
        this.shifts = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar los turnos';
        this.loading = false;
      }
    });
  }
}
