import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Question } from '../questions.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserAvatarComponent,
    TagListComponent,
    TimeAgoPipe
  ],
  template: `
    <article class="question-card" [class.has-accepted]="question.hasAcceptedAnswer">
      <div class="question-stats">
        <div class="stat" [class.answered]="question.answerCount > 0" [class.accepted]="question.hasAcceptedAnswer">
          <span class="stat-value">{{ question.answerCount }}</span>
          <span class="stat-label">cevap</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ question.viewCount }}</span>
          <span class="stat-label">görüntülenme</span>
        </div>
      </div>

      <div class="question-content">
        <h3 class="question-title">
          <a [routerLink]="['/questions', question.slug]">
            @if (question.hasAcceptedAnswer) {
              <svg class="accepted-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            }
            {{ question.title }}
          </a>
        </h3>

        <p class="question-preview">{{ question.bodyPreview }}</p>

        @if (question.tags.length > 0) {
          <app-tag-list [tags]="question.tags"></app-tag-list>
        }

        <div class="question-meta">
          <a [routerLink]="['/u', question.author.username]" class="author-link">
            <app-user-avatar 
              [avatarUrl]="question.author.avatarUrl" 
              [username]="question.author.displayName"
              size="xs">
            </app-user-avatar>
            <span class="author-name">{{ question.author.displayName }}</span>
          </a>
          <span class="separator">·</span>
          <time [attr.datetime]="question.createdAt">
            {{ question.createdAt | timeAgo }}
          </time>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .question-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color, #2a2a35);
      transition: background-color 0.2s;
    }

    .question-card:hover {
      background-color: rgba(255, 255, 255, 0.02);
    }

    .question-card.has-accepted {
      border-left: 3px solid #22c55e;
    }

    .question-stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      min-width: 70px;
    }

    .stat {
      text-align: center;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      border: 1px solid var(--border-color, #2a2a35);
      background: rgba(255, 255, 255, 0.02);
    }

    .stat.answered {
      border-color: #22c55e;
      color: #22c55e;
    }

    .stat.accepted {
      background: #22c55e;
      color: white;
      border-color: #22c55e;
    }

    .stat-value {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
    }

    .stat-label {
      display: block;
      font-size: 0.7rem;
      text-transform: uppercase;
      color: var(--text-muted, #94a3b8);
    }

    .question-content {
      flex: 1;
      min-width: 0;
    }

    .question-title {
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0 0 0.5rem;
    }

    .question-title a {
      color: #ff6d5a;
      text-decoration: none;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      transition: opacity 0.15s;
    }

    .question-title a:hover {
      opacity: 0.85;
    }

    .accepted-icon {
      flex-shrink: 0;
      color: #22c55e;
      margin-top: 2px;
    }

    .question-preview {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .question-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      margin-top: 0.75rem;
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.25rem;
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

    @media (max-width: 640px) {
      .question-stats {
        flex-direction: row;
        min-width: auto;
      }

      .stat {
        flex: 1;
      }
    }
  `]
})
export class QuestionCardComponent {
  @Input({ required: true }) question!: Question;
}
