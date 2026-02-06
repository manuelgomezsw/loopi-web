import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Inventarios</h2>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-center py-8">
          La lista de inventarios estará disponible en la Fase 2.
        </p>
      </div>
    </div>
  `
})
export class InventoryListComponent {}
