import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <header class="dashboard-header">
        <h1>Yönetim Paneli</h1>
        <p class="subtitle">Platform istatistikleri ve yönetim araçları</p>
      </header>

      <!-- Navigation Cards -->
      <nav class="admin-nav">
        <a routerLink="/admin/users" class="nav-card">
          <div class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div class="nav-content">
            <h3>Kullanıcı Yönetimi</h3>
            <p>Kullanıcıları yönet, rol ata, yasakla</p>
          </div>
        </a>

        <a routerLink="/admin/content" class="nav-card">
          <div class="nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
            </svg>
          </div>
          <div class="nav-content">
            <h3>İçerik Moderasyonu</h3>
            <p>İçerikleri incele, gizle, sil</p>
          </div>
        </a>
      </nav>

      <!-- Stats Grid -->
      @if (loading()) {
        <div class="stats-loading">
          <div class="spinner"></div>
          <p>İstatistikler yükleniyor...</p>
        </div>
      } @else if (stats()) {
        <section class="stats-section">
          <h2>Platform İstatistikleri</h2>
          <div class="stats-grid">
            <div class="stat-card users">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.totalUsers }}</span>
                <span class="stat-label">Toplam Kullanıcı</span>
              </div>
            </div>

            <div class="stat-card active">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.activeUsers }}</span>
                <span class="stat-label">Aktif Kullanıcı</span>
              </div>
            </div>

            <div class="stat-card banned">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.bannedUsers }}</span>
                <span class="stat-label">Yasaklı Kullanıcı</span>
              </div>
            </div>

            <div class="stat-card posts">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.totalPosts }}</span>
                <span class="stat-label">Yazı</span>
              </div>
            </div>

            <div class="stat-card questions">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.totalQuestions }}</span>
                <span class="stat-label">Soru</span>
              </div>
            </div>

            <div class="stat-card answers">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.totalAnswers }}</span>
                <span class="stat-label">Cevap</span>
              </div>
            </div>

            <div class="stat-card comments">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.totalComments }}</span>
                <span class="stat-label">Yorum</span>
              </div>
            </div>

            <div class="stat-card hidden">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stats()!.hiddenContent }}</span>
                <span class="stat-label">Gizli İçerik</span>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Quick Actions -->
      <section class="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div class="actions-grid">
          <a routerLink="/admin/users" [queryParams]="{ isBanned: true }" class="action-card">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>Yasaklı Kullanıcılar</span>
          </a>
          <a routerLink="/admin/content" [queryParams]="{ isHidden: true }" class="action-card">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            <span>Gizli İçerikler</span>
          </a>
          <a routerLink="/admin/content" [queryParams]="{ hasReports: true }" class="action-card warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span>Şikayet Edilen</span>
          </a>
          <a routerLink="/admin/users" [queryParams]="{ role: 'Moderator' }" class="action-card">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Moderatörler</span>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .dashboard-header .subtitle {
      color: #94a3b8;
      margin: 0;
    }

    /* Navigation Cards */
    .admin-nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .nav-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
    }

    .nav-card:hover {
      border-color: #ff6d5a;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 109, 90, 0.15);
    }

    .nav-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 109, 90, 0.1);
      border-radius: 12px;
      flex-shrink: 0;
    }

    .nav-icon svg {
      width: 28px;
      height: 28px;
      color: #ff6d5a;
    }

    .nav-content h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 0.25rem 0;
    }

    .nav-content p {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0;
    }

    /* Stats Section */
    .stats-section {
      margin-bottom: 3rem;
    }

    .stats-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 1.5rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 10px;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 22px;
      height: 22px;
    }

    .stat-card.users .stat-icon {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
    }

    .stat-card.active .stat-icon {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
    }

    .stat-card.banned .stat-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .stat-card.posts .stat-icon {
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
    }

    .stat-card.questions .stat-icon {
      background: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
    }

    .stat-card.answers .stat-icon {
      background: rgba(168, 85, 247, 0.1);
      color: #c084fc;
    }

    .stat-card.comments .stat-icon {
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
    }

    .stat-card.hidden .stat-icon {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .stats-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
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

    /* Quick Actions */
    .quick-actions {
      margin-bottom: 2rem;
    }

    .quick-actions h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 1.5rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 10px;
      text-decoration: none;
      color: #94a3b8;
      transition: all 0.2s;
    }

    .action-card:hover {
      border-color: #ff6d5a;
      color: #f8fafc;
    }

    .action-card svg {
      width: 24px;
      height: 24px;
    }

    .action-card span {
      font-size: 0.875rem;
      font-weight: 500;
      text-align: center;
    }

    .action-card.warning:hover {
      border-color: #fbbf24;
    }

    .action-card.warning:hover svg {
      color: #fbbf24;
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 1rem;
      }

      .dashboard-header h1 {
        font-size: 1.5rem;
      }

      .admin-nav {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
