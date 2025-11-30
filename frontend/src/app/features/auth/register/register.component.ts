import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
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
          <h1 class="auth-title">Kayıt Ol</h1>
          <p class="auth-subtitle">Topluluğumuza katılın ve bilgi paylaşmaya başlayın</p>
        </div>

        @if (error()) {
          <app-alert 
            type="error" 
            [message]="error()!" 
            (dismiss)="error.set(null)" 
          />
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="displayName" class="form-label">Ad Soyad</label>
            <input 
              id="displayName"
              type="text"
              formControlName="displayName"
              class="form-input"
              [class.error]="isFieldInvalid('displayName')"
              placeholder="Ahmet Yılmaz"
              autocomplete="name"
            />
            @if (isFieldInvalid('displayName')) {
              <span class="form-error">Ad soyad en az 2 karakter olmalıdır</span>
            }
          </div>

          <div class="form-group">
            <label for="username" class="form-label">Kullanıcı Adı</label>
            <input 
              id="username"
              type="text"
              formControlName="username"
              class="form-input"
              [class.error]="isFieldInvalid('username')"
              placeholder="ahmetyilmaz"
              autocomplete="username"
            />
            @if (isFieldInvalid('username')) {
              <span class="form-error">Kullanıcı adı 3-20 karakter, sadece harf ve rakam içermelidir</span>
            }
          </div>

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
            <label for="password" class="form-label">Şifre</label>
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
            <label for="confirmPassword" class="form-label">Şifre Tekrar</label>
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

          <div class="form-group terms">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="acceptTerms" />
              <span>
                <a routerLink="/terms" target="_blank">Kullanım Şartları</a>'nı ve 
                <a routerLink="/privacy" target="_blank">Gizlilik Politikası</a>'nı kabul ediyorum
              </span>
            </label>
            @if (isFieldInvalid('acceptTerms')) {
              <span class="form-error">Şartları kabul etmeniz gerekmektedir</span>
            }
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            [disabled]="loading() || registerForm.invalid"
          >
            @if (loading()) {
              <app-loading-spinner [size]="20" />
              Kayıt yapılıyor...
            } @else {
              Kayıt Ol
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Zaten hesabınız var mı?
            <a routerLink="/auth/login" class="auth-link">Giriş Yap</a>
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
      max-width: 420px;
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
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
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

    .form-error {
      font-size: 0.75rem;
      color: #ef4444;
    }

    .terms {
      margin-top: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
    }

    .checkbox-label input {
      margin-top: 0.125rem;
      accent-color: #ff6d5a;
    }

    .checkbox-label a {
      color: #ff6d5a;
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { confirmPassword, acceptTerms, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    });
  }
}
