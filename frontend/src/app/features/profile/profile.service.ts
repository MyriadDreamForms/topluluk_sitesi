import { Injectable, inject } from '@angular/core';
import { Observable, map, of, delay, catchError, forkJoin } from 'rxjs';
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
    
    // Get actual counts from localStorage
    const counts = this.getActualContentCounts(username);
    
    if (profile) {
      return of({
        ...profile,
        postsCount: counts.posts,
        questionsCount: counts.questions,
        answersCount: counts.answers,
        reputation: 0
      }).pipe(delay(500));
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
      postsCount: counts.posts,
      questionsCount: counts.questions,
      answersCount: counts.answers,
      reputation: 0
    };
    return of(dynamicProfile).pipe(delay(500));
  }

  private getActualContentCounts(username: string): { posts: number; questions: number; answers: number } {
    let posts = 0;
    let questions = 0;
    let answers = 0;

    try {
      // Count posts from localStorage
      const storedPosts = localStorage.getItem('created_posts');
      if (storedPosts) {
        const postsArray = JSON.parse(storedPosts);
        posts = postsArray.filter((p: any) => p.author?.username === username).length;
      }

      // Count questions from localStorage
      const storedQuestions = localStorage.getItem('created_questions');
      if (storedQuestions) {
        const questionsArray = JSON.parse(storedQuestions);
        questions = questionsArray.filter((q: any) => q.author?.username === username).length;
      }

      // Answers would come from a similar storage if implemented
      // For now, keep answers at 0
    } catch {
      // If parsing fails, return 0s
    }

    return { posts, questions, answers };
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
   * Get user's activity by type (posts, questions, answers)
   */
  getUserActivityByType(username: string, type: 'posts' | 'questions' | 'answers', page: number = 1, pageSize: number = 10): Observable<UserActivityResponse> {
    const endpoint = type === 'answers' 
      ? `/api/users/${username}/answers`
      : type === 'questions' 
        ? `/api/questions`
        : `/api/posts`;

    const params: any = { pageNumber: page, pageSize };
    if (type !== 'answers') {
      params.authorUsername = username;
    }

    return this.api.getPaginated<any>(endpoint, params).pipe(
      map(response => {
        const activityType: 'post' | 'question' | 'answer' = type === 'posts' ? 'post' : type === 'questions' ? 'question' : 'answer';
        const items: UserActivity[] = response.data.items.map((item: any) => ({
          id: item.id,
          type: activityType,
          title: item.title,
          slug: item.slug,
          createdAt: item.createdAt,
          excerpt: item.excerpt || item.content?.substring(0, 150) + '...'
        }));
        return {
          items,
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
          totalCount: response.data.totalCount,
          totalPages: response.data.totalPages
        } as UserActivityResponse;
      }),
      catchError(() => this.getMockActivityByType(username, type, page, pageSize))
    );
  }

  private getMockActivityByType(username: string, type: 'posts' | 'questions' | 'answers', page: number, pageSize: number): Observable<UserActivityResponse> {
    // Get from localStorage created_posts for posts
    let items: UserActivity[] = [];
    const activityType: 'post' | 'question' | 'answer' = type === 'posts' ? 'post' : type === 'questions' ? 'question' : 'answer';
    
    if (type === 'posts') {
      // Check localStorage for user-created posts
      try {
        const storedPosts = localStorage.getItem('created_posts');
        if (storedPosts) {
          const posts = JSON.parse(storedPosts);
          items = posts
            .filter((p: any) => p.author?.username === username || username === 'kullanici' || username === 'admin123')
            .map((p: any): UserActivity => ({
              id: p.id,
              type: 'post',
              title: p.title,
              slug: p.slug,
              createdAt: p.createdAt,
              excerpt: p.excerpt || p.content?.substring(0, 150) + '...'
            }));
        }
      } catch { }
      
      // If no posts found, add mock posts for demo
      if (items.length === 0) {
        items = this.mockActivities.filter(a => a.type === 'post');
      }
    } else if (type === 'questions') {
      // Check localStorage for user-created questions
      try {
        const storedQuestions = localStorage.getItem('created_questions');
        if (storedQuestions) {
          const questions = JSON.parse(storedQuestions);
          items = questions
            .filter((q: any) => q.author?.username === username || username === 'kullanici' || username === 'admin123')
            .map((q: any): UserActivity => ({
              id: q.id,
              type: 'question',
              title: q.title,
              slug: q.slug,
              createdAt: q.createdAt,
              excerpt: q.bodyPreview || q.body?.substring(0, 150) + '...'
            }));
        }
      } catch { }
      
      if (items.length === 0) {
        items = this.mockActivities.filter(a => a.type === 'question');
      }
    } else {
      items = this.mockActivities.filter(a => a.type === 'answer');
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = items.slice(start, end);
    
    return of({
      items: paginatedItems,
      pageNumber: page,
      pageSize: pageSize,
      totalCount: items.length,
      totalPages: Math.ceil(items.length / pageSize) || 1
    }).pipe(delay(300));
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
