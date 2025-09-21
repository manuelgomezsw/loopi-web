import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AssignedShift } from '../../model/assigned-shift';

export interface DeleteShiftConfirmationDialogData {
  assignedShift: AssignedShift;
  employeeName: string;
  shiftName: string;
}

@Component({
  selector: 'app-delete-shift-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-confirmation-dialog">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon class="warning-icon">warning</mat-icon>
        Confirmar Eliminación
      </h2>

      <mat-dialog-content class="dialog-content">
        <p class="confirmation-message">¿Estás seguro de que deseas eliminar esta asignación de turno?</p>

        <div class="shift-summary">
          <div class="summary-item"><strong>Empleado:</strong> {{ data.employeeName }}</div>
          <div class="summary-item"><strong>Turno:</strong> {{ data.shiftName }}</div>
          <div class="summary-item"><strong>Período:</strong> {{ formatDateRange() }}</div>
        </div>

        <p class="warning-text">
          <mat-icon class="inline-icon">info</mat-icon>
          Esta acción no se puede deshacer.
        </p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button class="cancel-button" (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>

        <button mat-raised-button color="warn" class="delete-button" (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrl: './delete-shift-confirmation-dialog.component.css'
})
export class DeleteShiftConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef<DeleteShiftConfirmationDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteShiftConfirmationDialogData) {}

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

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
