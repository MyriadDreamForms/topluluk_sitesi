import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventsService, CreateEventRequest } from '../events.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-page">
        <div class="page-header">
          <a routerLink="/events" class="back-link">← Etkinliklere Dön</a>
          <h1 class="page-title">{{ isEditMode() ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur' }}</h1>
          <p class="page-desc">
            {{ isEditMode() ? 'Etkinlik bilgilerini güncelleyin.' : 'Toplulukla paylaşmak istediğiniz etkinliğin detaylarını girin.' }}
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="event-form">
          <!-- Title -->
          <div class="form-group">
            <label for="title" class="form-label">Etkinlik Başlığı *</label>
            <input 
              type="text" 
              id="title" 
              formControlName="title"
              class="form-input"
              placeholder="Örn: İstanbul Tech Meetup #42"
            >
            @if (form.get('title')?.touched && form.get('title')?.errors?.['required']) {
              <span class="form-error">Başlık zorunludur</span>
            }
            @if (form.get('title')?.touched && form.get('title')?.errors?.['minlength']) {
              <span class="form-error">Başlık en az 5 karakter olmalıdır</span>
            }
          </div>

          <!-- Event Type -->
          <div class="form-group">
            <label class="form-label">Etkinlik Türü *</label>
            <div class="event-type-selector">
              <button 
                type="button"
                class="type-option"
                [class.active]="form.get('eventType')?.value === 'Offline'"
                (click)="setEventType('Offline')"
              >
                <span class="type-icon">📍</span>
                <span class="type-label">Yüz Yüze</span>
              </button>
              <button 
                type="button"
                class="type-option"
                [class.active]="form.get('eventType')?.value === 'Online'"
                (click)="setEventType('Online')"
              >
                <span class="type-icon">🌐</span>
                <span class="type-label">Online</span>
              </button>
              <button 
                type="button"
                class="type-option"
                [class.active]="form.get('eventType')?.value === 'Hybrid'"
                (click)="setEventType('Hybrid')"
              >
                <span class="type-icon">🔄</span>
                <span class="type-label">Hibrit</span>
              </button>
            </div>
          </div>

          <!-- Date & Time -->
          <div class="form-row">
            <div class="form-group">
              <label for="startDate" class="form-label">Başlangıç Tarihi ve Saati *</label>
              <input 
                type="datetime-local" 
                id="startDate" 
                formControlName="startDate"
                class="form-input"
              >
              @if (form.get('startDate')?.touched && form.get('startDate')?.errors?.['required']) {
                <span class="form-error">Başlangıç tarihi zorunludur</span>
              }
            </div>
            <div class="form-group">
              <label for="endDate" class="form-label">Bitiş Tarihi ve Saati</label>
              <input 
                type="datetime-local" 
                id="endDate" 
                formControlName="endDate"
                class="form-input"
              >
            </div>
          </div>

          <!-- Location (for Offline/Hybrid) -->
          @if (showLocation()) {
            <div class="form-group">
              <label for="location" class="form-label">Konum *</label>
              <input 
                type="text" 
                id="location" 
                formControlName="location"
                class="form-input"
                placeholder="Örn: Google Türkiye, Levent, İstanbul"
              >
              @if (form.get('location')?.touched && form.get('location')?.errors?.['required']) {
                <span class="form-error">Konum zorunludur</span>
              }
            </div>
          }

          <!-- Online URL (for Online/Hybrid) -->
          @if (showOnlineUrl()) {
            <div class="form-group">
              <label for="onlineUrl" class="form-label">Online Katılım Linki</label>
              <input 
                type="url" 
                id="onlineUrl" 
                formControlName="onlineUrl"
                class="form-input"
                placeholder="https://zoom.us/j/123456789"
              >
            </div>
          }

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">Etkinlik Açıklaması *</label>
            <textarea 
              id="description" 
              formControlName="description"
              class="form-textarea"
              rows="6"
              placeholder="Etkinlik hakkında detaylı bilgi verin. Program, konuşmacılar, gereksinimler vb."
            ></textarea>
            @if (form.get('description')?.touched && form.get('description')?.errors?.['required']) {
              <span class="form-error">Açıklama zorunludur</span>
            }
            @if (form.get('description')?.touched && form.get('description')?.errors?.['minlength']) {
              <span class="form-error">Açıklama en az 20 karakter olmalıdır</span>
            }
          </div>

          <!-- Image URL -->
          <div class="form-group">
            <label for="imageUrl" class="form-label">Kapak Görseli URL'i</label>
            <input 
              type="url" 
              id="imageUrl" 
              formControlName="imageUrl"
              class="form-input"
              placeholder="https://example.com/event-image.jpg"
            >
            <span class="form-hint">Görselin minimum 800x400 piksel boyutunda olması önerilir.</span>
          </div>

          <!-- Image Preview -->
          @if (form.get('imageUrl')?.value) {
            <div class="image-preview">
              <img [src]="form.get('imageUrl')?.value" alt="Etkinlik görseli önizleme" (error)="onImageError($event)">
            </div>
          }

          <!-- Submit -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" routerLink="/events">
              İptal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="form.invalid || submitting()"
            >
              @if (submitting()) {
                <span class="loading-dots">Kaydediliyor</span>
              } @else {
                {{ isEditMode() ? 'Değişiklikleri Kaydet' : 'Etkinlik Oluştur' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-block;
      color: var(--text-muted, #8a8a8a);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      transition: color 0.15s;
    }

    .back-link:hover {
      color: #ff6d5a;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.5rem;
    }

    .page-desc {
      color: var(--text-muted, #8a8a8a);
      font-size: 1rem;
      margin: 0;
    }

    .event-form {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      margin-bottom: 0.5rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      background: var(--bg-primary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      color: var(--text-primary, #ffffff);
      transition: border-color 0.15s;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #ff6d5a;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--text-muted, #8a8a8a);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-error {
      display: block;
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.375rem;
    }

    .form-hint {
      display: block;
      color: var(--text-muted, #8a8a8a);
      font-size: 0.8rem;
      margin-top: 0.375rem;
    }

    .event-type-selector {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .type-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.25rem;
      background: var(--bg-primary, #0d0d12);
      border: 2px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .type-option:hover {
      border-color: var(--text-muted);
    }

    .type-option.active {
      border-color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    .type-icon {
      font-size: 1.5rem;
    }

    .type-label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary, #ffffff);
    }

    .image-preview {
      margin-bottom: 1.5rem;
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-primary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
    }

    .image-preview img {
      width: 100%;
      max-height: 250px;
      object-fit: cover;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .btn {
      padding: 0.875rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
      text-decoration: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 0 24px rgba(255, 109, 90, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-primary, #ffffff);
    }

    .btn-secondary:hover {
      border-color: var(--text-muted);
    }

    .loading-dots::after {
      content: '';
      animation: dots 1.5s infinite;
    }

    @keyframes dots {
      0%, 20% { content: '.'; }
      40% { content: '..'; }
      60%, 100% { content: '...'; }
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .event-type-selector {
        grid-template-columns: 1fr;
      }

      .event-form {
        padding: 1.25rem;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class EventFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);

  form!: FormGroup;
  submitting = signal(false);
  isEditMode = signal(false);
  eventId = signal<string | null>(null);

  showLocation = computed(() => {
    const type = this.form?.get('eventType')?.value;
    return type === 'Offline' || type === 'Hybrid';
  });

  showOnlineUrl = computed(() => {
    const type = this.form?.get('eventType')?.value;
    return type === 'Online' || type === 'Hybrid';
  });

  ngOnInit(): void {
    this.initForm();

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug && slug !== 'new') {
      this.isEditMode.set(true);
      this.loadEvent(slug);
    }
  }

  setEventType(type: 'Online' | 'Offline' | 'Hybrid'): void {
    this.form.patchValue({ eventType: type });
    this.updateLocationValidation();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const request: CreateEventRequest = {
      title: formValue.title,
      description: formValue.description,
      eventType: formValue.eventType,
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: formValue.endDate ? new Date(formValue.endDate).toISOString() : undefined,
      location: formValue.location || undefined,
      onlineUrl: formValue.onlineUrl || undefined,
      imageUrl: formValue.imageUrl || undefined
    };

    if (this.isEditMode() && this.eventId()) {
      this.eventsService.updateEvent(this.eventId()!, request).subscribe({
        next: (event) => {
          this.router.navigate(['/events', event.slug]);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    } else {
      this.eventsService.createEvent(request).subscribe({
        next: (event) => {
          this.router.navigate(['/events', event.slug]);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      eventType: ['Offline', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      location: [''],
      onlineUrl: [''],
      description: ['', [Validators.required, Validators.minLength(20)]],
      imageUrl: ['']
    });

    this.updateLocationValidation();
  }

  private updateLocationValidation(): void {
    const eventType = this.form.get('eventType')?.value;
    const locationControl = this.form.get('location');

    if (eventType === 'Offline' || eventType === 'Hybrid') {
      locationControl?.setValidators([Validators.required]);
    } else {
      locationControl?.clearValidators();
    }
    locationControl?.updateValueAndValidity();
  }

  private loadEvent(slug: string): void {
    this.eventsService.getEventBySlug(slug).subscribe({
      next: (event) => {
        if (event) {
          this.eventId.set(event.id);
          this.form.patchValue({
            title: event.title,
            eventType: event.eventType,
            startDate: this.formatDateForInput(event.startDate),
            endDate: event.endDate ? this.formatDateForInput(event.endDate) : '',
            location: event.location || '',
            onlineUrl: event.onlineUrl || '',
            description: event.description,
            imageUrl: event.imageUrl || ''
          });
          this.updateLocationValidation();
        }
      }
    });
  }

  private formatDateForInput(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 16);
  }
}
