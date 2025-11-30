import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (linkToProfile && username) {
      <a [routerLink]="['/profile', username]" class="avatar-link" [attr.title]="username">
        <ng-container *ngTemplateOutlet="avatarTemplate"></ng-container>
      </a>
    } @else {
      <ng-container *ngTemplateOutlet="avatarTemplate"></ng-container>
    }
    
    <ng-template #avatarTemplate>
      <div 
        class="avatar" 
        [class]="'avatar--' + size"
        [style.background-color]="showInitials() ? avatarColor() : 'transparent'"
      >
        @if (avatarUrl && !imageError) {
          <img 
            [src]="avatarUrl" 
            [alt]="username || 'Kullanıcı avatarı'"
            (error)="onImageError()"
            class="avatar__image"
          />
        } @else {
          <span class="avatar__initials">{{ initials() }}</span>
        }
        
        @if (showBadge) {
          <span class="avatar__badge" [class]="'avatar__badge--' + badgeType"></span>
        }
      </div>
      
      @if (showUsername && username) {
        <span class="avatar__username" [class]="'avatar__username--' + size">
          {{ displayName || username }}
        </span>
      }
    </ng-template>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .avatar-link {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      
      &:hover .avatar {
        opacity: 0.9;
      }
      
      &:hover .avatar__username {
        color: var(--primary-color);
      }
    }
    
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
      transition: opacity 0.2s ease;
      
      &--xs {
        width: 24px;
        height: 24px;
        font-size: 10px;
      }
      
      &--sm {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }
      
      &--md {
        width: 40px;
        height: 40px;
        font-size: 14px;
      }
      
      &--lg {
        width: 56px;
        height: 56px;
        font-size: 18px;
      }
      
      &--xl {
        width: 80px;
        height: 80px;
        font-size: 24px;
      }
      
      &--2xl {
        width: 120px;
        height: 120px;
        font-size: 36px;
      }
      
      &__image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      &__initials {
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        user-select: none;
      }
      
      &__badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 25%;
        height: 25%;
        min-width: 8px;
        min-height: 8px;
        border-radius: 50%;
        border: 2px solid white;
        
        &--online {
          background-color: var(--success-color);
        }
        
        &--offline {
          background-color: var(--text-muted);
        }
        
        &--busy {
          background-color: var(--danger-color);
        }
        
        &--away {
          background-color: var(--warning-color);
        }
      }
      
      &__username {
        color: var(--text-primary);
        transition: color 0.2s ease;
        
        &--xs, &--sm {
          font-size: 0.75rem;
        }
        
        &--md {
          font-size: 0.875rem;
        }
        
        &--lg {
          font-size: 1rem;
          font-weight: 500;
        }
        
        &--xl, &--2xl {
          font-size: 1.25rem;
          font-weight: 600;
        }
      }
    }
  `]
})
export class UserAvatarComponent {
  @Input() avatarUrl: string | null = null;
  @Input() username: string | null = null;
  @Input() displayName: string | null = null;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() linkToProfile: boolean = false;
  @Input() showUsername: boolean = false;
  @Input() showBadge: boolean = false;
  @Input() badgeType: 'online' | 'offline' | 'busy' | 'away' = 'offline';
  
  imageError = false;
  
  showInitials = computed(() => !this.avatarUrl || this.imageError);
  
  initials = computed(() => {
    if (!this.username && !this.displayName) {
      return '?';
    }
    
    const name = this.displayName || this.username || '';
    const parts = name.trim().split(/\s+/);
    
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  });
  
  avatarColor = computed(() => {
    const name = this.username || this.displayName || '';
    return this.generateColor(name);
  });
  
  onImageError(): void {
    this.imageError = true;
  }
  
  private generateColor(str: string): string {
    // Generate a consistent color based on the string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use predefined colors for better aesthetics
    const colors = [
      '#6366f1', // Indigo
      '#8b5cf6', // Violet
      '#ec4899', // Pink
      '#f43f5e', // Rose
      '#f97316', // Orange
      '#eab308', // Yellow
      '#22c55e', // Green
      '#14b8a6', // Teal
      '#06b6d4', // Cyan
      '#3b82f6', // Blue
    ];
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}
