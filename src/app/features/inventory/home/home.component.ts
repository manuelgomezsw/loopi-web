import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { Inventory } from '../../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  employeeName = this.authService.employeeName;
  latestInventory = signal<Inventory | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.loadLatestInventory();
  }

  loadLatestInventory(): void {
    this.inventoryService.getLatestInventory().subscribe({
      next: (response) => {
        this.latestInventory.set(response.inventory);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  startNewInventory(): void {
    this.router.navigate(['/inventory/schedule']);
  }

  logout(): void {
    this.authService.logout();
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }

    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short'
    });
  }

  formatTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('es-CO', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
