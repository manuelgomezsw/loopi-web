import { Component, Input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-loading-progress',
  template: `
    <div class="loading-progress-container">
      <mat-progress-bar mode="indeterminate" [color]="color"></mat-progress-bar>
      @if (message) {
        <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading-progress-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 16px;
      }

      mat-progress-bar {
        width: 100%;
        max-width: 400px;
      }

      .loading-message {
        margin: 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        text-align: center;
      }
    `
  ],
  standalone: true,
  imports: [MatProgressBar]
})
export class LoadingProgressComponent {
  @Input() message?: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
