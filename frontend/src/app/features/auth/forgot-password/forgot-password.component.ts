import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, AlertComponent, LoadingSpinnerComponent],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <a routerLink="/" class="logo">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">TechCommunity</span>
          </a>
          <h1 class="auth-title">Şifremi Unuttum</h1>
          <p class="auth-subtitle">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim</p>
        </div>

        @if (error()) {
          <app-alert 
            type="error" 
            [message]="error()!" 
            (dismiss)="error.set(null)" 
          />
        }

        @if (success()) {
          <app-alert 
            type="success" 
            title="Başarılı!"
            [message]="'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'" 
            [dismissible]="false"
          />
        } @else {
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">E-posta</label>
              <input 
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                [class.error]="isFieldInvalid('email')"
                placeholder="ornek@email.com"
                autocomplete="email"
              />
              @if (isFieldInvalid('email')) {
                <span class="form-error">Geçerli bir e-posta adresi girin</span>
              }
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="loading() || forgotForm.invalid"
            >
              @if (loading()) {
                <app-loading-spinner [size]="20" />
                Gönderiliyor...
              } @else {
                Şifre Sıfırlama Bağlantısı Gönder
              }
            </button>
          </form>
        }

        <div class="auth-footer">
          <p>
            <a routerLink="/auth/login" class="auth-link">← Giriş sayfasına dön</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, var(--primary-light, #ebf8ff) 0%, #fff 100%);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--bg-secondary, #fff);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary, #1a202c);
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .auth-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #1a202c);
    }

    .auth-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted, #718096);
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #1a202c);
    }

    .form-input {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 0.5rem;
      background: var(--bg-primary, #fff);
      color: var(--text-primary, #1a202c);
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color, #3182ce);
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }

    .form-input.error {
      border-color: #e53e3e;
    }

    .form-error {
      font-size: 0.75rem;
      color: #e53e3e;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--primary-color, #3182ce);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover, #2c5282);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
    }

    .auth-footer p {
      margin: 0;
    }

    .auth-link {
      color: var(--primary-color, #3182ce);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.forgotForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.forgotForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        // Always show success to prevent email enumeration
        this.success.set(true);
      }
    });
  }
}
