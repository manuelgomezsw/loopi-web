import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AdminService } from '../../../core/services/admin.service';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/admin.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Categorías</h1>
          <p class="text-sm text-gray-500">Organiza las categorías de productos arrastrándolas</p>
        </div>
        <button
          (click)="openCreateModal()"
          class="bg-coffee-600 text-white px-4 py-2 rounded-lg hover:bg-coffee-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nueva categoría
        </button>
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
        <!-- Categories List with Drag & Drop -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div
            cdkDropList
            (cdkDropListDropped)="onDrop($event)"
            class="divide-y divide-gray-200"
          >
            @for (category of categories(); track category.id) {
              <div
                cdkDrag
                class="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-move"
                [class.opacity-50]="!category.active"
              >
                <!-- Drag Handle -->
                <div cdkDragHandle class="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                <!-- Order Number -->
                <div class="w-8 h-8 rounded-full bg-coffee-100 text-coffee-700 flex items-center justify-center font-semibold text-sm">
                  {{ category.display_order }}
                </div>

                <!-- Category Info -->
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
                  <p class="text-sm text-gray-500">{{ category.item_count }} productos</p>
                </div>

                <!-- Status Switch -->
                <button
                  (click)="toggleStatus(category); $event.stopPropagation()"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer"
                  [class]="category.active ? 'bg-emerald-600' : 'bg-gray-300'"
                  [title]="category.active ? 'Clic para desactivar' : 'Clic para activar'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    [class]="category.active ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>

                <!-- Actions -->
                <button
                  (click)="openEditModal(category)"
                  class="p-2 text-emerald-600 hover:text-emerald-900 rounded-lg hover:bg-gray-100"
                  title="Editar categoría"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            } @empty {
              <div class="p-8 text-center text-gray-500">
                No hay categorías registradas
              </div>
            }
          </div>
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div class="p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">
                {{ editingCategory() ? 'Editar categoría' : 'Nueva categoría' }}
              </h2>

              <form (ngSubmit)="saveCategory()">
                <div class="space-y-4">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.name"
                      name="name"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                      placeholder="Ej: Cafés"
                    />
                  </div>

                  @if (editingCategory()) {
                    <!-- Active -->
                    <div class="flex items-center gap-2">
                      <input
                        type="checkbox"
                        [(ngModel)]="formData.active"
                        name="active"
                        id="active"
                        class="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-gray-300 rounded"
                      />
                      <label for="active" class="text-sm font-medium text-gray-700">Categoría activa</label>
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
export class CategoryListComponent implements OnInit {
  private adminService = inject(AdminService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editingCategory = signal<Category | null>(null);
  saving = signal(false);
  error = signal('');

  formData = {
    name: '',
    active: true
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.adminService.listCategories().subscribe({
      next: (result) => {
        this.categories.set(result.categories || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onDrop(event: CdkDragDrop<Category[]>): void {
    const cats = [...this.categories()];
    moveItemInArray(cats, event.previousIndex, event.currentIndex);
    
    // Update display_order for all categories
    const orders = cats.map((cat, index) => ({
      id: cat.id,
      display_order: index + 1
    }));

    // Update local state immediately
    cats.forEach((cat, index) => {
      cat.display_order = index + 1;
    });
    this.categories.set(cats);

    // Save to backend
    this.adminService.reorderCategories({ orders }).subscribe({
      error: () => {
        // Reload on error
        this.loadCategories();
      }
    });
  }

  openCreateModal(): void {
    this.editingCategory.set(null);
    this.formData = { name: '', active: true };
    this.error.set('');
    this.showModal.set(true);
  }

  openEditModal(category: Category): void {
    this.editingCategory.set(category);
    this.formData = {
      name: category.name,
      active: category.active
    };
    this.error.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCategory.set(null);
    this.error.set('');
  }

  saveCategory(): void {
    if (!this.formData.name.trim()) {
      this.error.set('El nombre es requerido');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const editing = this.editingCategory();

    if (editing) {
      const updateReq: UpdateCategoryRequest = {
        name: this.formData.name.trim(),
        active: this.formData.active
      };

      this.adminService.updateCategory(editing.id, updateReq).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Error al actualizar la categoría');
          this.saving.set(false);
        }
      });
    } else {
      const createReq: CreateCategoryRequest = {
        name: this.formData.name.trim()
      };

      this.adminService.createCategory(createReq).subscribe({
        next: () => {
          this.closeModal();
          this.loadCategories();
          this.saving.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.error || 'Error al crear la categoría');
          this.saving.set(false);
        }
      });
    }
  }

  toggleStatus(category: Category): void {
    const newStatus = !category.active;
    this.adminService.updateCategoryStatus(category.id, newStatus).subscribe({
      next: () => {
        // Actualiza el estado local inmediatamente para feedback visual
        category.active = newStatus;
      },
      error: () => {
        // Si falla, recarga la lista para mostrar el estado real
        this.loadCategories();
      }
    });
  }
}
