import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardData, DiscrepancySummary } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else {
        <!-- Stats cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Inventarios Hoy</p>
                <p class="text-2xl font-bold text-gray-800">{{ data()?.stats?.today_inventories ?? 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Con Discrepancias</p>
                <p class="text-2xl font-bold text-orange-600">{{ data()?.stats?.with_discrepancies ?? 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Sin Discrepancias</p>
                <p class="text-2xl font-bold text-green-600">{{ data()?.stats?.without_discrepancies ?? 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Pendientes</p>
                <p class="text-2xl font-bold text-gray-600">{{ data()?.stats?.pending_inventories ?? 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent discrepancies -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">Discrepancias Recientes (últimos 3 días)</h3>
            <a 
              routerLink="/admin/inventories" 
              [queryParams]="{has_discrepancies: true}"
              class="text-sm text-indigo-600 hover:text-indigo-800">
              Ver todas →
            </a>
          </div>
          <div class="overflow-x-auto">
            @if (discrepancies().length === 0) {
              <p class="text-gray-500 text-center py-8">
                No hay discrepancias en los últimos 3 días.
              </p>
            } @else {
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Esperado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (item of discrepancies(); track item.inventory_id + '-' + item.item_id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.item_name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.expected_value }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.actual_value }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span [class]="item.difference < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                          {{ item.difference > 0 ? '+' : '' }}{{ item.difference }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.inventory_date) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatType(item.inventory_type) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <a [routerLink]="['/admin/inventories', item.inventory_id]" class="text-indigo-600 hover:text-indigo-900">
                          Ver →
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  data = signal<DashboardData | null>(null);
  discrepancies = signal<DiscrepancySummary[]>([]);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.adminService.getDashboard(3).subscribe({
      next: (data) => {
        this.data.set(data);
        this.discrepancies.set(data.recent_discrepancies || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' });
  }

  formatType(type: string): string {
    const types: Record<string, string> = {
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual'
    };
    return types[type] || type;
  }
}
