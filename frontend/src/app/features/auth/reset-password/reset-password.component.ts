import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-reset-password',
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
          <h1 class="auth-title">Şifre Sıfırla</h1>
          <p class="auth-subtitle">Yeni şifrenizi belirleyin</p>
        </div>

        @if (error()) {
          <app-alert 
            type="error" 
            [message]="error()!" 
            (dismiss)="error.set(null)" 
          />
        }

        @if (tokenError()) {
          <div class="token-error">
            <app-alert 
              type="error" 
              title="Geçersiz Bağlantı"
              [message]="'Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre sıfırlama isteği oluşturun.'" 
              [dismissible]="false"
            />
            <div class="token-error-actions">
              <a routerLink="/auth/forgot-password" class="btn btn-primary">Yeni Bağlantı İste</a>
            </div>
          </div>
        } @else if (success()) {
          <app-alert 
            type="success" 
            title="Şifreniz Değiştirildi!"
            [message]="'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.'" 
            [dismissible]="false"
          />
          <div class="success-actions">
            <a routerLink="/auth/login" class="btn btn-primary btn-block">Giriş Yap</a>
          </div>
        } @else {
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="password" class="form-label">Yeni Şifre</label>
              <input 
                id="password"
                type="password"
                formControlName="password"
                class="form-input"
                [class.error]="isFieldInvalid('password')"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              @if (isFieldInvalid('password')) {
                <span class="form-error">Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir</span>
              }
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Yeni Şifre Tekrar</label>
              <input 
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="form-input"
                [class.error]="isFieldInvalid('confirmPassword')"
                placeholder="••••••••"
                autocomplete="new-password"
              />
              @if (isFieldInvalid('confirmPassword')) {
                <span class="form-error">Şifreler eşleşmiyor</span>
              }
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="loading() || resetForm.invalid"
            >
              @if (loading()) {
                <app-loading-spinner [size]="20" />
                Şifre sıfırlanıyor...
              } @else {
                Şifreyi Sıfırla
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
      text-decoration: none;
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

    .token-error,
    .success-actions {
      margin-top: 1.5rem;
    }

    .token-error-actions {
      margin-top: 1rem;
      text-align: center;
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
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  tokenError = signal(false);
  
  private token: string | null = null;
  private email: string | null = null;

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email');
    
    if (!this.token || !this.email) {
      this.tokenError.set(true);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.resetForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    
    if (!hasUpperCase || !hasNumber) {
      return { passwordStrength: true };
    }
    return null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token || !this.email) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.resetForm.get('password')?.value
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400 && err.error?.message?.includes('token')) {
          this.tokenError.set(true);
        } else {
          this.error.set(err.error?.message || 'Şifre sıfırlanamadı. Lütfen tekrar deneyin.');
        }
      }
    });
  }
}
