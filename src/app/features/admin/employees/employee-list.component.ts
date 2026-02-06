import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-800">Empleados</h2>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-500 text-center py-8">
          La gestión de empleados estará disponible en la Fase 4.
        </p>
      </div>
    </div>
  `
})
export class EmployeeListComponent {}
