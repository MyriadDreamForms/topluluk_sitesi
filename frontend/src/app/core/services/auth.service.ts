import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: 'User' | 'Moderator' | 'Admin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  displayName: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: AuthTokens;
  };
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(true);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  
  readonly isAdmin = computed(() => this._currentUser()?.role === 'Admin');
  readonly isModerator = computed(() => {
    const role = this._currentUser()?.role;
    return role === 'Admin' || role === 'Moderator';
  });

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser) as User;
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
        } catch {
          this.clearAuth();
        }
      }
    }
    this._isLoading.set(false);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.tokens);
        }
      }),
      catchError(() => this.mockLogin(request))
    );
  }

  private mockLogin(request: LoginRequest): Observable<AuthResponse> {
    // Demo login - herhangi bir email/password ile giriş yapılabilir
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email: request.email,
      username: request.email.split('@')[0],
      displayName: request.email.split('@')[0].charAt(0).toUpperCase() + request.email.split('@')[0].slice(1),
      role: 'User',
      bio: 'Demo kullanıcı hesabı'
    };

    const mockTokens: AuthTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600
    };

    const response: AuthResponse = {
      success: true,
      data: { user: mockUser, tokens: mockTokens },
      message: 'Giriş başarılı (Demo mod)'
    };

    return of(response).pipe(
      delay(500),
      tap(res => this.setAuth(res.data.user, res.data.tokens))
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.tokens);
        }
      }),
      catchError(() => this.mockRegister(request))
    );
  }

  private mockRegister(request: RegisterRequest): Observable<AuthResponse> {
    // Demo kayıt - girilen bilgilerle kullanıcı oluşturulur
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email: request.email,
      username: request.username,
      displayName: request.displayName,
      role: 'User',
      bio: 'Yeni üye'
    };

    const mockTokens: AuthTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600
    };

    const response: AuthResponse = {
      success: true,
      data: { user: mockUser, tokens: mockTokens },
      message: 'Kayıt başarılı (Demo mod)'
    };

    return of(response).pipe(
      delay(800),
      tap(res => this.setAuth(res.data.user, res.data.tokens))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).pipe(
        catchError(() => of(null))
      ).subscribe();
    }

    this.clearAuth();
    this.router.navigate(['/']);
  }

  refreshTokens(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.success) {
          this.setAuth(response.data.user, response.data.tokens);
        }
      }),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, request).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset-password`, request).pipe(
      catchError(error => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private setAuth(user: User, tokens: AuthTokens): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    
    this._currentUser.set(user);
    this._isAuthenticated.set(true);
  }

  private clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }

  updateCurrentUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
    this._currentUser.set(user);
  }

  hasRole(role: 'User' | 'Moderator' | 'Admin'): boolean {
    const currentRole = this._currentUser()?.role;
    if (!currentRole) return false;
    
    const roleHierarchy: Record<string, number> = {
      'User': 1,
      'Moderator': 2,
      'Admin': 3
    };
    
    return roleHierarchy[currentRole] >= roleHierarchy[role];
  }
}
