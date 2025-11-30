import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface QuestionAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface QuestionTag {
  id: string;
  name: string;
  slug: string;
}

export interface Question {
  id: string;
  title: string;
  slug: string;
  bodyPreview: string;
  viewCount: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  author: QuestionAuthor;
  tags: QuestionTag[];
}

export interface QuestionDetail extends Question {
  body: string;
  bodyHtml?: string;
  acceptedAnswerId?: string;
  updatedAt?: string;
  isAuthor: boolean;
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

export interface CreateQuestionRequest {
  title: string;
  body: string;
  tagNames: string[];
}

export interface UpdateQuestionRequest {
  id: string;
  title: string;
  body: string;
  tagNames: string[];
}

export interface QuestionsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  authorUsername?: string;
  sortBy?: 'latest' | 'popular' | 'unanswered' | 'oldest';
  hasAcceptedAnswer?: boolean;
}

// Mock data for development
const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'TypeScript generics ile dynamic type inference nasıl yapılır?',
    slug: 'typescript-generics-dynamic-type-inference',
    bodyPreview: 'Bir fonksiyon yazıyorum ve generic parametrelerin runtime\'da belirlenmesini istiyorum. Conditional types kullanarak nasıl yapabilirim?',
    viewCount: 342,
    answerCount: 4,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: { id: '1', username: 'burakdev', displayName: 'Burak Özdemir', avatarUrl: null },
    tags: [
      { id: '1', name: 'TypeScript', slug: 'typescript' },
      { id: '2', name: 'Generics', slug: 'generics' }
    ]
  },
  {
    id: '2',
    title: 'Angular signals vs RxJS: Hangisini ne zaman kullanmalı?',
    slug: 'angular-signals-vs-rxjs',
    bodyPreview: 'Angular 21 ile birlikte signals geldi. Mevcut projemde RxJS kullanıyorum. Signals\'a geçmeli miyim yoksa ikisini birlikte mi kullanmalıyım?',
    viewCount: 567,
    answerCount: 7,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: { id: '2', username: 'selin_k', displayName: 'Selin Koç', avatarUrl: null },
    tags: [
      { id: '3', name: 'Angular', slug: 'angular' },
      { id: '4', name: 'RxJS', slug: 'rxjs' }
    ]
  },
  {
    id: '3',
    title: 'Docker container memory leak tespit etme yöntemleri',
    slug: 'docker-container-memory-leak',
    bodyPreview: 'Prod ortamındaki Docker containerlarımda memory sürekli artıyor ve bir süre sonra OOM killer devreye giriyor. Nasıl tespit edebilirim?',
    viewCount: 234,
    answerCount: 3,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    author: { id: '3', username: 'emre_ops', displayName: 'Emre Yıldırım', avatarUrl: null },
    tags: [
      { id: '5', name: 'Docker', slug: 'docker' },
      { id: '6', name: 'DevOps', slug: 'devops' }
    ]
  },
  {
    id: '4',
    title: 'React useEffect cleanup function çalışmıyor',
    slug: 'react-useeffect-cleanup',
    bodyPreview: 'WebSocket bağlantısını useEffect içinde açıyorum ama cleanup function\'da kapatma işlemi düzgün çalışmıyor. Component unmount olduğunda bağlantı açık kalıyor.',
    viewCount: 189,
    answerCount: 5,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    author: { id: '4', username: 'ayse_dev', displayName: 'Ayşe Çelik', avatarUrl: null },
    tags: [
      { id: '7', name: 'React', slug: 'react' },
      { id: '8', name: 'Hooks', slug: 'hooks' }
    ]
  },
  {
    id: '5',
    title: 'PostgreSQL JSONB index performans sorunu',
    slug: 'postgresql-jsonb-index-performans',
    bodyPreview: 'JSONB kolonundaki nested field\'a GIN index ekledim ama query hala seq scan yapıyor. EXPLAIN ANALYZE sonucunu paylaşıyorum...',
    viewCount: 456,
    answerCount: 2,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '5', username: 'murat_dba', displayName: 'Murat Aydın', avatarUrl: null },
    tags: [
      { id: '9', name: 'PostgreSQL', slug: 'postgresql' },
      { id: '10', name: 'Database', slug: 'database' }
    ]
  },
  {
    id: '6',
    title: 'Node.js cluster modülü ile load balancing',
    slug: 'nodejs-cluster-load-balancing',
    bodyPreview: 'Express.js uygulamamı cluster modülü ile çalıştırıyorum ama worker\'lar arasında session paylaşımı yapamıyorum. Redis session store kullanmalı mıyım?',
    viewCount: 312,
    answerCount: 4,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '6', username: 'canertopuz', displayName: 'Caner Topuz', avatarUrl: null },
    tags: [
      { id: '11', name: 'Node.js', slug: 'nodejs' },
      { id: '12', name: 'Express', slug: 'express' }
    ]
  },
  {
    id: '7',
    title: 'Kubernetes pod scheduling problemi',
    slug: 'kubernetes-pod-scheduling',
    bodyPreview: 'Yeni deploy ettiğim pod Pending durumunda kalıyor. kubectl describe pod çıktısında "Insufficient cpu" hatası alıyorum ama node\'da yeterli kaynak var.',
    viewCount: 278,
    answerCount: 0,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '7', username: 'deniz_cloud', displayName: 'Deniz Arslan', avatarUrl: null },
    tags: [
      { id: '13', name: 'Kubernetes', slug: 'kubernetes' },
      { id: '6', name: 'DevOps', slug: 'devops' }
    ]
  },
  {
    id: '8',
    title: 'Python async/await ile database bağlantısı',
    slug: 'python-async-database',
    bodyPreview: 'FastAPI kullanıyorum ve SQLAlchemy ile async database işlemleri yapmak istiyorum. asyncpg driver\'ı kullanmalı mıyım?',
    viewCount: 423,
    answerCount: 6,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '8', username: 'zeynep_py', displayName: 'Zeynep Kara', avatarUrl: null },
    tags: [
      { id: '14', name: 'Python', slug: 'python' },
      { id: '15', name: 'FastAPI', slug: 'fastapi' }
    ]
  },
  {
    id: '9',
    title: 'Git rebase conflict çözümü için best practice',
    slug: 'git-rebase-conflict-best-practice',
    bodyPreview: 'Feature branch\'imi main\'e rebase ederken çok fazla conflict çıkıyor. Interactive rebase kullanarak daha temiz bir şekilde nasıl çözebilirim?',
    viewCount: 567,
    answerCount: 8,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '9', username: 'omer_git', displayName: 'Ömer Şahin', avatarUrl: null },
    tags: [
      { id: '16', name: 'Git', slug: 'git' },
      { id: '17', name: 'Version Control', slug: 'version-control' }
    ]
  },
  {
    id: '10',
    title: 'CSS Grid ile responsive layout tasarımı',
    slug: 'css-grid-responsive-layout',
    bodyPreview: 'CSS Grid kullanarak masonry benzeri bir layout yapmak istiyorum. Grid-auto-rows ve minmax kullanıyorum ama mobile\'da düzgün görünmüyor.',
    viewCount: 234,
    answerCount: 3,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    author: { id: '10', username: 'elif_css', displayName: 'Elif Yılmaz', avatarUrl: null },
    tags: [
      { id: '18', name: 'CSS', slug: 'css' },
      { id: '19', name: 'Frontend', slug: 'frontend' }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/questions`;
  private readonly CREATED_QUESTIONS_KEY = 'created_questions';

  // Get user-created questions from localStorage
  private getCreatedQuestions(): QuestionDetail[] {
    try {
      const stored = localStorage.getItem(this.CREATED_QUESTIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save created question to localStorage
  private saveCreatedQuestion(question: QuestionDetail): void {
    const questions = this.getCreatedQuestions();
    // Add or update question
    const existingIndex = questions.findIndex(q => q.id === question.id);
    if (existingIndex >= 0) {
      questions[existingIndex] = question;
    } else {
      questions.unshift(question);
    }
    localStorage.setItem(this.CREATED_QUESTIONS_KEY, JSON.stringify(questions));
  }

  getQuestions(params: QuestionsQueryParams = {}): Observable<PaginatedResponse<Question>> {
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
    if (params.hasAcceptedAnswer !== undefined) {
      httpParams = httpParams.set('hasAcceptedAnswer', params.hasAcceptedAnswer.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Question>>>(this.baseUrl, { params: httpParams })
      .pipe(
        map(response => response.data),
        catchError(() => this.getMockQuestions(params))
      );
  }

  private getMockQuestions(params: QuestionsQueryParams): Observable<PaginatedResponse<Question>> {
    // Combine user-created questions with mock questions
    const createdQuestions = this.getCreatedQuestions();
    let filtered = [...createdQuestions, ...MOCK_QUESTIONS];

    // Author filter - only show questions from specific user
    if (params.authorUsername) {
      filtered = filtered.filter(q => 
        q.author?.username === params.authorUsername || 
        (params.authorUsername === 'kullanici' && q.author?.username === 'kullanici') ||
        (params.authorUsername === 'admin123' && q.author?.username === 'admin123')
      );
    }

    // Search filter
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(search) || 
        q.bodyPreview.toLowerCase().includes(search)
      );
    }

    // Tag filter
    if (params.tag) {
      filtered = filtered.filter(q => 
        q.tags.some(t => t.slug === params.tag || t.name.toLowerCase() === params.tag?.toLowerCase())
      );
    }

    // Has accepted answer filter
    if (params.hasAcceptedAnswer !== undefined) {
      filtered = filtered.filter(q => q.hasAcceptedAnswer === params.hasAcceptedAnswer);
    }

    // Sort
    switch (params.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'unanswered':
        filtered = filtered.filter(q => q.answerCount === 0);
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default: // latest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 10;
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

  getQuestionBySlug(slug: string): Observable<QuestionDetail> {
    return this.http.get<ApiResponse<QuestionDetail>>(`${this.baseUrl}/${slug}`)
      .pipe(
        map(response => response.data),
        catchError(() => {
          // First check user-created questions in localStorage
          const createdQuestions = this.getCreatedQuestions();
          const createdQuestion = createdQuestions.find(q => q.slug === slug);
          if (createdQuestion) {
            return of(createdQuestion).pipe(delay(300));
          }

          // Then check mock questions
          const question = MOCK_QUESTIONS.find(q => q.slug === slug);
          if (question) {
            return of({
              ...question,
              body: `${question.bodyPreview}\n\n## Detaylı Açıklama\n\nBu sorunun tam içeriği burada görüntülenecek. Backend aktif olduğunda gerçek içerik yüklenecektir.\n\n\`\`\`typescript\n// Örnek kod bloğu\nconst example = 'code';\nconsole.log(example);\n\`\`\`\n\nYardımlarınız için şimdiden teşekkürler!`,
              isAuthor: false
            } as QuestionDetail).pipe(delay(300));
          }
          throw new Error('Question not found');
        })
      );
  }

  createQuestion(request: CreateQuestionRequest): Observable<{ id: string; slug: string }> {
    return this.http.post<ApiResponse<{ id: string; slug: string }>>(this.baseUrl, request)
      .pipe(
        map(response => response.data),
        catchError(() => this.mockCreateQuestion(request))
      );
  }

  private mockCreateQuestion(request: CreateQuestionRequest): Observable<{ id: string; slug: string }> {
    const slug = request.title
      .toLowerCase()
      .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .substring(0, 100) + '-' + Date.now();

    const questionId = 'mock-' + Date.now();
    const currentUser = this.authService.currentUser();

    // Create full question detail for localStorage
    const mockQuestion: QuestionDetail = {
      id: questionId,
      title: request.title,
      slug: slug,
      body: request.body,
      bodyPreview: request.body.substring(0, 200) + (request.body.length > 200 ? '...' : ''),
      viewCount: 0,
      answerCount: 0,
      hasAcceptedAnswer: false,
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
      author: {
        id: currentUser?.id || 'current-user',
        username: currentUser?.username || 'current_user',
        displayName: currentUser?.displayName || 'Mevcut Kullanıcı',
        avatarUrl: currentUser?.avatarUrl || null
      },
      tags: request.tagNames.map((name: string, index: number) => ({
        id: `tag-${index}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      })),
      isAuthor: true
    };

    // Save to localStorage for persistence
    this.saveCreatedQuestion(mockQuestion);

    return of({ 
      id: questionId,
      slug: slug
    }).pipe(delay(800));
  }

  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        map(() => undefined),
        catchError(() => of(undefined).pipe(delay(600)))
      );
  }

  deleteQuestion(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getUnansweredQuestions(limit: number = 10): Observable<Question[]> {
    const params = new HttpParams()
      .set('sortBy', 'unanswered')
      .set('pageSize', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Question>>>(this.baseUrl, { params })
      .pipe(
        map(response => response.data.items),
        catchError(() => of(MOCK_QUESTIONS.filter(q => q.answerCount === 0).slice(0, limit)).pipe(delay(300)))
      );
  }

  getRecentQuestions(limit: number = 10): Observable<Question[]> {
    const params = new HttpParams()
      .set('sortBy', 'latest')
      .set('pageSize', limit.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Question>>>(this.baseUrl, { params })
      .pipe(
        map(response => response.data.items),
        catchError(() => of(MOCK_QUESTIONS.slice(0, limit)).pipe(delay(300)))
      );
  }
}
