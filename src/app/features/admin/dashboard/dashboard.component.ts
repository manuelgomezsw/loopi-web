import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardData, Employee } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
        @if (!hasInitialInventory() && !loading()) {
          <button
            (click)="openInitialInventoryModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Crear inventario inicial
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      } @else {
        <!-- Initial inventory banner -->
        @if (!hasInitialInventory()) {
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div class="flex">
              <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <h3 class="text-sm font-medium text-amber-800">Inventario inicial pendiente</h3>
                <p class="mt-1 text-sm text-amber-700">
                  No se ha creado un inventario inicial. Sin este, los primeros inventarios no tendrán valores de referencia para comparar.
                </p>
              </div>
            </div>
          </div>
        }

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

      }
    </div>

    <!-- Modal: Create Initial Inventory -->
    @if (showInitialModal()) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeInitialInventoryModal()" aria-hidden="true"></div>

          <!-- Modal panel: relative + z-10 so it appears above the backdrop -->
          <div class="relative z-10 transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Crear inventario inicial
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Este inventario establece la línea base del negocio. Se incluirán todos los productos activos para que el empleado asignado realice el conteo físico.
                  </p>
                </div>

                <!-- Employee selector -->
                <div class="mt-4">
                  <label for="employee-select" class="block text-sm font-medium text-gray-700 text-left">
                    Asignar a empleado
                  </label>
                  @if (loadingEmployees()) {
                    <div class="mt-1 flex justify-center py-3">
                      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                    </div>
                  } @else {
                    <select
                      id="employee-select"
                      [(ngModel)]="selectedEmployeeId"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
                      <option [ngValue]="0">Seleccionar empleado...</option>
                      @for (emp of employees(); track emp.id) {
                        <option [ngValue]="emp.id">{{ emp.name }} {{ emp.last_name }}</option>
                      }
                    </select>
                  }
                </div>

                @if (modalError()) {
                  <div class="mt-3 text-sm text-red-600">
                    {{ modalError() }}
                  </div>
                }
              </div>
            </div>
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                [disabled]="creatingInitial() || selectedEmployeeId === 0"
                (click)="createInitialInventory()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                @if (creatingInitial()) {
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando...
                } @else {
                  Crear inventario
                }
              </button>
              <button
                type="button"
                [disabled]="creatingInitial()"
                (click)="closeInitialInventoryModal()"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  data = signal<DashboardData | null>(null);
  hasInitialInventory = signal(true); // default true to avoid flash

  // Initial inventory modal
  showInitialModal = signal(false);
  loadingEmployees = signal(false);
  employees = signal<Employee[]>([]);
  selectedEmployeeId = 0;
  creatingInitial = signal(false);
  modalError = signal('');

  ngOnInit(): void {
    this.loadDashboard();
    this.checkInitialInventory();
  }

  loadDashboard(): void {
    this.adminService.getDashboard(3).subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  checkInitialInventory(): void {
    this.adminService.listInventories({ inventory_type: 'initial', page: 1, page_size: 1 }).subscribe({
      next: (result) => {
        this.hasInitialInventory.set(result.total > 0);
      },
      error: () => {
        this.hasInitialInventory.set(false);
      }
    });
  }

  openInitialInventoryModal(): void {
    this.showInitialModal.set(true);
    this.modalError.set('');
    this.selectedEmployeeId = 0;
    this.loadEmployees();
  }

  closeInitialInventoryModal(): void {
    this.showInitialModal.set(false);
    this.modalError.set('');
  }

  loadEmployees(): void {
    this.loadingEmployees.set(true);
    this.adminService.listAllActiveEmployees().subscribe({
      next: (result) => {
        this.employees.set(result.employees || []);
        this.loadingEmployees.set(false);
      },
      error: () => {
        this.loadingEmployees.set(false);
        this.modalError.set('Error al cargar empleados');
      }
    });
  }

  createInitialInventory(): void {
    if (this.selectedEmployeeId === 0) return;

    this.creatingInitial.set(true);
    this.modalError.set('');

    this.adminService.createInitialInventory({ responsible_id: this.selectedEmployeeId }).subscribe({
      next: () => {
        this.creatingInitial.set(false);
        this.showInitialModal.set(false);
        this.hasInitialInventory.set(true);
        // Reload dashboard to reflect changes
        this.loadDashboard();
      },
      error: (err) => {
        this.creatingInitial.set(false);
        const message = err.error?.error || 'Error al crear el inventario inicial';
        this.modalError.set(message);
      }
    });
  }
}
