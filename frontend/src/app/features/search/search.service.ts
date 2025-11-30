import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SearchType = 'post' | 'question' | 'user' | 'event' | 'tag';

export interface SearchTag {
  id: string;
  name: string;
  slug: string;
}

export interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  slug?: string;
  excerpt?: string;
  avatarUrl?: string;
  author?: SearchAuthor;
  createdAt: string;
  viewCount: number;
  commentCount?: number;
  answerCount?: number;
  isResolved?: boolean;
  hasAcceptedAnswer?: boolean;
  tags?: SearchTag[];
  relevance?: number;
  // Event specific
  eventDate?: string;
  location?: string;
  // User specific
  specializations?: string[];
  // Tag specific
  postCount?: number;
  questionCount?: number;
  followerCount?: number;
}

export interface SearchAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PaginatedSearchResults {
  items: SearchResult[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/search`;

  search(
    query: string,
    type?: string,
    tag?: string,
    page: number = 1,
    pageSize: number = 20
  ): Observable<PaginatedSearchResults> {
    let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (type) params = params.set('type', type);
    if (tag) params = params.set('tag', tag);

    return this.http.get<PaginatedSearchResults>(this.apiUrl, { params }).pipe(
      catchError(() => this.getMockSearchResults(query, type, page, pageSize))
    );
  }

  private getMockSearchResults(query: string, type?: string, page: number = 1, pageSize: number = 20): Observable<PaginatedSearchResults> {
    const queryLower = query.toLowerCase();
    
    let allResults: SearchResult[] = [
      // Posts
      {
        id: '1',
        type: 'post',
        title: 'Angular 21 ile Modern Web Uygulamaları',
        slug: 'angular-21-modern-web',
        excerpt: 'Angular 21\'in yeni özellikleri ve performans iyileştirmeleri hakkında detaylı bir rehber...',
        author: { id: '1', username: 'ahmet_dev', displayName: 'Ahmet Yılmaz' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        viewCount: 1250,
        commentCount: 15,
        tags: [
          { id: '1', name: 'Angular', slug: 'angular' },
          { id: '2', name: 'TypeScript', slug: 'typescript' },
          { id: '3', name: 'Frontend', slug: 'frontend' }
        ],
        relevance: 0.95
      },
      {
        id: '3',
        type: 'post',
        title: '.NET 10 Microservices Best Practices',
        slug: 'dotnet-10-microservices',
        excerpt: '.NET 10 ile microservices mimarisi kurulumu ve best practice\'ler...',
        author: { id: '3', username: 'ayse_arch', displayName: 'Ayşe Demir' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        viewCount: 2100,
        commentCount: 28,
        tags: [
          { id: '4', name: '.NET', slug: 'dotnet' },
          { id: '5', name: 'Microservices', slug: 'microservices' },
          { id: '6', name: 'Docker', slug: 'docker' }
        ],
        relevance: 0.82
      },
      // Questions
      {
        id: '2',
        type: 'question',
        title: 'TypeScript generic constraint nasıl yazılır?',
        slug: 'typescript-generic-constraint',
        excerpt: 'Karmaşık generic tip kısıtlamalarını TypeScript\'te nasıl tanımlarız?',
        author: { id: '2', username: 'mehmet_ts', displayName: 'Mehmet Kaya' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        viewCount: 890,
        answerCount: 5,
        isResolved: true,
        tags: [{ id: '2', name: 'TypeScript', slug: 'typescript' }],
        relevance: 0.88
      },
      {
        id: '5',
        type: 'question',
        title: 'PostgreSQL Full-Text Search performans optimizasyonu',
        slug: 'postgresql-fts-optimization',
        excerpt: 'Büyük veri setlerinde FTS sorguları nasıl optimize edilir?',
        author: { id: '5', username: 'db_expert', displayName: 'Ali Veli' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        viewCount: 567,
        answerCount: 3,
        isResolved: false,
        tags: [
          { id: '7', name: 'PostgreSQL', slug: 'postgresql' },
          { id: '8', name: 'Database', slug: 'database' },
          { id: '9', name: 'Performance', slug: 'performance' }
        ],
        relevance: 0.70
      },
      // Users
      {
        id: '4',
        type: 'user',
        title: 'Can Öztürk',
        slug: 'can_devops',
        excerpt: 'DevOps Engineer | Kubernetes, Docker, CI/CD',
        avatarUrl: undefined,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        viewCount: 0,
        specializations: ['Kubernetes', 'Docker', 'CI/CD', 'AWS'],
        relevance: 0.75
      },
      {
        id: '6',
        type: 'user',
        title: 'Zeynep Aksoy',
        slug: 'zeynep_frontend',
        excerpt: 'Senior Frontend Developer | React, Angular, Vue.js',
        avatarUrl: undefined,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
        viewCount: 0,
        specializations: ['React', 'Angular', 'Vue.js', 'TypeScript'],
        relevance: 0.72
      },
      // Events
      {
        id: '7',
        type: 'event',
        title: 'İstanbul Tech Meetup - AI & ML',
        slug: 'istanbul-tech-meetup-ai-ml',
        excerpt: 'Yapay zeka ve makine öğrenimi konularında güncel gelişmeleri tartışacağımız aylık buluşma.',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        location: 'İstanbul, Kadıköy - Google Campus',
        relevance: 0.68
      },
      {
        id: '8',
        type: 'event',
        title: 'Ankara Cloud Native Days',
        slug: 'ankara-cloud-native-days',
        excerpt: 'Kubernetes, Docker ve cloud native teknolojiler hakkında konuşmacılar ve workshoplar.',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
        location: 'Ankara, Çankaya - METU Teknokent',
        relevance: 0.65
      },
      // Tags
      {
        id: '9',
        type: 'tag',
        title: 'TypeScript',
        slug: 'typescript',
        excerpt: 'JavaScript\'e tip güvenliği ekleyen Microsoft tarafından geliştirilen programlama dili.',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        postCount: 145,
        questionCount: 89,
        followerCount: 1250,
        relevance: 0.90
      },
      {
        id: '10',
        type: 'tag',
        title: 'Angular',
        slug: 'angular',
        excerpt: 'Google tarafından geliştirilen TypeScript tabanlı frontend framework.',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        postCount: 112,
        questionCount: 67,
        followerCount: 980,
        relevance: 0.85
      }
    ];

    // Filter by query
    allResults = allResults.filter(r => 
      r.title.toLowerCase().includes(queryLower) ||
      r.excerpt?.toLowerCase().includes(queryLower) ||
      r.tags?.some(t => t.name.toLowerCase().includes(queryLower)) ||
      r.specializations?.some(s => s.toLowerCase().includes(queryLower))
    );

    // Filter by type
    if (type) {
      allResults = allResults.filter(r => r.type === type);
    }

    // Sort by relevance
    allResults.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    const totalCount = allResults.length;
    const items = allResults.slice((page - 1) * pageSize, page * pageSize);

    return of({
      items,
      pageNumber: page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      hasPreviousPage: page > 1,
      hasNextPage: page * pageSize < totalCount
    }).pipe(delay(300));
  }
}
