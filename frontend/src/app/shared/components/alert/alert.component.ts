import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert" [class]="'alert-' + type()" role="alert">
      <div class="alert-icon">
        @switch (type()) {
          @case ('success') { ✓ }
          @case ('error') { ✕ }
          @case ('warning') { ⚠ }
          @case ('info') { ℹ }
        }
      </div>
      <div class="alert-content">
        @if (title()) {
          <strong class="alert-title">{{ title() }}</strong>
        }
        <p class="alert-message">{{ message() }}</p>
      </div>
      @if (dismissible()) {
        <button class="alert-close" (click)="dismiss.emit()" aria-label="Kapat">
          ×
        </button>
      }
    </div>
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .alert-success {
      background: #c6f6d5;
      color: #276749;
    }

    .alert-error {
      background: #fed7d7;
      color: #c53030;
    }

    .alert-warning {
      background: #fefcbf;
      color: #975a16;
    }

    .alert-info {
      background: #bee3f8;
      color: #2b6cb0;
    }

    .alert-icon {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .alert-content {
      flex: 1;
    }

    .alert-title {
      display: block;
      margin-bottom: 0.25rem;
    }

    .alert-message {
      margin: 0;
      font-size: 0.875rem;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.5;
      transition: opacity 0.15s;
    }

    .alert-close:hover {
      opacity: 1;
    }
  `]
})
export class AlertComponent {
  type = input<AlertType>('info');
  title = input<string>('');
  message = input.required<string>();
  dismissible = input<boolean>(true);
  
  dismiss = output<void>();
}
