import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-redirect',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  `
})
export class RoleRedirectComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/inventory']);
    }
  }
}
