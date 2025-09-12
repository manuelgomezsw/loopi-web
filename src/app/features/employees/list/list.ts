import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, TrackByFunction } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { EmployeeResponse } from '../../../core/interfaces/api.interfaces';
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
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit {
  private store = inject(Store<AppState>);

  // Observables del store para OnPush optimization
  employees$: Observable<EmployeeResponse[]> = this.store.select(selectSortedEmployees);
  loading$: Observable<boolean> = this.store.select(selectEmployeeLoading);
  error$: Observable<string | null> = this.store.select(selectEmployeeError);
  stats$: Observable<any> = this.store.select(selectEmployeeStats);

  columnsToDisplay = ['employeeNumber', 'fullName', 'email', 'position', 'status', 'actions'];

  // TrackBy function para optimizar el rendering
  trackByEmployeeId: TrackByFunction<EmployeeResponse> = (index: number, employee: EmployeeResponse) => employee.id;

  ngOnInit(): void {
    // Cargar empleados al inicializar
    this.store.dispatch(EmployeeActions.loadEmployees({ filters: {} }));
  }

  selectEmployee(employeeId: number): void {
    this.store.dispatch(EmployeeActions.selectEmployee({ id: employeeId }));
  }

  deleteEmployee(employeeId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      this.store.dispatch(EmployeeActions.deleteEmployee({ id: employeeId }));
    }
  }
}
