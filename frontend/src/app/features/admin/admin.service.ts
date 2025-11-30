import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AdminUserDto {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'User' | 'Moderator' | 'Admin';
  isActive: boolean;
  isBanned: boolean;
  bannedUntil?: string;
  banReason?: string;
  postCount: number;
  questionCount: number;
  answerCount: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface ContentModerationDto {
  id: string;
  contentType: 'Post' | 'Question' | 'Answer' | 'Comment';
  title: string;
  excerpt?: string;
  authorUsername: string;
  authorDisplayName: string;
  isHidden: boolean;
  hiddenReason?: string;
  createdAt: string;
  reportCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalPosts: number;
  totalQuestions: number;
  totalAnswers: number;
  totalComments: number;
  hiddenContent: number;
  recentRegistrations: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  // Mock Data
  private readonly mockUsers: AdminUserDto[] = [
    {
      id: '1',
      username: 'ahmetyilmaz',
      email: 'ahmet@example.com',
      displayName: 'Ahmet Yılmaz',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet',
      role: 'Admin',
      isActive: true,
      isBanned: false,
      postCount: 25,
      questionCount: 10,
      answerCount: 45,
      createdAt: '2024-01-15T10:00:00Z',
      lastLoginAt: '2024-12-20T09:30:00Z'
    },
    {
      id: '2',
      username: 'mehmetcan',
      email: 'mehmet@example.com',
      displayName: 'Mehmet Can Öztürk',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet',
      role: 'Moderator',
      isActive: true,
      isBanned: false,
      postCount: 12,
      questionCount: 8,
      answerCount: 30,
      createdAt: '2024-02-20T14:00:00Z',
      lastLoginAt: '2024-12-19T16:45:00Z'
    },
    {
      id: '3',
      username: 'aysekaya',
      email: 'ayse@example.com',
      displayName: 'Ayşe Kaya',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ayse',
      role: 'User',
      isActive: true,
      isBanned: false,
      postCount: 5,
      questionCount: 15,
      answerCount: 20,
      createdAt: '2024-03-10T09:00:00Z',
      lastLoginAt: '2024-12-18T11:20:00Z'
    },
    {
      id: '4',
      username: 'fatihdemir',
      email: 'fatih@example.com',
      displayName: 'Fatih Demir',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatih',
      role: 'User',
      isActive: true,
      isBanned: true,
      banReason: 'Spam içerik paylaşımı',
      bannedUntil: '2025-01-15T00:00:00Z',
      postCount: 2,
      questionCount: 1,
      answerCount: 3,
      createdAt: '2024-05-05T12:00:00Z',
      lastLoginAt: '2024-12-01T08:00:00Z'
    },
    {
      id: '5',
      username: 'zeynepak',
      email: 'zeynep@example.com',
      displayName: 'Zeynep Ak',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep',
      role: 'User',
      isActive: true,
      isBanned: false,
      postCount: 8,
      questionCount: 12,
      answerCount: 25,
      createdAt: '2024-04-15T10:30:00Z',
      lastLoginAt: '2024-12-20T14:00:00Z'
    },
    {
      id: '6',
      username: 'canozturk',
      email: 'can@example.com',
      displayName: 'Can Öztürk',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=can',
      role: 'Moderator',
      isActive: true,
      isBanned: false,
      postCount: 18,
      questionCount: 5,
      answerCount: 40,
      createdAt: '2024-02-28T15:00:00Z',
      lastLoginAt: '2024-12-20T10:15:00Z'
    }
  ];

  private readonly mockContent: ContentModerationDto[] = [
    {
      id: '1',
      contentType: 'Post',
      title: 'React 18 Yeni Özellikler',
      excerpt: 'React 18 ile gelen yeni özellikler ve concurrent rendering...',
      authorUsername: 'ahmetyilmaz',
      authorDisplayName: 'Ahmet Yılmaz',
      isHidden: false,
      createdAt: '2024-12-15T10:00:00Z',
      reportCount: 0
    },
    {
      id: '2',
      contentType: 'Question',
      title: 'TypeScript generic type inference problemi',
      excerpt: 'Generic tip çıkarımında yaşadığım sorun...',
      authorUsername: 'aysekaya',
      authorDisplayName: 'Ayşe Kaya',
      isHidden: false,
      createdAt: '2024-12-14T14:30:00Z',
      reportCount: 0
    },
    {
      id: '3',
      contentType: 'Post',
      title: '[Spam] Ücretsiz iPhone Kazanın!',
      excerpt: 'Bu linke tıklayarak ücretsiz iPhone kazanabilirsiniz...',
      authorUsername: 'fatihdemir',
      authorDisplayName: 'Fatih Demir',
      isHidden: true,
      hiddenReason: 'Spam/Reklam içeriği',
      createdAt: '2024-12-10T08:00:00Z',
      reportCount: 5
    },
    {
      id: '4',
      contentType: 'Comment',
      title: 'Yorum: "Bu çözüm yanlış..."',
      excerpt: 'Bu çözüm kesinlikle yanlış, siz hiç programlama bilmiyorsunuz...',
      authorUsername: 'fatihdemir',
      authorDisplayName: 'Fatih Demir',
      isHidden: true,
      hiddenReason: 'Hakaret içeren yorum',
      createdAt: '2024-12-08T16:00:00Z',
      reportCount: 3
    },
    {
      id: '5',
      contentType: 'Answer',
      title: 'Cevap: "async/await kullanımı..."',
      excerpt: 'async/await ile bu işlemi şu şekilde yapabilirsiniz...',
      authorUsername: 'mehmetcan',
      authorDisplayName: 'Mehmet Can Öztürk',
      isHidden: false,
      createdAt: '2024-12-13T11:00:00Z',
      reportCount: 0
    },
    {
      id: '6',
      contentType: 'Question',
      title: 'Docker container network sorunu',
      excerpt: 'Container arası iletişimde yaşadığım problem...',
      authorUsername: 'zeynepak',
      authorDisplayName: 'Zeynep Ak',
      isHidden: false,
      createdAt: '2024-12-12T09:30:00Z',
      reportCount: 0
    },
    {
      id: '7',
      contentType: 'Post',
      title: 'Kubernetes Production Best Practices',
      excerpt: 'Production ortamında Kubernetes kullanırken dikkat edilmesi gerekenler...',
      authorUsername: 'canozturk',
      authorDisplayName: 'Can Öztürk',
      isHidden: false,
      createdAt: '2024-12-11T13:00:00Z',
      reportCount: 0
    }
  ];

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`).pipe(
      catchError(() =>
        of({
          totalUsers: this.mockUsers.length,
          activeUsers: this.mockUsers.filter(u => u.isActive && !u.isBanned).length,
          bannedUsers: this.mockUsers.filter(u => u.isBanned).length,
          totalPosts: this.mockContent.filter(c => c.contentType === 'Post').length,
          totalQuestions: this.mockContent.filter(c => c.contentType === 'Question').length,
          totalAnswers: this.mockContent.filter(c => c.contentType === 'Answer').length,
          totalComments: this.mockContent.filter(c => c.contentType === 'Comment').length,
          hiddenContent: this.mockContent.filter(c => c.isHidden).length,
          recentRegistrations: 3
        }).pipe(delay(300))
      )
    );
  }

  // Users
  getUsers(params?: {
    page?: number;
    pageSize?: number;
    role?: string;
    isBanned?: boolean;
    search?: string;
  }): Observable<PaginatedResult<AdminUserDto>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.isBanned !== undefined) httpParams = httpParams.set('isBanned', params.isBanned.toString());
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResult<AdminUserDto>>(`${this.apiUrl}/users`, { params: httpParams }).pipe(
      catchError(() => {
        let filteredUsers = [...this.mockUsers];

        if (params?.role) {
          filteredUsers = filteredUsers.filter(u => u.role === params.role);
        }
        if (params?.isBanned !== undefined) {
          filteredUsers = filteredUsers.filter(u => u.isBanned === params.isBanned);
        }
        if (params?.search) {
          const search = params.search.toLowerCase();
          filteredUsers = filteredUsers.filter(
            u =>
              u.username.toLowerCase().includes(search) ||
              u.email.toLowerCase().includes(search) ||
              (u.displayName?.toLowerCase().includes(search) ?? false)
          );
        }

        return of({
          items: filteredUsers,
          pageNumber: params?.page ?? 1,
          totalPages: 1,
          totalCount: filteredUsers.length,
          hasPreviousPage: false,
          hasNextPage: false
        }).pipe(delay(300));
      })
    );
  }

  updateUserRole(userId: string, role: 'User' | 'Moderator' | 'Admin'): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/role`, { role }).pipe(
      catchError(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
          user.role = role;
        }
        return of(undefined).pipe(delay(300));
      })
    );
  }

  banUser(userId: string, reason: string, bannedUntil?: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/ban`, { reason, bannedUntil }).pipe(
      catchError(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
          user.isBanned = true;
          user.banReason = reason;
          user.bannedUntil = bannedUntil;
        }
        return of(undefined).pipe(delay(300));
      })
    );
  }

  unbanUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/ban`).pipe(
      catchError(() => {
        const user = this.mockUsers.find(u => u.id === userId);
        if (user) {
          user.isBanned = false;
          user.banReason = undefined;
          user.bannedUntil = undefined;
        }
        return of(undefined).pipe(delay(300));
      })
    );
  }

  // Content Moderation
  getContent(params?: {
    page?: number;
    pageSize?: number;
    contentType?: string;
    isHidden?: boolean;
    hasReports?: boolean;
  }): Observable<PaginatedResult<ContentModerationDto>> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params?.contentType) httpParams = httpParams.set('contentType', params.contentType);
    if (params?.isHidden !== undefined) httpParams = httpParams.set('isHidden', params.isHidden.toString());
    if (params?.hasReports !== undefined) httpParams = httpParams.set('hasReports', params.hasReports.toString());

    return this.http.get<PaginatedResult<ContentModerationDto>>(`${this.apiUrl}/content`, { params: httpParams }).pipe(
      catchError(() => {
        let filteredContent = [...this.mockContent];

        if (params?.contentType) {
          filteredContent = filteredContent.filter(c => c.contentType === params.contentType);
        }
        if (params?.isHidden !== undefined) {
          filteredContent = filteredContent.filter(c => c.isHidden === params.isHidden);
        }
        if (params?.hasReports) {
          filteredContent = filteredContent.filter(c => c.reportCount > 0);
        }

        return of({
          items: filteredContent,
          pageNumber: params?.page ?? 1,
          totalPages: 1,
          totalCount: filteredContent.length,
          hasPreviousPage: false,
          hasNextPage: false
        }).pipe(delay(300));
      })
    );
  }

  hideContent(contentType: string, contentId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/content/hide`, { contentType, contentId, reason }).pipe(
      catchError(() => {
        const content = this.mockContent.find(c => c.id === contentId && c.contentType === contentType);
        if (content) {
          content.isHidden = true;
          content.hiddenReason = reason;
        }
        return of(undefined).pipe(delay(300));
      })
    );
  }

  unhideContent(contentType: string, contentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/content/${contentType}/${contentId}/hide`).pipe(
      catchError(() => {
        const content = this.mockContent.find(c => c.id === contentId && c.contentType === contentType);
        if (content) {
          content.isHidden = false;
          content.hiddenReason = undefined;
        }
        return of(undefined).pipe(delay(300));
      })
    );
  }
}
