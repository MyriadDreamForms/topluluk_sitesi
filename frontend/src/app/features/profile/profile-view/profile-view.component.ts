import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ProfileService, UserProfile, UserActivity } from '../profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

type TabType = 'posts' | 'questions' | 'answers';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    LoadingSpinnerComponent, 
    UserAvatarComponent, 
    AlertComponent,
    PaginationComponent,
    TimeAgoPipe
  ],
  template: `
    <div class="profile-page">
      @if (loading()) {
        <div class="loading-container">
          <app-loading-spinner [size]="40" />
        </div>
      } @else if (error()) {
        <div class="error-container">
          <app-alert 
            type="error" 
            title="Kullanıcı Bulunamadı"
            [message]="error()!" 
            [dismissible]="false"
          />
          <a routerLink="/" class="btn btn-secondary">Ana Sayfaya Dön</a>
        </div>
      } @else if (profile()) {
        <div class="profile-header">
          <div class="profile-cover"></div>
          <div class="profile-info">
            <div class="avatar-section">
              <app-user-avatar 
                [avatarUrl]="profile()!.avatarUrl || null"
                [displayName]="profile()!.displayName"
                size="2xl"
              />
              @if (isOwner()) {
                <a routerLink="/profile/settings" class="edit-profile-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                  Profili Düzenle
                </a>
                <a routerLink="/profile/events" class="edit-profile-btn events-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Etkinliklerim
                </a>
              }
            </div>
            
            <div class="user-details">
              <h1 class="display-name">{{ profile()!.displayName }}</h1>
              <p class="username">&#64;{{ profile()!.username }}</p>
              
              @if (profile()!.bio) {
                <p class="bio">{{ profile()!.bio }}</p>
              }
              
              <div class="meta-info">
                @if (profile()!.location) {
                  <span class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ profile()!.location }}
                  </span>
                }
                
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {{ formatDate(profile()!.createdAt) }} tarihinde katıldı
                </span>
              </div>
              
              <div class="social-links">
                @if (profile()!.website) {
                  <a [href]="profile()!.website" target="_blank" rel="noopener" class="social-link" title="Website">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </a>
                }
                @if (profile()!.githubUsername) {
                  <a [href]="'https://github.com/' + profile()!.githubUsername" target="_blank" rel="noopener" class="social-link" title="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                }
                @if (profile()!.twitterUsername) {
                  <a [href]="'https://twitter.com/' + profile()!.twitterUsername" target="_blank" rel="noopener" class="social-link" title="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                }
                @if (profile()!.linkedInUrl) {
                  <a [href]="profile()!.linkedInUrl" target="_blank" rel="noopener" class="social-link" title="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-card">
            <span class="stat-value">{{ profile()!.postsCount }}</span>
            <span class="stat-label">Yazı</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ profile()!.questionsCount }}</span>
            <span class="stat-label">Soru</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ profile()!.answersCount }}</span>
            <span class="stat-label">Cevap</span>
          </div>
        </div>
        
        <div class="profile-content">
          <div class="tabs">
            <button 
              class="tab" 
              [class.active]="activeTab() === 'posts'"
              (click)="setActiveTab('posts')"
            >
              {{ isOwner() ? 'Yazılarım' : 'Yazılar' }}
            </button>
            <button 
              class="tab" 
              [class.active]="activeTab() === 'questions'"
              (click)="setActiveTab('questions')"
            >
              {{ isOwner() ? 'Sorularım' : 'Sorular' }}
            </button>
            <button 
              class="tab" 
              [class.active]="activeTab() === 'answers'"
              (click)="setActiveTab('answers')"
            >
              {{ isOwner() ? 'Cevaplarım' : 'Cevaplar' }}
            </button>
          </div>
          
          <div class="tab-content">
            @if (activityLoading()) {
              <div class="activity-loading">
                <app-loading-spinner [size]="30" />
              </div>
            } @else if (activities().length === 0) {
              <div class="empty-state">
                <p>Henüz içerik yok.</p>
              </div>
            } @else {
              <div class="activity-list">
                @for (activity of activities(); track activity.id) {
                  <div class="activity-item">
                    <div class="activity-icon">
                      @switch (activity.type) {
                        @case ('post') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        }
                        @case ('question') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        }
                        @case ('answer') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 11 12 14 22 4"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                          </svg>
                        }
                      }
                    </div>
                    <div class="activity-content">
                      <a [routerLink]="getActivityLink(activity)" class="activity-title">
                        {{ activity.title }}
                      </a>
                      @if (activity.excerpt) {
                        <p class="activity-excerpt">{{ activity.excerpt }}</p>
                      }
                      <span class="activity-time">{{ activity.createdAt | timeAgo }}</span>
                    </div>
                  </div>
                }
              </div>
              
              @if (totalPages() > 1) {
                <div class="pagination-container">
                  <app-pagination 
                    [currentPage]="currentPage()"
                    [totalPages]="totalPages()"
                    [totalCount]="totalCount()"
                    [hasPreviousPage]="currentPage() > 1"
                    [hasNextPage]="currentPage() < totalPages()"
                    (pageChange)="onPageChange($event)"
                  />
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 1.5rem;
    }

    .profile-header {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .profile-cover {
      height: 140px;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 50%, #e6453c 100%);
      position: relative;
    }

    .profile-cover::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to top, rgba(23, 23, 28, 0.8), transparent);
    }

    .profile-info {
      padding: 0 2rem 2rem;
      display: flex;
      gap: 2rem;
    }

    .avatar-section {
      margin-top: -60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      z-index: 1;
    }

    .edit-profile-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .edit-profile-btn:hover {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .events-btn {
      margin-top: 0.5rem;
    }

    .user-details {
      flex: 1;
      padding-top: 1rem;
    }

    .display-name {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.25rem;
      color: var(--text-primary, #f8fafc);
    }

    .username {
      font-size: 1rem;
      color: #ff6d5a;
      margin: 0 0 1rem;
      font-weight: 500;
    }

    .bio {
      font-size: 0.9375rem;
      color: var(--text-secondary, #94a3b8);
      margin: 0 0 1rem;
      line-height: 1.6;
    }

    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: var(--text-muted, #64748b);
    }

    .meta-item svg {
      color: #ff6d5a;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-muted, #94a3b8);
      transition: all 0.2s;
    }

    .social-link:hover {
      background: rgba(255, 109, 90, 0.15);
      border-color: #ff6d5a;
      color: #ff6d5a;
      transform: translateY(-2px);
    }

    .profile-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
      transition: all 0.2s;
    }

    .stat-card:hover {
      border-color: rgba(255, 109, 90, 0.3);
      transform: translateY(-2px);
    }

    .stat-value {
      display: block;
      font-size: 1.75rem;
      font-weight: 700;
      color: #ff6d5a;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
    }

    .profile-content {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid var(--border-color, #2a2a35);
      background: rgba(13, 13, 18, 0.5);
    }

    .tab {
      flex: 1;
      padding: 1rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .tab:hover {
      color: var(--text-primary, #f8fafc);
      background: rgba(255, 255, 255, 0.03);
    }

    .tab.active {
      color: #ff6d5a;
    }

    .tab.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #ff6d5a, #ff5142);
    }

    .tab-content {
      padding: 1.5rem;
    }

    .activity-loading,
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      color: var(--text-muted, #64748b);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      transition: all 0.2s;
    }

    .activity-item:hover {
      border-color: rgba(255, 109, 90, 0.3);
      background: rgba(255, 109, 90, 0.05);
    }

    .activity-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 109, 90, 0.1);
      border-radius: 8px;
      color: #ff6d5a;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      display: block;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
      text-decoration: none;
      margin-bottom: 0.25rem;
      transition: color 0.2s;
    }

    .activity-title:hover {
      color: #ff6d5a;
    }

    .activity-excerpt {
      font-size: 0.875rem;
      color: var(--text-muted, #64748b);
      margin: 0 0 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    .pagination-container {
      margin-top: 1.5rem;
      display: flex;
      justify-content: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: var(--bg-tertiary, #0d0d12);
      color: var(--text-primary, #f8fafc);
      border: 1px solid var(--border-color, #2a2a35);
    }

    .btn-secondary:hover {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    @media (max-width: 640px) {
      .profile-info {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 1rem 1.5rem;
      }

      .avatar-section {
        margin-top: -50px;
      }

      .meta-info {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }

      .profile-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .display-name {
        font-size: 1.5rem;
      }
    }
  `]
})
export class ProfileViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  
  activeTab = signal<TabType>('posts');
  activities = signal<UserActivity[]>([]);
  activityLoading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);

  isOwner = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        this.loadProfile(username);
      }
    });
  }

  private loadProfile(username: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
        
        // Check if current user is the profile owner
        const currentUser = this.authService.currentUser();
        this.isOwner.set(currentUser?.username === profile.username);
        
        // Set SEO meta tags
        this.updateMetaTags(profile);
        
        // Load initial activity
        this.loadActivity();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Kullanıcı bulunamadı.');
      }
    });
  }

  private updateMetaTags(profile: UserProfile): void {
    const title = `${profile.displayName} (@${profile.username}) - TechCommunity`;
    this.title.setTitle(title);
    
    this.meta.updateTag({ name: 'description', content: profile.bio || `${profile.displayName} kullanıcısının TechCommunity profili` });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: profile.bio || `${profile.displayName} kullanıcısının profili` });
    this.meta.updateTag({ property: 'og:type', content: 'profile' });
    if (profile.avatarUrl) {
      this.meta.updateTag({ property: 'og:image', content: profile.avatarUrl });
    }
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.loadActivity();
  }

  private loadActivity(): void {
    const profile = this.profile();
    if (!profile) return;

    this.activityLoading.set(true);
    const tab = this.activeTab();
    
    this.profileService.getUserActivityByType(profile.username, tab, this.currentPage(), 10).subscribe({
      next: (response) => {
        this.activities.set(response.items);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.activityLoading.set(false);
      },
      error: () => {
        this.activities.set([]);
        this.activityLoading.set(false);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadActivity();
  }

  getActivityLink(activity: UserActivity): string {
    switch (activity.type) {
      case 'post':
        return `/posts/${activity.slug}`;
      case 'question':
        return `/questions/${activity.slug}`;
      case 'answer':
        return `/questions/${activity.slug}`;
      default:
        return '/';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
