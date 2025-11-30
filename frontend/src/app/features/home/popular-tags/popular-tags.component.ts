import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PopularTag } from '../feed.service';

@Component({
  selector: 'app-popular-tags',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="popular-tags">
      <h3>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        Popüler Etiketler
      </h3>

      <div class="tags-list">
        @for (tag of tags; track tag.slug) {
          <a [routerLink]="['/tags', tag.slug]" class="tag-item">
            <span class="tag-name">{{ tag.name }}</span>
            <span class="tag-count">{{ tag.totalCount }}</span>
          </a>
        }
      </div>

      <a routerLink="/tags" class="view-all">
        Tüm etiketleri gör
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  `,
  styles: [`
    .popular-tags {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.25rem;
    }

    h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 1rem;
    }

    h3 svg {
      color: #ff6d5a;
    }

    .tags-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .tag-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .tag-item:hover {
      background: rgba(255, 109, 90, 0.1);
    }

    .tag-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
    }

    .tag-item:hover .tag-name {
      color: #ff6d5a;
    }

    .tag-count {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
    }

    .view-all {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #2a2a35);
      font-size: 0.875rem;
      font-weight: 500;
      color: #ff6d5a;
      text-decoration: none;
      transition: all 0.2s;
    }

    .view-all:hover {
      opacity: 0.8;
    }
  `]
})
export class PopularTagsComponent {
  @Input() tags: PopularTag[] = [];
}
