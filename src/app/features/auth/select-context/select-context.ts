import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {WorkContextSelectorComponent} from '../../../shared/work-context-selector/work-context-selector';
import {AuthService} from '../../../core/services/auth/auth-service';

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
  private router = inject(Router);
  private auth = inject(AuthService);

  franchises: any[] = [];
  stores: any[] = [];

  onContextSelected(ctx: WorkContext): void {
    this.auth.selectContext({
      franchise_id: ctx.franchiseID,
      store_id: ctx.storeID
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('work-context', JSON.stringify(ctx));

        this.router.navigate(['/home']);
      },
      error: () => {
        alert('No se pudo establecer el contexto.');
      }
    });
  }
}
