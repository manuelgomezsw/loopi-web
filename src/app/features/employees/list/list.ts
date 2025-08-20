import {Component} from '@angular/core';
import {PageTitleComponent} from '../../../shared/page-title-component/page-title-component';
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
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-list',
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
export class EmployeeListComponent {
  columnsToDisplay = ['firstName', 'lastName', 'active', 'actions'];
}
