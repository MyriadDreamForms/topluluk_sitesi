import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService, PostDetail, CreatePostRequest, UpdatePostRequest } from '../posts.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { MarkdownViewerComponent } from '../../../shared/components/markdown-viewer/markdown-viewer.component';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    MarkdownViewerComponent
  ],
  template: `
    <div class="container">
      @if (isLoadingPost()) {
        <div class="loading-container">
          <app-loading-spinner></app-loading-spinner>
        </div>
      } @else {
        <header class="editor-header">
          <h1>{{ isEditMode() ? 'Yazıyı Düzenle' : 'Yeni Yazı' }}</h1>
          <div class="header-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">
              İptal
            </button>
            <button 
              type="button" 
              class="btn-primary"
              (click)="savePost(false)"
              [disabled]="!form.valid || isSubmitting()">
              @if (isSubmitting()) {
                Kaydediliyor...
              } @else {
                Taslak Kaydet
              }
            </button>
            <button 
              type="button" 
              class="btn-primary publish"
              (click)="savePost(true)"
              [disabled]="!form.valid || isSubmitting()">
              @if (isSubmitting()) {
                Yayınlanıyor...
              } @else {
                Yayınla
              }
            </button>
          </div>
        </header>

        @if (error()) {
          <div class="error-banner">
            {{ error() }}
          </div>
        }

        <div class="editor-layout">
          <form [formGroup]="form" class="editor-form">
            <div class="form-group">
              <label for="title">Başlık</label>
              <input
                type="text"
                id="title"
                formControlName="title"
                placeholder="Yazınızın başlığını girin..."
                [class.error]="form.get('title')?.invalid && form.get('title')?.touched"
              />
              @if (form.get('title')?.invalid && form.get('title')?.touched) {
                <span class="error-text">
                  @if (form.get('title')?.errors?.['required']) {
                    Başlık zorunludur
                  } @else if (form.get('title')?.errors?.['minlength']) {
                    Başlık en az 5 karakter olmalıdır
                  } @else if (form.get('title')?.errors?.['maxlength']) {
                    Başlık en fazla 200 karakter olmalıdır
                  }
                </span>
              }
            </div>

            <div class="form-group">
              <label for="excerpt">Özet (opsiyonel)</label>
              <textarea
                id="excerpt"
                formControlName="excerpt"
                rows="2"
                placeholder="Yazınızın kısa bir özeti..."
                maxlength="500">
              </textarea>
              <span class="char-count">{{ form.get('excerpt')?.value?.length || 0 }}/500</span>
            </div>

            <div class="form-group">
              <label for="coverImageUrl">Kapak Görseli URL (opsiyonel)</label>
              <input
                type="url"
                id="coverImageUrl"
                formControlName="coverImageUrl"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div class="form-group">
              <label for="tags">Etiketler</label>
              <input
                type="text"
                id="tags"
                formControlName="tagsInput"
                placeholder="Etiketleri virgülle ayırın: javascript, react, typescript"
              />
              <span class="helper-text">Etiketleri virgülle ayırarak yazın</span>
            </div>

            <div class="form-group editor-group">
              <div class="editor-tabs">
                <button 
                  type="button" 
                  [class.active]="activeTab() === 'write'"
                  (click)="activeTab.set('write')">
                  Yaz
                </button>
                <button 
                  type="button" 
                  [class.active]="activeTab() === 'preview'"
                  (click)="activeTab.set('preview')">
                  Önizleme
                </button>
              </div>

              @if (activeTab() === 'write') {
                <textarea
                  id="content"
                  formControlName="content"
                  rows="20"
                  placeholder="Markdown formatında içeriğinizi yazın..."
                  [class.error]="form.get('content')?.invalid && form.get('content')?.touched">
                </textarea>
                @if (form.get('content')?.invalid && form.get('content')?.touched) {
                  <span class="error-text">
                    @if (form.get('content')?.errors?.['required']) {
                      İçerik zorunludur
                    } @else if (form.get('content')?.errors?.['minlength']) {
                      İçerik en az 50 karakter olmalıdır
                    }
                  </span>
                }
              } @else {
                <div class="preview-container">
                  @if (form.get('content')?.value) {
                    <app-markdown-viewer [content]="form.get('content')?.value"></app-markdown-viewer>
                  } @else {
                    <p class="empty-preview">Önizleme için içerik yazın...</p>
                  }
                </div>
              }
            </div>

            <div class="markdown-help">
              <details>
                <summary>Markdown Yardımı</summary>
                <div class="help-content">
                  <code># Başlık 1</code>
                  <code>## Başlık 2</code>
                  <code>**kalın**</code>
                  <code>*italik*</code>
                  <code>[link](url)</code>
                  <code>![resim](url)</code>
                  <code>\`kod\`</code>
                  <code>\`\`\`dil<br/>kod bloğu<br/>\`\`\`</code>
                  <code>- liste öğesi</code>
                  <code>1. numaralı liste</code>
                  <code>> alıntı</code>
                </div>
              </details>
            </div>
          </form>
        </div>
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

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .editor-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary, #f8fafc);
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-secondary {
      padding: 0.625rem 1.25rem;
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      color: var(--text-secondary, #94a3b8);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted, #64748b);
      color: var(--text-primary, #f8fafc);
    }

    .btn-primary {
      padding: 0.625rem 1.25rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      color: var(--text-primary, #f8fafc);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted, #64748b);
    }

    .btn-primary.publish {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      border: none;
      color: white;
    }

    .btn-primary.publish:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-banner {
      padding: 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      color: #f87171;
      margin-bottom: 1.5rem;
    }

    .editor-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
      font-size: 0.9375rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.875rem 1rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      font-size: 1rem;
      color: var(--text-primary, #f8fafc);
      transition: all 0.2s;
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: var(--text-muted, #64748b);
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .form-group input.error,
    .form-group textarea.error {
      border-color: #ef4444;
    }

    .error-text {
      color: #f87171;
      font-size: 0.875rem;
    }

    .char-count {
      text-align: right;
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    .helper-text {
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
    }

    .editor-group {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      overflow: hidden;
    }

    .editor-tabs {
      display: flex;
      background: rgba(13, 13, 18, 0.5);
      border-bottom: 1px solid var(--border-color, #2a2a35);
    }

    .editor-tabs button {
      flex: 1;
      padding: 0.875rem 1rem;
      background: transparent;
      border: none;
      font-weight: 500;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .editor-tabs button:hover {
      color: var(--text-primary, #f8fafc);
      background: rgba(255, 255, 255, 0.03);
    }

    .editor-tabs button.active {
      background: var(--bg-secondary, #17171c);
      color: #ff6d5a;
    }

    .editor-tabs button.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #ff6d5a, #ff5142);
    }

    .editor-group textarea {
      border: none;
      border-radius: 0;
      min-height: 400px;
      font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
      resize: vertical;
      background: var(--bg-secondary, #17171c);
    }

    .editor-group textarea:focus {
      box-shadow: none;
    }

    .preview-container {
      min-height: 400px;
      padding: 1.5rem;
      background: var(--bg-secondary, #17171c);
      color: var(--text-primary, #f8fafc);
    }

    .empty-preview {
      color: var(--text-muted, #64748b);
      font-style: italic;
    }

    .markdown-help {
      margin-top: 1rem;
    }

    .markdown-help details {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      overflow: hidden;
    }

    .markdown-help summary {
      cursor: pointer;
      color: #ff6d5a;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.875rem 1rem;
      transition: background 0.2s;
    }

    .markdown-help summary:hover {
      background: rgba(255, 109, 90, 0.05);
    }

    .help-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 0.75rem;
      padding: 1rem;
      background: var(--bg-tertiary, #0d0d12);
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .help-content code {
      font-size: 0.8rem;
      background: var(--bg-secondary, #17171c);
      color: #ff6d5a;
      padding: 0.375rem 0.625rem;
      border-radius: 6px;
      border: 1px solid var(--border-color, #2a2a35);
      display: block;
    }

    @media (max-width: 768px) {
      .editor-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .editor-header h1 {
        font-size: 1.5rem;
      }

      .header-actions {
        width: 100%;
        flex-wrap: wrap;
      }

      .header-actions button {
        flex: 1;
        min-width: 100px;
      }
    }
  `]
})
export class PostEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form: FormGroup;
  isEditMode = signal(false);
  isLoadingPost = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'write' | 'preview'>('write');
  
  private existingPost: PostDetail | null = null;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      excerpt: ['', [Validators.maxLength(500)]],
      coverImageUrl: [''],
      tagsInput: ['']
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.isEditMode.set(true);
      this.loadPost(slug);
    }
  }

  private loadPost(slug: string): void {
    this.isLoadingPost.set(true);

    this.postsService.getPostBySlug(slug).subscribe({
      next: (post) => {
        if (!post.isAuthor) {
          this.router.navigate(['/posts', slug]);
          return;
        }

        this.existingPost = post;
        this.form.patchValue({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          coverImageUrl: post.coverImageUrl || '',
          tagsInput: post.tags.map(t => t.name).join(', ')
        });
        this.isLoadingPost.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.error.set('Yazı yüklenirken bir hata oluştu.');
        this.isLoadingPost.set(false);
      }
    });
  }

  savePost(publish: boolean): void {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    const formValue = this.form.value;
    const tagNames = formValue.tagsInput
      ? formValue.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t)
      : [];

    if (this.isEditMode() && this.existingPost) {
      const request: UpdatePostRequest = {
        id: this.existingPost.id,
        title: formValue.title,
        content: formValue.content,
        excerpt: formValue.excerpt || undefined,
        coverImageUrl: formValue.coverImageUrl || undefined,
        tagNames,
        isPublished: publish
      };

      this.postsService.updatePost(this.existingPost.id, request).subscribe({
        next: (post) => {
          this.isSubmitting.set(false);
          this.router.navigate(['/posts', post.slug]);
        },
        error: (err) => {
          console.error('Failed to update post:', err);
          this.error.set('Yazı güncellenirken bir hata oluştu.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      const request: CreatePostRequest = {
        title: formValue.title,
        content: formValue.content,
        excerpt: formValue.excerpt || undefined,
        coverImageUrl: formValue.coverImageUrl || undefined,
        tagNames,
        isPublished: publish
      };

      this.postsService.createPost(request).subscribe({
        next: (post) => {
          this.isSubmitting.set(false);
          this.router.navigate(['/posts', post.slug]);
        },
        error: (err) => {
          console.error('Failed to create post:', err);
          this.error.set('Yazı oluşturulurken bir hata oluştu.');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode() && this.existingPost) {
      this.router.navigate(['/posts', this.existingPost.slug]);
    } else {
      this.router.navigate(['/posts']);
    }
  }
}
