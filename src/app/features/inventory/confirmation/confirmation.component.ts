import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit {
  private router = inject(Router);

  issuesCreated = signal(0);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state;
    if (state?.issuesCreated !== undefined) {
      this.issuesCreated.set(state.issuesCreated);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
