import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
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
          <h1 class="auth-title">Giriş Yap</h1>
          <p class="auth-subtitle">Hesabınıza giriş yaparak topluluğa katılın</p>
        </div>

        @if (error()) {
          <app-alert 
            type="error" 
            [message]="error()!" 
            (dismiss)="error.set(null)" 
          />
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
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

          <div class="form-group">
            <div class="form-label-row">
              <label for="password" class="form-label">Şifre</label>
              <a routerLink="/auth/forgot-password" class="forgot-link">Şifremi unuttum</a>
            </div>
            <input 
              id="password"
              type="password"
              formControlName="password"
              class="form-input"
              [class.error]="isFieldInvalid('password')"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            @if (isFieldInvalid('password')) {
              <span class="form-error">Şifre en az 6 karakter olmalıdır</span>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loading() || loginForm.invalid"
          >
            @if (loading()) {
              <app-loading-spinner [size]="20" />
              Giriş yapılıyor...
            } @else {
              Giriş Yap
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Hesabınız yok mu?
            <a routerLink="/auth/register" class="auth-link">Kayıt Ol</a>
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
      background: 
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 109, 90, 0.15), transparent),
        var(--bg-primary, #0d0d12);
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
      color: var(--text-primary, #f8fafc);
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .auth-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #f8fafc);
    }

    .auth-subtitle {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
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

    .form-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
    }

    .forgot-link {
      font-size: 0.75rem;
      color: #ff6d5a;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .form-input {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary, #f8fafc);
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input::placeholder {
      color: var(--text-muted, #64748b);
    }

    .form-input:focus {
      outline: none;
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
    }

    .form-input.error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-error {
      font-size: 0.75rem;
      color: #ef4444;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
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
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .auth-footer p {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .auth-link {
      color: #ff6d5a;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    });
  }
}
