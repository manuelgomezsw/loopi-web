import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { InventoryListItem, InventoryFilter } from '../../../core/models/admin.model';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Inventarios</h2>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input 
              type="date" 
              [(ngModel)]="filterDateFrom"
              (change)="applyFilters()"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input 
              type="date" 
              [(ngModel)]="filterDateTo"
              (change)="applyFilters()"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select 
              [(ngModel)]="filterType"
              (change)="applyFilters()"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todos</option>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Discrepancias</label>
            <select 
              [(ngModel)]="filterDiscrepancies"
              (change)="applyFilters()"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todos</option>
              <option value="true">Con discrepancias</option>
              <option value="false">Sin discrepancias</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              (click)="clearFilters()"
              class="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        } @else if (inventories().length === 0) {
          <p class="text-gray-500 text-center py-12">
            No se encontraron inventarios con los filtros seleccionados.
          </p>
        } @else {
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empleado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencias</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (inv of inventories(); track inv.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(inv.inventory_date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatType(inv.inventory_type, inv.schedule) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ inv.employee_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ inv.total_items }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    @if (inv.items_with_diff > 0) {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {{ inv.items_with_diff }}
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        0
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    @if (inv.status === 'completed') {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completado
                      </span>
                    } @else {
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En progreso
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <a [routerLink]="['/admin/inventories', inv.id]" class="text-indigo-600 hover:text-indigo-900">
                      Ver detalle →
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="flex-1 flex justify-between sm:hidden">
                <button 
                  (click)="prevPage()" 
                  [disabled]="currentPage() === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  Anterior
                </button>
                <button 
                  (click)="nextPage()" 
                  [disabled]="currentPage() === totalPages()"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                  Siguiente
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando página <span class="font-medium">{{ currentPage() }}</span> de <span class="font-medium">{{ totalPages() }}</span>
                    ({{ total() }} inventarios)
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button 
                      (click)="prevPage()" 
                      [disabled]="currentPage() === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                      ←
                    </button>
                    <button 
                      (click)="nextPage()" 
                      [disabled]="currentPage() === totalPages()"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class InventoryListComponent implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  inventories = signal<InventoryListItem[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  total = signal(0);

  filterDateFrom = '';
  filterDateTo = '';
  filterType = '';
  filterDiscrepancies = '';

  ngOnInit(): void {
    // Read query params for initial filters
    this.route.queryParams.subscribe(params => {
      if (params['has_discrepancies']) {
        this.filterDiscrepancies = params['has_discrepancies'];
      }
      if (params['date_from']) {
        this.filterDateFrom = params['date_from'];
      }
      if (params['date_to']) {
        this.filterDateTo = params['date_to'];
      }
      if (params['inventory_type']) {
        this.filterType = params['inventory_type'];
      }
      this.loadInventories();
    });
  }

  loadInventories(): void {
    this.loading.set(true);
    
    const filter: InventoryFilter = {
      page: this.currentPage(),
      page_size: 20
    };

    if (this.filterDateFrom) filter.date_from = this.filterDateFrom;
    if (this.filterDateTo) filter.date_to = this.filterDateTo;
    if (this.filterType) filter.inventory_type = this.filterType;
    if (this.filterDiscrepancies) filter.has_discrepancies = this.filterDiscrepancies === 'true';

    this.adminService.listInventories(filter).subscribe({
      next: (result) => {
        this.inventories.set(result.items || []);
        this.currentPage.set(result.page);
        this.totalPages.set(result.total_pages);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadInventories();
  }

  clearFilters(): void {
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.filterType = '';
    this.filterDiscrepancies = '';
    this.currentPage.set(1);
    this.router.navigate([], { queryParams: {} });
    this.loadInventories();
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadInventories();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadInventories();
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatType(type: string, schedule?: string): string {
    const types: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual'
    };
    const schedules: Record<string, string> = {
      opening: 'Apertura',
      noon: 'Mediodía',
      closing: 'Cierre'
    };
    
    let result = types[type] || type;
    if (schedule && schedules[schedule]) {
      result += ` - ${schedules[schedule]}`;
    }
    return result;
  }
}
