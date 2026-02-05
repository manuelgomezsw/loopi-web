import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { DiscrepancyItem } from '../../../core/models';

@Component({
  selector: 'app-discrepancy-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discrepancy-review.component.html'
})
export class DiscrepancyReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private inventoryService = inject(InventoryService);

  inventoryId = signal<number>(0);
  loading = signal(true);
  completing = signal(false);
  error = signal('');

  discrepancies = signal<DiscrepancyItem[]>([]);
  hasDiscrepancies = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryId.set(id);

    this.inventoryService.getDiscrepancies(id).subscribe({
      next: (response) => {
        this.discrepancies.set(response.items);
        this.hasDiscrepancies.set(response.has_discrepancies);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar las discrepancias');
        this.loading.set(false);
      }
    });
  }

  continueToSales(): void {
    // Navigate to sales entry for Phase 2
    this.router.navigate(['/inventory', this.inventoryId(), 'sales']);
  }

  finishInventory(): void {
    // No discrepancies - go directly to summary
    this.router.navigate(['/inventory', this.inventoryId(), 'summary']);
  }

  goBackToItems(): void {
    // Return to Phase 1 to review items
    this.router.navigate(['/inventory', this.inventoryId(), 'item']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getDifferenceClass(item: DiscrepancyItem): string {
    const diff = item.real_value - item.suggested_value;
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getDifferenceText(item: DiscrepancyItem): string {
    const diff = item.real_value - item.suggested_value;
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
  }
}
