import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmployeeResponse } from '../../../core/interfaces/api.interfaces';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { PageTitleComponent } from '../../../shared/page-title-component/page-title-component';
import { AppState } from '../../../store/app.state';
import * as EmployeeActions from '../../../store/employee/employee.actions';
import {
  selectEmployeeError,
  selectEmployeeLoading,
  selectEmployeeStats,
  selectSortedEmployees
} from '../../../store/employee/employee.selectors';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
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
    MatProgressSpinner,
    MatTooltip
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit {
  private store = inject(Store<AppState>);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  // Observables del store para OnPush optimization
  employees$: Observable<EmployeeResponse[]> = this.store.select(selectSortedEmployees);
  loading$: Observable<boolean> = this.store.select(selectEmployeeLoading);
  error$: Observable<string | null> = this.store.select(selectEmployeeError);
  stats$: Observable<any> = this.store.select(selectEmployeeStats);

  columnsToDisplay = ['fullName', 'position', 'isActive', 'actions'];

  // TrackBy function para optimizar el rendering
  trackByEmployeeId: TrackByFunction<EmployeeResponse> = (index: number, employee: EmployeeResponse) => employee.id;

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees({ filters: {} }));
  }

  selectEmployee(employeeId: number): void {
    this.store.dispatch(EmployeeActions.selectEmployee({ id: employeeId }));
  }

  onDeleteEmployee(employee: EmployeeResponse): void {
    this.showDeleteConfirmation(() => {
      this.store.dispatch(EmployeeActions.deleteEmployee({ id: employee.id }));
      this.notificationService.info(`Empleado ${employee.first_name} ${employee.last_name} eliminado`);
    });
  }

  private showDeleteConfirmation(onConfirm: () => void): void {
    // Usando confirm temporal hasta implementar dialog personalizado
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      onConfirm();
    }
    // TODO: Reemplazar por MatDialog con componente personalizado de confirmación
  }
}
