import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import {
  Employee,
  EmployeeFilter,
  EmployeeRole,
  CreateEmployeeRequest,
  UpdateEmployeeRequest
} from '../../../core/models/admin.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Empleados</h2>
        <button
          (click)="openCreateModal()"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Empleado
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()"
              placeholder="Nombre o usuario..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              [(ngModel)]="filterRole"
              (change)="applyFilters()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Todos</option>
              <option value="admin">Admin</option>
              <option value="employee">Empleado</option>
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

      <!-- Employees Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        } @else if (employees().length === 0) {
          <div class="text-center py-12 text-gray-500">
            No se encontraron empleados con los filtros aplicados.
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (emp of employees(); track emp.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ emp.name }} {{ emp.last_name }}</div>
                      @if (emp.document_number) {
                        <div class="text-xs text-gray-500">{{ emp.document_type }}: {{ emp.document_number }}</div>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-600">{{ emp.username }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        [class]="emp.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                      >
                        {{ emp.role === 'admin' ? 'Admin' : 'Empleado' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-600">
                        @if (emp.phone) {
                          <div>{{ emp.phone }}</div>
                        }
                        @if (emp.email) {
                          <div class="text-xs text-gray-400">{{ emp.email }}</div>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button
                        (click)="toggleStatus(emp)"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                        [class]="emp.active ? 'bg-emerald-600' : 'bg-gray-300'"
                        [title]="emp.active ? 'Clic para desactivar' : 'Clic para activar'"
                      >
                        <span
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                          [class]="emp.active ? 'translate-x-6' : 'translate-x-1'"
                        ></span>
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="flex justify-center gap-3">
                        <button
                          (click)="openEditModal(emp)"
                          class="text-emerald-600 hover:text-emerald-900"
                          title="Editar empleado"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          (click)="resetPassword(emp)"
                          class="text-orange-600 hover:text-orange-900"
                          title="Restablecer contraseña"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, total()) }} de {{ total() }} empleados
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
            <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ editingEmployee() ? 'Editar Empleado' : 'Nuevo Empleado' }}
              </h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      [(ngModel)]="formName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                    <input
                      type="text"
                      [(ngModel)]="formLastName"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                    <input
                      type="text"
                      [(ngModel)]="formUsername"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  @if (!editingEmployee()) {
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                      <input
                        type="password"
                        [(ngModel)]="formPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  }
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
                    <select
                      [(ngModel)]="formDocumentType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Seleccionar</option>
                      <option value="CC">CC</option>
                      <option value="CE">CE</option>
                      <option value="NUIP">NUIP</option>
                      <option value="PP">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Número Documento</label>
                    <input
                      type="text"
                      [(ngModel)]="formDocumentNumber"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      [(ngModel)]="formPhone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      [(ngModel)]="formEmail"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      [(ngModel)]="formBirthDate"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
                    <select
                      [(ngModel)]="formRole"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="employee">Empleado</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                @if (editingEmployee()) {
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
                  (click)="saveEmployee()"
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

      <!-- Confirm Reset Password Modal -->
      @if (showResetModal()) {
        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/50" (click)="closeResetModal()"></div>
            <div class="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmar Reset de Contraseña</h3>
              <p class="text-gray-600 mb-6">
                ¿Estás seguro que deseas resetear la contraseña de <strong>{{ resetEmployee()?.name }} {{ resetEmployee()?.last_name }}</strong>?
              </p>
              <p class="text-sm text-gray-500 mb-6">
                La nueva contraseña será: Documento + Año de nacimiento
              </p>
              <div class="flex justify-end gap-3">
                <button
                  (click)="closeResetModal()"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  (click)="confirmResetPassword()"
                  [disabled]="resetting()"
                  class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {{ resetting() ? 'Reseteando...' : 'Resetear' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  private adminService = inject(AdminService);
  protected Math = Math;

  // State
  employees = signal<Employee[]>([]);
  total = signal(0);
  totalPages = signal(0);
  loading = signal(false);
  showModal = signal(false);
  editingEmployee = signal<Employee | null>(null);
  saving = signal(false);
  showResetModal = signal(false);
  resetEmployee = signal<Employee | null>(null);
  resetting = signal(false);

  // Filters
  searchQuery = '';
  filterRole = '';
  filterActive = '';
  currentPage = 1;
  pageSize = 20;

  // Form
  formUsername = '';
  formPassword = '';
  formName = '';
  formLastName = '';
  formDocumentType = '';
  formDocumentNumber = '';
  formPhone = '';
  formEmail = '';
  formBirthDate = '';
  formRole: EmployeeRole = 'employee';
  formActive = true;

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading.set(true);

    const filter: EmployeeFilter = {
      page: this.currentPage,
      page_size: this.pageSize,
    };

    if (this.searchQuery) filter.search = this.searchQuery;
    if (this.filterRole) filter.role = this.filterRole as EmployeeRole;
    if (this.filterActive !== '') filter.active = this.filterActive === 'true';

    this.adminService.listEmployees(filter).subscribe({
      next: (result) => {
        this.employees.set(result.employees || []);
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
    this.loadEmployees();
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterRole = '';
    this.filterActive = '';
    this.currentPage = 1;
    this.loadEmployees();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  toggleStatus(emp: Employee) {
    this.adminService.updateEmployeeStatus(emp.id, !emp.active).subscribe({
      next: () => {
        emp.active = !emp.active;
      }
    });
  }

  openCreateModal() {
    this.editingEmployee.set(null);
    this.formUsername = '';
    this.formPassword = '';
    this.formName = '';
    this.formLastName = '';
    this.formDocumentType = '';
    this.formDocumentNumber = '';
    this.formPhone = '';
    this.formEmail = '';
    this.formBirthDate = '';
    this.formRole = 'employee';
    this.formActive = true;
    this.showModal.set(true);
  }

  openEditModal(emp: Employee) {
    this.editingEmployee.set(emp);
    this.formUsername = emp.username;
    this.formPassword = '';
    this.formName = emp.name;
    this.formLastName = emp.last_name;
    this.formDocumentType = emp.document_type || '';
    this.formDocumentNumber = emp.document_number || '';
    this.formPhone = emp.phone || '';
    this.formEmail = emp.email || '';
    this.formBirthDate = emp.birth_date ? emp.birth_date.substring(0, 10) : '';
    this.formRole = emp.role;
    this.formActive = emp.active;
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingEmployee.set(null);
  }

  saveEmployee() {
    if (!this.formName.trim() || !this.formLastName.trim() || !this.formUsername.trim()) return;

    this.saving.set(true);

    if (this.editingEmployee()) {
      const data: UpdateEmployeeRequest = {
        username: this.formUsername.trim(),
        name: this.formName.trim(),
        last_name: this.formLastName.trim(),
        document_type: this.formDocumentType || undefined,
        document_number: this.formDocumentNumber || undefined,
        phone: this.formPhone || undefined,
        email: this.formEmail || undefined,
        birth_date: this.formBirthDate || undefined,
        role: this.formRole,
        active: this.formActive
      };

      this.adminService.updateEmployee(this.editingEmployee()!.id, data).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadEmployees();
        },
        error: () => {
          this.saving.set(false);
        }
      });
    } else {
      if (!this.formPassword) {
        this.saving.set(false);
        return;
      }

      const data: CreateEmployeeRequest = {
        username: this.formUsername.trim(),
        password: this.formPassword,
        name: this.formName.trim(),
        last_name: this.formLastName.trim(),
        document_type: this.formDocumentType || undefined,
        document_number: this.formDocumentNumber || undefined,
        phone: this.formPhone || undefined,
        email: this.formEmail || undefined,
        birth_date: this.formBirthDate || undefined,
        role: this.formRole
      };

      this.adminService.createEmployee(data).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeModal();
          this.loadEmployees();
        },
        error: () => {
          this.saving.set(false);
        }
      });
    }
  }

  resetPassword(emp: Employee) {
    this.resetEmployee.set(emp);
    this.showResetModal.set(true);
  }

  closeResetModal() {
    this.showResetModal.set(false);
    this.resetEmployee.set(null);
  }

  confirmResetPassword() {
    if (!this.resetEmployee()) return;

    this.resetting.set(true);
    this.adminService.resetEmployeePassword(this.resetEmployee()!.id).subscribe({
      next: () => {
        this.resetting.set(false);
        this.closeResetModal();
      },
      error: () => {
        this.resetting.set(false);
      }
    });
  }
}
