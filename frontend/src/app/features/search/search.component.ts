import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TagBadgeComponent, Tag } from '../../shared/components/tag-badge/tag-badge.component';
import { SearchService, SearchResult, SearchType } from './search.service';

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
              placeholder="Yazı, soru, kullanıcı veya etkinlik ara..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="performSearch()"
              autofocus
            />
            <button class="search-btn" (click)="performSearch()">Ara</button>
          </div>

          @if (query()) {
            <p class="search-info">
              "<strong>{{ query() }}</strong>" için {{ totalResults() }} sonuç bulundu
              @if (searchTime()) {
                <span class="search-time">({{ searchTime() }}ms)</span>
              }
            </p>
          }
        </div>

        <div class="search-filters">
          @for (filter of filters; track filter.value) {
            <button 
              class="filter-btn" 
              [class.active]="activeFilter() === filter.value"
              (click)="setFilter(filter.value)"
            >
              <span class="filter-icon">{{ filter.icon }}</span>
              {{ filter.label }}
              @if (getFilterCount(filter.value) > 0) {
                <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
              }
            </button>
          }
        </div>

        @if (loading()) {
          <div class="loading-container">
            <app-loading-spinner />
          </div>
        } @else {
          <div class="search-results">
            @for (result of filteredResults(); track result.id) {
              <!-- Post Result -->
              @if (result.type === 'post') {
                <article class="result-card">
                  <div class="result-type post">📝 Yazı</div>
                  <div class="result-content">
                    <h3 class="result-title">
                      <a [routerLink]="['/posts', result.slug]">{{ result.title }}</a>
                    </h3>
                    <p class="result-excerpt">{{ result.excerpt }}</p>
                    <div class="result-meta">
                      <span class="author">{{ result.author?.displayName }}</span>
                      <span class="separator">•</span>
                      <span class="date">{{ result.createdAt | date:'dd MMM yyyy' }}</span>
                      <span class="separator">•</span>
                      <span class="views">{{ result.viewCount }} görüntülenme</span>
                    </div>
                    @if (result.tags && result.tags.length > 0) {
                      <div class="result-tags">
                        @for (tag of result.tags; track tag.id) {
                          <app-tag-badge [tag]="tag" />
                        }
                      </div>
                    }
                  </div>
                </article>
              }

              <!-- Question Result -->
              @if (result.type === 'question') {
                <article class="result-card">
                  <div class="result-type question">❓ Soru</div>
                  <div class="result-stats">
                    <div class="stat" [class.resolved]="result.isResolved">
                      <span class="stat-value">{{ result.answerCount || 0 }}</span>
                      <span class="stat-label">cevap</span>
                    </div>
                  </div>
                  <div class="result-content">
                    <h3 class="result-title">
                      <a [routerLink]="['/questions', result.slug]">
                        @if (result.isResolved) {
                          <span class="resolved-badge">✓</span>
                        }
                        {{ result.title }}
                      </a>
                    </h3>
                    <p class="result-excerpt">{{ result.excerpt }}</p>
                    <div class="result-meta">
                      <span class="author">{{ result.author?.displayName }}</span>
                      <span class="separator">•</span>
                      <span class="date">{{ result.createdAt | date:'dd MMM yyyy' }}</span>
                    </div>
                    @if (result.tags && result.tags.length > 0) {
                      <div class="result-tags">
                        @for (tag of result.tags; track tag.id) {
                          <app-tag-badge [tag]="tag" />
                        }
                      </div>
                    }
                  </div>
                </article>
              }

              <!-- User Result -->
              @if (result.type === 'user') {
                <article class="result-card user-card">
                  <div class="result-type user">👤 Kullanıcı</div>
                  <div class="user-content">
                    <div class="user-avatar">
                      @if (result.avatarUrl) {
                        <img [src]="result.avatarUrl" [alt]="result.title" />
                      } @else {
                        <div class="avatar-placeholder">{{ result.title?.charAt(0)?.toUpperCase() }}</div>
                      }
                    </div>
                    <div class="user-info">
                      <h3 class="result-title">
                        <a [routerLink]="['/users', result.slug]">{{ result.title }}</a>
                      </h3>
                      <p class="user-username">&#64;{{ result.slug }}</p>
                      <p class="result-excerpt">{{ result.excerpt }}</p>
                      @if (result.specializations && result.specializations.length > 0) {
                        <div class="user-skills">
                          @for (skill of result.specializations.slice(0, 5); track skill) {
                            <span class="skill-tag">{{ skill }}</span>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </article>
              }

              <!-- Event Result -->
              @if (result.type === 'event') {
                <article class="result-card event-card">
                  <div class="result-type event">📅 Etkinlik</div>
                  <div class="result-content">
                    <h3 class="result-title">
                      <a [routerLink]="['/events', result.slug]">{{ result.title }}</a>
                    </h3>
                    <p class="result-excerpt">{{ result.excerpt }}</p>
                    @if (result.eventDate) {
                      <div class="event-date">
                        <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{{ result.eventDate | date:'dd MMMM yyyy, HH:mm' }}</span>
                      </div>
                    }
                    @if (result.location) {
                      <div class="event-location">
                        <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{{ result.location }}</span>
                      </div>
                    }
                  </div>
                </article>
              }

              <!-- Tag Result -->
              @if (result.type === 'tag') {
                <article class="result-card tag-card">
                  <div class="result-type tag">#️⃣ Etiket</div>
                  <div class="tag-content">
                    <a [routerLink]="['/tags', result.slug]" class="tag-name">
                      #{{ result.title }}
                    </a>
                    <p class="result-excerpt">{{ result.excerpt }}</p>
                    <div class="tag-stats">
                      @if (result.postCount !== undefined) {
                        <span class="tag-stat">{{ result.postCount }} yazı</span>
                      }
                      @if (result.questionCount !== undefined) {
                        <span class="tag-stat">{{ result.questionCount }} soru</span>
                      }
                      @if (result.followerCount !== undefined) {
                        <span class="tag-stat">{{ result.followerCount }} takipçi</span>
                      }
                    </div>
                  </div>
                </article>
              }
            } @empty {
              <div class="empty-state">
                @if (query()) {
                  <div class="empty-icon">🔍</div>
                  <h3>Sonuç bulunamadı</h3>
                  <p>"<strong>{{ query() }}</strong>" için herhangi bir sonuç bulunamadı.</p>
                  <ul class="suggestions">
                    <li>Farklı anahtar kelimeler deneyin</li>
                    <li>Daha genel terimler kullanın</li>
                    <li>Yazım hatalarını kontrol edin</li>
                  </ul>
                } @else {
                  <div class="empty-icon">🔎</div>
                  <h3>Aramaya Başlayın</h3>
                  <p>Yazı, soru, kullanıcı veya etkinlik aramak için yukarıdaki kutuyu kullanın.</p>
                }
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
      color: #f8fafc;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #17171c;
      border: 1px solid #2a2a35;
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
      color: #94a3b8;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: 1rem;
      color: #f8fafc;
    }

    .search-input::placeholder {
      color: #64748b;
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
      transform: translateY(-1px);
    }

    .search-info {
      margin-top: 1rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .search-time {
      color: #64748b;
      margin-left: 0.25rem;
    }

    .search-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #2a2a35;
      flex-wrap: wrap;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid #2a2a35;
      color: #94a3b8;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-btn:hover {
      border-color: #64748b;
      color: #f8fafc;
    }

    .filter-btn.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .filter-icon {
      font-size: 0.875rem;
    }

    .filter-count {
      background: rgba(255, 109, 90, 0.2);
      color: #ff6d5a;
      font-size: 0.75rem;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-weight: 600;
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
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      transition: all 0.2s;
    }

    .result-card:hover {
      border-color: #ff6d5a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .result-type {
      font-size: 0.7rem;
      font-weight: 600;
      color: #94a3b8;
      white-space: nowrap;
      padding: 0.25rem 0.5rem;
      background: rgba(148, 163, 184, 0.1);
      border-radius: 4px;
      height: fit-content;
    }

    .result-type.post {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }

    .result-type.question {
      color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    .result-type.user {
      color: #22c55e;
      background: rgba(34, 197, 94, 0.1);
    }

    .result-type.event {
      color: #a855f7;
      background: rgba(168, 85, 247, 0.1);
    }

    .result-type.tag {
      color: #eab308;
      background: rgba(234, 179, 8, 0.1);
    }

    .result-stats {
      flex-shrink: 0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border: 1px solid #2a2a35;
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
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.625rem;
      color: #94a3b8;
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
      color: #f8fafc;
      text-decoration: none;
      transition: color 0.15s;
    }

    .result-title a:hover {
      color: #ff6d5a;
    }

    .resolved-badge {
      color: #22c55e;
      margin-right: 0.25rem;
    }

    .result-excerpt {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .result-meta {
      font-size: 0.75rem;
      color: #64748b;
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

    /* User Card Styles */
    .user-card {
      flex-direction: column;
    }

    .user-content {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .user-avatar img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2a2a35;
    }

    .avatar-placeholder {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-username {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0 0 0.5rem;
    }

    .user-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.5rem;
    }

    .skill-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
      border-radius: 4px;
    }

    /* Event Card Styles */
    .event-date,
    .event-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.5rem;
    }

    .calendar-icon,
    .location-icon {
      width: 14px;
      height: 14px;
      color: #ff6d5a;
    }

    /* Tag Card Styles */
    .tag-card {
      flex-direction: column;
    }

    .tag-content {
      flex: 1;
    }

    .tag-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ff6d5a;
      text-decoration: none;
      transition: color 0.15s;
    }

    .tag-name:hover {
      color: #ff8577;
    }

    .tag-stats {
      display: flex;
      gap: 1rem;
      margin-top: 0.75rem;
    }

    .tag-stat {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: #f8fafc;
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: #94a3b8;
      margin: 0 0 1rem;
    }

    .suggestions {
      text-align: left;
      display: inline-block;
      color: #64748b;
      font-size: 0.875rem;
      list-style: disc;
      padding-left: 1.5rem;
    }

    .suggestions li {
      margin-bottom: 0.25rem;
    }

    @media (max-width: 640px) {
      .result-card {
        flex-direction: column;
      }

      .result-stats {
        order: -1;
      }

      .search-filters {
        gap: 0.375rem;
      }

      .filter-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  loading = signal(true);
  query = signal('');
  searchQuery = '';
  activeFilter = signal<SearchType | 'all'>('all');
  results = signal<SearchResult[]>([]);
  totalResults = signal(0);
  searchTime = signal(0);

  // Filter definitions
  filters: { value: SearchType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'Tümü', icon: '🔍' },
    { value: 'post', label: 'Yazılar', icon: '📝' },
    { value: 'question', label: 'Sorular', icon: '❓' },
    { value: 'user', label: 'Kullanıcılar', icon: '👤' },
    { value: 'event', label: 'Etkinlikler', icon: '📅' },
    { value: 'tag', label: 'Etiketler', icon: '#️⃣' }
  ];

  // Count results by type
  resultCounts = computed(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const result of this.results()) {
      counts[result.type] = (counts[result.type] || 0) + 1;
      counts['all']++;
    }
    return counts;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.query.set(params['q']);
        this.searchQuery = params['q'];
        const type = params['type'] as SearchType | undefined;
        if (type && this.filters.some(f => f.value === type)) {
          this.activeFilter.set(type);
        }
        this.search(params['q'], type);
      } else {
        this.loading.set(false);
      }
    });
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      const trimmedQuery = this.searchQuery.trim();
      this.query.set(trimmedQuery);
      
      // Update URL with search query
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: trimmedQuery },
        queryParamsHandling: 'merge'
      });
      
      this.search(trimmedQuery);
    }
  }

  setFilter(filter: SearchType | 'all'): void {
    this.activeFilter.set(filter);
    
    // Update URL with filter
    const queryParams: Record<string, string | null> = { 
      q: this.query() || null 
    };
    if (filter !== 'all') {
      queryParams['type'] = filter;
    } else {
      queryParams['type'] = null;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  getFilterCount(filterValue: SearchType | 'all'): number {
    return this.resultCounts()[filterValue] || 0;
  }

  filteredResults(): SearchResult[] {
    const filter = this.activeFilter();
    if (filter === 'all') {
      return this.results();
    }
    return this.results().filter(r => r.type === filter);
  }

  private search(query: string, type?: SearchType): void {
    this.loading.set(true);
    const startTime = performance.now();
    
    this.searchService.search(query, type).subscribe({
      next: (response) => {
        this.results.set(response.items);
        this.totalResults.set(response.totalCount);
        this.searchTime.set(Math.round(performance.now() - startTime));
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.totalResults.set(0);
        this.loading.set(false);
      }
    });
  }
}
