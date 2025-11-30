import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  questionCount: number;
  followerCount: number;
  color?: string;
}

interface ContentItem {
  id: string;
  type: 'post' | 'question';
  title: string;
  slug: string;
  excerpt: string;
  author: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
  viewCount: number;
  commentCount?: number;
  answerCount?: number;
  isResolved?: boolean;
}

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, UserAvatarComponent, TimeAgoPipe],
  template: `
    <div class="container">
      @if (loading()) {
        <div class="loading-container">
          <app-loading-spinner />
        </div>
      } @else if (tag()) {
        <div class="tag-page">
          <header class="tag-header">
            <div class="tag-info">
              <h1 class="tag-name" [style.color]="tag()!.color || '#ff6d5a'">
                #{{ tag()!.name }}
              </h1>
              <p class="tag-description">{{ tag()!.description }}</p>
              
              <div class="tag-stats">
                <div class="stat">
                  <span class="stat-value">{{ tag()!.postCount }}</span>
                  <span class="stat-label">yazı</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ tag()!.questionCount }}</span>
                  <span class="stat-label">soru</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ tag()!.followerCount }}</span>
                  <span class="stat-label">takipçi</span>
                </div>
              </div>
            </div>
            
            <div class="tag-actions">
              <button class="btn btn-primary" [class.following]="isFollowing()" (click)="toggleFollow()">
                @if (isFollowing()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Takip Ediliyor
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Takip Et
                }
              </button>
            </div>
          </header>

          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">İçerikler</h2>
              <div class="filter-tabs">
                <button 
                  class="tab" 
                  [class.active]="contentFilter() === 'all'"
                  (click)="setContentFilter('all')"
                >
                  Tümü
                </button>
                <button 
                  class="tab" 
                  [class.active]="contentFilter() === 'posts'"
                  (click)="setContentFilter('posts')"
                >
                  Yazılar
                </button>
                <button 
                  class="tab" 
                  [class.active]="contentFilter() === 'questions'"
                  (click)="setContentFilter('questions')"
                >
                  Sorular
                </button>
              </div>
            </div>

            <div class="content-list">
              @for (item of filteredContent(); track item.id) {
                <article class="content-card">
                  <div class="content-type" [class.question]="item.type === 'question'">
                    @if (item.type === 'post') {
                      📝 Yazı
                    } @else {
                      ❓ Soru
                      @if (item.isResolved) {
                        <span class="resolved-badge">✓ Çözüldü</span>
                      }
                    }
                  </div>
                  
                  @if (item.type === 'question') {
                    <div class="content-stats">
                      <div class="stat-box" [class.resolved]="item.isResolved">
                        <span class="stat-num">{{ item.answerCount || 0 }}</span>
                        <span class="stat-text">cevap</span>
                      </div>
                    </div>
                  }
                  
                  <div class="content-body">
                    <h3 class="content-title">
                      <a [routerLink]="item.type === 'post' ? ['/posts', item.slug] : ['/questions', item.slug]">
                        {{ item.title }}
                      </a>
                    </h3>
                    <p class="content-excerpt">{{ item.excerpt }}</p>
                    
                    <footer class="content-footer">
                      <div class="author-info">
                        <a [routerLink]="['/u', item.author.username]" class="author-link">
                          <app-user-avatar 
                            [avatarUrl]="item.author.avatarUrl ?? null" 
                            [username]="item.author.displayName"
                            size="xs">
                          </app-user-avatar>
                          <span class="author-name">{{ item.author.displayName }}</span>
                        </a>
                        <span class="separator">·</span>
                        <time [attr.datetime]="item.createdAt">{{ item.createdAt | timeAgo }}</time>
                      </div>
                      <div class="content-meta">
                        <span class="meta-item">{{ item.viewCount }} görüntülenme</span>
                        @if (item.type === 'post' && item.commentCount) {
                          <span class="meta-item">{{ item.commentCount }} yorum</span>
                        }
                      </div>
                    </footer>
                  </div>
                </article>
              } @empty {
                <div class="empty-state">
                  <div class="empty-icon">📭</div>
                  <h3>Henüz içerik yok</h3>
                  <p>Bu etiketle ilgili henüz yazı veya soru paylaşılmamış.</p>
                  <div class="empty-actions">
                    <a routerLink="/posts/new" class="btn btn-primary">Yazı Paylaş</a>
                    <a routerLink="/questions/ask" class="btn btn-outline">Soru Sor</a>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="not-found">
          <div class="empty-icon">🏷️</div>
          <h2>Etiket bulunamadı</h2>
          <p>Aradığınız etiket mevcut değil veya kaldırılmış olabilir.</p>
          <a routerLink="/tags" class="btn btn-primary">Tüm Etiketlere Dön</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .tag-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      padding-bottom: 2rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #2a2a35;
    }

    .tag-info {
      flex: 1;
    }

    .tag-name {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.75rem;
    }

    .tag-description {
      font-size: 1rem;
      color: #94a3b8;
      margin: 0 0 1.5rem;
      line-height: 1.6;
    }

    .tag-stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
    }

    .tag-actions {
      flex-shrink: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
    }

    .btn-primary:hover {
      box-shadow: 0 0 20px rgba(255, 109, 90, 0.4);
      transform: translateY(-1px);
    }

    .btn-primary.following {
      background: rgba(255, 109, 90, 0.15);
      color: #ff6d5a;
    }

    .btn-outline {
      background: transparent;
      border: 1px solid #2a2a35;
      color: #f8fafc;
    }

    .btn-outline:hover {
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .tab {
      background: transparent;
      border: 1px solid #2a2a35;
      color: #94a3b8;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .tab:hover {
      border-color: #64748b;
      color: #f8fafc;
    }

    .tab.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .content-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .content-card {
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      gap: 1rem;
      transition: all 0.2s;
    }

    .content-card:hover {
      border-color: #ff6d5a;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .content-type {
      font-size: 0.7rem;
      font-weight: 600;
      color: #3b82f6;
      white-space: nowrap;
      padding: 0.25rem 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 4px;
      height: fit-content;
    }

    .content-type.question {
      color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    .resolved-badge {
      color: #22c55e;
      margin-left: 0.5rem;
    }

    .content-stats {
      flex-shrink: 0;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border: 1px solid #2a2a35;
      border-radius: 8px;
      min-width: 55px;
      background: rgba(255, 255, 255, 0.02);
    }

    .stat-box.resolved {
      background: rgba(34, 197, 94, 0.15);
      border-color: #22c55e;
    }

    .stat-num {
      font-size: 1.1rem;
      font-weight: 600;
      color: #f8fafc;
    }

    .stat-text {
      font-size: 0.625rem;
      color: #94a3b8;
    }

    .content-body {
      flex: 1;
      min-width: 0;
    }

    .content-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .content-title a {
      color: #f8fafc;
      text-decoration: none;
      transition: color 0.15s;
    }

    .content-title a:hover {
      color: #ff6d5a;
    }

    .content-excerpt {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0 0 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .content-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #64748b;
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      text-decoration: none;
      color: #94a3b8;
      transition: color 0.15s;
    }

    .author-link:hover {
      color: #ff6d5a;
    }

    .author-name {
      font-weight: 500;
    }

    .separator {
      color: #64748b;
    }

    .content-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }

    .empty-state,
    .not-found {
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

    .empty-state h3,
    .not-found h2 {
      font-size: 1.25rem;
      color: #f8fafc;
      margin: 0 0 0.5rem;
    }

    .empty-state p,
    .not-found p {
      color: #94a3b8;
      margin: 0 0 1.5rem;
    }

    .empty-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 640px) {
      .tag-header {
        flex-direction: column;
      }

      .tag-stats {
        gap: 1.5rem;
      }

      .content-card {
        flex-direction: column;
      }

      .filter-tabs {
        width: 100%;
      }

      .tab {
        flex: 1;
        text-align: center;
      }

      .empty-actions {
        flex-direction: column;
      }
    }
  `]
})
export class TagDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  loading = signal(true);
  tag = signal<Tag | null>(null);
  content = signal<ContentItem[]>([]);
  contentFilter = signal<'all' | 'posts' | 'questions'>('all');
  isFollowing = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['slug']) {
        this.loadTag(params['slug']);
      }
    });
  }

  setContentFilter(filter: 'all' | 'posts' | 'questions'): void {
    this.contentFilter.set(filter);
  }

  filteredContent(): ContentItem[] {
    const filter = this.contentFilter();
    const items = this.content();
    
    if (filter === 'all') {
      return items;
    }
    
    return items.filter(item => 
      filter === 'posts' ? item.type === 'post' : item.type === 'question'
    );
  }

  toggleFollow(): void {
    this.isFollowing.set(!this.isFollowing());
  }

  private loadTag(slug: string): void {
    this.loading.set(true);

    // Mock data - will be replaced with API call
    setTimeout(() => {
      // Find tag by slug
      const mockTags: Record<string, Tag> = {
        'javascript': {
          id: '1',
          name: 'JavaScript',
          slug: 'javascript',
          description: 'Web geliştirmenin temel programlama dili. Frontend ve backend geliştirme için kullanılır. Dinamik web siteleri, Node.js sunucu uygulamaları ve modern web frameworkleri için vazgeçilmez.',
          postCount: 234,
          questionCount: 156,
          followerCount: 1890,
          color: '#f7df1e'
        },
        'typescript': {
          id: '2',
          name: 'TypeScript',
          slug: 'typescript',
          description: 'JavaScript\'in tip güvenli süper kümesi. Büyük ölçekli uygulamalar için idealdir. Derleme zamanında tip kontrolü yaparak hataları erkenden yakalar.',
          postCount: 189,
          questionCount: 98,
          followerCount: 1450,
          color: '#3178c6'
        },
        'angular': {
          id: '3',
          name: 'Angular',
          slug: 'angular',
          description: 'Google tarafından geliştirilen güçlü frontend framework. Kurumsal uygulamalar için tercih edilir. Component tabanlı mimari ve güçlü CLI araçları sunar.',
          postCount: 145,
          questionCount: 87,
          followerCount: 1230,
          color: '#dd0031'
        },
        'react': {
          id: '4',
          name: 'React',
          slug: 'react',
          description: 'Facebook tarafından geliştirilen popüler UI kütüphanesi. Component tabanlı geliştirme yaklaşımı. Virtual DOM ile yüksek performans sunar.',
          postCount: 198,
          questionCount: 134,
          followerCount: 2100,
          color: '#61dafb'
        }
      };

      const foundTag = mockTags[slug];
      this.tag.set(foundTag || null);

      if (foundTag) {
        this.loadContent(slug);
      } else {
        this.loading.set(false);
      }
    }, 300);
  }

  private loadContent(tagSlug: string): void {
    // Mock content for the tag
    setTimeout(() => {
      const mockContent: ContentItem[] = [
        {
          id: '1',
          type: 'post',
          title: `${this.tag()?.name} ile Modern Web Geliştirme`,
          slug: `${tagSlug}-modern-web-development`,
          excerpt: 'Bu yazıda modern web geliştirme teknikleri ve en iyi pratikler hakkında detaylı bilgi vereceğiz...',
          author: {
            username: 'ahmet_dev',
            displayName: 'Ahmet Yılmaz',
            avatarUrl: undefined
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          viewCount: 1250,
          commentCount: 15
        },
        {
          id: '2',
          type: 'question',
          title: `${this.tag()?.name} performans optimizasyonu nasıl yapılır?`,
          slug: `${tagSlug}-performance-optimization`,
          excerpt: 'Büyük ölçekli uygulamalarda performans sorunları yaşıyorum. Nasıl optimize edebilirim?',
          author: {
            username: 'mehmet_ts',
            displayName: 'Mehmet Kaya',
            avatarUrl: undefined
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          viewCount: 890,
          answerCount: 5,
          isResolved: true
        },
        {
          id: '3',
          type: 'post',
          title: `${this.tag()?.name} 2025 Yol Haritası`,
          slug: `${tagSlug}-2025-roadmap`,
          excerpt: 'Bu yılın en önemli gelişmeleri ve gelecekte bizi bekleyen özellikler hakkında kapsamlı bir inceleme...',
          author: {
            username: 'zeynep_frontend',
            displayName: 'Zeynep Aksoy',
            avatarUrl: undefined
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          viewCount: 2100,
          commentCount: 28
        },
        {
          id: '4',
          type: 'question',
          title: `${this.tag()?.name} ile unit test yazarken karşılaşılan sorunlar`,
          slug: `${tagSlug}-unit-testing-issues`,
          excerpt: 'Async fonksiyonları test ederken timeout hataları alıyorum. Nasıl çözebilirim?',
          author: {
            username: 'can_devops',
            displayName: 'Can Öztürk',
            avatarUrl: undefined
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
          viewCount: 567,
          answerCount: 3,
          isResolved: false
        },
        {
          id: '5',
          type: 'post',
          title: `Başlangıçtan Uzmanlığa ${this.tag()?.name} Rehberi`,
          slug: `${tagSlug}-beginner-to-expert-guide`,
          excerpt: 'Sıfırdan başlayarak profesyonel seviyeye ulaşmak için izlemeniz gereken yol haritası...',
          author: {
            username: 'ayse_arch',
            displayName: 'Ayşe Demir',
            avatarUrl: undefined
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
          viewCount: 3450,
          commentCount: 42
        }
      ];

      this.content.set(mockContent);
      this.loading.set(false);
    }, 200);
  }
}
