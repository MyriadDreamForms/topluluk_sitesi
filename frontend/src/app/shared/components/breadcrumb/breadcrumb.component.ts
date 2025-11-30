import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a routerLink="/" class="breadcrumb-link">
            <span class="breadcrumb-icon">🏠</span>
            Ana Sayfa
          </a>
        </li>
        @for (item of items(); track item.label; let last = $last) {
          <li class="breadcrumb-item">
            <span class="breadcrumb-separator">›</span>
            @if (item.url && !last) {
              <a [routerLink]="item.url" class="breadcrumb-link">{{ item.label }}</a>
            } @else {
              <span class="breadcrumb-current" [attr.aria-current]="last ? 'page' : null">
                {{ item.label }}
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      padding: 0.75rem 0;
      margin-bottom: 1rem;
    }

    .breadcrumb-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 0.25rem;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .breadcrumb-separator {
      color: var(--text-muted, #a0aec0);
      margin: 0 0.25rem;
    }

    .breadcrumb-link {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--primary-color, #3182ce);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.15s;
    }

    .breadcrumb-link:hover {
      color: var(--primary-hover, #2c5282);
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: var(--text-muted, #718096);
      font-size: 0.875rem;
    }

    .breadcrumb-icon {
      font-size: 0.875rem;
    }
  `]
})
export class BreadcrumbComponent {
  items = input<BreadcrumbItem[]>([]);
}
