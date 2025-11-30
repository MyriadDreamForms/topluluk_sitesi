import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, PaginatedResponse } from '../../core/services/api.service';
import { TagBadgeComponent, Tag } from '../../shared/components/tag-badge/tag-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  viewCount: number;
  createdAt: string;
  author: {
    username: string;
    displayName: string;
  };
  tags: Tag[];
}

interface Question {
  id: string;
  title: string;
  slug: string;
  answerCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    username: string;
    displayName: string;
  };
  tags: Tag[];
  isResolved: boolean;
}

interface Event {
  id: string;
  title: string;
  slug: string;
  eventType: 'Online' | 'Offline';
  startDate: string;
  location?: string;
  onlineUrl?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TagBadgeComponent, LoadingSpinnerComponent],
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
        <section class="home-section">
          <div class="section-header">
            <h2 class="section-title">Son Yazılar</h2>
            <a routerLink="/posts" class="section-link">Tümünü Gör →</a>
          </div>
          
          @if (loading()) {
            <app-loading-spinner />
          } @else {
            <div class="content-list">
              @for (post of recentPosts(); track post.id) {
                <article class="content-card">
                  <h3 class="content-title">
                    <a [routerLink]="['/posts', post.slug]">{{ post.title }}</a>
                  </h3>
                  <p class="content-excerpt">{{ post.excerpt }}</p>
                  <div class="content-meta">
                    <span class="author">{{ post.author.displayName }}</span>
                    <span class="separator">•</span>
                    <span class="date">{{ post.createdAt | date:'dd MMM yyyy' }}</span>
                    <span class="separator">•</span>
                    <span class="views">{{ post.viewCount }} görüntülenme</span>
                  </div>
                  <div class="content-tags">
                    @for (tag of post.tags; track tag.id) {
                      <app-tag-badge [tag]="tag" />
                    }
                  </div>
                </article>
              } @empty {
                <p class="empty-message">Henüz yazı yok.</p>
              }
            </div>
          }
        </section>

        <section class="home-section">
          <div class="section-header">
            <h2 class="section-title">Son Sorular</h2>
            <a routerLink="/questions" class="section-link">Tümünü Gör →</a>
          </div>
          
          @if (loading()) {
            <app-loading-spinner />
          } @else {
            <div class="content-list">
              @for (question of recentQuestions(); track question.id) {
                <article class="content-card question-card">
                  <div class="question-stats">
                    <div class="stat" [class.resolved]="question.isResolved">
                      <span class="stat-value">{{ question.answerCount }}</span>
                      <span class="stat-label">cevap</span>
                    </div>
                  </div>
                  <div class="question-content">
                    <h3 class="content-title">
                      <a [routerLink]="['/questions', question.slug]">{{ question.title }}</a>
                    </h3>
                    <div class="content-meta">
                      <span class="author">{{ question.author.displayName }}</span>
                      <span class="separator">•</span>
                      <span class="date">{{ question.createdAt | date:'dd MMM yyyy' }}</span>
                    </div>
                    <div class="content-tags">
                      @for (tag of question.tags; track tag.id) {
                        <app-tag-badge [tag]="tag" />
                      }
                    </div>
                  </div>
                </article>
              } @empty {
                <p class="empty-message">Henüz soru yok.</p>
              }
            </div>
          }
        </section>

        <aside class="home-sidebar">
          <section class="sidebar-section">
            <h3 class="sidebar-title">Yaklaşan Etkinlikler</h3>
            @if (loading()) {
              <app-loading-spinner [size]="24" />
            } @else {
              <div class="events-list">
                @for (event of upcomingEvents(); track event.id) {
                  <a [routerLink]="['/events', event.slug]" class="event-card">
                    <div class="event-date">
                      <span class="event-day">{{ event.startDate | date:'dd' }}</span>
                      <span class="event-month">{{ event.startDate | date:'MMM' }}</span>
                    </div>
                    <div class="event-info">
                      <span class="event-title">{{ event.title }}</span>
                      <span class="event-type" [class.online]="event.eventType === 'Online'">
                        {{ event.eventType === 'Online' ? '🌐 Online' : '📍 ' + event.location }}
                      </span>
                    </div>
                  </a>
                } @empty {
                  <p class="empty-message">Yaklaşan etkinlik yok.</p>
                }
              </div>
            }
            <a routerLink="/events" class="sidebar-link">Tüm Etkinlikler →</a>
          </section>

          <section class="sidebar-section">
            <h3 class="sidebar-title">Popüler Etiketler</h3>
            <div class="tags-cloud">
              @for (tag of popularTags(); track tag.id) {
                <app-tag-badge [tag]="tag" [showCount]="true" [large]="true" />
              }
            </div>
            <a routerLink="/tags" class="sidebar-link">Tüm Etiketler →</a>
          </section>
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
      grid-template-columns: 1fr 1fr 300px;
      gap: 2rem;
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
        grid-template-columns: 1fr 1fr;
      }

      .home-sidebar {
        grid-column: span 2;
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

      .home-grid {
        grid-template-columns: 1fr;
      }

      .home-sidebar {
        grid-column: 1;
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);

  loading = signal(true);
  recentPosts = signal<Post[]>([]);
  recentQuestions = signal<Question[]>([]);
  upcomingEvents = signal<Event[]>([]);
  popularTags = signal<Tag[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Simulated data for now - will be replaced with actual API calls
    setTimeout(() => {
      this.recentPosts.set([
        {
          id: '1',
          title: 'TypeScript 5.0 ile Gelen Yenilikler',
          slug: 'typescript-5-yenilikler',
          excerpt: 'TypeScript 5.0 sürümü ile birlikte gelen dekoratörler, const type parametreleri ve daha birçok yenilik...',
          viewCount: 1234,
          createdAt: new Date().toISOString(),
          author: { username: 'ahmet', displayName: 'Ahmet Yılmaz' },
          tags: [
            { id: '1', name: 'TypeScript', slug: 'typescript' },
            { id: '2', name: 'JavaScript', slug: 'javascript' }
          ]
        }
      ]);

      this.recentQuestions.set([
        {
          id: '1',
          title: 'Angular 21\'de standalone component nasıl oluşturulur?',
          slug: 'angular-21-standalone-component',
          answerCount: 3,
          viewCount: 567,
          createdAt: new Date().toISOString(),
          author: { username: 'mehmet', displayName: 'Mehmet Demir' },
          tags: [
            { id: '3', name: 'Angular', slug: 'angular' },
            { id: '1', name: 'TypeScript', slug: 'typescript' }
          ],
          isResolved: true
        }
      ]);

      this.upcomingEvents.set([
        {
          id: '1',
          title: 'İstanbul Tech Meetup',
          slug: 'istanbul-tech-meetup',
          eventType: 'Offline',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'İstanbul'
        }
      ]);

      this.popularTags.set([
        { id: '1', name: 'TypeScript', slug: 'typescript', postCount: 156 },
        { id: '3', name: 'Angular', slug: 'angular', postCount: 89 },
        { id: '4', name: 'React', slug: 'react', postCount: 134 },
        { id: '5', name: 'Node.js', slug: 'nodejs', postCount: 78 },
        { id: '6', name: 'Python', slug: 'python', postCount: 92 }
      ]);

      this.loading.set(false);
    }, 500);
  }
}
