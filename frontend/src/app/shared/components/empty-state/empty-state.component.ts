import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3 class="empty-title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
      <div class="empty-action">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      text-align: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.6;
    }

    .empty-title {
      color: var(--text-primary, #1a202c);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }

    .empty-message {
      color: var(--text-muted, #718096);
      font-size: 0.875rem;
      max-width: 400px;
      margin: 0 0 1.5rem;
    }

    .empty-action {
      display: flex;
      gap: 0.75rem;
    }
  `]
})
export class EmptyStateComponent {
  icon = input<string>('📭');
  title = input.required<string>();
  message = input<string>('');
}
