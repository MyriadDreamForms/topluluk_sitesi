import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedItem } from '../feed.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-feed-item',
  standalone: true,
  imports: [CommonModule, RouterModule, UserAvatarComponent, TimeAgoPipe],
  template: `
    <article class="feed-item" [class.question]="item.type === 'question'">
      <div class="item-type">
        @if (item.type === 'post') {
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Yazı</span>
        } @else {
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Soru</span>
          @if (item.hasAcceptedAnswer) {
            <span class="solved-badge">✓ Çözüldü</span>
          }
        }
      </div>

      <a [routerLink]="item.type === 'post' ? ['/posts', item.slug] : ['/questions', item.slug]" class="item-title">
        {{ item.title }}
      </a>

      @if (item.excerpt) {
        <p class="item-excerpt">{{ item.excerpt }}</p>
      }

      <div class="item-tags">
        @for (tag of item.tags; track tag.slug) {
          <a [routerLink]="['/tags', tag.slug]" class="tag">{{ tag.name }}</a>
        }
      </div>

      <footer class="item-footer">
        <div class="author-info">
          <a [routerLink]="['/u', item.author.username]" class="author-link">
            <app-user-avatar 
              [avatarUrl]="item.author.avatarUrl ?? null" 
              [username]="item.author.displayName"
              size="xs">
            </app-user-avatar>
            <span class="author-name">{{ item.author.displayName }}</span>
          </a>
          <span class="separator">·</span>
          <time [attr.datetime]="item.createdAt">{{ item.createdAt | timeAgo }}</time>
        </div>

        <div class="item-stats">
          <span class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {{ item.viewCount }}
          </span>
          @if (item.type === 'post') {
            <span class="stat">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {{ item.commentCount }}
            </span>
          } @else {
            <span class="stat" [class.has-accepted]="item.hasAcceptedAnswer">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              {{ item.answerCount }} cevap
            </span>
          }
        </div>
      </footer>
    </article>
  `,
  styles: [`
    .feed-item {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.25rem;
      transition: all 0.2s;
    }

    .feed-item:hover {
      border-color: #ff6d5a40;
      transform: translateY(-2px);
    }

    .feed-item.question {
      border-left: 3px solid #ff6d5a;
    }

    .item-type {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted, #64748b);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .item-type svg {
      opacity: 0.7;
    }

    .solved-badge {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.7rem;
    }

    .item-title {
      display: block;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      text-decoration: none;
      line-height: 1.4;
      margin-bottom: 0.5rem;
      transition: color 0.2s;
    }

    .item-title:hover {
      color: #ff6d5a;
    }

    .item-excerpt {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.6;
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .item-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tag {
      display: inline-flex;
      padding: 0.25rem 0.625rem;
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .tag:hover {
      background: rgba(255, 109, 90, 0.2);
    }

    .item-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      text-decoration: none;
      color: inherit;
    }

    .author-link:hover .author-name {
      color: #ff6d5a;
    }

    .separator {
      color: var(--border-color, #2a2a35);
    }

    .item-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
    }

    .stat.has-accepted {
      color: #22c55e;
    }

    @media (max-width: 640px) {
      .item-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
    }
  `]
})
export class FeedItemComponent {
  @Input({ required: true }) item!: FeedItem;
}
