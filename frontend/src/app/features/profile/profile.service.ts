import { Injectable, inject } from '@angular/core';
import { Observable, map, of, delay, catchError } from 'rxjs';
import { ApiService, ApiResponse } from '../../core/services/api.service';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email?: string; // Only visible to profile owner
  bio?: string;
  avatarUrl?: string;
  role: 'User' | 'Moderator' | 'Admin';
  createdAt: string;
  location?: string;
  website?: string;
  githubUsername?: string;
  twitterUsername?: string;
  linkedInUrl?: string;
  
  // Stats
  postsCount: number;
  questionsCount: number;
  answersCount: number;
  reputation: number;
}

export interface UpdateProfileRequest {
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUsername?: string;
  twitterUsername?: string;
  linkedInUrl?: string;
}

export interface UserActivity {
  id: string;
  type: 'post' | 'question' | 'answer' | 'comment';
  title: string;
  slug: string;
  createdAt: string;
  excerpt?: string;
}

export interface UserActivityResponse {
  items: UserActivity[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly api = inject(ApiService);

  private readonly mockProfiles: UserProfile[] = [
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
    }
  ];

  private readonly mockActivities: UserActivity[] = [
    {
      id: '1',
      type: 'post',
      title: 'React 19 ile Gelen Yeni Özellikler',
      slug: 'react-19-ile-gelen-yeni-ozellikler',
      createdAt: '2024-11-28T10:00:00Z',
      excerpt: 'React 19 ile birlikte gelen Server Components, Actions ve diğer yenilikler...'
    },
    {
      id: '2',
      type: 'question',
      title: 'Next.js 14 App Router ile API Routes nasıl kullanılır?',
      slug: 'nextjs-14-app-router-api-routes',
      createdAt: '2024-11-25T15:30:00Z',
      excerpt: 'App Router ile API endpoints oluşturmak istiyorum ama...'
    },
    {
      id: '3',
      type: 'answer',
      title: 'TypeScript Generic Types kullanımı',
      slug: 'typescript-generic-types',
      createdAt: '2024-11-22T08:45:00Z',
      excerpt: 'Generic types ile daha tip-güvenli kod yazabilirsiniz...'
    },
    {
      id: '4',
      type: 'post',
      title: 'Docker ile Microservices Mimarisi',
      slug: 'docker-microservices-mimarisi',
      createdAt: '2024-11-20T12:00:00Z',
      excerpt: 'Mikroservis mimarisinde Docker kullanımının avantajları...'
    },
    {
      id: '5',
      type: 'question',
      title: 'PostgreSQL vs MongoDB: Hangisi ne zaman kullanılmalı?',
      slug: 'postgresql-vs-mongodb',
      createdAt: '2024-11-18T09:15:00Z',
      excerpt: 'Proje gereksinimlerine göre veritabanı seçimi...'
    }
  ];

  /**
   * Get current user's profile (requires authentication)
   */
  getCurrentProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/api/users/me').pipe(
      map(response => response.data),
      catchError(() => {
        // Return first mock profile as current user
        return of(this.mockProfiles[0]).pipe(delay(500));
      })
    );
  }

  /**
   * Get public profile by username
   */
  getProfileByUsername(username: string): Observable<UserProfile> {
    return this.api.get<UserProfile>(`/api/users/${username}`).pipe(
      map(response => response.data),
      catchError(() => this.getMockProfile(username))
    );
  }

  private getMockProfile(username: string): Observable<UserProfile> {
    const profile = this.mockProfiles.find(p => p.username.toLowerCase() === username.toLowerCase());
    if (profile) {
      return of(profile).pipe(delay(500));
    }
    // Generate a dynamic mock profile for any username
    const dynamicProfile: UserProfile = {
      id: 'dynamic-' + username,
      username: username,
      displayName: username.charAt(0).toUpperCase() + username.slice(1).replace(/[._-]/g, ' '),
      bio: 'Teknoloji meraklısı developer',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      role: 'User',
      createdAt: '2024-06-01T10:00:00Z',
      location: 'Türkiye',
      postsCount: Math.floor(Math.random() * 20),
      questionsCount: Math.floor(Math.random() * 15),
      answersCount: Math.floor(Math.random() * 30),
      reputation: Math.floor(Math.random() * 500) + 100
    };
    return of(dynamicProfile).pipe(delay(500));
  }

  /**
   * Update current user's profile
   */
  updateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    return this.api.put<UserProfile>('/api/users/profile', data).pipe(
      map(response => response.data),
      catchError(() => this.mockUpdateProfile(data))
    );
  }

  private mockUpdateProfile(data: UpdateProfileRequest): Observable<UserProfile> {
    const currentProfile = this.mockProfiles[0];
    const updatedProfile: UserProfile = {
      ...currentProfile,
      displayName: data.displayName,
      bio: data.bio,
      location: data.location,
      website: data.website,
      githubUsername: data.githubUsername,
      twitterUsername: data.twitterUsername,
      linkedInUrl: data.linkedInUrl
    };
    return of(updatedProfile).pipe(delay(800));
  }

  /**
   * Upload avatar image
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Using raw HttpClient for multipart form data
    return this.api.post<{ avatarUrl: string }>('/api/users/avatar', formData).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get user's activity (posts, questions, answers)
   */
  getUserActivity(username: string, page: number = 1, pageSize: number = 10): Observable<UserActivityResponse> {
    return this.api.getPaginated<UserActivity>(`/api/users/${username}/activity`, {
      pageNumber: page,
      pageSize
    }).pipe(
      map(response => response.data),
      catchError(() => this.getMockActivity(page, pageSize))
    );
  }

  private getMockActivity(page: number, pageSize: number): Observable<UserActivityResponse> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = this.mockActivities.slice(start, end);
    
    return of({
      items: paginatedItems,
      pageNumber: page,
      pageSize: pageSize,
      totalCount: this.mockActivities.length,
      totalPages: Math.ceil(this.mockActivities.length / pageSize)
    }).pipe(delay(400));
  }

  /**
   * Get user's posts
   */
  getUserPosts(username: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.api.getPaginated<any>(`/api/posts`, {
      authorUsername: username,
      pageNumber: page,
      pageSize
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get user's questions
   */
  getUserQuestions(username: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.api.getPaginated<any>(`/api/questions`, {
      authorUsername: username,
      pageNumber: page,
      pageSize
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get user's answers
   */
  getUserAnswers(username: string, page: number = 1, pageSize: number = 10): Observable<any> {
    return this.api.getPaginated<any>(`/api/users/${username}/answers`, {
      pageNumber: page,
      pageSize
    }).pipe(
      map(response => response.data)
    );
  }
}
