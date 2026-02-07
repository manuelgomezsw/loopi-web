import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { Inventory, InProgressInventory } from '../../../core/models';

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
  inProgressInventory = signal<InProgressInventory | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    forkJoin({
      latest: this.inventoryService.getLatestInventory(),
      inProgress: this.inventoryService.getInProgressInventories()
    }).subscribe({
      next: ({ latest, inProgress }) => {
        this.latestInventory.set(latest.inventory);
        // Take the first in-progress inventory (most recent)
        if (inProgress.count > 0 && inProgress.inventories.length > 0) {
          this.inProgressInventory.set(inProgress.inventories[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  hasInProgressInventory(): boolean {
    return this.inProgressInventory() !== null;
  }

  continueInventory(): void {
    const inventory = this.inProgressInventory();
    if (inventory) {
      this.router.navigate(['/inventory', inventory.id, 'item']);
    }
  }

  startNewInventory(): void {
    this.router.navigate(['/inventory/schedule']);
  }

  logout(): void {
    this.authService.logout();
  }

  formatInventoryType(inventory: Inventory | InProgressInventory): string {
    const typeMap: Record<string, string> = {
      'daily': 'Diario',
      'weekly': 'Semanal',
      'monthly': 'Mensual'
    };
    const scheduleMap: Record<string, string> = {
      'opening': 'Apertura',
      'noon': 'Mediodía',
      'closing': 'Cierre'
    };

    const typeName = typeMap[inventory.inventory_type] || inventory.inventory_type;

    if (inventory.inventory_type === 'daily' && inventory.schedule) {
      const scheduleName = scheduleMap[inventory.schedule] || inventory.schedule;
      return `${typeName} - ${scheduleName}`;
    }

    return typeName;
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

  formatStartedTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) {
      return 'hace un momento';
    } else if (diffMins < 60) {
      return `hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `hace ${diffHours}h`;
    } else {
      return this.formatTime(dateTimeStr);
    }
  }
}
