import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButton, MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { PageTitleComponent } from '../../../../shared/page-title-component/page-title-component';

@Component({
  selector: 'app-absence-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButton,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatTooltip,
    PageTitleComponent
  ],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class AbsenceListComponent {
  displayedColumns: string[] = ['date', 'type', 'hours', 'comment', 'actions'];

  absences = [
    { date: '2025-08-03', type: 'Incapacidad', hours: null, comment: 'Reposo médico' },
    { date: '2025-08-10', type: 'Horas no laboradas', hours: 2, comment: 'Salida anticipada' },
    { date: '2025-08-18', type: 'Permiso no remunerado', hours: 8, comment: '' }
  ];
}
