import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { InventoryDetailView, InventoryDetailItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            (click)="goBack()"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 class="text-2xl font-bold text-gray-800">Inventario #{{ inventory()?.id }}</h2>
        </div>
        @if (inventory()?.status === 'completed') {
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Completado
          </span>
        } @else {
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            En progreso
          </span>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else if (inventory()) {
        <!-- Info cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-sm text-gray-500">Fecha</p>
            <p class="text-lg font-semibold text-gray-800">{{ formatDate(inventory()!.inventory_date) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-sm text-gray-500">Tipo</p>
            <p class="text-lg font-semibold text-gray-800">{{ formatType(inventory()!.inventory_type, inventory()!.schedule) }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-sm text-gray-500">Empleado</p>
            <p class="text-lg font-semibold text-gray-800">{{ inventory()!.employee_name }}</p>
          </div>
          <div class="bg-white rounded-lg shadow p-4">
            <p class="text-sm text-gray-500">Horario</p>
            <p class="text-lg font-semibold text-gray-800">{{ formatTime(inventory()!.started_at) }} - {{ inventory()!.completed_at ? formatTime(inventory()!.completed_at!) : 'En curso' }}</p>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex items-center gap-8">
            <div>
              <span class="text-sm text-gray-500">Total items:</span>
              <span class="ml-2 font-semibold">{{ inventory()!.total_items }}</span>
            </div>
            <div>
              <span class="text-sm text-gray-500">Con diferencias:</span>
              <span class="ml-2 font-semibold text-orange-600">{{ inventory()!.items_with_diff }}</span>
            </div>
            <div>
              <span class="text-sm text-gray-500">Sin diferencias:</span>
              <span class="ml-2 font-semibold text-green-600">{{ inventory()!.total_items - inventory()!.items_with_diff }}</span>
            </div>
            <div class="flex-1"></div>
            <label class="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                [(ngModel)]="showOnlyDiscrepancies"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
              Solo discrepancias
            </label>
          </div>
        </div>

        <!-- Details table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Esperado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Contado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Compras</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mermas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of filteredDetails(); track item.detail_id) {
                <tr [class.bg-orange-50]="item.has_discrepancy">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.item_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.item_type === 'product' ? 'Producto' : 'Insumo' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ item.expected_value }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (editingItem() === item.detail_id) {
                      <input 
                        type="number" 
                        [(ngModel)]="editRealValue"
                        min="0"
                        class="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    } @else {
                      {{ item.real_value ?? '-' }}
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (editingItem() === item.detail_id) {
                      <input 
                        type="number" 
                        [(ngModel)]="editStockReceived"
                        min="0"
                        class="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    } @else {
                      {{ item.stock_received ?? '-' }}
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (editingItem() === item.detail_id) {
                      <input 
                        type="number" 
                        [(ngModel)]="editUnitsSold"
                        min="0"
                        class="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    } @else {
                      {{ item.units_sold ?? '-' }}
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (editingItem() === item.detail_id && inventory()?.status === 'completed') {
                      <input 
                        type="number" 
                        [(ngModel)]="editShrinkage"
                        min="0"
                        class="w-20 text-center border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    } @else if (editingItem() === item.detail_id) {
                      <span class="text-gray-400 text-xs">Solo si completado</span>
                    } @else {
                      {{ item.shrinkage ?? '-' }}
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (item.has_discrepancy) {
                      <span [class]="item.difference < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                        {{ item.difference > 0 ? '+' : '' }}{{ item.difference }}
                      </span>
                    } @else {
                      <span class="text-green-600">0</span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    @if (editingItem() === item.detail_id) {
                      <div class="flex items-center justify-center gap-2">
                        <button 
                          (click)="saveEdit(item)"
                          [disabled]="saving()"
                          class="text-green-600 hover:text-green-800 disabled:opacity-50">
                          @if (saving()) {
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          } @else {
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                          }
                        </button>
                        <button 
                          (click)="cancelEdit()"
                          class="text-gray-500 hover:text-gray-700">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    } @else {
                      <button 
                        (click)="startEdit(item)"
                        class="text-indigo-600 hover:text-indigo-800">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class InventoryDetailComponent implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  inventory = signal<InventoryDetailView | null>(null);
  editingItem = signal<number | null>(null);
  showOnlyDiscrepancies = false;

  editRealValue: number | null = null;
  editStockReceived: number | null = null;
  editUnitsSold: number | null = null;
  editShrinkage: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('inventoryID');
    if (id) {
      this.loadInventory(parseInt(id, 10));
    }
  }

  loadInventory(id: number): void {
    this.loading.set(true);
    this.adminService.getInventoryDetail(id).subscribe({
      next: (data) => {
        this.inventory.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  filteredDetails(): InventoryDetailItem[] {
    const inv = this.inventory();
    if (!inv) return [];
    
    if (this.showOnlyDiscrepancies) {
      return inv.details.filter(d => d.has_discrepancy);
    }
    return inv.details;
  }

  startEdit(item: InventoryDetailItem): void {
    this.editingItem.set(item.detail_id);
    this.editRealValue = item.real_value;
    this.editStockReceived = item.stock_received;
    this.editUnitsSold = item.units_sold;
    this.editShrinkage = item.shrinkage;
  }

  cancelEdit(): void {
    this.editingItem.set(null);
    this.editRealValue = null;
    this.editStockReceived = null;
    this.editUnitsSold = null;
    this.editShrinkage = null;
  }

  saveEdit(item: InventoryDetailItem): void {
    const inv = this.inventory();
    if (!inv) return;

    const payload: { real_value?: number; stock_received?: number; units_sold?: number; shrinkage?: number } = {
      real_value: this.editRealValue ?? undefined,
      stock_received: this.editStockReceived ?? undefined,
      units_sold: this.editUnitsSold ?? undefined
    };
    if (inv.status === 'completed') {
      payload.shrinkage = this.editShrinkage ?? undefined;
    }

    this.saving.set(true);
    this.adminService.updateInventoryDetail(inv.id, item.detail_id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancelEdit();
        this.loadInventory(inv.id);
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/inventories']);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  formatType(type: string, schedule?: string): string {
    const types: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      initial: 'Inicial'
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
