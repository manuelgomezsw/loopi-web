import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { WorkContextInfo } from '../../../core/interfaces/api.interfaces';
import { WorkContextSelectorComponent } from '../../../shared/work-context-selector/work-context-selector';
import { AppState } from '../../../store/app.state';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-select-context',
  standalone: true,
  templateUrl: './select-context.html',
  styleUrls: ['./select-context.css'],
  imports: [CommonModule, WorkContextSelectorComponent, MatCardModule]
})
export class SelectContextComponent {
  private store = inject(Store<AppState>);

  onContextSelected(ctx: WorkContextInfo): void {
    this.store.dispatch(
      AuthActions.selectContext({
        context: {
          franchise_id: ctx.franchiseID,
          store_id: ctx.storeID
        }
      })
    );
  }
}
