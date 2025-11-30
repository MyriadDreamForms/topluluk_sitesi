import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { QuestionsService, QuestionDetail } from '../questions.service';
import { AnswersService, Answer } from '../answers.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';
import { MarkdownViewerComponent } from '../../../shared/components/markdown-viewer/markdown-viewer.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { SeoService } from '../../../core/services/seo.service';
import { AuthStateService } from '../../auth/auth-state.service';
import { AnswerItemComponent } from '../answer-item/answer-item.component';
import { AnswerFormComponent } from '../answer-form/answer-form.component';

@Component({
  selector: 'app-question-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserAvatarComponent,
    TagListComponent,
    MarkdownViewerComponent,
    LoadingSpinnerComponent,
    TimeAgoPipe,
    AnswerItemComponent,
    AnswerFormComponent
  ],
  template: `
    <div class="container">
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
          <h2>Soru bulunamadı</h2>
          <p>{{ error() }}</p>
          <a routerLink="/questions" class="btn-primary">Sorulara Dön</a>
        </div>
      } @else if (question()) {
        <article class="question">
          <header class="question-header">
            <h1 class="question-title">{{ question()!.title }}</h1>
            
            <div class="question-meta">
              <a [routerLink]="['/u', question()!.author.username]" class="author-link">
                <app-user-avatar 
                  [avatarUrl]="question()!.author.avatarUrl" 
                  [username]="question()!.author.displayName"
                  size="sm">
                </app-user-avatar>
                <span class="author-name">{{ question()!.author.displayName }}</span>
              </a>
              <span class="separator">·</span>
              <time [attr.datetime]="question()!.createdAt">
                {{ question()!.createdAt | timeAgo }}
              </time>
              @if (question()!.updatedAt) {
                <span class="separator">·</span>
                <span class="edited">Düzenlendi</span>
              }
              <span class="separator">·</span>
              <span class="views">{{ question()!.viewCount }} görüntülenme</span>
            </div>

            @if (question()!.isAuthor) {
              <div class="question-actions">
                <a [routerLink]="['/questions', question()!.slug, 'edit']" class="btn-icon" title="Düzenle">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </a>
                <button class="btn-icon danger" (click)="deleteQuestion()" title="Sil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            }
          </header>

          <div class="question-body">
            <app-markdown-viewer [content]="question()!.body"></app-markdown-viewer>
          </div>

          @if (question()!.tags.length > 0) {
            <app-tag-list [tags]="question()!.tags" [clickable]="true"></app-tag-list>
          }
        </article>

        <!-- Answers Section -->
        <section class="answers-section">
          <h2>
            {{ question()!.answerCount }} Cevap
            @if (question()!.acceptedAnswerId) {
              <span class="accepted-badge">✓ Çözüldü</span>
            }
          </h2>

          @for (answer of answers(); track answer.id) {
            <app-answer-item 
              [answer]="answer" 
              [questionAuthorId]="question()!.author.id"
              [acceptedAnswerId]="question()!.acceptedAnswerId"
              (accepted)="onAnswerAccepted($event)"
              (deleted)="onAnswerDeleted($event)">
            </app-answer-item>
          }

          @if (answersLoading()) {
            <div class="loading-container">
              <app-loading-spinner></app-loading-spinner>
            </div>
          }

          @if (authState.isAuthenticated()) {
            <app-answer-form 
              [questionId]="question()!.id"
              (answerAdded)="onAnswerAdded()">
            </app-answer-form>
          } @else {
            <div class="login-prompt">
              <p>Cevap vermek için <a routerLink="/auth/login">giriş yapın</a>.</p>
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .error-message {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary, #6b7280);
    }

    .error-message svg {
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .error-message h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #1f2937);
      margin: 0 0 0.5rem;
    }

    .error-message p {
      margin: 0 0 1.5rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    .question {
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .question-header {
      margin-bottom: 1.5rem;
    }

    .question-title {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.3;
      margin: 0 0 1rem;
      color: var(--text-primary, #1f2937);
    }

    .question-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary, #6b7280);
    }

    .author-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
    }

    .author-link:hover .author-name {
      color: var(--primary-color, #3b82f6);
    }

    .separator {
      color: var(--border-color, #e5e7eb);
    }

    .edited {
      font-style: italic;
    }

    .question-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn-icon {
      padding: 0.5rem;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary, #6b7280);
      transition: all 0.2s;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon:hover {
      color: var(--primary-color, #3b82f6);
      border-color: var(--primary-color, #3b82f6);
    }

    .btn-icon.danger:hover {
      color: #ef4444;
      border-color: #ef4444;
    }

    .question-body {
      margin-bottom: 1.5rem;
    }

    .answers-section {
      margin-top: 2rem;
    }

    .answers-section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .accepted-badge {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--success-color, #22c55e);
      background: rgba(34, 197, 94, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .login-prompt {
      text-align: center;
      padding: 2rem;
      background: var(--card-bg, #fff);
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 8px;
      margin-top: 1.5rem;
    }

    .login-prompt p {
      margin: 0;
      color: var(--text-secondary, #6b7280);
    }

    .login-prompt a {
      color: var(--primary-color, #3b82f6);
      text-decoration: none;
      font-weight: 500;
    }

    .login-prompt a:hover {
      text-decoration: underline;
    }
  `]
})
export class QuestionDetailComponent implements OnInit {
  private readonly questionsService = inject(QuestionsService);
  private readonly answersService = inject(AnswersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);
  readonly authState = inject(AuthStateService);

  question = signal<QuestionDetail | null>(null);
  answers = signal<Answer[]>([]);
  isLoading = signal(true);
  answersLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadQuestion(slug);
      }
    });
  }

  private loadQuestion(slug: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.questionsService.getQuestionBySlug(slug).subscribe({
      next: (question) => {
        this.question.set(question);
        this.updateSeo(question);
        this.isLoading.set(false);
        this.loadAnswers(question.id);
      },
      error: (err) => {
        console.error('Failed to load question:', err);
        this.error.set('Bu soru bulunamadı veya silinmiş olabilir.');
        this.isLoading.set(false);
      }
    });
  }

  private loadAnswers(questionId: string): void {
    this.answersLoading.set(true);

    this.answersService.getAnswers({ questionId }).subscribe({
      next: (response) => {
        this.answers.set(response.items);
        this.answersLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load answers:', err);
        this.answersLoading.set(false);
      }
    });
  }

  private updateSeo(question: QuestionDetail): void {
    this.seoService.updateTags({
      title: question.title,
      description: question.bodyPreview || question.body.substring(0, 160),
      keywords: question.tags.map(t => t.name),
      author: question.author.displayName,
      type: 'article'
    });
  }

  deleteQuestion(): void {
    if (!this.question()) return;

    if (confirm('Bu soruyu silmek istediğinizden emin misiniz?')) {
      this.questionsService.deleteQuestion(this.question()!.id).subscribe({
        next: () => {
          this.router.navigate(['/questions']);
        },
        error: (err) => {
          console.error('Failed to delete question:', err);
          alert('Soru silinirken bir hata oluştu.');
        }
      });
    }
  }

  onAnswerAdded(): void {
    if (this.question()) {
      this.loadAnswers(this.question()!.id);
      // Update answer count
      const current = this.question()!;
      this.question.set({ ...current, answerCount: current.answerCount + 1 });
    }
  }

  onAnswerAccepted(answerId: string): void {
    if (this.question()) {
      const current = this.question()!;
      const newAcceptedId = current.acceptedAnswerId === answerId ? undefined : answerId;
      this.question.set({ ...current, acceptedAnswerId: newAcceptedId });
      
      // Update answers list to reflect acceptance
      this.answers.update(answers => 
        answers.map(a => ({
          ...a,
          isAccepted: a.id === newAcceptedId
        }))
      );
    }
  }

  onAnswerDeleted(answerId: string): void {
    this.answers.update(answers => answers.filter(a => a.id !== answerId));
    if (this.question()) {
      const current = this.question()!;
      this.question.set({ ...current, answerCount: Math.max(0, current.answerCount - 1) });
    }
  }
}
