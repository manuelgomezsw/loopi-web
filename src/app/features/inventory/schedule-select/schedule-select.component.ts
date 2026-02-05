import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { Schedule, SuggestedSchedule } from '../../../core/models';

@Component({
  selector: 'app-schedule-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-select.component.html'
})
export class ScheduleSelectComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  suggestedSchedule = signal<SuggestedSchedule | null>(null);
  selectedSchedule = signal<Schedule>('opening');
  loading = signal(true);
  creating = signal(false);
  error = signal('');

  schedules: { value: Schedule; label: string; icon: string }[] = [
    { value: 'opening', label: 'Apertura', icon: '🌅' },
    { value: 'noon', label: 'Mediodía', icon: '☀️' },
    { value: 'closing', label: 'Cierre', icon: '🌙' }
  ];

  ngOnInit(): void {
    this.inventoryService.getSuggestedSchedule().subscribe({
      next: (suggested) => {
        this.suggestedSchedule.set(suggested);
        this.selectedSchedule.set(suggested.schedule);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  selectSchedule(schedule: Schedule): void {
    this.selectedSchedule.set(schedule);
  }

  continue(): void {
    const suggested = this.suggestedSchedule();
    if (!suggested) return;

    this.creating.set(true);
    this.error.set('');

    this.inventoryService.createInventory({
      schedule: this.selectedSchedule(),
      date: suggested.date
    }).subscribe({
      next: (inventory) => {
        this.router.navigate(['/inventory', inventory.id, 'item']);
      },
      error: (err) => {
        this.creating.set(false);
        if (err.status === 409) {
          this.error.set('Ya existe un inventario para este horario');
        } else {
          this.error.set('Error al crear el inventario');
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}
