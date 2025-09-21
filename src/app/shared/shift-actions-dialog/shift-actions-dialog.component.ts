import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AssignedShift } from '../../model/assigned-shift';

export interface ShiftActionsDialogData {
  assignedShift: AssignedShift;
  employeeName: string;
  shiftName: string;
  startTime: string;
  endTime: string;
}

export interface ShiftActionsDialogResult {
  action: 'edit' | 'delete' | 'cancel';
  assignedShift: AssignedShift;
}

@Component({
  selector: 'app-shift-actions-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="shift-actions-dialog">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="title-icon">schedule</mat-icon>
        Acciones del Turno
      </h2>

      <mat-dialog-content class="dialog-content">
        <div class="shift-info">
          <div class="info-row">
            <mat-icon class="info-icon">person</mat-icon>
            <span class="info-label">Empleado:</span>
            <span class="info-value">{{ data.employeeName }}</span>
          </div>

          <div class="info-row">
            <mat-icon class="info-icon">work</mat-icon>
            <span class="info-label">Turno:</span>
            <span class="info-value">{{ data.shiftName }}</span>
          </div>

          <div class="info-row">
            <mat-icon class="info-icon">access_time</mat-icon>
            <span class="info-label">Horario:</span>
            <span class="info-value">{{ data.startTime }} - {{ data.endTime }}</span>
          </div>

          <div class="info-row">
            <mat-icon class="info-icon">date_range</mat-icon>
            <span class="info-label">Período:</span>
            <span class="info-value">{{ formatDateRange() }}</span>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-raised-button color="primary" class="action-button edit-button" (click)="onEdit()">
          <mat-icon>edit</mat-icon>
          Editar
        </button>

        <button mat-raised-button color="warn" class="action-button delete-button" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>

        <button mat-button class="action-button cancel-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './shift-actions-dialog.component.css'
})
export class ShiftActionsDialogComponent {
  private dialogRef = inject(MatDialogRef<ShiftActionsDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ShiftActionsDialogData) {}

  formatDateRange(): string {
    const startDate = new Date(this.data.assignedShift.start_date);
    const endDate = new Date(this.data.assignedShift.end_date);

    const formatOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short'
    };

    const startFormatted = startDate.toLocaleDateString('es-ES', formatOptions);
    const endFormatted = endDate.toLocaleDateString('es-ES', formatOptions);

    return `${startFormatted} - ${endFormatted}`;
  }

  onEdit(): void {
    this.dialogRef.close({
      action: 'edit',
      assignedShift: this.data.assignedShift
    } as ShiftActionsDialogResult);
  }

  onDelete(): void {
    this.dialogRef.close({
      action: 'delete',
      assignedShift: this.data.assignedShift
    } as ShiftActionsDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({
      action: 'cancel',
      assignedShift: this.data.assignedShift
    } as ShiftActionsDialogResult);
  }
}
