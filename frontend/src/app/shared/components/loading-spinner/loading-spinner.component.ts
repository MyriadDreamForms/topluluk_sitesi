import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.overlay]="overlay()" [class.fullscreen]="fullscreen()">
      <div class="spinner" [style.width.px]="size()" [style.height.px]="size()">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      @if (message()) {
        <p class="loading-message">{{ message() }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }

    .loading-container.overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 100;
    }

    .loading-container.fullscreen {
      position: fixed;
      inset: 0;
      background: var(--bg-primary, #fff);
      z-index: 1000;
    }

    .spinner {
      position: relative;
    }

    .spinner-ring {
      position: absolute;
      inset: 0;
      border: 3px solid transparent;
      border-top-color: var(--primary-color, #3182ce);
      border-radius: 50%;
      animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    }

    .spinner-ring:nth-child(1) {
      animation-delay: -0.45s;
    }

    .spinner-ring:nth-child(2) {
      animation-delay: -0.3s;
    }

    .spinner-ring:nth-child(3) {
      animation-delay: -0.15s;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-message {
      color: var(--text-muted, #718096);
      font-size: 0.875rem;
      margin: 0;
    }
  `]
})
export class LoadingSpinnerComponent {
  size = input<number>(40);
  message = input<string>('');
  overlay = input<boolean>(false);
  fullscreen = input<boolean>(false);
}
