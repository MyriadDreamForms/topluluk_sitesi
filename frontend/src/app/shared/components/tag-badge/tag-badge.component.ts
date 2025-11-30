import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  questionCount?: number;
}

@Component({
  selector: 'app-tag-badge',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (clickable()) {
      <a [routerLink]="['/tags', tag().slug]" class="tag-badge" [class.large]="large()">
        {{ tag().name }}
        @if (showCount() && (tag().postCount || tag().questionCount)) {
          <span class="tag-count">{{ tag().postCount || tag().questionCount }}</span>
        }
      </a>
    } @else {
      <span class="tag-badge" [class.large]="large()">
        {{ tag().name }}
        @if (showCount() && (tag().postCount || tag().questionCount)) {
          <span class="tag-count">{{ tag().postCount || tag().questionCount }}</span>
        }
      </span>
    }
  `,
  styles: [`
    .tag-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.5rem;
      background: var(--tag-bg, #e2e8f0);
      color: var(--tag-color, #4a5568);
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 0.25rem;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    a.tag-badge:hover {
      background: var(--primary-color, #3182ce);
      color: white;
    }

    .tag-badge.large {
      padding: 0.375rem 0.75rem;
      font-size: 0.875rem;
    }

    .tag-count {
      background: rgba(0, 0, 0, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-size: 0.625rem;
    }
  `]
})
export class TagBadgeComponent {
  tag = input.required<Tag>();
  clickable = input<boolean>(true);
  showCount = input<boolean>(false);
  large = input<boolean>(false);
}
