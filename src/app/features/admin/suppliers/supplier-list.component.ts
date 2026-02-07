import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Supplier, SupplierFilter, CreateSupplierRequest, UpdateSupplierRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p class="text-sm text-gray-500">Gestiona los proveedores de productos</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nuevo proveedor
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="filter.search"
              (ngModelChange)="onSearchChange()"
              placeholder="Buscar por razón social, NIT o contacto..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
            />
          </div>
          <select
            [(ngModel)]="filterActive"
            (ngModelChange)="onFilterChange()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex justify-center py-12">
          <svg class="animate-spin h-8 w-8 text-coffee-500" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else {
        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón social</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIT</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (supplier of suppliers(); track supplier.id) {
                <tr class="hover:bg-gray-50" [class.opacity-50]="!supplier.active">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ supplier.business_name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ supplier.tax_id }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ supplier.contact_name }}</div>
                    <div class="text-sm text-gray-500">{{ supplier.contact_phone }}</div>
                    @if (supplier.contact_email) {
                      <div class="text-sm text-gray-500">{{ supplier.contact_email }}</div>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      (click)="toggleStatus(supplier)"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                      [class]="supplier.active ? 'bg-emerald-600' : 'bg-gray-300'"
                      [title]="supplier.active ? 'Clic para desactivar' : 'Clic para activar'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        [class]="supplier.active ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      (click)="openEditModal(supplier)"
                      class="text-emerald-600 hover:text-emerald-900"
                      title="Editar proveedor"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                    No hay proveedores registrados
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Pagination -->
          @if (totalPages() > 1) {
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div class="text-sm text-gray-700">
                Mostrando {{ (filter.page! - 1) * filter.page_size! + 1 }} a {{ Math.min(filter.page! * filter.page_size!, total()) }} de {{ total() }} resultados
              </div>
              <div class="flex gap-2">
                <button
                  (click)="goToPage(filter.page! - 1)"
                  [disabled]="filter.page === 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  (click)="goToPage(filter.page! + 1)"
                  [disabled]="filter.page === totalPages()"
                  class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ editingSupplier() ? 'Editar proveedor' : 'Nuevo proveedor' }}
              </h2>

              <form (ngSubmit)="saveSupplier()">
                <div class="space-y-4">
                  <!-- Business Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Razón social *</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.business_name"
                      name="business_name"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    />
                  </div>

                  <!-- Tax ID -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">NIT *</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.tax_id"
                      name="tax_id"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                      placeholder="Ej: 900123456-1"
                    />
                  </div>

                  <!-- Contact Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Persona de contacto</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.contact_name"
                      name="contact_name"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    />
                  </div>

                  <!-- Contact Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
                    <input
                      type="tel"
                      [(ngModel)]="formData.contact_phone"
                      name="contact_phone"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    />
                  </div>

                  <!-- Contact Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo de contacto</label>
                    <input
                      type="email"
                      [(ngModel)]="formData.contact_email"
                      name="contact_email"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    />
                  </div>

                  @if (editingSupplier()) {
                    <!-- Active -->
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        [(ngModel)]="formData.active"
                        name="active"
                        id="active"
                        class="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                      />
                      <label for="active" class="text-sm font-medium text-gray-700">Proveedor activo</label>
                    </div>
                  }
                </div>

                @if (error()) {
                  <div class="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {{ error() }}
                  </div>
                }

                <div class="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    (click)="closeModal()"
                    class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    [disabled]="saving()"
                    class="px-4 py-2 bg-coffee-600 text-white rounded-lg hover:bg-coffee-700 disabled:opacity-50"
                  >
                    {{ saving() ? 'Guardando...' : 'Guardar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SupplierListComponent implements OnInit {
  private adminService = inject(AdminService);
  Math = Math;

  suppliers = signal<Supplier[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editingSupplier = signal<Supplier | null>(null);
  saving = signal(false);
  error = signal('');
  total = signal(0);
  totalPages = signal(0);

  filter: SupplierFilter = {
    page: 1,
    page_size: 20
  };
  filterActive = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  formData = {
    business_name: '',
    tax_id: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    active: true
  };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading.set(true);
    this.adminService.listSuppliers(this.filter).subscribe({
      next: (result) => {
        this.suppliers.set(result.suppliers || []);
        this.total.set(result.total);
        this.totalPages.set(result.total_pages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.filter.page = 1;
      this.loadSuppliers();
    }, 300);
  }

  onFilterChange(): void {
    this.filter.active = this.filterActive === '' ? undefined : this.filterActive === 'true';
    this.filter.page = 1;
    this.loadSuppliers();
  }

  goToPage(page: number): void {
    this.filter.page = page;
    this.loadSuppliers();
  }

  openCreateModal(): void {
    this.editingSupplier.set(null);
    this.formData = {
      business_name: '',
      tax_id: '',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      active: true
    };
    this.error.set('');
    this.showModal.set(true);
  }

  openEditModal(supplier: Supplier): void {
    this.editingSupplier.set(supplier);
    this.formData = {
      business_name: supplier.business_name,
      tax_id: supplier.tax_id,
      contact_name: supplier.contact_name || '',
      contact_phone: supplier.contact_phone || '',
      contact_email: supplier.contact_email || '',
      active: supplier.active
    };
    this.error.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingSupplier.set(null);
    this.error.set('');
  }

  saveSupplier(): void {
    if (!this.formData.business_name.trim()) {
      this.error.set('La razón social es requerida');
      return;
    }
    if (!this.formData.tax_id.trim()) {
      this.error.set('El NIT es requerido');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const editing = this.editingSupplier();

    if (editing) {
      const updateReq: UpdateSupplierRequest = {
        business_name: this.formData.business_name.trim(),
        tax_id: this.formData.tax_id.trim(),
        contact_name: this.formData.contact_name.trim(),
        contact_phone: this.formData.contact_phone.trim(),
        contact_email: this.formData.contact_email.trim(),
        active: this.formData.active
      };

      this.adminService.updateSupplier(editing.id, updateReq).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Error al actualizar el proveedor');
          this.saving.set(false);
        }
      });
    } else {
      const createReq: CreateSupplierRequest = {
        business_name: this.formData.business_name.trim(),
        tax_id: this.formData.tax_id.trim(),
        contact_name: this.formData.contact_name.trim(),
        contact_phone: this.formData.contact_phone.trim(),
        contact_email: this.formData.contact_email.trim()
      };

      this.adminService.createSupplier(createReq).subscribe({
        next: () => {
          this.closeModal();
          this.loadSuppliers();
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Error al crear el proveedor');
          this.saving.set(false);
        }
      });
    }
  }

  toggleStatus(supplier: Supplier): void {
    const newStatus = !supplier.active;
    this.adminService.updateSupplierStatus(supplier.id, newStatus).subscribe({
      next: () => {
        // Actualiza el estado local inmediatamente para feedback visual
        supplier.active = newStatus;
      },
      error: () => {
        // Si falla, recarga la lista para mostrar el estado real
        this.loadSuppliers();
      }
    });
  }
}
