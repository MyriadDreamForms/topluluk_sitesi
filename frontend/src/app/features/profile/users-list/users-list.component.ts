import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService, UserProfile } from '../profile.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UserAvatarComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <header class="page-header">
        <div class="header-content">
          <h1>Topluluk Üyeleri</h1>
          <p class="subtitle">
            Türkiye'nin en aktif teknoloji topluluğunun üyeleri
          </p>
        </div>
      </header>

      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Kullanıcı ara..." 
            [(ngModel)]="searchQuery"
            (input)="filterUsers()"
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
            [class.active]="sortBy() === 'reputation'" 
            (click)="changeSort('reputation')">
            En Aktif
          </button>
          <button 
            [class.active]="sortBy() === 'newest'" 
            (click)="changeSort('newest')">
            En Yeni
          </button>
          <button 
            [class.active]="sortBy() === 'name'" 
            (click)="changeSort('name')">
            İsim
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <app-loading-spinner></app-loading-spinner>
        </div>
      } @else if (filteredUsers().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h2>Kullanıcı Bulunamadı</h2>
          <p>Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
        </div>
      } @else {
        <div class="stats-bar">
          <span class="stats-count">{{ filteredUsers().length }} üye</span>
        </div>

        <div class="users-grid">
          @for (user of filteredUsers(); track user.id) {
            <a [routerLink]="['/u', user.username]" class="user-card">
              <div class="user-avatar-wrapper">
                <app-user-avatar 
                  [avatarUrl]="user.avatarUrl || null"
                  [displayName]="user.displayName"
                  size="lg"
                />
                @if (user.role === 'Admin') {
                  <span class="role-badge admin">Admin</span>
                } @else if (user.role === 'Moderator') {
                  <span class="role-badge mod">Mod</span>
                }
              </div>
              
              <div class="user-info">
                <h3 class="user-name">{{ user.displayName }}</h3>
                <p class="user-username">&#64;{{ user.username }}</p>
                
                @if (user.bio) {
                  <p class="user-bio">{{ user.bio }}</p>
                }
                
                @if (user.location) {
                  <p class="user-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{ user.location }}
                  </p>
                }
              </div>

              <div class="user-stats">
                <div class="stat">
                  <span class="stat-value">{{ user.reputation }}</span>
                  <span class="stat-label">Puan</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ user.postsCount }}</span>
                  <span class="stat-label">Yazı</span>
                </div>
                <div class="stat">
                  <span class="stat-value">{{ user.answersCount }}</span>
                  <span class="stat-label">Cevap</span>
                </div>
              </div>
            </a>
          }
        </div>
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
      margin-bottom: 2rem;
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

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
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

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted, #94a3b8);
    }

    .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--text-muted, #64748b);
    }

    .empty-state h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      margin: 0;
    }

    .stats-bar {
      margin-bottom: 1rem;
      padding: 0.5rem 0;
    }

    .stats-count {
      color: var(--text-muted, #94a3b8);
      font-size: 0.875rem;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1rem;
    }

    .user-card {
      display: flex;
      flex-direction: column;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.5rem;
      text-decoration: none;
      transition: all 0.2s;
    }

    .user-card:hover {
      border-color: rgba(255, 109, 90, 0.4);
      background: rgba(255, 109, 90, 0.05);
      transform: translateY(-2px);
    }

    .user-avatar-wrapper {
      position: relative;
      display: inline-flex;
      align-self: flex-start;
      margin-bottom: 1rem;
    }

    .role-badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      padding: 2px 6px;
      font-size: 0.625rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .role-badge.admin {
      background: linear-gradient(135deg, #ff6d5a, #ff5142);
      color: white;
    }

    .role-badge.mod {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
    }

    .user-info {
      flex: 1;
      margin-bottom: 1rem;
    }

    .user-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.25rem;
    }

    .user-username {
      font-size: 0.875rem;
      color: #ff6d5a;
      margin: 0 0 0.75rem;
      font-weight: 500;
    }

    .user-bio {
      font-size: 0.875rem;
      color: var(--text-secondary, #94a3b8);
      margin: 0 0 0.5rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .user-location {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      margin: 0;
    }

    .user-location svg {
      color: #ff6d5a;
    }

    .user-stats {
      display: flex;
      gap: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 1.125rem;
      font-weight: 700;
      color: #ff6d5a;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    @media (max-width: 768px) {
      .header-content h1 {
        font-size: 1.5rem;
      }

      .users-grid {
        grid-template-columns: 1fr;
      }

      .sort-options {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  users = signal<UserProfile[]>([]);
  filteredUsers = signal<UserProfile[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  sortBy = signal<'reputation' | 'newest' | 'name'>('reputation');

  // Mock users data
  private readonly mockUsers: UserProfile[] = [
    {
      id: '1',
      username: 'ahmetyilmaz',
      displayName: 'Ahmet Yılmaz',
      bio: 'Full Stack Developer | React, Node.js, TypeScript | Open Source Enthusiast',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet',
      role: 'Admin',
      createdAt: '2023-06-15T10:00:00Z',
      location: 'İstanbul, Türkiye',
      website: 'https://ahmetyilmaz.dev',
      githubUsername: 'ahmetyilmaz',
      twitterUsername: 'ahmetylmz',
      linkedInUrl: 'https://linkedin.com/in/ahmetyilmaz',
      postsCount: 24,
      questionsCount: 12,
      answersCount: 56,
      reputation: 1250
    },
    {
      id: '2',
      username: 'zeynepkaya',
      displayName: 'Zeynep Kaya',
      bio: 'Senior Backend Developer | Go, Kubernetes, Microservices',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep',
      role: 'Moderator',
      createdAt: '2023-08-20T14:30:00Z',
      location: 'Ankara, Türkiye',
      website: 'https://zeynepkaya.com',
      githubUsername: 'zeynepkaya',
      postsCount: 18,
      questionsCount: 8,
      answersCount: 42,
      reputation: 980
    },
    {
      id: '3',
      username: 'mehmetdemir',
      displayName: 'Mehmet Demir',
      bio: 'Mobile Developer | Flutter, Swift, Kotlin | Tech Writer',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet',
      role: 'User',
      createdAt: '2024-01-10T09:00:00Z',
      location: 'İzmir, Türkiye',
      twitterUsername: 'mehmetdemir_dev',
      postsCount: 15,
      questionsCount: 25,
      answersCount: 38,
      reputation: 720
    },
    {
      id: '4',
      username: 'aysegulcelik',
      displayName: 'Ayşegül Çelik',
      bio: 'DevOps Engineer | AWS, Docker, Terraform | Cloud Architecture',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aysegul',
      role: 'User',
      createdAt: '2023-11-05T16:45:00Z',
      location: 'Bursa, Türkiye',
      githubUsername: 'aysegulcelik',
      postsCount: 12,
      questionsCount: 5,
      answersCount: 28,
      reputation: 650
    },
    {
      id: '5',
      username: 'canozturk',
      displayName: 'Can Öztürk',
      bio: 'Frontend Developer | Vue.js, Nuxt, Tailwind CSS',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=can',
      role: 'User',
      createdAt: '2024-03-22T11:20:00Z',
      location: 'Antalya, Türkiye',
      website: 'https://canozturk.dev',
      postsCount: 8,
      questionsCount: 15,
      answersCount: 22,
      reputation: 480
    },
    {
      id: '6',
      username: 'elifarslan',
      displayName: 'Elif Arslan',
      bio: 'Data Scientist | Python, TensorFlow, Machine Learning',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elif',
      role: 'User',
      createdAt: '2024-02-14T13:00:00Z',
      location: 'İstanbul, Türkiye',
      linkedInUrl: 'https://linkedin.com/in/elifarslan',
      postsCount: 10,
      questionsCount: 18,
      answersCount: 15,
      reputation: 420
    },
    {
      id: '7',
      username: 'burakkoc',
      displayName: 'Burak Koç',
      bio: 'Security Engineer | Penetration Testing, OWASP, Bug Bounty Hunter',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=burak',
      role: 'Moderator',
      createdAt: '2023-09-08T08:15:00Z',
      location: 'İstanbul, Türkiye',
      twitterUsername: 'burakkoc_sec',
      postsCount: 20,
      questionsCount: 6,
      answersCount: 45,
      reputation: 890
    },
    {
      id: '8',
      username: 'semaozdemir',
      displayName: 'Sema Özdemir',
      bio: 'UI/UX Designer turned Developer | Figma, React, Design Systems',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sema',
      role: 'User',
      createdAt: '2024-04-01T10:30:00Z',
      location: 'Eskişehir, Türkiye',
      website: 'https://semaozdemir.design',
      postsCount: 6,
      questionsCount: 10,
      answersCount: 12,
      reputation: 350
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      this.users.set(this.mockUsers);
      this.sortUsers();
      this.loading.set(false);
    }, 500);
  }

  filterUsers(): void {
    const query = this.searchQuery().toLowerCase().trim();
    
    if (!query) {
      this.sortUsers();
      return;
    }

    const filtered = this.users().filter(user => 
      user.displayName.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      (user.bio && user.bio.toLowerCase().includes(query)) ||
      (user.location && user.location.toLowerCase().includes(query))
    );

    this.filteredUsers.set(filtered);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.sortUsers();
  }

  changeSort(sort: 'reputation' | 'newest' | 'name'): void {
    this.sortBy.set(sort);
    this.sortUsers();
  }

  private sortUsers(): void {
    let sorted = [...this.users()];
    
    switch (this.sortBy()) {
      case 'reputation':
        sorted.sort((a, b) => b.reputation - a.reputation);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        sorted.sort((a, b) => a.displayName.localeCompare(b.displayName, 'tr'));
        break;
    }

    // Apply search filter if exists
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      sorted = sorted.filter(user => 
        user.displayName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query))
      );
    }

    this.filteredUsers.set(sorted);
  }
}
