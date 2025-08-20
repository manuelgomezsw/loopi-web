import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {Franchise} from '../../model/franchise';

@Component({
  selector: 'app-work-context-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './work-context-selector.html',
  styleUrl: './work-context-selector.css'
})
export class WorkContextSelectorComponent {
  @Input() franchiseID: number = 0;
  @Input() franchiseName: string = "";
  @Input() franchises: Franchise[] = [];

  @Input() storeID: number = 0;
  @Input() storeName: string = "";
  @Input() stores: Store[] = [];

  @Output() contextSelected = new EventEmitter<{ franchiseId: number, storeId: number }>();

  selectedFranchiseId: number | null = null;
  selectedStoreId: number | null = null;

  get filteredStores(): Store[] {
    return this.stores.filter(s => s.franchiseId === this.selectedFranchiseId);
  }

  confirm() {
    if (this.selectedFranchiseId && this.selectedStoreId) {
      this.contextSelected.emit({
        franchiseId: this.selectedFranchiseId,
        storeId: this.selectedStoreId
      });
    }
  }
}
