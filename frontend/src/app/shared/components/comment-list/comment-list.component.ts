import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommentsService, Comment } from '../../../core/services/comments.service';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { AuthStateService } from '../../../features/auth/auth-state.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UserAvatarComponent,
    TimeAgoPipe,
    LoadingSpinnerComponent,
    CommentFormComponent
  ],
  template: `
    @if (isLoading()) {
      <div class="loading-container">
        <app-loading-spinner></app-loading-spinner>
      </div>
    } @else if (comments().length === 0) {
      <div class="empty-state">
        <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
      </div>
    } @else {
      <div class="comments-list">
        @for (comment of comments(); track comment.id) {
          <div class="comment" [class.editing]="editingCommentId() === comment.id">
            <div class="comment-header">
              <a [routerLink]="['/u', comment.author.username]" class="author-link">
                <app-user-avatar 
                  [avatarUrl]="comment.author.avatarUrl ?? null" 
                  [username]="comment.author.displayName"
                  size="sm">
                </app-user-avatar>
                <div class="author-info">
                  <span class="author-name">{{ comment.author.displayName }}</span>
                  <time [attr.datetime]="comment.createdAt">
                    {{ comment.createdAt | timeAgo }}
                    @if (comment.updatedAt) {
                      <span class="edited">(düzenlendi)</span>
                    }
                  </time>
                </div>
              </a>

              @if (comment.isAuthor) {
                <div class="comment-actions">
                  <button 
                    class="btn-action" 
                    (click)="startEdit(comment)"
                    [disabled]="editingCommentId() !== null">
                    Düzenle
                  </button>
                  <button 
                    class="btn-action danger" 
                    (click)="deleteComment(comment.id)"
                    [disabled]="editingCommentId() !== null">
                    Sil
                  </button>
                </div>
              }
            </div>

            @if (editingCommentId() === comment.id) {
              <div class="edit-form">
                <textarea 
                  [(ngModel)]="editContent"
                  rows="3"
                  placeholder="Yorumunuzu düzenleyin...">
                </textarea>
                <div class="edit-actions">
                  <button class="btn-cancel" (click)="cancelEdit()">İptal</button>
                  <button 
                    class="btn-save" 
                    (click)="saveEdit(comment.id)"
                    [disabled]="!editContent.trim()">
                    Kaydet
                  </button>
                </div>
              </div>
            } @else {
              <div class="comment-content">
                <p>{{ comment.content }}</p>
              </div>
            }

            <div class="comment-footer">
              @if (authState.isAuthenticated()) {
                <button 
                  class="btn-reply" 
                  (click)="toggleReply(comment.id)"
                  [class.active]="replyingTo() === comment.id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 17 4 12 9 7"></polyline>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                  </svg>
                  Yanıtla
                </button>
              }
              
              @if (comment.replyCount > 0) {
                <button 
                  class="btn-replies" 
                  (click)="toggleReplies(comment.id)"
                  [class.expanded]="expandedReplies().has(comment.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {{ comment.replyCount }} yanıt
                </button>
              }
            </div>

            <!-- Reply Form -->
            @if (replyingTo() === comment.id) {
              <div class="reply-form-container">
                <app-comment-form
                  [postId]="postId"
                  [questionId]="questionId"
                  [parentId]="comment.id"
                  (commentAdded)="onReplyAdded(comment.id)"
                  (cancelled)="cancelReply()">
                </app-comment-form>
              </div>
            }

            <!-- Nested Replies -->
            @if (expandedReplies().has(comment.id) && replies().get(comment.id)) {
              <div class="nested-replies">
                @for (reply of replies().get(comment.id); track reply.id) {
                  <div class="comment reply">
                    <div class="comment-header">
                      <a [routerLink]="['/u', reply.author.username]" class="author-link">
                        <app-user-avatar 
                          [avatarUrl]="reply.author.avatarUrl ?? null" 
                          [username]="reply.author.displayName"
                          size="xs">
                        </app-user-avatar>
                        <div class="author-info">
                          <span class="author-name">{{ reply.author.displayName }}</span>
                          <time [attr.datetime]="reply.createdAt">
                            {{ reply.createdAt | timeAgo }}
                          </time>
                        </div>
                      </a>

                      @if (reply.isAuthor) {
                        <div class="comment-actions">
                          <button class="btn-action danger" (click)="deleteComment(reply.id)">Sil</button>
                        </div>
                      }
                    </div>
                    <div class="comment-content">
                      <p>{{ reply.content }}</p>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      @if (hasMore()) {
        <button class="btn-load-more" (click)="loadMore()" [disabled]="isLoadingMore()">
          @if (isLoadingMore()) {
            Yükleniyor...
          } @else {
            Daha fazla yorum yükle
          }
        </button>
      }
    }
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary, #6b7280);
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comment {
      padding: 1rem;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
    }

    .comment.editing {
      border-color: var(--primary-color, #3b82f6);
    }

    .comment.reply {
      margin-left: 2rem;
      background: var(--bg-secondary, #f9fafb);
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary, #1f2937);
    }

    .author-info time {
      font-size: 0.75rem;
      color: var(--text-secondary, #6b7280);
    }

    .edited {
      font-style: italic;
      margin-left: 0.25rem;
    }

    .comment-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      background: transparent;
      border: none;
      color: var(--text-secondary, #6b7280);
      cursor: pointer;
    }

    .btn-action:hover {
      color: var(--primary-color, #3b82f6);
    }

    .btn-action.danger:hover {
      color: #ef4444;
    }

    .btn-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .comment-content {
      margin-bottom: 0.75rem;
    }

    .comment-content p {
      margin: 0;
      line-height: 1.6;
      color: var(--text-primary, #1f2937);
      white-space: pre-wrap;
    }

    .edit-form {
      margin-bottom: 0.75rem;
    }

    .edit-form textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      font-size: 0.9rem;
      resize: vertical;
      min-height: 80px;
    }

    .edit-form textarea:focus {
      outline: none;
      border-color: var(--primary-color, #3b82f6);
    }

    .edit-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .btn-cancel,
    .btn-save {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-color, #e5e7eb);
      color: var(--text-secondary, #6b7280);
    }

    .btn-save {
      background: var(--primary-color, #3b82f6);
      border: none;
      color: white;
    }

    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .comment-footer {
      display: flex;
      gap: 1rem;
    }

    .btn-reply,
    .btn-replies {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: transparent;
      border: none;
      color: var(--text-secondary, #6b7280);
      font-size: 0.8rem;
      cursor: pointer;
    }

    .btn-reply:hover,
    .btn-replies:hover {
      color: var(--primary-color, #3b82f6);
    }

    .btn-reply.active {
      color: var(--primary-color, #3b82f6);
    }

    .btn-replies.expanded svg {
      transform: rotate(180deg);
    }

    .reply-form-container {
      margin-top: 1rem;
      padding-left: 2rem;
    }

    .nested-replies {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-load-more {
      width: 100%;
      padding: 0.75rem;
      margin-top: 1rem;
      background: transparent;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      color: var(--primary-color, #3b82f6);
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-load-more:hover:not(:disabled) {
      background: var(--bg-secondary, #f9fafb);
    }

    .btn-load-more:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class CommentListComponent implements OnInit {
  @Input() postId?: string;
  @Input() questionId?: string;

  private readonly commentsService = inject(CommentsService);
  readonly authState = inject(AuthStateService);

  comments = signal<Comment[]>([]);
  replies = signal<Map<string, Comment[]>>(new Map());
  
  isLoading = signal(true);
  isLoadingMore = signal(false);
  hasMore = signal(false);
  currentPage = signal(1);
  pageSize = 10;

  editingCommentId = signal<string | null>(null);
  editContent = '';
  
  replyingTo = signal<string | null>(null);
  expandedReplies = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading.set(true);
    
    this.commentsService.getComments({
      postId: this.postId,
      questionId: this.questionId,
      pageNumber: 1,
      pageSize: this.pageSize
    }).subscribe({
      next: (response) => {
        this.comments.set(response.items);
        this.hasMore.set(response.hasNextPage);
        this.currentPage.set(1);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load comments:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMore(): void {
    this.isLoadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.commentsService.getComments({
      postId: this.postId,
      questionId: this.questionId,
      pageNumber: nextPage,
      pageSize: this.pageSize
    }).subscribe({
      next: (response) => {
        this.comments.update(current => [...current, ...response.items]);
        this.hasMore.set(response.hasNextPage);
        this.currentPage.set(nextPage);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        console.error('Failed to load more comments:', err);
        this.isLoadingMore.set(false);
      }
    });
  }

  startEdit(comment: Comment): void {
    this.editingCommentId.set(comment.id);
    this.editContent = comment.content;
  }

  cancelEdit(): void {
    this.editingCommentId.set(null);
    this.editContent = '';
  }

  saveEdit(commentId: string): void {
    if (!this.editContent.trim()) return;

    this.commentsService.updateComment(commentId, this.editContent).subscribe({
      next: (updatedComment) => {
        this.comments.update(comments => 
          comments.map(c => c.id === commentId ? updatedComment : c)
        );
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Failed to update comment:', err);
        alert('Yorum güncellenirken bir hata oluştu.');
      }
    });
  }

  deleteComment(commentId: string): void {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    this.commentsService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(comments => 
          comments.filter(c => c.id !== commentId)
        );
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
        alert('Yorum silinirken bir hata oluştu.');
      }
    });
  }

  toggleReply(commentId: string): void {
    if (this.replyingTo() === commentId) {
      this.replyingTo.set(null);
    } else {
      this.replyingTo.set(commentId);
    }
  }

  cancelReply(): void {
    this.replyingTo.set(null);
  }

  onReplyAdded(parentId: string): void {
    this.replyingTo.set(null);
    
    // Update reply count
    this.comments.update(comments =>
      comments.map(c => c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c)
    );

    // Expand and reload replies
    this.expandedReplies.update(set => {
      const newSet = new Set(set);
      newSet.add(parentId);
      return newSet;
    });
    this.loadReplies(parentId);
  }

  toggleReplies(commentId: string): void {
    const expanded = this.expandedReplies();
    
    if (expanded.has(commentId)) {
      this.expandedReplies.update(set => {
        const newSet = new Set(set);
        newSet.delete(commentId);
        return newSet;
      });
    } else {
      this.expandedReplies.update(set => {
        const newSet = new Set(set);
        newSet.add(commentId);
        return newSet;
      });
      
      if (!this.replies().has(commentId)) {
        this.loadReplies(commentId);
      }
    }
  }

  private loadReplies(parentId: string): void {
    this.commentsService.getReplies(parentId).subscribe({
      next: (response) => {
        this.replies.update(map => {
          const newMap = new Map(map);
          newMap.set(parentId, response.items);
          return newMap;
        });
      },
      error: (err) => {
        console.error('Failed to load replies:', err);
      }
    });
  }
}
