import { Component, inject, signal, computed, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventoryItem } from '../../../core/models';

@Component({
  selector: 'app-item-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-entry.component.html'
})
export class ItemEntryComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  /** Exposed for template (requiresPurchasesOnly) */
  inventoryService = inject(InventoryService);

  @ViewChild('realValueInput') realValueInput!: ElementRef<HTMLInputElement>;

  inventoryId = signal<number>(0);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  // Form value - only physical count in Phase 1
  realValue = signal<number | null>(null);

  // Computed from service
  items = this.inventoryService.items;
  currentIndex = this.inventoryService.currentItemIndex;

  currentItem = computed<InventoryItem | null>(() => {
    const items = this.items();
    const index = this.currentIndex();
    return items[index] ?? null;
  });

  progress = computed(() => this.inventoryService.getProgress());
  isFirst = computed(() => this.inventoryService.isFirstItem());
  isLast = computed(() => this.inventoryService.isLastItem());

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryId.set(id);

    this.inventoryService.getInventoryItems(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadCurrentItemValues();
        this.focusRealValueInput();
      },
      error: () => {
        this.error.set('Error al cargar los items');
        this.loading.set(false);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusRealValueInput(), 100);
  }

  loadCurrentItemValues(): void {
    const item = this.currentItem();
    if (item) {
      this.realValue.set(item.real_value ?? null);
    }
  }

  focusRealValueInput(): void {
    setTimeout(() => {
      if (this.realValueInput?.nativeElement) {
        this.realValueInput.nativeElement.focus();
        this.realValueInput.nativeElement.select();
      }
    }, 50);
  }

  isValidRealValue(): boolean {
    const value = this.realValue();
    return value !== null && value !== undefined && !isNaN(value) && value >= 0;
  }

  saveAndNext(): void {
    const item = this.currentItem();
    if (!item || !this.isValidRealValue()) {
      this.error.set('Ingresa el conteo real');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.inventoryService.saveDetail(this.inventoryId(), {
      item_id: item.item_id,
      real_value: this.realValue()!
    }).subscribe({
      next: () => {
        this.saving.set(false);

        if (this.isLast()) {
          // Phase 1 complete - go to discrepancy review
          this.router.navigate(['/inventory', this.inventoryId(), 'review']);
        } else {
          // Go to next item
          this.inventoryService.nextItem();
          this.loadCurrentItemValues();
          this.focusRealValueInput();
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
      this.inventoryService.previousItem();
      this.loadCurrentItemValues();
      this.focusRealValueInput();
    }
  }

  goToSummary(): void {
    this.router.navigate(['/inventory', this.inventoryId(), 'review']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  incrementValue(): void {
    const current = this.realValue() ?? 0;
    this.realValue.set(current + 1);
  }

  decrementValue(): void {
    const current = this.realValue() ?? 0;
    if (current > 0) {
      this.realValue.set(current - 1);
    } else {
      this.realValue.set(0);
    }
  }

  onRealValueChange(value: string): void {
    const parsed = parseInt(value, 10);
    if (value === '' || value === null) {
      this.realValue.set(null);
    } else if (!isNaN(parsed) && parsed >= 0) {
      this.realValue.set(parsed);
    }
  }
}
