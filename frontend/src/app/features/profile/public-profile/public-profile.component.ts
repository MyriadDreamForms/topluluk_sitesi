import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProfileService, UserProfile } from '../profile.service';
import { PostsService } from '../../posts/posts.service';
import { QuestionsService } from '../../questions/questions.service';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  viewCount: number;
  commentCount?: number;
  createdAt: string;
}

interface QuestionItem {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeAgoPipe],
  template: `
    <div class="public-profile">
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Profil yükleniyor...</p>
        </div>
      } @else if (profile()) {
        <!-- Profile Header -->
        <header class="profile-header">
          <div class="profile-card">
            <div class="avatar-section">
              <img
                [src]="profile()!.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + profile()!.username"
                [alt]="profile()!.displayName || profile()!.username"
                class="avatar"
              />
              @if (profile()!.role !== 'User') {
                <span class="role-badge" [class]="profile()!.role.toLowerCase()">
                  {{ getRoleLabel(profile()!.role) }}
                </span>
              }
            </div>
            <div class="info-section">
              <h1 class="display-name">{{ profile()!.displayName || profile()!.username }}</h1>
              <p class="username">&#64;{{ profile()!.username }}</p>
              
              @if (profile()!.bio) {
                <p class="bio">{{ profile()!.bio }}</p>
              }
              
              <div class="meta-info">
                @if (profile()!.location) {
                  <span class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {{ profile()!.location }}
                  </span>
                }
                <span class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {{ formatDate(profile()!.createdAt) }} tarihinde katıldı
                </span>
              </div>

              <div class="social-links">
                @if (profile()!.website) {
                  <a [href]="profile()!.website" target="_blank" class="social-link" title="Website">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </a>
                }
                @if (profile()!.githubUsername) {
                  <a [href]="'https://github.com/' + profile()!.githubUsername" target="_blank" class="social-link" title="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                }
                @if (profile()!.twitterUsername) {
                  <a [href]="'https://twitter.com/' + profile()!.twitterUsername" target="_blank" class="social-link" title="Twitter/X">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                }
                @if (profile()!.linkedInUrl) {
                  <a [href]="profile()!.linkedInUrl" target="_blank" class="social-link" title="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                }
              </div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stat">
              <span class="stat-value">{{ profile()!.postsCount }}</span>
              <span class="stat-label">Yazı</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ profile()!.questionsCount }}</span>
              <span class="stat-label">Soru</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ profile()!.answersCount }}</span>
              <span class="stat-label">Cevap</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ profile()!.reputation }}</span>
              <span class="stat-label">Puan</span>
            </div>
          </div>
        </header>

        <!-- Content Tabs -->
        <section class="content-section">
          <div class="tabs">
            <button
              class="tab"
              [class.active]="activeTab() === 'posts'"
              (click)="setActiveTab('posts')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Yazılar ({{ profile()!.postsCount }})
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'questions'"
              (click)="setActiveTab('questions')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              Sorular ({{ profile()!.questionsCount }})
            </button>
          </div>

          <div class="tab-content">
            @if (activeTab() === 'posts') {
              @if (loadingContent()) {
                <div class="content-loading">
                  <div class="spinner"></div>
                </div>
              } @else if (posts().length) {
                <div class="content-list">
                  @for (post of posts(); track post.id) {
                    <a [routerLink]="['/posts', post.slug]" class="content-item">
                      <h3>{{ post.title }}</h3>
                      @if (post.excerpt) {
                        <p class="excerpt">{{ post.excerpt }}</p>
                      }
                      <div class="content-meta">
                        <span>{{ post.viewCount }} görüntüleme</span>
                        <span>{{ post.createdAt | timeAgo }}</span>
                      </div>
                    </a>
                  }
                </div>
              } @else {
                <div class="empty-tab">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p>Henüz yazı paylaşılmamış</p>
                </div>
              }
            } @else if (activeTab() === 'questions') {
              @if (loadingContent()) {
                <div class="content-loading">
                  <div class="spinner"></div>
                </div>
              } @else if (questions().length) {
                <div class="content-list">
                  @for (question of questions(); track question.id) {
                    <a [routerLink]="['/questions', question.slug]" class="content-item">
                      <div class="question-header">
                        <h3>{{ question.title }}</h3>
                        @if (question.hasAcceptedAnswer) {
                          <span class="accepted-badge" title="Kabul edilmiş cevabı var">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </span>
                        }
                      </div>
                      <div class="content-meta">
                        <span>{{ question.answerCount }} cevap</span>
                        <span>{{ question.viewCount }} görüntüleme</span>
                        <span>{{ question.createdAt | timeAgo }}</span>
                      </div>
                    </a>
                  }
                </div>
              } @else {
                <div class="empty-tab">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  <p>Henüz soru sorulmamış</p>
                </div>
              }
            }
          </div>
        </section>
      } @else {
        <div class="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
          </svg>
          <h2>Kullanıcı Bulunamadı</h2>
          <p>Aradığınız kullanıcı mevcut değil veya kaldırılmış olabilir.</p>
          <a routerLink="/" class="back-home">Ana Sayfaya Dön</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .public-profile {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #2a2a35;
      border-top-color: #ff6d5a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Profile Header */
    .profile-header {
      margin-bottom: 2rem;
    }

    .profile-card {
      display: flex;
      gap: 2rem;
      padding: 2rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 16px;
      margin-bottom: 1rem;
    }

    .avatar-section {
      position: relative;
      flex-shrink: 0;
    }

    .avatar {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #2a2a35;
    }

    .role-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .role-badge.admin {
      background: #ef4444;
      color: white;
    }

    .role-badge.moderator {
      background: #8b5cf6;
      color: white;
    }

    .info-section {
      flex: 1;
    }

    .display-name {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }

    .username {
      font-size: 1rem;
      color: #64748b;
      margin: 0 0 1rem 0;
    }

    .bio {
      font-size: 1rem;
      color: #94a3b8;
      margin: 0 0 1rem 0;
      line-height: 1.6;
    }

    .meta-info {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #64748b;
    }

    .meta-item svg {
      width: 16px;
      height: 16px;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #2a2a35;
      border-radius: 8px;
      color: #94a3b8;
      transition: all 0.2s;
    }

    .social-link:hover {
      background: #ff6d5a;
      color: white;
    }

    .social-link svg {
      width: 18px;
      height: 18px;
    }

    /* Stats Card */
    .stats-card {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1.5rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #64748b;
    }

    /* Content Section */
    .content-section {
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      overflow: hidden;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid #2a2a35;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
      padding: 1rem;
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      justify-content: center;
    }

    .tab:hover {
      color: #f8fafc;
      background: #1e1e25;
    }

    .tab.active {
      color: #ff6d5a;
      border-bottom: 2px solid #ff6d5a;
      margin-bottom: -1px;
    }

    .tab svg {
      width: 18px;
      height: 18px;
    }

    .tab-content {
      min-height: 300px;
    }

    .content-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }

    .content-list {
      display: flex;
      flex-direction: column;
    }

    .content-item {
      display: block;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #2a2a35;
      text-decoration: none;
      transition: background 0.2s;
    }

    .content-item:hover {
      background: #1e1e25;
    }

    .content-item:last-child {
      border-bottom: none;
    }

    .content-item h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .question-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .accepted-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: #22c55e;
      border-radius: 50%;
      color: white;
    }

    .accepted-badge svg {
      width: 12px;
      height: 12px;
    }

    .excerpt {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0 0 0.5rem 0;
      line-height: 1.5;
    }

    .content-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.8125rem;
      color: #64748b;
    }

    .empty-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #64748b;
    }

    .empty-tab svg {
      width: 48px;
      height: 48px;
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    /* Error State */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      text-align: center;
    }

    .error-state svg {
      width: 64px;
      height: 64px;
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .error-state h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .error-state p {
      color: #94a3b8;
      margin: 0 0 1.5rem 0;
    }

    .back-home {
      padding: 0.75rem 1.5rem;
      background: #ff6d5a;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: background 0.2s;
    }

    .back-home:hover {
      background: #ff5a45;
    }

    @media (max-width: 768px) {
      .public-profile {
        padding: 1rem;
      }

      .profile-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1.5rem;
      }

      .avatar {
        width: 96px;
        height: 96px;
      }

      .display-name {
        font-size: 1.5rem;
      }

      .meta-info {
        justify-content: center;
      }

      .social-links {
        justify-content: center;
      }

      .stats-card {
        grid-template-columns: repeat(2, 1fr);
      }

      .tab {
        font-size: 0.875rem;
        padding: 0.75rem;
      }
    }
  `]
})
export class PublicProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly postsService = inject(PostsService);
  private readonly questionsService = inject(QuestionsService);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  loadingContent = signal(false);
  activeTab = signal<'posts' | 'questions'>('posts');
  posts = signal<PostItem[]>([]);
  questions = signal<QuestionItem[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.loadProfile(username);
      }
    });
  }

  private loadProfile(username: string): void {
    this.loading.set(true);
    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
        this.loadPosts(username);
      },
      error: () => {
        this.profile.set(null);
        this.loading.set(false);
      }
    });
  }

  setActiveTab(tab: 'posts' | 'questions'): void {
    this.activeTab.set(tab);
    const username = this.profile()?.username;
    if (!username) return;

    if (tab === 'posts' && this.posts().length === 0) {
      this.loadPosts(username);
    } else if (tab === 'questions' && this.questions().length === 0) {
      this.loadQuestions(username);
    }
  }

  private loadPosts(username: string): void {
    this.loadingContent.set(true);
    this.postsService.getPosts({ authorUsername: username, pageNumber: 1, pageSize: 10 }).subscribe({
      next: (result) => {
        this.posts.set(result.items.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          viewCount: p.viewCount,
          commentCount: p.commentCount,
          createdAt: p.createdAt
        })));
        this.loadingContent.set(false);
      },
      error: () => {
        this.loadingContent.set(false);
      }
    });
  }

  private loadQuestions(username: string): void {
    this.loadingContent.set(true);
    this.questionsService.getQuestions({ authorUsername: username, pageNumber: 1, pageSize: 10 }).subscribe({
      next: (result) => {
        this.questions.set(result.items.map((q: any) => ({
          id: q.id,
          title: q.title,
          slug: q.slug,
          viewCount: q.viewCount,
          answerCount: q.answerCount,
          hasAcceptedAnswer: q.hasAcceptedAnswer,
          createdAt: q.createdAt
        })));
        this.loadingContent.set(false);
      },
      error: () => {
        this.loadingContent.set(false);
      }
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'Admin': return 'Admin';
      case 'Moderator': return 'Moderatör';
      default: return role;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
