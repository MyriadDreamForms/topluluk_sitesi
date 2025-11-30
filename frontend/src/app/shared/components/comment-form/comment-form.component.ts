import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService, Comment } from '../../../core/services/comments.service';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="comment-form" (ngSubmit)="submitComment()">
      <textarea
        [(ngModel)]="content"
        name="content"
        [placeholder]="parentId ? 'Yanıtınızı yazın...' : 'Yorumunuzu yazın...'"
        rows="3"
        [disabled]="isSubmitting()">
      </textarea>
      
      <div class="form-actions">
        @if (parentId) {
          <button type="button" class="btn-cancel" (click)="cancel()">
            İptal
          </button>
        }
        <button 
          type="submit" 
          class="btn-submit"
          [disabled]="!content.trim() || isSubmitting()">
          @if (isSubmitting()) {
            <span class="spinner"></span>
            Gönderiliyor...
          } @else if (parentId) {
            Yanıtla
          } @else {
            Yorum Yap
          }
        </button>
      </div>

      @if (error()) {
        <div class="error-message">
          {{ error() }}
        </div>
      }
    </form>
  `,
  styles: [`
    .comment-form {
      margin-bottom: 1.5rem;
    }

    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      font-size: 0.9rem;
      resize: vertical;
      min-height: 100px;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-color, #3b82f6);
    }

    textarea:disabled {
      background: var(--bg-secondary, #f9fafb);
      cursor: not-allowed;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }

    .btn-cancel {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 6px;
      color: var(--text-secondary, #6b7280);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: var(--bg-secondary, #f9fafb);
    }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: var(--primary-color, #3b82f6);
      border: none;
      border-radius: 6px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      background: var(--primary-hover, #2563eb);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      color: #dc2626;
      font-size: 0.875rem;
    }
  `]
})
export class CommentFormComponent {
  @Input() postId?: string;
  @Input() questionId?: string;
  @Input() parentId?: string;

  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly commentsService = inject(CommentsService);

  content = '';
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  submitComment(): void {
    if (!this.content.trim() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    this.commentsService.addComment({
      content: this.content.trim(),
      postId: this.postId,
      questionId: this.questionId,
      parentId: this.parentId
    }).subscribe({
      next: (comment) => {
        this.content = '';
        this.isSubmitting.set(false);
        this.commentAdded.emit(comment);
      },
      error: (err) => {
        console.error('Failed to add comment:', err);
        this.error.set('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
        this.isSubmitting.set(false);
      }
    });
  }

  cancel(): void {
    this.content = '';
    this.error.set(null);
    this.cancelled.emit();
  }
}
