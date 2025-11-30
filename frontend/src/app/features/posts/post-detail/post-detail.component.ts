import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PostsService, PostDetail } from '../posts.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';
import { MarkdownViewerComponent } from '../../../shared/components/markdown-viewer/markdown-viewer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { SeoService } from '../../../core/services/seo.service';
import { AuthStateService } from '../../auth/auth-state.service';
import { CommentListComponent } from '../../../shared/components/comment-list/comment-list.component';
import { CommentFormComponent } from '../../../shared/components/comment-form/comment-form.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserAvatarComponent,
    TagListComponent,
    MarkdownViewerComponent,
    LoadingSpinnerComponent,
    TimeAgoPipe,
    CommentListComponent,
    CommentFormComponent
  ],
  template: `
    <div class="container">
      @if (isLoading()) {
        <div class="loading-container">
          <app-loading-spinner></app-loading-spinner>
        </div>
      } @else if (error()) {
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Yazı bulunamadı</h2>
          <p>{{ error() }}</p>
          <a routerLink="/posts" class="btn-primary">Yazılara Dön</a>
        </div>
      } @else if (post()) {
        <article class="post">
          @if (post()!.coverImageUrl) {
            <div class="cover-image">
              <img [src]="post()!.coverImageUrl" [alt]="post()!.title" />
            </div>
          }

          <header class="post-header">
            <div class="post-meta">
              <a [routerLink]="['/u', post()!.author.username]" class="author-link">
                <app-user-avatar 
                  [avatarUrl]="post()!.author.avatarUrl" 
                  [username]="post()!.author.displayName"
                  size="md">
                </app-user-avatar>
                <div class="author-info">
                  <span class="author-name">{{ post()!.author.displayName }}</span>
                  <time [attr.datetime]="post()!.publishedAt || post()!.createdAt">
                    {{ (post()!.publishedAt || post()!.createdAt) | timeAgo }}
                    @if (post()!.updatedAt) {
                      · Güncellendi
                    }
                  </time>
                </div>
              </a>

              @if (post()!.isAuthor) {
                <div class="post-actions">
                  <a [routerLink]="['/posts', post()!.slug, 'edit']" class="btn-icon" title="Düzenle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </a>
                  <button class="btn-icon danger" (click)="deletePost()" title="Sil">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              }
            </div>

            <h1 class="post-title">{{ post()!.title }}</h1>

            @if (post()!.tags.length > 0) {
              <app-tag-list [tags]="post()!.tags" [clickable]="true"></app-tag-list>
            }
          </header>

          <div class="post-content">
            <app-markdown-viewer [content]="post()!.content"></app-markdown-viewer>
          </div>

          <footer class="post-footer">
            <div class="post-stats">
              <span class="stat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ post()!.viewCount }} görüntülenme
              </span>
              <span class="stat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ post()!.likeCount }} beğeni
              </span>
            </div>

            <div class="share-actions">
              <button class="btn-share" (click)="sharePost()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Paylaş
              </button>
            </div>
          </footer>
        </article>

        <!-- Comments Section -->
        <section class="comments-section">
          <h2>Yorumlar ({{ post()!.commentCount }})</h2>
          
          @if (authState.isAuthenticated()) {
            <app-comment-form 
              [postId]="post()!.id"
              (commentAdded)="onCommentAdded()">
            </app-comment-form>
          } @else {
            <div class="login-prompt">
              <p>Yorum yapmak için <a routerLink="/auth/login">giriş yapın</a>.</p>
            </div>
          }

          <app-comment-list [postId]="post()!.id"></app-comment-list>
        </section>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .error-message {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary, #6b7280);
    }

    .error-message svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .error-message h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #1f2937);
      margin: 0 0 0.5rem;
    }

    .error-message p {
      margin: 0 0 1.5rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    .cover-image {
      margin: 0 -1rem 2rem;
      border-radius: 12px;
      overflow: hidden;
    }

    .cover-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .post-header {
      margin-bottom: 2rem;
    }

    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .author-info {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-weight: 600;
      color: var(--text-primary, #1f2937);
    }

    .author-info time {
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
    }

    .post-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.5rem;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary, #6b7280);
      transition: all 0.2s;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon:hover {
      color: var(--primary-color, #3b82f6);
      border-color: var(--primary-color, #3b82f6);
    }

    .btn-icon.danger:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    .post-title {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      color: var(--text-primary, #1f2937);
      margin: 0 0 1rem;
    }

    .post-content {
      margin-bottom: 2rem;
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0;
      border-top: 1px solid var(--border-color, #e5e7eb);
      border-bottom: 1px solid var(--border-color, #e5e7eb);
      margin-bottom: 2rem;
    }

    .post-stats {
      display: flex;
      gap: 1.5rem;
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary, #6b7280);
    }

    .btn-share {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary, #6b7280);
      transition: all 0.2s;
    }

    .btn-share:hover {
      color: var(--primary-color, #3b82f6);
      border-color: var(--primary-color, #3b82f6);
    }

    .comments-section {
      margin-top: 2rem;
    }

    .comments-section h2 {
      font-size: 1.5rem;
      margin: 0 0 1.5rem;
    }

    .login-prompt {
      text-align: center;
      padding: 2rem;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .login-prompt p {
      margin: 0;
      color: var(--text-secondary, #6b7280);
    }

    .login-prompt a {
      color: var(--primary-color, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }

    .login-prompt a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .post-title {
        font-size: 1.75rem;
      }

      .post-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class PostDetailComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  readonly authState = inject(AuthStateService);

  post = signal<PostDetail | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  private loadPost(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.postsService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        this.updateSeo(post);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.error.set('Bu yazı bulunamadı veya silinmiş olabilir.');
        this.isLoading.set(false);
      }
    });
  }

  private updateSeo(post: PostDetail): void {
    this.seoService.updateTags({
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      keywords: post.tags.map(t => t.name),
      image: post.coverImageUrl,
      author: post.author.displayName,
      type: 'article'
    });
  }

  deletePost(): void {
    if (!this.post()) return;

    if (confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
      this.postsService.deletePost(this.post()!.id).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('Yazı silinirken bir hata oluştu.');
        }
      });
    }
  }

  sharePost(): void {
    if (navigator.share && this.post()) {
      navigator.share({
        title: this.post()!.title,
        text: this.post()!.excerpt || '',
        url: window.location.href
      }).catch(() => {
        this.copyToClipboard();
      });
    } else {
      this.copyToClipboard();
    }
  }

  private copyToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Bağlantı panoya kopyalandı!');
    });
  }

  onCommentAdded(): void {
    // Refresh post to update comment count
    if (this.post()) {
      this.loadPost(this.post()!.slug);
    }
  }
}
