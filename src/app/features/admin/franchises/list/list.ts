import {Component} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {PageTitleComponent} from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatIcon,
    MatIconButton,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class FranchiseListComponent {
  columnsToDisplay = ['name', 'location', 'active', 'actions'];
}
