import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface SidebarLink {
  label: string;
  route: string;
  icon: string;
  badge?: number;
  requiresAuth?: boolean;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.sidebar--open]="isOpen" [class.sidebar--collapsed]="isCollapsed">
      <div class="sidebar__header">
        <button 
          class="sidebar__toggle"
          (click)="toggleCollapse()"
          [attr.aria-label]="isCollapsed ? 'Kenar çubuğunu genişlet' : 'Kenar çubuğunu daralt'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            @if (isCollapsed) {
              <polyline points="9 18 15 12 9 6"></polyline>
            } @else {
              <polyline points="15 18 9 12 15 6"></polyline>
            }
          </svg>
        </button>
      </div>
      
      <nav class="sidebar__nav">
        <ul class="sidebar__list">
          @for (link of visibleLinks(); track link.route) {
            <li class="sidebar__item">
              <a 
                [routerLink]="link.route"
                routerLinkActive="sidebar__link--active"
                class="sidebar__link"
                [title]="isCollapsed ? link.label : ''"
              >
                <span class="sidebar__icon" [innerHTML]="link.icon"></span>
                @if (!isCollapsed) {
                  <span class="sidebar__label">{{ link.label }}</span>
                  @if (link.badge && link.badge > 0) {
                    <span class="sidebar__badge">{{ link.badge > 99 ? '99+' : link.badge }}</span>
                  }
                }
              </a>
            </li>
          }
        </ul>
      </nav>
      
      @if (!isCollapsed) {
        <div class="sidebar__footer">
          <div class="sidebar__section">
            <h4 class="sidebar__section-title">Popüler Etiketler</h4>
            <div class="sidebar__tags">
              @for (tag of popularTags; track tag) {
                <a [routerLink]="['/tags', tag]" class="sidebar__tag">
                  {{ tag }}
                </a>
              }
            </div>
          </div>
        </div>
      }
    </aside>
    
    <!-- Overlay for mobile -->
    @if (isOpen) {
      <div class="sidebar__overlay" (click)="close()"></div>
    }
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: var(--header-height, 64px);
      left: 0;
      bottom: 0;
      width: 260px;
      background-color: var(--bg-primary);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      z-index: 40;
      transition: transform 0.3s ease, width 0.3s ease;
      
      @media (max-width: 1024px) {
        transform: translateX(-100%);
        
        &--open {
          transform: translateX(0);
        }
      }
      
      &--collapsed {
        width: 72px;
        
        .sidebar__footer {
          display: none;
        }
      }
      
      &__header {
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem;
        border-bottom: 1px solid var(--border-color);
        
        @media (max-width: 1024px) {
          display: none;
        }
      }
      
      &__toggle {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        border-radius: 4px;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
      }
      
      &__nav {
        flex: 1;
        overflow-y: auto;
        padding: 1rem 0;
      }
      
      &__list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      &__item {
        margin-bottom: 0.25rem;
      }
      
      &__link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 0.2s ease;
        margin: 0 0.5rem;
        border-radius: 8px;
        
        &:hover {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
        }
        
        &--active {
          background-color: var(--primary-color);
          color: white;
          
          &:hover {
            background-color: var(--primary-hover);
            color: white;
          }
        }
      }
      
      &__icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        
        svg {
          width: 20px;
          height: 20px;
        }
      }
      
      &__label {
        flex: 1;
        font-size: 0.9rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      &__badge {
        background-color: var(--danger-color);
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.125rem 0.375rem;
        border-radius: 10px;
        min-width: 20px;
        text-align: center;
      }
      
      &__footer {
        padding: 1rem;
        border-top: 1px solid var(--border-color);
      }
      
      &__section {
        &-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }
      }
      
      &__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      &__tag {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background-color: var(--bg-secondary);
        color: var(--text-secondary);
        font-size: 0.75rem;
        border-radius: 4px;
        text-decoration: none;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: var(--primary-color);
          color: white;
        }
      }
      
      &__overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 39;
        
        @media (min-width: 1025px) {
          display: none;
        }
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Input() isCollapsed = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() isCollapsedChange = new EventEmitter<boolean>();
  
  private readonly authService = inject(AuthService);
  
  links: SidebarLink[] = [
    {
      label: 'Ana Sayfa',
      route: '/',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
    },
    {
      label: 'Gönderiler',
      route: '/posts',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    },
    {
      label: 'Sorular',
      route: '/questions',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    },
    {
      label: 'Etkinlikler',
      route: '/events',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    },
    {
      label: 'Etiketler',
      route: '/tags',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>'
    },
    {
      label: 'Profilim',
      route: '/profile',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
      requiresAuth: true
    },
    {
      label: 'Yönetim Paneli',
      route: '/admin',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      requiresAuth: true,
      roles: ['Admin', 'Moderator']
    }
  ];
  
  popularTags: string[] = [
    'javascript',
    'typescript',
    'angular',
    'react',
    'dotnet',
    'python',
    'yapay-zeka',
    'veritabani'
  ];
  
  visibleLinks() {
    const isAuthenticated = this.authService.isAuthenticated();
    const user = this.authService.currentUser();
    
    return this.links.filter(link => {
      // Check auth requirement
      if (link.requiresAuth && !isAuthenticated) {
        return false;
      }
      
      // Check role requirement
      if (link.roles && link.roles.length > 0) {
        if (!user || !link.roles.includes(user.role)) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isCollapsedChange.emit(this.isCollapsed);
  }
  
  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
