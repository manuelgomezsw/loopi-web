import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Store as NgRxStore } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WorkContextInfo } from '../../core/interfaces/api.interfaces';
import { FranchiseService } from '../../core/services/franchise/franchise';
import { StoreService } from '../../core/services/store/store';
import { Franchise } from '../../model/franchise';
import { Store as StoreModel } from '../../model/store';
import { WorkContext } from '../../model/work-context';
import { AppState } from '../../store/app.state';
import { selectAuthLoading } from '../../store/auth/auth.selectors';
import { LoadingProgressComponent } from '../loading-progress/loading-progress';

@Component({
  selector: 'app-work-context-selector',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    LoadingProgressComponent
  ],
  templateUrl: './work-context-selector.html',
  styleUrl: './work-context-selector.css'
})
export class WorkContextSelectorComponent implements OnInit {
  @Input() franchises: Franchise[] = [];
  @Input() stores: StoreModel[] = [];
  @Output() contextSelected = new EventEmitter<WorkContextInfo>();

  private franchiseService = inject(FranchiseService);
  private storeService = inject(StoreService);
  private store = inject(NgRxStore<AppState>);

  workContext: WorkContext = {
    franchiseID: 0,
    storeID: 0,
    franchiseName: '',
    storeName: ''
  };

  // Loading states
  loadingStores = false;
  contextLoading$: Observable<boolean> = this.store.select(selectAuthLoading);

  ngOnInit(): void {
    this.franchiseService.getAll().subscribe(franchises => (this.franchises = franchises));
  }

  onFranchiseSelected(): void {
    const franchiseID = this.workContext.franchiseID;
    if (!franchiseID) return;

    this.loadingStores = true;
    this.stores = []; // Limpiar tiendas anteriores

    this.storeService.getByFranchiseId(franchiseID).subscribe({
      next: stores => {
        this.stores = stores;
        this.loadingStores = false;
      },
      error: () => {
        this.loadingStores = false;
      }
    });
  }

  confirm(): void {
    const franchise = this.franchises.find(f => f.id === this.workContext.franchiseID);
    const store = this.stores.find(s => s.id === this.workContext.storeID);

    this.contextSelected.emit({
      franchiseID: this.workContext.franchiseID,
      franchiseId: this.workContext.franchiseID, // Propiedad adicional requerida
      franchiseName: franchise?.name ?? '',
      storeID: this.workContext.storeID,
      storeId: this.workContext.storeID, // Propiedad adicional requerida
      storeName: store?.name ?? '',
      permissions: [] // Array vacío por defecto
    });
  }
}
