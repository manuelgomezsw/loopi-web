import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Sidebar -->
      <aside 
        class="bg-white shadow-lg transition-all duration-300 flex flex-col"
        [class.w-64]="!collapsed()"
        [class.w-16]="collapsed()">
        
        <!-- Logo -->
        <div class="h-16 flex items-center justify-center border-b border-gray-200">
          @if (!collapsed()) {
            <span class="text-xl font-bold text-indigo-600">Loopi Admin</span>
          } @else {
            <span class="text-xl font-bold text-indigo-600">L</span>
          }
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-2">
          <a 
            routerLink="/admin/dashboard" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            @if (!collapsed()) {
              <span>Dashboard</span>
            }
          </a>

          <a 
            routerLink="/admin/inventories" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
            </svg>
            @if (!collapsed()) {
              <span>Inventarios</span>
            }
          </a>

          <a 
            routerLink="/admin/items" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            @if (!collapsed()) {
              <span>Items</span>
            }
          </a>

          <a 
            routerLink="/admin/employees" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            @if (!collapsed()) {
              <span>Empleados</span>
            }
          </a>

          <a 
            routerLink="/admin/categories" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            @if (!collapsed()) {
              <span>Categorías</span>
            }
          </a>

          <a 
            routerLink="/admin/suppliers" 
            routerLinkActive="bg-indigo-50 text-indigo-600"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
            </svg>
            @if (!collapsed()) {
              <span>Proveedores</span>
            }
          </a>
        </nav>

        <!-- Collapse button & Logout -->
        <div class="p-4 border-t border-gray-200 space-y-2">
          <button 
            (click)="toggleCollapse()"
            class="w-full flex items-center justify-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <svg 
              class="w-5 h-5 transition-transform" 
              [class.rotate-180]="collapsed()"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
          </button>

          <button 
            (click)="logout()"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            @if (!collapsed()) {
              <span>Cerrar sesión</span>
            }
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 class="text-lg font-semibold text-gray-800">Panel de Administración</h1>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">{{ auth.employeeName() }}</span>
            <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ getInitials() }}</span>
            </div>
          </div>
        </header>

        <!-- Page content -->
        <div class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  collapsed = signal(false);

  toggleCollapse(): void {
    this.collapsed.update(v => !v);
  }

  logout(): void {
    this.auth.logout();
  }

  getInitials(): string {
    const employee = this.auth.employee();
    if (!employee) return '';
    return (employee.name[0] + employee.last_name[0]).toUpperCase();
  }
}
