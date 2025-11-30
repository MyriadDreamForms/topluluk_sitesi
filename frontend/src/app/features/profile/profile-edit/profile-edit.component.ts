import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService, UserProfile, UpdateProfileRequest } from '../profile.service';
import { AuthService, User } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AvatarUploadComponent } from '../avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    LoadingSpinnerComponent, 
    AlertComponent,
    AvatarUploadComponent
  ],
  template: `
    <div class="profile-edit-page">
      <div class="page-header">
        <h1 class="page-title">Profil Ayarları</h1>
        <p class="page-subtitle">Profilinizi düzenleyin ve güncelleyin</p>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <app-loading-spinner [size]="40" />
        </div>
      } @else {
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
            [message]="'Profiliniz başarıyla güncellendi.'" 
            (dismiss)="success.set(false)" 
          />
        }

        <div class="settings-grid">
          <!-- Avatar Section -->
          <div class="settings-card">
            <h2 class="card-title">Profil Fotoğrafı</h2>
            <app-avatar-upload 
              [currentAvatarUrl]="profile()?.avatarUrl"
              [displayName]="profile()?.displayName || ''"
              (avatarChanged)="onAvatarChanged($event)"
            />
          </div>

          <!-- Profile Form -->
          <div class="settings-card">
            <h2 class="card-title">Profil Bilgileri</h2>
            
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
              <div class="form-group">
                <label for="displayName" class="form-label">Ad Soyad *</label>
                <input 
                  id="displayName"
                  type="text"
                  formControlName="displayName"
                  class="form-input"
                  [class.error]="isFieldInvalid('displayName')"
                  placeholder="Ahmet Yılmaz"
                />
                @if (isFieldInvalid('displayName')) {
                  <span class="form-error">Ad soyad en az 2 karakter olmalıdır</span>
                }
              </div>

              <div class="form-group">
                <label for="bio" class="form-label">Hakkımda</label>
                <textarea 
                  id="bio"
                  formControlName="bio"
                  class="form-input form-textarea"
                  [class.error]="isFieldInvalid('bio')"
                  placeholder="Kendinizden kısaca bahsedin..."
                  rows="4"
                ></textarea>
                <div class="char-count">{{ profileForm.get('bio')?.value?.length || 0 }} / 500</div>
                @if (isFieldInvalid('bio')) {
                  <span class="form-error">Biyografi en fazla 500 karakter olabilir</span>
                }
              </div>

              <div class="form-group">
                <label for="location" class="form-label">Konum</label>
                <input 
                  id="location"
                  type="text"
                  formControlName="location"
                  class="form-input"
                  placeholder="İstanbul, Türkiye"
                />
              </div>

              <div class="form-group">
                <label for="website" class="form-label">Website</label>
                <input 
                  id="website"
                  type="url"
                  formControlName="website"
                  class="form-input"
                  [class.error]="isFieldInvalid('website')"
                  placeholder="https://example.com"
                />
                @if (isFieldInvalid('website')) {
                  <span class="form-error">Geçerli bir URL girin</span>
                }
              </div>

              <div class="form-divider">
                <span>Sosyal Medya</span>
              </div>

              <div class="form-group">
                <label for="githubUsername" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Kullanıcı Adı
                </label>
                <div class="input-with-prefix">
                  <span class="input-prefix">github.com/</span>
                  <input 
                    id="githubUsername"
                    type="text"
                    formControlName="githubUsername"
                    class="form-input"
                    placeholder="username"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="twitterUsername" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X (Twitter) Kullanıcı Adı
                </label>
                <div class="input-with-prefix">
                  <span class="input-prefix">x.com/</span>
                  <input 
                    id="twitterUsername"
                    type="text"
                    formControlName="twitterUsername"
                    class="form-input"
                    placeholder="username"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="linkedInUrl" class="form-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn URL
                </label>
                <input 
                  id="linkedInUrl"
                  type="url"
                  formControlName="linkedInUrl"
                  class="form-input"
                  [class.error]="isFieldInvalid('linkedInUrl')"
                  placeholder="https://linkedin.com/in/username"
                />
                @if (isFieldInvalid('linkedInUrl')) {
                  <span class="form-error">Geçerli bir LinkedIn URL girin</span>
                }
              </div>

              <div class="form-actions">
                <a routerLink="/profile" class="btn btn-secondary">İptal</a>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="saving() || profileForm.invalid"
                >
                  @if (saving()) {
                    <app-loading-spinner [size]="18" />
                    Kaydediliyor...
                  } @else {
                    Değişiklikleri Kaydet
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-edit-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.5rem;
    }

    .page-subtitle {
      font-size: 0.9375rem;
      color: var(--text-muted, #718096);
      margin: 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .settings-card {
      background: var(--bg-secondary, #fff);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .profile-form {
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
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #1a202c);
    }

    .form-input {
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
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

    .form-textarea {
      resize: vertical;
      min-height: 100px;
      line-height: 1.5;
    }

    .char-count {
      font-size: 0.75rem;
      color: var(--text-muted, #718096);
      text-align: right;
    }

    .form-error {
      font-size: 0.75rem;
      color: #e53e3e;
    }

    .form-divider {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
    }

    .form-divider::before,
    .form-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color, #e2e8f0);
    }

    .form-divider span {
      padding: 0 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-muted, #718096);
    }

    .input-with-prefix {
      display: flex;
      align-items: stretch;
    }

    .input-prefix {
      display: flex;
      align-items: center;
      padding: 0 0.75rem;
      font-size: 0.875rem;
      color: var(--text-muted, #718096);
      background: var(--bg-tertiary, #f7fafc);
      border: 1px solid var(--border-color, #e2e8f0);
      border-right: none;
      border-radius: 0.5rem 0 0 0.5rem;
    }

    .input-with-prefix .form-input {
      border-radius: 0 0.5rem 0.5rem 0;
      flex: 1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      text-decoration: none;
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

    .btn-secondary {
      background: var(--bg-tertiary, #f7fafc);
      color: var(--text-primary, #1a202c);
      border: 1px solid var(--border-color, #e2e8f0);
    }

    .btn-secondary:hover {
      background: var(--bg-primary, #fff);
    }

    @media (max-width: 640px) {
      .form-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class ProfileEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    bio: ['', [Validators.maxLength(500)]],
    location: ['', [Validators.maxLength(100)]],
    website: ['', [Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)]],
    githubUsername: ['', [Validators.maxLength(39)]],
    twitterUsername: ['', [Validators.maxLength(15)]],
    linkedInUrl: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/)]]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    
    this.profileService.getCurrentProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.profileForm.patchValue({
          displayName: profile.displayName,
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          githubUsername: profile.githubUsername || '',
          twitterUsername: profile.twitterUsername || '',
          linkedInUrl: profile.linkedInUrl || ''
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Profil bilgileri yüklenemedi.');
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onAvatarChanged(avatarUrl: string): void {
    const profile = this.profile();
    if (profile) {
      this.profile.set({ ...profile, avatarUrl });
      
      // Update AuthService current user
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        this.authService.updateCurrentUser({ ...currentUser, avatarUrl });
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);
    this.success.set(false);

    const formValue = this.profileForm.value;
    const request: UpdateProfileRequest = {
      displayName: formValue.displayName,
      bio: formValue.bio || undefined,
      location: formValue.location || undefined,
      website: formValue.website || undefined,
      githubUsername: formValue.githubUsername || undefined,
      twitterUsername: formValue.twitterUsername || undefined,
      linkedInUrl: formValue.linkedInUrl || undefined
    };

    this.profileService.updateProfile(request).subscribe({
      next: (updatedProfile) => {
        this.profile.set(updatedProfile);
        this.saving.set(false);
        this.success.set(true);
        
        // Update AuthService current user
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.authService.updateCurrentUser({
            ...currentUser,
            displayName: updatedProfile.displayName,
            bio: updatedProfile.bio
          });
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Profil güncellenirken bir hata oluştu.');
      }
    });
  }
}
