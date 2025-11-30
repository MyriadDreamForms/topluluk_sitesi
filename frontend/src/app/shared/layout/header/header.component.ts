import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">TechCommunity</span>
          </a>

          <nav class="nav-main" [class.open]="mobileMenuOpen()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              Ana Sayfa
            </a>
            <a routerLink="/posts" routerLinkActive="active" class="nav-link">
              Yazılar
            </a>
            <a routerLink="/questions" routerLinkActive="active" class="nav-link">
              Sorular
            </a>
            <a routerLink="/tags" routerLinkActive="active" class="nav-link">
              Etiketler
            </a>
            <a routerLink="/events" routerLinkActive="active" class="nav-link">
              Etkinlikler
            </a>
          </nav>

          <div class="header-actions">
            <div class="search-box" [class.focused]="searchFocused()">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                class="search-input" 
                placeholder="Ara..." 
                [(ngModel)]="searchQuery"
                (keyup.enter)="onSearch()"
                (focus)="searchFocused.set(true)"
                (blur)="searchFocused.set(false)"
                #searchInput
              />
              <span class="search-shortcut" (click)="focusSearch()">⌘K</span>
            </div>

            @if (authService.isAuthenticated()) {
              <div class="user-menu" (click)="toggleUserMenu()">
                <div class="user-avatar">
                  {{ authService.currentUser()?.displayName?.charAt(0) || 'U' }}
                </div>
                @if (userMenuOpen()) {
                  <div class="user-dropdown" (click)="$event.stopPropagation()">
                    <div class="dropdown-header">
                      <strong>{{ authService.currentUser()?.displayName }}</strong>
                      <small>{{ '@' + authService.currentUser()?.username }}</small>
                    </div>
                    <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                      Profilim
                    </a>
                    <a routerLink="/profile/events" class="dropdown-item" (click)="closeUserMenu()">
                      📅 Etkinliklerim
                    </a>
                    <a routerLink="/posts/new" class="dropdown-item" (click)="closeUserMenu()">
                      Yeni Yazı
                    </a>
                    <a routerLink="/questions/ask" class="dropdown-item" (click)="closeUserMenu()">
                      Soru Sor
                    </a>
                    @if (authService.isAdmin()) {
                      <hr class="dropdown-divider" />
                      <a routerLink="/admin" class="dropdown-item" (click)="closeUserMenu()">
                        Yönetim Paneli
                      </a>
                    }
                    <hr class="dropdown-divider" />
                    <button class="dropdown-item logout" (click)="logout()">
                      Çıkış Yap
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/auth/login" class="btn btn-outline">
                Giriş
              </a>
              <a routerLink="/auth/register" class="btn btn-primary">
                Kayıt Ol
              </a>
            }

            <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Menü">
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: rgba(13, 13, 18, 0.9);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color, #2a2a35);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      transition: opacity 0.15s;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .nav-main {
      display: flex;
      gap: 0.25rem;
    }

    .nav-link {
      padding: 0.5rem 0.875rem;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      border-radius: 8px;
      transition: all 0.15s;
    }

    .nav-link:hover {
      color: var(--text-primary, #f8fafc);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-link.active {
      color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      transition: all 0.2s;
    }

    .search-box:hover,
    .search-box:focus-within {
      border-color: #ff6d5a;
      background: rgba(255, 109, 90, 0.05);
    }

    .search-icon {
      width: 16px;
      height: 16px;
      color: var(--text-muted, #8a8a8a);
      flex-shrink: 0;
    }

    .search-input {
      background: none;
      border: none;
      outline: none;
      font-size: 0.875rem;
      color: var(--text-primary, #ffffff);
      width: 160px;
    }

    .search-input::placeholder {
      color: var(--text-muted, #8a8a8a);
    }

    .search-shortcut {
      font-size: 0.7rem;
      color: var(--text-muted, #6a6a6a);
      background: rgba(255, 255, 255, 0.1);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }

    .btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 8px;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-outline {
      border: 1px solid var(--border-color, #2a2a35);
      background: transparent;
      color: var(--text-primary, #ffffff);
    }

    .btn-outline:hover {
      border-color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    .btn-primary {
      border: none;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      font-weight: 600;
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #ff5142 0%, #e84a3a 100%);
      box-shadow: 0 0 20px rgba(255, 109, 90, 0.4);
    }

    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6d5a, #ff5142);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      transition: box-shadow 0.15s;
    }

    .user-avatar:hover {
      box-shadow: 0 0 16px rgba(255, 109, 90, 0.5);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      min-width: 200px;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      z-index: 50;
      overflow: hidden;
    }

    .dropdown-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color, #334155);
      background: rgba(255, 255, 255, 0.02);
    }

    .dropdown-header strong {
      display: block;
      font-size: 0.875rem;
      color: var(--text-primary, #f8fafc);
    }

    .dropdown-header small {
      color: var(--text-muted, #94a3b8);
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.625rem 1rem;
      text-align: left;
      font-size: 0.875rem;
      color: var(--text-secondary, #cbd5e1);
      text-decoration: none;
      border: none;
      background: none;
      cursor: pointer;
      transition: all 0.15s;
    }

    .dropdown-item:hover {
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
    }

    .dropdown-item.logout {
      color: var(--error-color, #ef4444);
    }

    .dropdown-item.logout:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .dropdown-divider {
      margin: 0.25rem 0;
      border: none;
      border-top: 1px solid var(--border-color, #334155);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-primary, #f8fafc);
    }

    @media (max-width: 768px) {
      .nav-main {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-secondary, #1e293b);
        flex-direction: column;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, #334155);
      }

      .nav-main.open {
        display: flex;
      }

      .btn {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }

      .search-box {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);
  searchFocused = signal(false);
  searchQuery = '';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearch();
    }
  }

  focusSearch(): void {
    const input = document.querySelector('.search-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery.trim() } 
      });
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}
