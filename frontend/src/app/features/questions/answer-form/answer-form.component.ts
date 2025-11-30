import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnswersService } from '../answers.service';

@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="answer-form">
      <h3>Cevabınız</h3>
      
      <div class="editor-tabs">
        <button 
          type="button" 
          class="tab-btn"
          [class.active]="!showPreview()"
          (click)="showPreview.set(false)">
          Yaz
        </button>
        <button 
          type="button" 
          class="tab-btn"
          [class.active]="showPreview()"
          (click)="showPreview.set(true)">
          Önizle
        </button>
      </div>

      @if (!showPreview()) {
        <textarea
          [(ngModel)]="body"
          placeholder="Cevabınızı buraya yazın. Markdown desteklenir."
          rows="8"
          class="answer-textarea">
        </textarea>
      } @else {
        <div class="preview-content" [innerHTML]="previewHtml()"></div>
      }

      <div class="form-actions">
        <button 
          class="btn-primary" 
          [disabled]="isSubmitting() || !body.trim()"
          (click)="submitAnswer()">
          @if (isSubmitting()) {
            <span class="spinner"></span>
            Gönderiliyor...
          } @else {
            Cevabı Gönder
          }
        </button>
      </div>

      @if (error()) {
        <div class="error-message">{{ error() }}</div>
      }
    </div>
  `,
  styles: [`
    .answer-form {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0 0 1rem;
      color: var(--text-primary, #f8fafc);
    }

    .editor-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .tab-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color, #2a2a35);
      background: transparent;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border-color: #ff6d5a;
    }

    .answer-textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary, #f8fafc);
      resize: vertical;
      min-height: 150px;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    }

    .answer-textarea::placeholder {
      color: var(--text-muted, #64748b);
    }

    .answer-textarea:focus {
      outline: none;
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .preview-content {
      min-height: 150px;
      padding: 1rem;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.02);
      color: var(--text-primary, #f8fafc);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #ef4444;
      font-size: 0.875rem;
    }
  `]
})
export class AnswerFormComponent {
  private readonly answersService = inject(AnswersService);

  @Input({ required: true }) questionId!: string;
  @Output() answerAdded = new EventEmitter<void>();

  body = '';
  showPreview = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  previewHtml(): string {
    let html = this.body || '';
    html = html
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    return html;
  }

  submitAnswer(): void {
    if (!this.body.trim()) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    this.answersService.addAnswer({
      questionId: this.questionId,
      body: this.body.trim()
    }).subscribe({
      next: () => {
        this.body = '';
        this.isSubmitting.set(false);
        this.answerAdded.emit();
      },
      error: (err) => {
        console.error('Failed to add answer:', err);
        this.error.set('Cevap gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        this.isSubmitting.set(false);
      }
    });
  }
}
