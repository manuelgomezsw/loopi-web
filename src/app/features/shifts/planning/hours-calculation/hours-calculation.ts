import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
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
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { HourSummary } from '../../../../model/hour-summary';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';
import { AbsenceListComponent } from '../../absences/list/list';

@Component({
  selector: 'app-hours-calculation',
  standalone: true,
  imports: [
    PageTitleComponent,
    MatCard,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    NgIf,
    RouterLink,
    MatTooltip,
    MatIcon
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './hours-calculation.html',
  styleUrl: './hours-calculation.css'
})
export class HoursCalculation {
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  dataSource: HourSummary[] = [
    { employee: 'Valentina', ordinary: 80, extra: 5, sunday: 4, hasAbsences: true },
    { employee: 'Arnaldis', ordinary: 78, extra: 6, sunday: 3, hasAbsences: true },
    { employee: 'Sirelda', ordinary: 78, extra: 6, sunday: 3, hasAbsences: true }
  ];

  columnsToDisplay = ['employee', 'ordinary', 'extra', 'sunday', 'absences'];

  viewAbsences(employee: string): void {
    const isMobile = window.innerWidth < 600;

    const dialogRef = this.dialog.open(AbsenceListComponent, {
      width: isMobile ? '100vw' : '90vw',
      maxWidth: '900px',
      height: isMobile ? '100vh' : 'auto',
      maxHeight: '90vh',
      panelClass: 'responsive-dialog',
      data: { employeeName: employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.success('Ausencia registrada correctamente');
      }
    });
  }
}
