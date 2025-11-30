import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostsService, Post, PostsQueryParams } from '../posts.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SeoService } from '../../../core/services/seo.service';

type SortOption = 'latest' | 'popular' | 'trending' | 'oldest';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PostCardComponent,
    PaginationComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <header class="page-header">
        <div class="header-content">
          <h1>
            @if (currentTag()) {
              #{{ currentTag() }} Yazıları
            } @else {
              Yazılar
            }
          </h1>
          <p class="subtitle">
            Topluluk üyelerinin teknoloji yazıları
          </p>
        </div>
        <a routerLink="/posts/new" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Yeni Yazı
        </a>
      </header>

      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Yazılarda ara..." 
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
          />
          @if (searchQuery()) {
            <button class="clear-btn" (click)="clearSearch()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          }
        </div>
        
        <div class="sort-options">
          <button 
            [class.active]="sortBy() === 'latest'" 
            (click)="changeSort('latest')">
            En Yeni
          </button>
          <button 
            [class.active]="sortBy() === 'popular'" 
            (click)="changeSort('popular')">
            Popüler
          </button>
          <button 
            [class.active]="sortBy() === 'trending'" 
            (click)="changeSort('trending')">
            Trend
          </button>
        </div>
      </div>

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
          <p>{{ error() }}</p>
          <button class="btn-secondary" (click)="loadPosts()">Tekrar Dene</button>
        </div>
      } @else if (posts().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <h2>Henüz yazı yok</h2>
          <p>
            @if (searchQuery() || currentTag()) {
              Arama kriterlerinize uygun yazı bulunamadı.
            } @else {
              İlk yazıyı paylaşan siz olun!
            }
          </p>
          <a routerLink="/posts/new" class="btn-primary">İlk Yazıyı Oluştur</a>
        </div>
      } @else {
        <div class="posts-grid">
          @for (post of posts(); track post.id) {
            <app-post-card [post]="post" (delete)="onDeletePost($event)"></app-post-card>
          }
        </div>

        @if (totalPages() > 1) {
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            [totalCount]="totalCount()"
            (pageChange)="onPageChange($event)">
          </app-pagination>
        }
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: transparent;
      color: #ff6d5a;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 280px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
    }

    .search-box:focus-within {
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .search-box svg {
      color: var(--text-muted, #94a3b8);
      flex-shrink: 0;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 1rem;
      background: transparent;
      color: var(--text-primary, #f8fafc);
    }

    .search-box input::placeholder {
      color: var(--text-muted, #64748b);
    }

    .clear-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--text-muted, #94a3b8);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .clear-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ff6d5a;
    }

    .sort-options {
      display: flex;
      gap: 0.5rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      padding: 4px;
    }

    .sort-options button {
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      color: var(--text-muted, #94a3b8);
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .sort-options button:hover {
      color: var(--text-primary, #f8fafc);
    }

    .sort-options button.active {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .error-message,
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted, #94a3b8);
    }

    .error-message svg,
    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--text-muted, #64748b);
    }

    .error-message h2,
    .empty-state h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .error-message p,
    .empty-state p {
      margin: 0 0 1.5rem;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
      }

      .header-content h1 {
        font-size: 1.5rem;
      }

      .posts-grid {
        grid-template-columns: 1fr;
      }

      .sort-options {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class PostListComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);

  posts = signal<Post[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  pageSize = 12;

  searchQuery = signal('');
  sortBy = signal<SortOption>('latest');
  currentTag = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage.set(Number(params['page']) || 1);
      this.searchQuery.set(params['search'] || '');
      this.sortBy.set(params['sort'] || 'latest');
      this.currentTag.set(params['tag'] || null);
      this.loadPosts();
    });

    this.updateSeo();
  }

  private updateSeo(): void {
    const tag = this.currentTag();
    if (tag) {
      this.seoService.updateTags({
        title: `#${tag} Yazıları`,
        description: `${tag} etiketli teknoloji yazıları ve makaleleri`,
        keywords: [tag, 'yazı', 'makale', 'teknoloji']
      });
    } else {
      this.seoService.updateTags({
        title: 'Yazılar',
        description: 'Topluluk üyelerinin teknoloji yazıları, makaleleri ve rehberleri',
        keywords: ['yazı', 'makale', 'teknoloji', 'blog']
      });
    }
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params: PostsQueryParams = {
      pageNumber: this.currentPage(),
      pageSize: this.pageSize,
      sortBy: this.sortBy()
    };

    if (this.searchQuery()) {
      params.search = this.searchQuery();
    }

    if (this.currentTag()) {
      params.tag = this.currentTag()!;
    }

    this.postsService.getPosts(params).subscribe({
      next: (response) => {
        this.posts.set(response.items);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.error.set('Yazılar yüklenirken bir hata oluştu.');
        this.isLoading.set(false);
      }
    });
  }

  search(): void {
    this.currentPage.set(1);
    this.loadPosts();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
    this.loadPosts();
  }

  changeSort(sort: SortOption): void {
    if (this.sortBy() !== sort) {
      this.sortBy.set(sort);
      this.currentPage.set(1);
      this.loadPosts();
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeletePost(post: Post): void {
    this.postsService.deletePost(post.id).subscribe({
      next: () => {
        // Remove from current list
        this.posts.update(posts => posts.filter(p => p.id !== post.id));
        this.totalCount.update(count => count - 1);
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        alert('Yazı silinirken bir hata oluştu.');
      }
    });
  }
}
