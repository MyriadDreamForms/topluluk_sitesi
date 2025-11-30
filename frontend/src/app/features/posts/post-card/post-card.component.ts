import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../posts.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserAvatarComponent,
    TagListComponent,
    TimeAgoPipe
  ],
  template: `
    <article class="post-card" [class.featured]="post.isFeatured">
      @if (post.coverImageUrl) {
        <div class="post-cover">
          <a [routerLink]="['/posts', post.slug]">
            <img [src]="post.coverImageUrl" [alt]="post.title" />
          </a>
          @if (post.isFeatured) {
            <span class="featured-badge">Öne Çıkan</span>
          }
          @if (post.isAuthor) {
            <div class="author-actions">
              <a [routerLink]="['/posts', post.slug, 'edit']" class="action-btn edit-btn" title="Düzenle">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </a>
              <button class="action-btn delete-btn" title="Sil" (click)="onDeleteClick($event)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          }
        </div>
      } @else if (post.isAuthor) {
        <div class="author-actions no-cover">
          <a [routerLink]="['/posts', post.slug, 'edit']" class="action-btn edit-btn" title="Düzenle">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
            </svg>
          </a>
          <button class="action-btn delete-btn" title="Sil" (click)="onDeleteClick($event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      }
      
      <div class="post-content">
        <div class="post-meta">
          <a [routerLink]="['/u', post.author.username]" class="author-link">
            <app-user-avatar 
              [avatarUrl]="post.author.avatarUrl" 
              [username]="post.author.displayName"
              size="sm">
            </app-user-avatar>
            <span class="author-name">{{ post.author.displayName }}</span>
          </a>
          <span class="separator">·</span>
          <time [attr.datetime]="post.publishedAt || post.createdAt">
            {{ (post.publishedAt || post.createdAt) | timeAgo }}
          </time>
        </div>

        <h2 class="post-title">
          <a [routerLink]="['/posts', post.slug]">{{ post.title }}</a>
        </h2>

        @if (post.excerpt) {
          <p class="post-excerpt">{{ post.excerpt }}</p>
        }

        @if (post.tags.length > 0) {
          <app-tag-list [tags]="post.tags"></app-tag-list>
        }

        <div class="post-stats">
          <span class="stat" title="Görüntülenme">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {{ post.viewCount }}
          </span>
          <span class="stat" title="Beğeni">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {{ post.likeCount }}
          </span>
          <span class="stat" title="Yorum">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {{ post.commentCount }}
          </span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .post-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .post-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 109, 90, 0.3);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .post-card.featured {
      border-color: #ff6d5a;
    }

    .post-cover {
      position: relative;
      aspect-ratio: 16 / 9;
      overflow: hidden;
    }

    .post-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .post-cover:hover img {
      transform: scale(1.05);
    }

    .featured-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .author-actions {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 0.5rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .author-actions.no-cover {
      position: absolute;
      top: 12px;
      right: 12px;
      left: auto;
    }

    .post-card:hover .author-actions {
      opacity: 1;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .edit-btn {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }

    .edit-btn:hover {
      background: #3b82f6;
      transform: scale(1.1);
    }

    .delete-btn {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }

    .delete-btn:hover {
      background: #ef4444;
      transform: scale(1.1);
    }

    .post-content {
      padding: 1.25rem;
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      margin-bottom: 0.75rem;
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      transition: color 0.15s;
    }

    .author-link:hover .author-name {
      color: #ff6d5a;
    }

    .separator {
      color: var(--border-color, #2a2a35);
    }

    .post-title {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.4;
      margin: 0 0 0.5rem;
    }

    .post-title a {
      color: var(--text-primary, #f8fafc);
      text-decoration: none;
      transition: color 0.15s;
    }

    .post-title a:hover {
      color: #ff6d5a;
    }

    .post-excerpt {
      font-size: 0.9rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.6;
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-stats {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
    }

    .stat svg {
      opacity: 0.7;
    }
  `]
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() delete = new EventEmitter<Post>();

  onDeleteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm(`"${this.post.title}" yazısını silmek istediğinize emin misiniz?`)) {
      this.delete.emit(this.post);
    }
  }
}
