import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventorySummary } from '../../../core/models';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html'
})
export class SummaryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryService = inject(InventoryService);

  inventoryId = signal<number>(0);
  summary = signal<InventorySummary | null>(null);
  loading = signal(true);
  completing = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryId.set(id);
    this.loadSummary();
  }

  loadSummary(): void {
    this.inventoryService.getSummary(this.inventoryId()).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el resumen');
        this.loading.set(false);
      }
    });
  }

  complete(): void {
    const sum = this.summary();
    if (!sum || !sum.can_complete) return;

    this.completing.set(true);
    this.error.set('');

    this.inventoryService.completeInventory(this.inventoryId()).subscribe({
      next: (response) => {
        this.router.navigate(['/inventory', this.inventoryId(), 'confirmation'], {
          state: { issuesCreated: response.issues_created }
        });
      },
      error: () => {
        this.completing.set(false);
        this.error.set('Error al completar el inventario');
      }
    });
  }

  goBackToItems(): void {
    this.router.navigate(['/inventory', this.inventoryId(), 'item']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatSchedule(schedule: string): string {
    const scheduleMap: Record<string, string> = {
      'opening': 'Apertura',
      'noon': 'Mediodía',
      'closing': 'Cierre',
      'weekly': 'Semanal',
      'monthly': 'Mensual'
    };
    return scheduleMap[schedule] || schedule;
  }
}
