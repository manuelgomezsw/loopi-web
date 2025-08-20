import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {Franchise} from '../../../model/franchise';
import {WorkContextSelectorComponent} from '../../../shared/work-context-selector/work-context-selector';
import {WorkContextService} from '../../../core/services/work-context/work-context';

@Component({
  selector: 'app-select-context',
  standalone: true,
  templateUrl: './select-context.html',
  styleUrls: ['./select-context.css'],
  imports: [
    CommonModule,
    WorkContextSelectorComponent,
    MatCardModule
  ]
})
export class SelectContextComponent {
  franchises: Franchise[] = [
    {id: 1, name: 'Urbania', location: '', active: true},
    {id: 2, name: 'Madelo', location: '', active: true}
  ];

  stores: Store[] = [
    {id: 101, name: 'Jardines Llanogrande', franchiseId: 1},
    {id: 102, name: 'San Nicolás', franchiseId: 1},
    {id: 201, name: 'Vayúh', franchiseId: 2}
  ];

  constructor(private router: Router, private workContextService: WorkContextService) {
  }

  onContextSelected(ctx: { franchiseId: number; storeId: number }) {
    const franchise = this.franchises.find(f => f.id === ctx.franchiseId);
    const store = this.stores.find(s => s.id === ctx.storeId);

    const context: WorkContext = {
      franchiseId: ctx.franchiseId,
      storeId: ctx.storeId,
      franchiseName: franchise?.name ?? '',
      storeName: store?.name ?? ''
    };

    this.workContextService.set(context);
    this.router.navigate(['/home']);
  }
}
