import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
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
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { ShiftService } from '../../../../core/services/shift/shift';
import { WorkContextService } from '../../../../core/services/work-context/work-context';
import { extractBackendErrorMessage } from '../../../../core/utils/error-handler.utils';
import { Shift } from '../../../../model/shift';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../../shared/confirm-dialog/confirm-dialog';
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
    TimeFormatPipe,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class ShiftConfigListComponent implements OnInit {
  private shiftService = inject(ShiftService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private workContextService = inject(WorkContextService);

  shifts: Shift[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.fetchShifts();
  }

  fetchShifts(): void {
    this.loading = true;
    this.error = '';

    // Obtener el ID de la tienda del contexto de trabajo
    const storeId = this.workContextService.getStoreId();

    if (!storeId) {
      this.error = 'No se ha seleccionado una tienda. Por favor, selecciona un contexto de trabajo.';
      this.loading = false;
      this.notificationService.error(this.error);
      return;
    }

    this.shiftService
      .getByStore(storeId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = extractBackendErrorMessage(error);
          this.error = errorMessage;
          this.loading = false;
          this.notificationService.error(errorMessage);
          return of([]);
        })
      )
      .subscribe(data => {
        this.shifts = data;
        this.loading = false;
      });
  }

  editShift(shift: Shift): void {
    this.router.navigate(['/shifts/config', shift.id, 'edit']);
  }

  deleteShift(shift: Shift): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el turno "${shift.name}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      icon: 'delete',
      iconColor: 'warn'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && shift.id) {
        this.performDelete(shift.id);
      }
    });
  }

  private performDelete(shiftId: number): void {
    this.shiftService
      .delete(shiftId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage = extractBackendErrorMessage(error);
          this.notificationService.error(errorMessage);
          return of(null);
        })
      )
      .subscribe(result => {
        if (result !== null) {
          this.notificationService.success('Turno eliminado exitosamente');
          this.fetchShifts(); // Recargar la lista
        }
      });
  }
}
