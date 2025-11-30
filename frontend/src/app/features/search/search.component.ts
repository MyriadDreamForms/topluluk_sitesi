import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TagBadgeComponent, Tag } from '../../shared/components/tag-badge/tag-badge.component';

interface SearchResult {
  id: string;
  type: 'post' | 'question';
  title: string;
  slug: string;
  excerpt: string;
  author: {
    username: string;
    displayName: string;
  };
  tags: Tag[];
  createdAt: string;
  viewCount: number;
  answerCount?: number;
  isResolved?: boolean;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, TagBadgeComponent],
  template: `
    <div class="container">
      <div class="search-page">
        <div class="search-header">
          <h1 class="search-title">Arama Sonuçları</h1>
          
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Yazı, soru veya konu ara..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="performSearch()"
              autofocus
            />
            <button class="search-btn" (click)="performSearch()">Ara</button>
          </div>

          @if (query()) {
            <p class="search-info">
              "<strong>{{ query() }}</strong>" için {{ totalResults() }} sonuç bulundu
            </p>
          }
        </div>

        <div class="search-filters">
          <button 
            class="filter-btn" 
            [class.active]="activeFilter() === 'all'"
            (click)="setFilter('all')"
          >
            Tümü
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter() === 'posts'"
            (click)="setFilter('posts')"
          >
            Yazılar
          </button>
          <button 
            class="filter-btn" 
            [class.active]="activeFilter() === 'questions'"
            (click)="setFilter('questions')"
          >
            Sorular
          </button>
        </div>

        @if (loading()) {
          <div class="loading-container">
            <app-loading-spinner />
          </div>
        } @else {
          <div class="search-results">
            @for (result of filteredResults(); track result.id) {
              <article class="result-card">
                <div class="result-type" [class.question]="result.type === 'question'">
                  {{ result.type === 'post' ? '📝 Yazı' : '❓ Soru' }}
                </div>
                
                @if (result.type === 'question' && result.answerCount !== undefined) {
                  <div class="result-stats">
                    <div class="stat" [class.resolved]="result.isResolved">
                      <span class="stat-value">{{ result.answerCount }}</span>
                      <span class="stat-label">cevap</span>
                    </div>
                  </div>
                }
                
                <div class="result-content">
                  <h3 class="result-title">
                    <a [routerLink]="result.type === 'post' ? ['/posts', result.slug] : ['/questions', result.slug]">
                      {{ result.title }}
                    </a>
                  </h3>
                  <p class="result-excerpt">{{ result.excerpt }}</p>
                  
                  <div class="result-meta">
                    <span class="author">{{ result.author.displayName }}</span>
                    <span class="separator">•</span>
                    <span class="date">{{ result.createdAt | date:'dd MMM yyyy' }}</span>
                    <span class="separator">•</span>
                    <span class="views">{{ result.viewCount }} görüntülenme</span>
                  </div>
                  
                  <div class="result-tags">
                    @for (tag of result.tags; track tag.id) {
                      <app-tag-badge [tag]="tag" />
                    }
                  </div>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>Sonuç bulunamadı</h3>
                <p>Farklı anahtar kelimeler deneyebilirsiniz.</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .search-header {
      margin-bottom: 2rem;
    }

    .search-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 1.5rem;
      color: var(--text-primary, #ffffff);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      transition: all 0.2s;
    }

    .search-box:focus-within {
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .search-icon {
      width: 20px;
      height: 20px;
      color: var(--text-muted, #8a8a8a);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: 1rem;
      color: var(--text-primary, #ffffff);
    }

    .search-input::placeholder {
      color: var(--text-muted, #8a8a8a);
    }

    .search-btn {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-btn:hover {
      box-shadow: 0 0 20px rgba(255, 109, 90, 0.4);
    }

    .search-info {
      margin-top: 1rem;
      color: var(--text-muted, #8a8a8a);
      font-size: 0.9rem;
    }

    .search-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color, #2a2a35);
    }

    .filter-btn {
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-muted, #8a8a8a);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-btn:hover {
      border-color: var(--text-muted);
      color: var(--text-primary);
    }

    .filter-btn.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem 0;
    }

    .search-results {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .result-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      transition: all 0.2s;
    }

    .result-card:hover {
      border-color: #ff6d5a;
    }

    .result-type {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted, #8a8a8a);
      white-space: nowrap;
    }

    .result-type.question {
      color: #ff6d5a;
    }

    .result-stats {
      flex-shrink: 0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 8px;
      min-width: 50px;
      background: rgba(255, 255, 255, 0.02);
    }

    .stat.resolved {
      background: rgba(34, 197, 94, 0.15);
      border-color: #22c55e;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
    }

    .stat-label {
      font-size: 0.625rem;
      color: var(--text-muted, #8a8a8a);
    }

    .result-content {
      flex: 1;
      min-width: 0;
    }

    .result-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .result-title a {
      color: var(--text-primary, #ffffff);
      text-decoration: none;
      transition: color 0.15s;
    }

    .result-title a:hover {
      color: #ff6d5a;
    }

    .result-excerpt {
      font-size: 0.875rem;
      color: var(--text-muted, #8a8a8a);
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .result-meta {
      font-size: 0.75rem;
      color: var(--text-light, #6a6a6a);
      margin-bottom: 0.5rem;
    }

    .separator {
      margin: 0 0.375rem;
    }

    .result-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted, #8a8a8a);
      margin: 0;
    }

    @media (max-width: 640px) {
      .result-card {
        flex-direction: column;
      }

      .result-stats {
        order: -1;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  loading = signal(true);
  query = signal('');
  searchQuery = '';
  activeFilter = signal<'all' | 'posts' | 'questions'>('all');
  results = signal<SearchResult[]>([]);
  totalResults = signal(0);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.query.set(params['q']);
        this.searchQuery = params['q'];
        this.search(params['q']);
      } else {
        this.loading.set(false);
      }
    });
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.query.set(this.searchQuery.trim());
      this.search(this.searchQuery.trim());
    }
  }

  setFilter(filter: 'all' | 'posts' | 'questions'): void {
    this.activeFilter.set(filter);
  }

  filteredResults() {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return this.results();
    }
    return this.results().filter(r => 
      filter === 'posts' ? r.type === 'post' : r.type === 'question'
    );
  }

  private search(query: string): void {
    this.loading.set(true);
    
    // Simulated search - will be replaced with actual API call
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: 'TypeScript 5.0 ile Gelen Yenilikler',
          slug: 'typescript-5-yenilikler',
          excerpt: 'TypeScript 5.0 sürümü ile birlikte gelen dekoratörler, const type parametreleri ve daha birçok yenilik...',
          author: { username: 'ahmet', displayName: 'Ahmet Yılmaz' },
          tags: [
            { id: '1', name: 'TypeScript', slug: 'typescript' },
            { id: '2', name: 'JavaScript', slug: 'javascript' }
          ],
          createdAt: new Date().toISOString(),
          viewCount: 1234
        },
        {
          id: '2',
          type: 'question',
          title: 'Angular 21\'de standalone component nasıl oluşturulur?',
          slug: 'angular-21-standalone-component',
          excerpt: 'Angular 21 ile birlikte standalone componentler varsayılan olarak geldi. Nasıl oluşturabilirim?',
          author: { username: 'mehmet', displayName: 'Mehmet Demir' },
          tags: [
            { id: '3', name: 'Angular', slug: 'angular' }
          ],
          createdAt: new Date().toISOString(),
          viewCount: 567,
          answerCount: 3,
          isResolved: true
        },
        {
          id: '3',
          type: 'post',
          title: 'React vs Angular 2025 Karşılaştırması',
          slug: 'react-vs-angular-2025',
          excerpt: '2025 yılında React ve Angular arasındaki farklar, avantajlar ve dezavantajlar...',
          author: { username: 'ali', displayName: 'Ali Kaya' },
          tags: [
            { id: '4', name: 'React', slug: 'react' },
            { id: '3', name: 'Angular', slug: 'angular' }
          ],
          createdAt: new Date().toISOString(),
          viewCount: 2341
        }
      ];

      // Filter by query (simple simulation)
      const filtered = mockResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some(t => t.name.toLowerCase().includes(query.toLowerCase()))
      );

      this.results.set(filtered.length > 0 ? filtered : mockResults);
      this.totalResults.set(this.results().length);
      this.loading.set(false);
    }, 500);
  }
}
