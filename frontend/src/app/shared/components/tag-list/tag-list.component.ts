import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface Tag {
  id?: string;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tag-list">
      @for (tag of tags; track tag.slug) {
        @if (clickable) {
          <a 
            [routerLink]="['/tags', tag.slug]" 
            class="tag"
            [title]="tag.name">
            {{ tag.name }}
          </a>
        } @else {
          <span class="tag" [title]="tag.name">
            {{ tag.name }}
          </span>
        }
      }
    </div>
  `,
  styles: [`
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--tag-bg, #f3f4f6);
      color: var(--tag-text, #374151);
      font-size: 0.8rem;
      font-weight: 500;
      border-radius: 9999px;
      text-decoration: none;
      transition: all 0.2s;
    }

    a.tag:hover {
      background: var(--primary-color, #3b82f6);
      color: white;
    }
  `]
})
export class TagListComponent {
  @Input() tags: Tag[] = [];
  @Input() clickable = false;
}
