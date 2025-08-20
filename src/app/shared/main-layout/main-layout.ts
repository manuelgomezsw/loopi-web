import {Component, inject, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {WorkContextSelectorComponent} from '../work-context-selector/work-context-selector';
import {MatTooltip} from '@angular/material/tooltip';
import {Franchise} from '../../model/franchise';
import {AuthService} from '../../core/services/auth-service/auth-service';
import {WorkContextService} from '../../core/services/work-context/work-context';

@Component({
  selector: 'app-main-layout',
  imports: [
    MatIcon,
    MatToolbar,
    MatIconButton,
    MatButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    RouterLink,
    MatTooltip,
    RouterOutlet,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit {
  private dialog = inject(MatDialog);
  franchises: Franchise[] = [];
  stores: Store[] = [];
  context: WorkContext | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private workContextService: WorkContextService
  ) {
    this.context = this.workContextService.get();
  }

  ngOnInit(): void {
    this.loadFranchisesAndStores();

    const saved = localStorage.getItem('work-context');
    if (saved) {
      this.context = JSON.parse(saved);
    }
  }

  loadFranchisesAndStores(): void {
    // 🔁 Reemplazá esto con un servicio real si lo tenés
    this.franchises = [
      {
        id: 1, name: 'Urbania',
        location: "",
        active: false
      },
      {
        id: 2, name: 'Madelo',
        location: "",
        active: false
      }
    ];

    this.stores = [
      {id: 101, name: 'Jardines Llanogrande', franchiseId: 1},
      {id: 102, name: 'San Nicolás', franchiseId: 1},
      {id: 201, name: 'Vayúh', franchiseId: 2}
    ];
  }

  openContextSelector(): void {
    const dialogRef = this.dialog.open(WorkContextSelectorComponent, {
      width: '480px',
      disableClose: true,
      data: {
        franchises: this.franchises,
        stores: this.stores
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const franchise = this.franchises.find(f => f.id === result.franchiseId);
        const store = this.stores.find(s => s.id === result.storeId);

        this.context = {
          franchiseId: result.franchiseId,
          storeId: result.storeId,
          franchiseName: franchise?.name || '',
          storeName: store?.name || ''
        };

        localStorage.setItem('work-context', JSON.stringify(this.context));
      }
    });
  }

  // Podés agregar getters si querés usarlos en el HTML
  get franchiseLabel(): string {
    return this.context?.franchiseName ?? 'Urbania';
  }

  get storeLabel(): string {
    return this.context?.storeName ?? 'Jardines Llanogrande';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
