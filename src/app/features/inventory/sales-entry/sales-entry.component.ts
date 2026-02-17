import { Component, inject, signal, computed, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { DiscrepancyItem } from '../../../core/models';

@Component({
  selector: 'app-sales-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-entry.component.html'
})
export class SalesEntryComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  /** Exposed for template (requiresPurchasesOnly) */
  inventoryService = inject(InventoryService);

  @ViewChild('stockReceivedInput') stockReceivedInput!: ElementRef<HTMLInputElement>;

  // Expose Math for template
  Math = Math;

  inventoryId = signal<number>(0);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  // Form values for Phase 2
  stockReceived = signal<number>(0);
  unitsSold = signal<number>(0);

  // Computed from service
  discrepancyItems = this.inventoryService.discrepancyItems;
  currentIndex = this.inventoryService.discrepancyIndex;

  currentItem = computed<DiscrepancyItem | null>(() => {
    const items = this.discrepancyItems();
    const index = this.currentIndex();
    return items[index] ?? null;
  });

  progress = computed(() => this.inventoryService.getDiscrepancyProgress());
  isFirst = computed(() => this.inventoryService.isFirstDiscrepancyItem());
  isLast = computed(() => this.inventoryService.isLastDiscrepancyItem());

  // Calculate expected adjustment
  expectedAdjustment = computed(() => {
    const item = this.currentItem();
    if (!item) return 0;
    return item.suggested_value - item.real_value;
  });

  // Calculate if adjustment makes sense
  adjustmentBalance = computed(() => {
    const expected = this.expectedAdjustment();
    const adjustment = this.unitsSold() - this.stockReceived();
    return expected - adjustment;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryId.set(id);

    // Check if we have discrepancies loaded
    if (this.discrepancyItems().length === 0) {
      // Load discrepancies first
      this.inventoryService.getDiscrepancies(id).subscribe({
        next: () => {
          this.loading.set(false);
          this.loadCurrentItemValues();
          this.focusInput();
        },
        error: () => {
          this.error.set('Error al cargar los items');
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
      this.loadCurrentItemValues();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusInput(), 100);
  }

  loadCurrentItemValues(): void {
    const item = this.currentItem();
    if (item) {
      this.stockReceived.set(item.stock_received ?? 0);
      this.unitsSold.set(item.units_sold ?? 0);
    }
  }

  focusInput(): void {
    setTimeout(() => {
      if (this.stockReceivedInput?.nativeElement) {
        this.stockReceivedInput.nativeElement.focus();
        this.stockReceivedInput.nativeElement.select();
      }
    }, 50);
  }

  saveAndNext(): void {
    const item = this.currentItem();
    if (!item) return;

    this.saving.set(true);
    this.error.set('');

    this.inventoryService.saveSales(this.inventoryId(), {
      item_id: item.item_id,
      stock_received: this.stockReceived(),
      units_sold: this.unitsSold()
    }).subscribe({
      next: () => {
        this.saving.set(false);

        if (this.isLast()) {
          // Phase 2 complete - go to summary
          this.router.navigate(['/inventory', this.inventoryId(), 'summary']);
        } else {
          // Go to next item
          this.inventoryService.nextDiscrepancyItem();
          this.loadCurrentItemValues();
          this.focusInput();
        }
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Error al guardar');
      }
    });
  }

  previous(): void {
    if (!this.isFirst()) {
      this.inventoryService.previousDiscrepancyItem();
      this.loadCurrentItemValues();
      this.focusInput();
    }
  }

  goToSummary(): void {
    this.router.navigate(['/inventory', this.inventoryId(), 'summary']);
  }

  goBack(): void {
    this.router.navigate(['/inventory', this.inventoryId(), 'review']);
  }

  // Helpers for stock received
  incrementStockReceived(): void {
    this.stockReceived.set(this.stockReceived() + 1);
  }

  decrementStockReceived(): void {
    if (this.stockReceived() > 0) {
      this.stockReceived.set(this.stockReceived() - 1);
    }
  }

  onStockReceivedChange(value: string): void {
    const parsed = parseInt(value, 10);
    if (value === '' || isNaN(parsed)) {
      this.stockReceived.set(0);
    } else if (parsed >= 0) {
      this.stockReceived.set(parsed);
    }
  }

  // Helpers for units sold
  incrementUnitsSold(): void {
    this.unitsSold.set(this.unitsSold() + 1);
  }

  decrementUnitsSold(): void {
    if (this.unitsSold() > 0) {
      this.unitsSold.set(this.unitsSold() - 1);
    }
  }

  onUnitsSoldChange(value: string): void {
    const parsed = parseInt(value, 10);
    if (value === '' || isNaN(parsed)) {
      this.unitsSold.set(0);
    } else if (parsed >= 0) {
      this.unitsSold.set(parsed);
    }
  }
}
