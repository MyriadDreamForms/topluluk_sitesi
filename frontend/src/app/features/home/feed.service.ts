import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, delay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeedItem {
  id: string;
  type: 'post' | 'question';
  title: string;
  slug: string;
  excerpt?: string;
  author: FeedAuthor;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  tags: FeedTag[];
}

export interface FeedAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface FeedTag {
  name: string;
  slug: string;
}

export interface PaginatedFeed {
  items: FeedItem[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PopularTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  questionCount: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/feed`;
  private readonly tagsApiUrl = `${environment.apiUrl}/tags`;

  getFeed(sort: string = 'latest', page: number = 1, pageSize: number = 20): Observable<PaginatedFeed> {
    const params = new HttpParams()
      .set('sort', sort)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedFeed>(this.apiUrl, { params }).pipe(
      catchError(() => this.getMockFeed(sort, page, pageSize))
    );
  }

  getPopularTags(limit: number = 10): Observable<PopularTag[]> {
    const params = new HttpParams()
      .set('popular', 'true')
      .set('limit', limit.toString());

    return this.http.get<PopularTag[]>(this.tagsApiUrl, { params }).pipe(
      catchError(() => this.getMockPopularTags())
    );
  }

  private getMockFeed(sort: string, page: number, pageSize: number): Observable<PaginatedFeed> {
    const allItems: FeedItem[] = [
      {
        id: '1',
        type: 'post',
        title: 'Angular 21 ile Modern Web Uygulamaları Geliştirme',
        slug: 'angular-21-modern-web',
        excerpt: 'Angular 21\'in sunduğu yeni özellikler ve performans iyileştirmeleri hakkında kapsamlı bir rehber...',
        author: { id: '1', username: 'ahmet_dev', displayName: 'Ahmet Yılmaz', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        viewCount: 1250,
        commentCount: 15,
        answerCount: 0,
        hasAcceptedAnswer: false,
        tags: [{ name: 'Angular', slug: 'angular' }, { name: 'TypeScript', slug: 'typescript' }]
      },
      {
        id: '2',
        type: 'question',
        title: 'PostgreSQL\'de Full-Text Search nasıl optimize edilir?',
        slug: 'postgresql-full-text-search-optimization',
        excerpt: 'Büyük veri setlerinde FTS performansını artırmak için hangi yöntemleri kullanabiliriz?',
        author: { id: '2', username: 'mehmet_db', displayName: 'Mehmet Kaya', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        viewCount: 890,
        commentCount: 0,
        answerCount: 7,
        hasAcceptedAnswer: true,
        tags: [{ name: 'PostgreSQL', slug: 'postgresql' }, { name: 'Database', slug: 'database' }]
      },
      {
        id: '3',
        type: 'post',
        title: '.NET 10 ile Microservices Mimarisi',
        slug: 'dotnet-10-microservices',
        excerpt: '.NET 10\'un microservices için sunduğu yeni araçlar ve best practice\'ler...',
        author: { id: '3', username: 'ayse_arch', displayName: 'Ayşe Demir', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        viewCount: 2100,
        commentCount: 28,
        answerCount: 0,
        hasAcceptedAnswer: false,
        tags: [{ name: '.NET', slug: 'dotnet' }, { name: 'Microservices', slug: 'microservices' }]
      },
      {
        id: '4',
        type: 'question',
        title: 'Docker container\'lar arası iletişim nasıl kurulur?',
        slug: 'docker-container-iletisim',
        excerpt: 'Birden fazla container\'ın birbirleriyle güvenli şekilde haberleşmesi için...',
        author: { id: '4', username: 'can_devops', displayName: 'Can Öztürk', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        viewCount: 567,
        commentCount: 0,
        answerCount: 4,
        hasAcceptedAnswer: false,
        tags: [{ name: 'Docker', slug: 'docker' }, { name: 'DevOps', slug: 'devops' }]
      },
      {
        id: '5',
        type: 'post',
        title: 'React vs Angular 2025: Hangisini Seçmeli?',
        slug: 'react-vs-angular-2025',
        excerpt: '2025 yılında frontend framework seçimi yaparken dikkat edilmesi gereken faktörler...',
        author: { id: '5', username: 'zeynep_fe', displayName: 'Zeynep Aksoy', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        viewCount: 3450,
        commentCount: 52,
        answerCount: 0,
        hasAcceptedAnswer: false,
        tags: [{ name: 'React', slug: 'react' }, { name: 'Angular', slug: 'angular' }, { name: 'Frontend', slug: 'frontend' }]
      },
      {
        id: '6',
        type: 'question',
        title: 'TypeScript generic constraint nasıl yazılır?',
        slug: 'typescript-generic-constraint',
        excerpt: 'Karmaşık generic tip kısıtlamalarını TypeScript\'te nasıl tanımlarız?',
        author: { id: '1', username: 'ahmet_dev', displayName: 'Ahmet Yılmaz', avatarUrl: undefined },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        viewCount: 423,
        commentCount: 0,
        answerCount: 3,
        hasAcceptedAnswer: true,
        tags: [{ name: 'TypeScript', slug: 'typescript' }]
      }
    ];

    let sorted: FeedItem[];
    if (sort === 'popular') {
      sorted = [...allItems].sort((a, b) => b.viewCount - a.viewCount);
    } else if (sort === 'trending') {
      sorted = [...allItems].filter(i => {
        const hours = (Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60);
        return hours < 168;
      }).sort((a, b) => b.viewCount - a.viewCount);
    } else {
      sorted = [...allItems].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return of({
      items,
      pageNumber: page,
      pageSize,
      totalCount: sorted.length,
      totalPages: Math.ceil(sorted.length / pageSize),
      hasPreviousPage: page > 1,
      hasNextPage: page * pageSize < sorted.length
    }).pipe(delay(300));
  }

  private getMockPopularTags(): Observable<PopularTag[]> {
    return of([
      { id: '1', name: 'JavaScript', slug: 'javascript', description: 'JavaScript programlama dili', postCount: 156, questionCount: 89, totalCount: 245 },
      { id: '2', name: 'TypeScript', slug: 'typescript', description: 'TypeScript programlama dili', postCount: 124, questionCount: 67, totalCount: 191 },
      { id: '3', name: 'Angular', slug: 'angular', description: 'Angular framework', postCount: 98, questionCount: 54, totalCount: 152 },
      { id: '4', name: '.NET', slug: 'dotnet', description: '.NET framework', postCount: 87, questionCount: 48, totalCount: 135 },
      { id: '5', name: 'React', slug: 'react', description: 'React library', postCount: 112, questionCount: 71, totalCount: 183 },
      { id: '6', name: 'Docker', slug: 'docker', description: 'Docker containerization', postCount: 65, questionCount: 42, totalCount: 107 },
      { id: '7', name: 'PostgreSQL', slug: 'postgresql', description: 'PostgreSQL veritabanı', postCount: 45, questionCount: 38, totalCount: 83 },
      { id: '8', name: 'Node.js', slug: 'nodejs', description: 'Node.js runtime', postCount: 78, questionCount: 52, totalCount: 130 },
      { id: '9', name: 'Python', slug: 'python', description: 'Python programlama dili', postCount: 92, questionCount: 61, totalCount: 153 },
      { id: '10', name: 'DevOps', slug: 'devops', description: 'DevOps pratikleri', postCount: 54, questionCount: 32, totalCount: 86 }
    ]).pipe(delay(200));
  }
}
