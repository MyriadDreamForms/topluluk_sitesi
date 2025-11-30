import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Answer, AnswersService } from '../answers.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { MarkdownViewerComponent } from '../../../shared/components/markdown-viewer/markdown-viewer.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { AuthStateService } from '../../auth/auth-state.service';

@Component({
  selector: 'app-answer-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserAvatarComponent,
    MarkdownViewerComponent,
    TimeAgoPipe
  ],
  template: `
    <article class="answer" [class.accepted]="answer.isAccepted">
      <div class="answer-status">
        @if (canAccept) {
          <button 
            class="accept-btn" 
            [class.accepted]="answer.isAccepted"
            (click)="toggleAccept()"
            [title]="answer.isAccepted ? 'Kabul edilen cevabı kaldır' : 'Cevabı kabul et'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </button>
        } @else if (answer.isAccepted) {
          <div class="accepted-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        }
      </div>

      <div class="answer-content">
        <div class="answer-body">
          <app-markdown-viewer [content]="answer.body"></app-markdown-viewer>
        </div>

        <footer class="answer-footer">
          <div class="answer-meta">
            <a [routerLink]="['/u', answer.author.username]" class="author-link">
              <app-user-avatar 
                [avatarUrl]="answer.author.avatarUrl" 
                [username]="answer.author.displayName"
                size="xs">
              </app-user-avatar>
              <span class="author-name">{{ answer.author.displayName }}</span>
            </a>
            <span class="separator">·</span>
            <time [attr.datetime]="answer.createdAt">
              {{ answer.createdAt | timeAgo }}
            </time>
            @if (answer.updatedAt) {
              <span class="separator">·</span>
              <span class="edited">düzenlendi</span>
            }
          </div>

          @if (answer.isAuthor) {
            <div class="answer-actions">
              <button class="btn-text" (click)="toggleEdit()">Düzenle</button>
              <button class="btn-text danger" (click)="confirmDelete()">Sil</button>
            </div>
          }
        </footer>
      </div>
    </article>
  `,
  styles: [`
    .answer {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      margin-bottom: 1rem;
    }

    .answer.accepted {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.05);
    }

    .answer-status {
      flex-shrink: 0;
    }

    .accept-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 2px solid var(--border-color, #2a2a35);
      border-radius: 50%;
      background: transparent;
      color: var(--text-muted, #64748b);
      cursor: pointer;
      transition: all 0.2s;
    }

    .accept-btn:hover {
      border-color: #22c55e;
      color: #22c55e;
    }

    .accept-btn.accepted {
      background: #22c55e;
      border-color: #22c55e;
      color: white;
    }

    .accepted-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: #22c55e;
    }

    .answer-content {
      flex: 1;
      min-width: 0;
    }

    .answer-body {
      margin-bottom: 1rem;
      color: var(--text-primary, #f8fafc);
    }

    .answer-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .answer-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
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

    .edited {
      font-style: italic;
    }

    .answer-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-text {
      padding: 0.25rem 0.5rem;
      background: transparent;
      border: none;
      font-size: 0.8rem;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: color 0.2s;
    }

    .btn-text:hover {
      color: #ff6d5a;
    }

    .btn-text.danger:hover {
      color: #ef4444;
    }
  `]
})
export class AnswerItemComponent {
  private readonly answersService = inject(AnswersService);
  private readonly authState = inject(AuthStateService);

  @Input({ required: true }) answer!: Answer;
  @Input() questionAuthorId?: string;
  @Input() acceptedAnswerId?: string;
  @Output() accepted = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();

  isEditing = false;

  get canAccept(): boolean {
    return this.authState.userId === this.questionAuthorId;
  }

  toggleAccept(): void {
    this.answersService.acceptAnswer(this.answer.id).subscribe({
      next: () => {
        this.accepted.emit(this.answer.id);
      },
      error: (err) => {
        console.error('Failed to accept answer:', err);
        alert('Cevap kabul edilirken bir hata oluştu.');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    // TODO: Implement inline editing
  }

  confirmDelete(): void {
    if (confirm('Bu cevabı silmek istediğinizden emin misiniz?')) {
      this.answersService.deleteAnswer(this.answer.id).subscribe({
        next: () => {
          this.deleted.emit(this.answer.id);
        },
        error: (err) => {
          console.error('Failed to delete answer:', err);
          alert('Cevap silinirken bir hata oluştu.');
        }
      });
    }
  }
}
