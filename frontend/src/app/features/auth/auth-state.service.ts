import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import type { User } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly authService = inject(AuthService);
  
  readonly user = computed(() => this.authService.currentUser());
  readonly isAuthenticated = computed(() => !!this.authService.currentUser());
  readonly isLoading = signal(false);
  
  get userId(): string | null {
    return this.user()?.id ?? null;
  }
  
  get username(): string | null {
    return this.user()?.username ?? null;
  }
  
  get displayName(): string | null {
    return this.user()?.displayName ?? null;
  }
  
  get avatarUrl(): string | null {
    return this.user()?.avatarUrl ?? null;
  }
  
  get role(): string | null {
    return this.user()?.role ?? null;
  }
  
  isAdmin(): boolean {
    return this.user()?.role === 'Admin';
  }
  
  isModerator(): boolean {
    const role = this.user()?.role;
    return role === 'Admin' || role === 'Moderator';
  }
  
  hasRole(role: string): boolean {
    return this.user()?.role === role;
  }
  
  async refreshUser(): Promise<void> {
    this.isLoading.set(true);
    try {
      // Token yenile ve kullanıcı bilgilerini güncelle
      await this.authService.refreshTokens().toPromise();
    } catch {
      // Token yenileme başarısız olursa sessizce devam et
    } finally {
      this.isLoading.set(false);
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
