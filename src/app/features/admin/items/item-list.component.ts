import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import {
  Item,
  ItemFilter,
  ItemType,
  InventoryFrequency,
  CreateItemRequest,
  UpdateItemRequest
} from '../../../core/models/admin.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Items</h2>
        <button
          (click)="openCreateModal()"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Item
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Nombre del item..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              [(ngModel)]="filterType"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todos</option>
              <option value="product">Producto</option>
              <option value="supply">Insumo</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
            <select
              [(ngModel)]="filterFrequency"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todas</option>
              <option value="daily">Diaria</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              [(ngModel)]="filterActive"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              (click)="clearFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        } @else if (items().length === 0) {
          <div class="text-center py-12 text-gray-500">
            No se encontraron items con los filtros aplicados.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (item of items(); track item.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-medium text-gray-900">{{ item.name }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="item.type === 'product' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                      >
                        {{ item.type === 'product' ? 'Producto' : 'Insumo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-600">{{ getFrequencyLabel(item.inventory_frequency) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        (click)="toggleStatus(item)"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                        [class]="item.active ? 'bg-emerald-600' : 'bg-gray-300'"
                      >
                        <span
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          [class]="item.active ? 'translate-x-6' : 'translate-x-1'"
                        ></span>
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="openEditModal(item)"
                        class="text-emerald-600 hover:text-emerald-900"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, total()) }} de {{ total() }} items
            </div>
            <div class="flex gap-2">
              <button
                (click)="goToPage(currentPage - 1)"
                [disabled]="currentPage === 1"
                class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              <button
                (click)="goToPage(currentPage + 1)"
                [disabled]="currentPage >= totalPages()"
                class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Modal Create/Edit -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50" (click)="closeModal()"></div>
            <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ editingItem() ? 'Editar Item' : 'Nuevo Item' }}
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    [(ngModel)]="formName"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nombre del item"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    [(ngModel)]="formType"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="product">Producto</option>
                    <option value="supply">Insumo</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Inventario</label>
                  <select
                    [(ngModel)]="formFrequency"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="daily">Diaria</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                @if (editingItem()) {
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      [(ngModel)]="formActive"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option [ngValue]="true">Activo</option>
                      <option [ngValue]="false">Inactivo</option>
                    </select>
                  </div>
                }
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  (click)="saveItem()"
                  [disabled]="saving()"
                  class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {{ saving() ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ItemListComponent implements OnInit {
  private adminService = inject(AdminService);
  protected Math = Math;

  // State
  items = signal<Item[]>([]);
  total = signal(0);
  totalPages = signal(0);
  loading = signal(false);
  showModal = signal(false);
  editingItem = signal<Item | null>(null);
  saving = signal(false);

  // Filters
  searchQuery = '';
  filterType = '';
  filterFrequency = '';
  filterActive = '';
  currentPage = 1;
  pageSize = 20;

  // Form
  formName = '';
  formType: ItemType = 'supply';
  formFrequency: InventoryFrequency = 'monthly';
  formActive = true;

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading.set(true);

    const filter: ItemFilter = {
      page: this.currentPage,
      page_size: this.pageSize,
    };

    if (this.searchQuery) filter.search = this.searchQuery;
    if (this.filterType) filter.type = this.filterType as ItemType;
    if (this.filterFrequency) filter.frequency = this.filterFrequency as InventoryFrequency;
    if (this.filterActive !== '') filter.active = this.filterActive === 'true';

    this.adminService.listItems(filter).subscribe({
      next: (result) => {
        this.items.set(result.items || []);
        this.total.set(result.total);
        this.totalPages.set(result.total_pages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearchChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFilters(), 300);
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadItems();
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterType = '';
    this.filterFrequency = '';
    this.filterActive = '';
    this.currentPage = 1;
    this.loadItems();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
      this.loadItems();
    }
  }

  getFrequencyLabel(frequency: InventoryFrequency): string {
    const labels: Record<InventoryFrequency, string> = {
      daily: 'Diaria',
      weekly: 'Semanal',
      monthly: 'Mensual'
    };
    return labels[frequency] || frequency;
  }

  toggleStatus(item: Item) {
    this.adminService.updateItemStatus(item.id, !item.active).subscribe({
      next: () => {
        item.active = !item.active;
      }
    });
  }

  openCreateModal() {
    this.editingItem.set(null);
    this.formName = '';
    this.formType = 'supply';
    this.formFrequency = 'monthly';
    this.formActive = true;
    this.showModal.set(true);
  }

  openEditModal(item: Item) {
    this.editingItem.set(item);
    this.formName = item.name;
    this.formType = item.type;
    this.formFrequency = item.inventory_frequency;
    this.formActive = item.active;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingItem.set(null);
  }

  saveItem() {
    if (!this.formName.trim()) return;

    this.saving.set(true);

    if (this.editingItem()) {
      const data: UpdateItemRequest = {
        type: this.formType,
        name: this.formName.trim(),
        inventory_frequency: this.formFrequency,
        active: this.formActive
      };

      this.adminService.updateItem(this.editingItem()!.id, data).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadItems();
        },
        error: () => {
          this.saving.set(false);
        }
      });
    } else {
      const data: CreateItemRequest = {
        type: this.formType,
        name: this.formName.trim(),
        inventory_frequency: this.formFrequency
      };

      this.adminService.createItem(data).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadItems();
        },
        error: () => {
          this.saving.set(false);
        }
      });
    }
  }
}
