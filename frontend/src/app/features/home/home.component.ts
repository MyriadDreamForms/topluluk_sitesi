import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedService, FeedItem, PopularTag } from './feed.service';
import { EventsService, EventDto } from '../events/events.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { PopularTagsComponent } from './popular-tags/popular-tags.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, FeedItemComponent, PopularTagsComponent, UpcomingEventsComponent],
  template: `
    <div class="container">
      <section class="hero">
        <h1 class="hero-title">Türkiye'nin Tech Topluluğuna Hoş Geldiniz 🚀</h1>
        <p class="hero-desc">
          Yazılımcılar, veri bilimciler ve teknoloji meraklıları için bilgi paylaşım platformu.
          Sorular sorun, yazılar yazın, etkinliklere katılın!
        </p>
        <div class="hero-actions">
          <a routerLink="/questions/ask" class="btn btn-primary">Soru Sor</a>
          <a routerLink="/posts/new" class="btn btn-outline">Yazı Paylaş</a>
        </div>
      </section>

      <div class="home-grid">
        <section class="feed-section">
          <div class="section-header">
            <h2 class="section-title">Topluluk Akışı</h2>
            <div class="feed-tabs">
              <button 
                class="tab" 
                [class.active]="sortBy() === 'latest'"
                (click)="setSort('latest')">
                En Yeni
              </button>
              <button 
                class="tab" 
                [class.active]="sortBy() === 'popular'"
                (click)="setSort('popular')">
                Popüler
              </button>
              <button 
                class="tab" 
                [class.active]="sortBy() === 'trending'"
                (click)="setSort('trending')">
                Trend
              </button>
            </div>
          </div>
          
          @if (loading()) {
            <app-loading-spinner />
          } @else {
            <div class="feed-list">
              @for (item of feedItems(); track item.id) {
                <app-feed-item [item]="item"></app-feed-item>
              } @empty {
                <div class="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <p>Henüz içerik yok. İlk yazıyı veya soruyu siz paylaşın!</p>
                </div>
              }
            </div>
            
            <a routerLink="/posts" class="section-link">Tüm içerikleri gör →</a>
          }
        </section>

        <aside class="home-sidebar">
          <app-popular-tags [tags]="popularTags()"></app-popular-tags>

          <app-upcoming-events></app-upcoming-events>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero {
      text-align: center;
      padding: 4rem 1rem;
      background: 
        radial-gradient(ellipse 100% 80% at 50% -30%, rgba(255, 109, 90, 0.15), transparent 60%),
        radial-gradient(ellipse 60% 50% at 100% 0%, rgba(124, 58, 237, 0.1), transparent 50%),
        var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 1.5rem;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 109, 90, 0.5), transparent);
    }

    .hero-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--text-primary, #f8fafc);
    }

    .hero-desc {
      font-size: 1.125rem;
      color: var(--text-muted, #94a3b8);
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .btn {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #ff5142 0%, #e84a3a 100%);
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
    }

    .btn-outline {
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-primary, #ffffff);
      background: rgba(255, 255, 255, 0.03);
    }

    .btn-outline:hover {
      border-color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
      transform: translateY(-2px);
    }

    .home-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
    }

    .feed-section {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .feed-tabs {
      display: flex;
      gap: 0.25rem;
      background: rgba(255, 255, 255, 0.02);
      padding: 0.25rem;
      border-radius: 10px;
      border: 1px solid var(--border-color, #2a2a35);
    }

    .tab {
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--text-primary, #f8fafc);
    }

    .tab.active {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .feed-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted, #64748b);
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .home-section {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary, #f8fafc);
    }

    .section-link {
      color: #ff6d5a;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: opacity 0.15s;
    }

    .section-link:hover {
      opacity: 0.8;
    }

    .content-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .content-card {
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-color, #2a2a35);
    }

    .content-card:last-child {
      padding-bottom: 0;
      border-bottom: none;
    }

    .content-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .content-title a {
      color: var(--text-primary, #f8fafc);
      text-decoration: none;
      transition: color 0.15s;
    }

    .content-title a:hover {
      color: #ff6d5a;
    }

    .content-excerpt {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .content-meta {
      font-size: 0.75rem;
      color: var(--text-light, #64748b);
      margin-bottom: 0.5rem;
    }

    .separator {
      margin: 0 0.375rem;
    }

    .content-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .question-card {
      display: flex;
      gap: 1rem;
    }

    .question-stats {
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
      color: var(--text-primary, #f8fafc);
    }

    .stat-label {
      font-size: 0.625rem;
      color: var(--text-muted, #94a3b8);
    }

    .question-content {
      flex: 1;
    }

    .home-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-section {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.25rem;
    }

    .sidebar-title {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem;
      color: var(--text-primary, #f8fafc);
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .event-card {
      display: flex;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
      padding: 0.5rem;
      border-radius: 8px;
      transition: background 0.15s;
    }

    .event-card:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .event-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      padding: 0.375rem 0.5rem;
      border-radius: 8px;
      min-width: 45px;
    }

    .event-day {
      font-size: 1rem;
      font-weight: 700;
    }

    .event-month {
      font-size: 0.625rem;
      text-transform: uppercase;
    }

    .event-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 0.25rem;
    }

    .event-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
    }

    .event-type {
      font-size: 0.75rem;
      color: var(--text-muted, #94a3b8);
    }

    .event-type.online {
      color: #ff6d5a;
    }

    .sidebar-link {
      display: block;
      text-align: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #2a2a35);
      color: #ff6d5a;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: opacity 0.15s;
    }

    .sidebar-link:hover {
      opacity: 0.8;
    }

    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .empty-message {
      color: var(--text-muted, #64748b);
      font-size: 0.875rem;
      text-align: center;
      padding: 1rem 0;
    }

    @media (max-width: 1024px) {
      .home-grid {
        grid-template-columns: 1fr;
      }

      .home-sidebar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 640px) {
      .hero {
        padding: 2.5rem 1rem;
      }

      .hero-title {
        font-size: 1.5rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .feed-tabs {
        justify-content: center;
      }

      .home-sidebar {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly feedService = inject(FeedService);
  private readonly eventsService = inject(EventsService);
  private readonly seoService = inject(SeoService);

  loading = signal(true);
  feedItems = signal<FeedItem[]>([]);
  popularTags = signal<PopularTag[]>([]);
  sortBy = signal<'latest' | 'popular' | 'trending'>('latest');

  ngOnInit(): void {
    this.seoService.updateTags({
      title: 'Türkiye Teknoloji Topluluğu',
      description: 'Türkiye\'nin en büyük teknoloji topluluğu. Yazılım, DevOps, veri bilimi ve daha fazlası hakkında içerikler, sorular ve etkinlikler.',
      keywords: ['teknoloji', 'yazılım', 'programlama', 'topluluk', 'Türkiye']
    });
    this.loadData();
  }

  setSort(sort: 'latest' | 'popular' | 'trending'): void {
    this.sortBy.set(sort);
    this.loadFeed();
  }

  private loadData(): void {
    this.loadFeed();
    this.loadPopularTags();
  }

  private loadFeed(): void {
    this.loading.set(true);
    this.feedService.getFeed(this.sortBy(), 1, 10).subscribe({
      next: (response) => {
        this.feedItems.set(response.items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private loadPopularTags(): void {
    this.feedService.getPopularTags(8).subscribe({
      next: (tags) => {
        this.popularTags.set(tags);
      }
    });
  }
}
