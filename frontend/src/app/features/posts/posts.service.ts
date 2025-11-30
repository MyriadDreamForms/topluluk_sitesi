import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PostTag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  publishedAt?: string;
  author: PostAuthor;
  tags: PostTag[];
}

export interface PostDetail extends Post {
  content: string;
  updatedAt?: string;
  isAuthor: boolean;
  hasLiked: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: { [key: string]: string[] };
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  tagNames: string[];
  isPublished?: boolean;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
}

export interface PostsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  authorUsername?: string;
  sortBy?: 'latest' | 'popular' | 'trending' | 'oldest';
  isFeatured?: boolean;
}

// Mock data for development
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'TypeScript 5.0 ile Gelen Yenilikler ve Best Practices',
    slug: 'typescript-5-yenilikler',
    excerpt: 'TypeScript 5.0 sürümü ile birlikte gelen dekoratörler, const type parametreleri ve daha birçok yenilik hakkında detaylı rehber.',
    coverImageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    isFeatured: true,
    isPublished: true,
    viewCount: 2456,
    likeCount: 89,
    commentCount: 23,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '1', username: 'ahmetyilmaz', displayName: 'Ahmet Yılmaz', avatarUrl: null },
    tags: [
      { id: '1', name: 'TypeScript', slug: 'typescript' },
      { id: '2', name: 'JavaScript', slug: 'javascript' }
    ]
  },
  {
    id: '2',
    title: 'Angular 21 Standalone Components: Tam Rehber',
    slug: 'angular-21-standalone-components',
    excerpt: 'Angular 21 ile gelen standalone components özelliğini A\'dan Z\'ye öğrenin. NgModule\'lere veda etmenin zamanı geldi!',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    isFeatured: false,
    isPublished: true,
    viewCount: 1834,
    likeCount: 67,
    commentCount: 15,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '2', username: 'mehmetdemir', displayName: 'Mehmet Demir', avatarUrl: null },
    tags: [
      { id: '3', name: 'Angular', slug: 'angular' },
      { id: '1', name: 'TypeScript', slug: 'typescript' }
    ]
  },
  {
    id: '3',
    title: 'Docker ile Microservices Mimarisi Kurulumu',
    slug: 'docker-microservices-mimarisi',
    excerpt: 'Microservices mimarisi nedir ve Docker ile nasıl uygulanır? Pratik örneklerle adım adım öğrenin.',
    coverImageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    isFeatured: true,
    isPublished: true,
    viewCount: 3102,
    likeCount: 124,
    commentCount: 31,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '3', username: 'alikaya', displayName: 'Ali Kaya', avatarUrl: null },
    tags: [
      { id: '4', name: 'Docker', slug: 'docker' },
      { id: '5', name: 'DevOps', slug: 'devops' }
    ]
  },
  {
    id: '4',
    title: 'React vs Angular 2025: Hangisini Seçmeli?',
    slug: 'react-vs-angular-2025',
    excerpt: '2025 yılında React ve Angular arasındaki farklar, avantajlar ve dezavantajlar. Projeniz için doğru seçimi yapın.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    isFeatured: false,
    isPublished: true,
    viewCount: 4521,
    likeCount: 156,
    commentCount: 78,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '4', username: 'zeynepozturk', displayName: 'Zeynep Öztürk', avatarUrl: null },
    tags: [
      { id: '6', name: 'React', slug: 'react' },
      { id: '3', name: 'Angular', slug: 'angular' }
    ]
  },
  {
    id: '5',
    title: 'PostgreSQL Performance Tuning: İleri Seviye Teknikler',
    slug: 'postgresql-performance-tuning',
    excerpt: 'PostgreSQL veritabanınızın performansını artırmak için index optimizasyonu, query tuning ve caching stratejileri.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    isFeatured: false,
    isPublished: true,
    viewCount: 1567,
    likeCount: 45,
    commentCount: 12,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '5', username: 'canersahin', displayName: 'Caner Şahin', avatarUrl: null },
    tags: [
      { id: '7', name: 'PostgreSQL', slug: 'postgresql' },
      { id: '8', name: 'Database', slug: 'database' }
    ]
  },
  {
    id: '6',
    title: 'Node.js ile RESTful API Geliştirme',
    slug: 'nodejs-restful-api',
    excerpt: 'Express.js kullanarak profesyonel bir RESTful API nasıl geliştirilir? Authentication, validation ve error handling.',
    coverImageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    isFeatured: false,
    isPublished: true,
    viewCount: 2234,
    likeCount: 78,
    commentCount: 19,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '1', username: 'ahmetyilmaz', displayName: 'Ahmet Yılmaz', avatarUrl: null },
    tags: [
      { id: '9', name: 'Node.js', slug: 'nodejs' },
      { id: '2', name: 'JavaScript', slug: 'javascript' }
    ]
  },
  {
    id: '7',
    title: 'Kubernetes 101: Başlangıç Rehberi',
    slug: 'kubernetes-baslangic-rehberi',
    excerpt: 'Kubernetes nedir, nasıl çalışır? Pod, Service, Deployment kavramlarını öğrenin ve ilk cluster\'ınızı kurun.',
    coverImageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
    isFeatured: true,
    isPublished: true,
    viewCount: 1890,
    likeCount: 92,
    commentCount: 27,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '3', username: 'alikaya', displayName: 'Ali Kaya', avatarUrl: null },
    tags: [
      { id: '10', name: 'Kubernetes', slug: 'kubernetes' },
      { id: '5', name: 'DevOps', slug: 'devops' }
    ]
  },
  {
    id: '8',
    title: 'Python ile Machine Learning: Scikit-learn Rehberi',
    slug: 'python-machine-learning-scikit-learn',
    excerpt: 'Scikit-learn kütüphanesi ile temel machine learning algoritmalarını öğrenin ve gerçek dünya problemlerini çözün.',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
    isFeatured: false,
    isPublished: true,
    viewCount: 2678,
    likeCount: 103,
    commentCount: 34,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '6', username: 'elozencan', displayName: 'Elif Özcan', avatarUrl: null },
    tags: [
      { id: '11', name: 'Python', slug: 'python' },
      { id: '12', name: 'Machine Learning', slug: 'machine-learning' }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/posts`;
  private readonly CREATED_POSTS_KEY = 'created_posts';

  // Get user-created posts from localStorage
  private getCreatedPosts(): PostDetail[] {
    try {
      const stored = localStorage.getItem(this.CREATED_POSTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save created post to localStorage
  private saveCreatedPost(post: PostDetail): void {
    const posts = this.getCreatedPosts();
    // Add or update post
    const existingIndex = posts.findIndex(p => p.id === post.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem(this.CREATED_POSTS_KEY, JSON.stringify(posts));
  }

  getPosts(params: PostsQueryParams = {}): Observable<PaginatedResponse<Post>> {
    let httpParams = new HttpParams();

    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.tag) {
      httpParams = httpParams.set('tag', params.tag);
    }
    if (params.authorUsername) {
      httpParams = httpParams.set('authorUsername', params.authorUsername);
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.isFeatured !== undefined) {
      httpParams = httpParams.set('isFeatured', params.isFeatured.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Post>>>(this.baseUrl, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(() => this.getMockPosts(params))
      );
  }

  private getMockPosts(params: PostsQueryParams): Observable<PaginatedResponse<Post>> {
    // Combine user-created posts with mock posts
    const createdPosts = this.getCreatedPosts().filter(p => p.isPublished);
    let filtered = [...createdPosts, ...MOCK_POSTS];

    // Search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) || 
        p.excerpt.toLowerCase().includes(search)
      );
    }

    // Tag filter
    if (params.tag) {
      filtered = filtered.filter(p => 
        p.tags.some(t => t.slug === params.tag || t.name.toLowerCase() === params.tag?.toLowerCase())
      );
    }

    // Featured filter
    if (params.isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === params.isFeatured);
    }

    // Sort
    switch (params.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'trending':
        filtered.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default: // latest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 12;
    const startIndex = (pageNumber - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return of({
      items: paginatedItems,
      pageNumber,
      pageSize,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
      hasNextPage: startIndex + pageSize < filtered.length,
      hasPreviousPage: pageNumber > 1
    }).pipe(delay(300));
  }

  getPostBySlug(slug: string): Observable<PostDetail> {
    return this.http.get<ApiResponse<PostDetail>>(`${this.baseUrl}/${slug}`)
      .pipe(
        map(response => response.data),
        catchError(() => {
          // First check user-created posts in localStorage
          const createdPosts = this.getCreatedPosts();
          const createdPost = createdPosts.find(p => p.slug === slug);
          if (createdPost) {
            return of(createdPost).pipe(delay(300));
          }

          // Then check mock posts
          const post = MOCK_POSTS.find(p => p.slug === slug);
          if (post) {
            return of({
              ...post,
              content: `# ${post.title}\n\n${post.excerpt}\n\nBu yazının tam içeriği burada görüntülenecek. Backend aktif olduğunda gerçek içerik yüklenecektir.\n\n## Alt Başlık\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n\`\`\`typescript\nconst example = 'code';\nconsole.log(example);\n\`\`\`\n\n## Sonuç\n\nBu yazıda konuyu detaylı olarak inceledik.`,
              isAuthor: false,
              hasLiked: false
            } as PostDetail).pipe(delay(300));
          }
          throw new Error('Post not found');
        })
      );
  }

  createPost(request: CreatePostRequest): Observable<PostDetail> {
    return this.http.post<ApiResponse<PostDetail>>(this.baseUrl, request)
      .pipe(
        map(response => response.data),
        catchError(() => this.mockCreatePost(request))
      );
  }

  private mockCreatePost(request: CreatePostRequest): Observable<PostDetail> {
    const slug = request.title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .substring(0, 100) + '-' + Date.now();

    const currentUser = this.authService.currentUser();

    const mockPost: PostDetail = {
      id: 'mock-' + Date.now(),
      title: request.title,
      slug: slug,
      content: request.content,
      excerpt: request.excerpt || request.content.substring(0, 200) + '...',
      coverImageUrl: request.coverImageUrl,
      isFeatured: false,
      isPublished: request.isPublished ?? false,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      publishedAt: request.isPublished ? new Date().toISOString() : undefined,
      author: {
        id: currentUser?.id || 'current-user',
        username: currentUser?.username || 'kullanici',
        displayName: currentUser?.displayName || 'Demo Kullanıcı',
        avatarUrl: currentUser?.avatarUrl || null
      },
      tags: request.tagNames.map((name, i) => ({
        id: `tag-${i}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      })),
      isAuthor: true,
      hasLiked: false
    };

    // Save to localStorage for persistence
    this.saveCreatedPost(mockPost);

    return of(mockPost).pipe(delay(800));
  }

  updatePost(id: string, request: UpdatePostRequest): Observable<PostDetail> {
    return this.http.put<ApiResponse<PostDetail>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        map(response => response.data),
        catchError(() => this.mockUpdatePost(id, request))
      );
  }

  private mockUpdatePost(id: string, request: UpdatePostRequest): Observable<PostDetail> {
    const existingPost = MOCK_POSTS.find(p => p.id === id);
    const createdPosts = this.getCreatedPosts();
    const createdPost = createdPosts.find(p => p.id === id);
    
    const mockPost: PostDetail = {
      id: id,
      title: request.title,
      slug: createdPost?.slug || existingPost?.slug || id,
      content: request.content,
      excerpt: request.excerpt || request.content.substring(0, 200) + '...',
      coverImageUrl: request.coverImageUrl,
      isFeatured: existingPost?.isFeatured || false,
      isPublished: request.isPublished ?? false,
      viewCount: createdPost?.viewCount || existingPost?.viewCount || 0,
      likeCount: createdPost?.likeCount || existingPost?.likeCount || 0,
      commentCount: createdPost?.commentCount || existingPost?.commentCount || 0,
      createdAt: createdPost?.createdAt || existingPost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: request.isPublished ? new Date().toISOString() : undefined,
      author: createdPost?.author || existingPost?.author || {
        id: 'current-user',
        username: 'kullanici',
        displayName: 'Demo Kullanıcı',
        avatarUrl: null
      },
      tags: request.tagNames.map((name, i) => ({
        id: `tag-${i}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      })),
      isAuthor: true,
      hasLiked: false
    };

    // Save to localStorage for persistence
    this.saveCreatedPost(mockPost);

    return of(mockPost).pipe(delay(600));
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getMyPosts(params: PostsQueryParams = {}): Observable<PaginatedResponse<Post>> {
    let httpParams = new HttpParams();

    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Post>>>(`${this.baseUrl}/my`, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(() => this.getMockPosts(params))
      );
  }

  getFeaturedPosts(limit: number = 5): Observable<Post[]> {
    const params = new HttpParams()
      .set('isFeatured', 'true')
      .set('pageSize', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Post>>>(this.baseUrl, { params })
      .pipe(
        map(response => response.data.items),
        catchError(() => of(MOCK_POSTS.filter(p => p.isFeatured).slice(0, limit)).pipe(delay(300)))
      );
  }

  getRecentPosts(limit: number = 10): Observable<Post[]> {
    const params = new HttpParams()
      .set('sortBy', 'latest')
      .set('pageSize', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Post>>>(this.baseUrl, { params })
      .pipe(
        map(response => response.data.items),
        catchError(() => of(MOCK_POSTS.slice(0, limit)).pipe(delay(300)))
      );
  }
}
