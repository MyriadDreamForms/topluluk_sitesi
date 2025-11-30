import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>İletişim</h1>
        <p class="subtitle">Sorularınız ve önerileriniz için bize ulaşın</p>
      </div>
      
      <div class="page-content">
        <div class="contact-grid">
          <div class="contact-form-section">
            <h2>Bize Yazın</h2>
            
            @if (submitted()) {
              <div class="success-message">
                <span class="icon">✓</span>
                <p>Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
              </div>
            } @else {
              <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                <div class="form-group">
                  <label for="name">Adınız *</label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name"
                    placeholder="Adınızı girin"
                  >
                  @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {
                    <span class="error">Lütfen adınızı girin</span>
                  }
                </div>

                <div class="form-group">
                  <label for="email">E-posta *</label>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email"
                    placeholder="ornek@email.com"
                  >
                  @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
                    <span class="error">Geçerli bir e-posta adresi girin</span>
                  }
                </div>

                <div class="form-group">
                  <label for="subject">Konu *</label>
                  <select id="subject" formControlName="subject">
                    <option value="">Konu seçin</option>
                    <option value="general">Genel Soru</option>
                    <option value="feedback">Öneri / Geri Bildirim</option>
                    <option value="bug">Hata Bildirimi</option>
                    <option value="partnership">İş Birliği</option>
                    <option value="other">Diğer</option>
                  </select>
                  @if (contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched) {
                    <span class="error">Lütfen bir konu seçin</span>
                  }
                </div>

                <div class="form-group">
                  <label for="message">Mesajınız *</label>
                  <textarea 
                    id="message" 
                    formControlName="message"
                    rows="5"
                    placeholder="Mesajınızı yazın..."
                  ></textarea>
                  @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                    <span class="error">Mesaj en az 10 karakter olmalıdır</span>
                  }
                </div>

                <button type="submit" class="btn btn-primary" [disabled]="contactForm.invalid">
                  Gönder
                </button>
              </form>
            }
          </div>

          <div class="contact-info-section">
            <h2>İletişim Bilgileri</h2>
            
            <div class="info-card">
              <div class="info-item">
                <span class="icon">📧</span>
                <div>
                  <strong>E-posta</strong>
                  <p>iletisim&#64;techcommunity.com.tr</p>
                </div>
              </div>

              <div class="info-item">
                <span class="icon">📍</span>
                <div>
                  <strong>Adres</strong>
                  <p>İstanbul, Türkiye</p>
                </div>
              </div>

              <div class="info-item">
                <span class="icon">⏰</span>
                <div>
                  <strong>Yanıt Süresi</strong>
                  <p>1-2 iş günü içinde</p>
                </div>
              </div>
            </div>

            <div class="social-links">
              <h3>Sosyal Medya</h3>
              <div class="social-icons">
                <a href="https://twitter.com/techcommunitytr" target="_blank" rel="noopener" aria-label="Twitter">
                  𝕏
                </a>
                <a href="https://github.com/techcommunitytr" target="_blank" rel="noopener" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com/company/techcommunitytr" target="_blank" rel="noopener" aria-label="LinkedIn">
                  in
                </a>
                <a href="https://discord.gg/techcommunitytr" target="_blank" rel="noopener" aria-label="Discord">
                  💬
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #718096);
      font-size: 1rem;
      margin: 0;
    }

    .page-content {
      background: var(--bg-secondary, #fff);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #1a202c);
      margin-bottom: 0.5rem;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 6px;
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #1a202c);
      transition: border-color 0.15s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary-color, #3182ce);
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error {
      display: block;
      color: var(--error-color, #e53e3e);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-primary {
      background: var(--primary-color, #3182ce);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover, #2c5282);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .success-message {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      background: var(--success-light, #f0fff4);
      border: 1px solid var(--success-color, #48bb78);
      border-radius: 8px;
    }

    .success-message .icon {
      color: var(--success-color, #48bb78);
      font-size: 1.25rem;
    }

    .success-message p {
      margin: 0;
      color: var(--text-primary, #1a202c);
    }

    .info-card {
      background: var(--bg-muted, #f7fafc);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item .icon {
      font-size: 1.25rem;
    }

    .info-item strong {
      display: block;
      font-size: 0.875rem;
      color: var(--text-primary, #1a202c);
      margin-bottom: 0.25rem;
    }

    .info-item p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-muted, #718096);
    }

    .social-links h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1rem;
    }

    .social-icons {
      display: flex;
      gap: 0.75rem;
    }

    .social-icons a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--bg-muted, #f7fafc);
      border-radius: 8px;
      color: var(--text-muted, #718096);
      font-size: 1.125rem;
      text-decoration: none;
      transition: all 0.15s;
    }

    .social-icons a:hover {
      background: var(--primary-color, #3182ce);
      color: white;
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  
  submitted = signal(false);
  
  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.contactForm.valid) {
      // In a real app, this would send the form data to a backend
      console.log('Form submitted:', this.contactForm.value);
      this.submitted.set(true);
    }
  }
}
