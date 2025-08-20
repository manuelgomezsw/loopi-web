import {Component} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-shift-list',
  imports: [
    PageTitleComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatRow,
    MatRowDef,
    MatTable,
    RouterLink,
    MatHeaderCellDef,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class ShiftConfigListComponent {
  columnsToDisplay = ['shift', 'startTime', 'endTime', 'lunchTime', 'workDays', 'actions'];
}
