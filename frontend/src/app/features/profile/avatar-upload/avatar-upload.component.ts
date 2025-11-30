import { Component, inject, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../profile.service';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [CommonModule, UserAvatarComponent, LoadingSpinnerComponent, AlertComponent],
  template: `
    <div class="avatar-upload">
      <div class="avatar-preview">
        <app-user-avatar 
          [avatarUrl]="currentAvatarUrl || null"
          [displayName]="displayName"
          size="xl"
        />
        @if (uploading()) {
          <div class="upload-overlay">
            <app-loading-spinner [size]="24" />
          </div>
        }
      </div>
      
      <div class="upload-controls">
        <p class="upload-info">
          JPG, PNG veya GIF formatında, maksimum 2MB boyutunda bir fotoğraf yükleyin.
        </p>
        
        @if (error()) {
          <app-alert 
            type="error" 
            [message]="error()!" 
            (dismiss)="error.set(null)" 
          />
        }
        
        <div class="button-group">
          <label class="btn btn-secondary upload-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Fotoğraf Yükle
            <input 
              type="file" 
              accept="image/jpeg,image/png,image/gif"
              (change)="onFileSelected($event)"
              class="file-input"
              [disabled]="uploading()"
            />
          </label>
          
          @if (currentAvatarUrl) {
            <button 
              type="button"
              class="btn btn-danger"
              (click)="removeAvatar()"
              [disabled]="uploading()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Kaldır
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-upload {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .avatar-preview {
      position: relative;
      flex-shrink: 0;
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-controls {
      flex: 1;
    }

    .upload-info {
      font-size: 0.875rem;
      color: var(--text-muted, #718096);
      margin: 0 0 1rem;
      line-height: 1.5;
    }

    .button-group {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.625rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-secondary {
      background: var(--bg-tertiary, #f7fafc);
      color: var(--text-primary, #1a202c);
      border: 1px solid var(--border-color, #e2e8f0);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--bg-primary, #fff);
      border-color: var(--primary-color, #3182ce);
      color: var(--primary-color, #3182ce);
    }

    .btn-danger {
      background: #fff5f5;
      color: #e53e3e;
      border: 1px solid #fed7d7;
    }

    .btn-danger:hover:not(:disabled) {
      background: #fed7d7;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .upload-btn {
      position: relative;
      overflow: hidden;
    }

    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }

    .file-input:disabled {
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      .avatar-upload {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .button-group {
        justify-content: center;
      }
    }
  `]
})
export class AvatarUploadComponent {
  private readonly profileService = inject(ProfileService);

  @Input() currentAvatarUrl?: string;
  @Input() displayName: string = '';
  @Output() avatarChanged = new EventEmitter<string>();

  uploading = signal(false);
  error = signal<string | null>(null);

  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    // Reset input for same file selection
    input.value = '';

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Sadece JPG, PNG veya GIF formatları desteklenmektedir.');
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.error.set('Dosya boyutu 2MB\'dan küçük olmalıdır.');
      return;
    }

    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    this.uploading.set(true);
    this.error.set(null);

    this.profileService.uploadAvatar(file).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.currentAvatarUrl = response.avatarUrl;
        this.avatarChanged.emit(response.avatarUrl);
      },
      error: (err) => {
        this.uploading.set(false);
        this.error.set(err.error?.message || 'Fotoğraf yüklenirken bir hata oluştu.');
      }
    });
  }

  removeAvatar(): void {
    // For now, just clear the avatar URL
    // In a real app, you might want to call an API endpoint to remove the avatar
    this.currentAvatarUrl = undefined;
    this.avatarChanged.emit('');
  }
}
