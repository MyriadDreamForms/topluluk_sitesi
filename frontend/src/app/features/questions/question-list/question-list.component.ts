import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionsService, Question, QuestionsQueryParams } from '../questions.service';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SeoService } from '../../../core/services/seo.service';
import { AuthStateService } from '../../auth/auth-state.service';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    QuestionCardComponent,
    PaginationComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <header class="page-header">
        <div class="header-content">
          <h1>Sorular</h1>
          <p>Topluluktan gelen teknik sorular ve cevaplar</p>
        </div>
        
        @if (authState.isAuthenticated()) {
          <a routerLink="/questions/ask" class="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Soru Sor
          </a>
        }
      </header>

      <div class="filters">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Sorularda ara..." 
            [(ngModel)]="searchTerm"
            (keyup.enter)="applySearch()"
          />
        </div>

        <div class="filter-tabs">
          <button 
            class="tab" 
            [class.active]="sortBy() === 'latest'"
            (click)="setSort('latest')">
            En Yeni
          </button>
          <button 
            class="tab" 
            [class.active]="sortBy() === 'popular'"
            (click)="setSort('popular')">
            Popüler
          </button>
          <button 
            class="tab" 
            [class.active]="sortBy() === 'unanswered'"
            (click)="setSort('unanswered')">
            Cevaplanmamış
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading-spinner></app-loading-spinner>
        </div>
      } @else if (error()) {
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Bir hata oluştu</h2>
          <p>{{ error() }}</p>
          <button class="btn-primary" (click)="loadQuestions()">Tekrar Dene</button>
        </div>
      } @else if (questions().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2>Henüz soru yok</h2>
          <p>İlk soruyu siz sorun!</p>
          @if (authState.isAuthenticated()) {
            <a routerLink="/questions/ask" class="btn-primary">Soru Sor</a>
          }
        </div>
      } @else {
        <div class="question-list">
          @for (question of questions(); track question.id) {
            <app-question-card [question]="question"></app-question-card>
          }
        </div>

        @if (totalPages() > 1) {
          <app-pagination
            [currentPage]="currentPage()"
            [totalPages]="totalPages()"
            [totalCount]="totalCount()"
            [hasPreviousPage]="hasPreviousPage()"
            [hasNextPage]="hasNextPage()"
            (pageChange)="onPageChange($event)">
          </app-pagination>
        }
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #f8fafc);
    }

    .header-content p {
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-primary:hover {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
    }

    .filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      flex: 1;
      min-width: 200px;
      max-width: 400px;
      transition: all 0.2s;
    }

    .search-box:focus-within {
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .search-box svg {
      color: var(--text-muted, #94a3b8);
      flex-shrink: 0;
    }

    .search-box input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.9rem;
      background: transparent;
      color: var(--text-primary, #f8fafc);
    }

    .search-box input::placeholder {
      color: var(--text-muted, #64748b);
    }

    .filter-tabs {
      display: flex;
      gap: 0.25rem;
      background: var(--bg-secondary, #17171c);
      padding: 0.25rem;
      border-radius: 10px;
      border: 1px solid var(--border-color, #2a2a35);
    }

    .tab {
      padding: 0.5rem 1rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--text-primary, #f8fafc);
    }

    .tab.active {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .error-message, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted, #94a3b8);
    }

    .error-message svg, .empty-state svg {
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--text-muted, #64748b);
    }

    .error-message h2, .empty-state h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .error-message p, .empty-state p {
      margin: 0 0 1.5rem;
    }

    .question-list {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
    }

    @media (max-width: 640px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }

      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      .filter-tabs {
        justify-content: center;
      }
    }
  `]
})
export class QuestionListComponent implements OnInit {
  private readonly questionsService = inject(QuestionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  readonly authState = inject(AuthStateService);

  questions = signal<Question[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  hasPreviousPage = signal(false);
  hasNextPage = signal(false);
  sortBy = signal<'latest' | 'popular' | 'unanswered'>('latest');
  searchTerm = '';
  tagFilter = '';

  ngOnInit(): void {
    this.seoService.updateTags({
      title: 'Sorular - Tech Community',
      description: 'Türkiye teknoloji topluluğundan gelen teknik sorular ve cevaplar',
      keywords: ['soru', 'cevap', 'teknoloji', 'programlama']
    });

    this.route.queryParams.subscribe(params => {
      this.currentPage.set(parseInt(params['page'] || '1', 10));
      this.sortBy.set(params['sort'] || 'latest');
      this.searchTerm = params['search'] || '';
      this.tagFilter = params['tag'] || '';
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params: QuestionsQueryParams = {
      pageNumber: this.currentPage(),
      pageSize: 20,
      sortBy: this.sortBy(),
      search: this.searchTerm || undefined,
      tag: this.tagFilter || undefined
    };

    this.questionsService.getQuestions(params).subscribe({
      next: (response) => {
        this.questions.set(response.items);
        this.totalPages.set(response.totalPages);
        this.totalCount.set(response.totalCount);
        this.hasPreviousPage.set(response.hasPreviousPage);
        this.hasNextPage.set(response.hasNextPage);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load questions:', err);
        this.error.set('Sorular yüklenirken bir hata oluştu.');
        this.isLoading.set(false);
      }
    });
  }

  setSort(sort: 'latest' | 'popular' | 'unanswered'): void {
    this.router.navigate([], {
      queryParams: { sort, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  applySearch(): void {
    this.router.navigate([], {
      queryParams: { search: this.searchTerm || null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
}
