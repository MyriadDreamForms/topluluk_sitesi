import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { QuestionsService, QuestionDetail, CreateQuestionRequest, UpdateQuestionRequest } from '../questions.service';

@Component({
  selector: 'app-question-ask',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './question-ask.component.html',
  styleUrl: './question-ask.component.scss'
})
export class QuestionAskComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private questionsService = inject(QuestionsService);

  questionForm!: FormGroup;
  tagInput = '';
  
  isEditMode = signal(false);
  showPreview = signal(false);
  selectedTags = signal<string[]>([]);
  previewHtml = signal('');
  submitting = signal(false);
  error = signal<string | null>(null);
  
  private questionId: string | null = null;
  private questionSlug: string | null = null;

  ngOnInit() {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      body: ['', [Validators.required, Validators.minLength(30)]]
    });

    // Check if editing existing question
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.questionSlug = params['edit'];
        this.isEditMode.set(true);
        this.loadQuestion(params['edit']);
      }
    });

    // Watch for body changes to update preview
    this.questionForm.get('body')?.valueChanges.subscribe(value => {
      this.updatePreview(value);
    });
  }

  private loadQuestion(slug: string) {
    this.questionsService.getQuestionBySlug(slug).subscribe({
      next: (question: QuestionDetail) => {
        this.questionForm.patchValue({
          title: question.title,
          body: question.body
        });
        this.selectedTags.set(question.tags?.map(t => t.name) || []);
        this.questionId = question.id;
      },
      error: () => {
        this.error.set('Soru yüklenemedi');
      }
    });
  }

  private updatePreview(markdown: string) {
    let html = markdown || '';
    html = html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    this.previewHtml.set(html);
  }

  addTag(event: Event) {
    event.preventDefault();
    const tag = this.tagInput.trim().toLowerCase().replace(',', '');
    if (tag && !this.selectedTags().includes(tag) && this.selectedTags().length < 5) {
      this.selectedTags.update(tags => [...tags, tag]);
      this.tagInput = '';
    }
  }

  removeTag(tag: string) {
    this.selectedTags.update(tags => tags.filter(t => t !== tag));
  }

  onSubmit() {
    if (this.questionForm.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.error.set(null);

    if (this.isEditMode() && this.questionId) {
      const updateData: UpdateQuestionRequest = {
        id: this.questionId,
        title: this.questionForm.get('title')?.value,
        body: this.questionForm.get('body')?.value,
        tagNames: this.selectedTags()
      };
      
      this.questionsService.updateQuestion(this.questionId, updateData).subscribe({
        next: () => {
          this.submitting.set(false);
          this.router.navigate(['/questions', this.questionSlug || this.questionId]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
    } else {
      const createData: CreateQuestionRequest = {
        title: this.questionForm.get('title')?.value,
        body: this.questionForm.get('body')?.value,
        tagNames: this.selectedTags()
      };
      
      this.questionsService.createQuestion(createData).subscribe({
        next: (result) => {
          this.submitting.set(false);
          this.router.navigate(['/questions', result.slug || result.id]);
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(err.error?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/questions']);
  }
}
