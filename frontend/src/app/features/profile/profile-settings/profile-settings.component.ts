import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService, UpdateProfileRequest } from '../profile.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, UserAvatarComponent],
  template: `
    <div class="settings-page">
      <div class="container">
        <header class="page-header">
          <h1>Profil Ayarları</h1>
          <p class="subtitle">Profil bilgilerinizi ve hesap ayarlarınızı yönetin</p>
        </header>

        <div class="settings-layout">
          <nav class="settings-nav">
            <button 
              [class.active]="activeTab() === 'profile'"
              (click)="activeTab.set('profile')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profil Bilgileri
            </button>
            <button 
              [class.active]="activeTab() === 'account'"
              (click)="activeTab.set('account')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Hesap Ayarları
            </button>
            <button 
              [class.active]="activeTab() === 'notifications'"
              (click)="activeTab.set('notifications')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Bildirimler
            </button>
            <button 
              [class.active]="activeTab() === 'privacy'"
              (click)="activeTab.set('privacy')">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Gizlilik
            </button>
          </nav>

          <div class="settings-content">
            @if (loading()) {
              <div class="loading-container">
                <app-loading-spinner [size]="40" />
              </div>
            } @else {
              @switch (activeTab()) {
                @case ('profile') {
                  <div class="settings-section">
                    <h2>Profil Bilgileri</h2>
                    <p class="section-description">Herkese açık profil bilgilerinizi güncelleyin</p>

                    <div class="avatar-section">
                      <app-user-avatar 
                        [avatarUrl]="currentUser()?.avatarUrl || null"
                        [displayName]="currentUser()?.displayName || 'Kullanıcı'"
                        size="xl"
                      />
                      <div class="avatar-actions">
                        <button class="btn btn-secondary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Fotoğraf Yükle
                        </button>
                        <span class="avatar-hint">JPG, PNG veya GIF. Max 2MB</span>
                      </div>
                    </div>

                    <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="settings-form">
                      <div class="form-row">
                        <div class="form-group">
                          <label for="displayName">Görünen Ad</label>
                          <input 
                            type="text" 
                            id="displayName" 
                            formControlName="displayName"
                            placeholder="Adınız Soyadınız"
                          />
                        </div>
                        <div class="form-group">
                          <label for="username">Kullanıcı Adı</label>
                          <div class="input-prefix">
                            <span>&#64;</span>
                            <input 
                              type="text" 
                              id="username" 
                              [value]="currentUser()?.username"
                              disabled
                            />
                          </div>
                          <span class="helper-text">Kullanıcı adı değiştirilemez</span>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="bio">Hakkında</label>
                        <textarea 
                          id="bio" 
                          formControlName="bio"
                          rows="3"
                          placeholder="Kendinizi kısaca tanıtın..."
                          maxlength="300"
                        ></textarea>
                        <span class="char-count">{{ profileForm.get('bio')?.value?.length || 0 }}/300</span>
                      </div>

                      <div class="form-group">
                        <label for="location">Konum</label>
                        <input 
                          type="text" 
                          id="location" 
                          formControlName="location"
                          placeholder="Şehir, Ülke"
                        />
                      </div>

                      <div class="form-group">
                        <label for="website">Website</label>
                        <input 
                          type="url" 
                          id="website" 
                          formControlName="website"
                          placeholder="https://example.com"
                        />
                      </div>

                      <h3 class="subsection-title">Sosyal Medya</h3>

                      <div class="form-row">
                        <div class="form-group">
                          <label for="githubUsername">GitHub</label>
                          <div class="input-prefix">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <input 
                              type="text" 
                              id="githubUsername" 
                              formControlName="githubUsername"
                              placeholder="kullaniciadi"
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <label for="twitterUsername">Twitter / X</label>
                          <div class="input-prefix">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <input 
                              type="text" 
                              id="twitterUsername" 
                              formControlName="twitterUsername"
                              placeholder="kullaniciadi"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label for="linkedInUrl">LinkedIn</label>
                        <input 
                          type="url" 
                          id="linkedInUrl" 
                          formControlName="linkedInUrl"
                          placeholder="https://linkedin.com/in/kullaniciadi"
                        />
                      </div>

                      @if (saveError()) {
                        <div class="error-banner">{{ saveError() }}</div>
                      }

                      @if (saveSuccess()) {
                        <div class="success-banner">Profil başarıyla güncellendi!</div>
                      }

                      <div class="form-actions">
                        <button type="submit" class="btn btn-primary" [disabled]="saving()">
                          @if (saving()) {
                            <span class="spinner"></span>
                            Kaydediliyor...
                          } @else {
                            Değişiklikleri Kaydet
                          }
                        </button>
                      </div>
                    </form>
                  </div>
                }

                @case ('account') {
                  <div class="settings-section">
                    <h2>Hesap Ayarları</h2>
                    <p class="section-description">E-posta ve şifre ayarlarınızı yönetin</p>

                    <div class="setting-item">
                      <div class="setting-info">
                        <h4>E-posta Adresi</h4>
                        <p>{{ currentUser()?.email }}</p>
                      </div>
                      <button class="btn btn-secondary">Değiştir</button>
                    </div>

                    <div class="setting-item">
                      <div class="setting-info">
                        <h4>Şifre</h4>
                        <p>Son değişiklik: Bilinmiyor</p>
                      </div>
                      <button class="btn btn-secondary">Şifre Değiştir</button>
                    </div>

                    <div class="danger-zone">
                      <h3>Tehlikeli Bölge</h3>
                      <div class="setting-item danger">
                        <div class="setting-info">
                          <h4>Hesabı Sil</h4>
                          <p>Hesabınızı kalıcı olarak silmek geri alınamaz</p>
                        </div>
                        <button class="btn btn-danger">Hesabı Sil</button>
                      </div>
                    </div>
                  </div>
                }

                @case ('notifications') {
                  <div class="settings-section">
                    <h2>Bildirim Ayarları</h2>
                    <p class="section-description">Hangi bildirimleri almak istediğinizi seçin</p>

                    <div class="toggle-group">
                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>E-posta Bildirimleri</h4>
                          <p>Önemli güncellemeler için e-posta alın</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" checked />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Soru Yanıtları</h4>
                          <p>Sorularınıza yanıt geldiğinde bildirim alın</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" checked />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Yazı Yorumları</h4>
                          <p>Yazılarınıza yorum yapıldığında bildirim alın</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" checked />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Takipçi Bildirimleri</h4>
                          <p>Yeni takipçileriniz hakkında bildirim alın</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Haftalık Özet</h4>
                          <p>Haftalık topluluk aktivite özeti alın</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                }

                @case ('privacy') {
                  <div class="settings-section">
                    <h2>Gizlilik Ayarları</h2>
                    <p class="section-description">Profil görünürlüğü ve veri ayarlarınızı yönetin</p>

                    <div class="toggle-group">
                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Herkese Açık Profil</h4>
                          <p>Profilinizi herkes görebilir</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" checked />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>E-posta Görünürlüğü</h4>
                          <p>E-posta adresinizi profilinizde gösterin</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>

                      <div class="toggle-item">
                        <div class="toggle-info">
                          <h4>Aktivite Durumu</h4>
                          <p>Çevrimiçi durumunuzu gösterin</p>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" checked />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>

                    <div class="data-section">
                      <h3>Veri İşlemleri</h3>
                      <div class="setting-item">
                        <div class="setting-info">
                          <h4>Verilerimi İndir</h4>
                          <p>Tüm verilerinizin bir kopyasını indirin</p>
                        </div>
                        <button class="btn btn-secondary">İndir</button>
                      </div>
                    </div>
                  </div>
                }
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      min-height: calc(100vh - 64px);
      background: var(--bg-primary, #0d0d12);
      padding: 2rem 0;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .settings-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .settings-nav button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      color: var(--text-secondary, #94a3b8);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .settings-nav button:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary, #f8fafc);
    }

    .settings-nav button.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: rgba(255, 109, 90, 0.3);
      color: #ff6d5a;
    }

    .settings-nav button svg {
      flex-shrink: 0;
    }

    .settings-content {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 2rem;
      min-height: 500px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .settings-section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.5rem;
    }

    .section-description {
      color: var(--text-muted, #64748b);
      margin: 0 0 2rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .avatar-hint {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
      font-size: 0.875rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem 1rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 8px;
      color: var(--text-primary, #f8fafc);
      font-size: 1rem;
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

    .form-group input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .input-prefix {
      display: flex;
      align-items: center;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .input-prefix:focus-within {
      border-color: #ff6d5a;
      box-shadow: 0 0 0 3px rgba(255, 109, 90, 0.1);
    }

    .input-prefix span,
    .input-prefix svg {
      padding: 0.75rem;
      color: var(--text-muted, #64748b);
      background: rgba(255, 255, 255, 0.03);
    }

    .input-prefix input {
      flex: 1;
      border: none;
      background: transparent;
      padding-left: 0;
    }

    .input-prefix input:focus {
      box-shadow: none;
    }

    .helper-text {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    .char-count {
      text-align: right;
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
    }

    .subsection-title {
      font-size: 1rem;
      font-weight: 600;
      color: #ff6d5a;
      margin: 1rem 0 0;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color, #2a2a35);
      margin-top: 1rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      box-shadow: 0 0 30px rgba(255, 109, 90, 0.4);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      color: var(--text-primary, #f8fafc);
      border: 1px solid var(--border-color, #2a2a35);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted, #64748b);
    }

    .btn-danger {
      background: transparent;
      color: #f87171;
      border: 1px solid rgba(248, 113, 113, 0.3);
    }

    .btn-danger:hover {
      background: rgba(248, 113, 113, 0.1);
      border-color: #f87171;
    }

    .error-banner {
      padding: 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      color: #f87171;
    }

    .success-banner {
      padding: 1rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 10px;
      color: #4ade80;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Account & Privacy Tabs */
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      margin-bottom: 1rem;
    }

    .setting-info h4 {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.25rem;
    }

    .setting-info p {
      font-size: 0.875rem;
      color: var(--text-muted, #64748b);
      margin: 0;
    }

    .danger-zone {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .danger-zone h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #f87171;
      margin: 0 0 1rem;
    }

    .setting-item.danger {
      border-color: rgba(248, 113, 113, 0.3);
    }

    .data-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .data-section h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 1rem;
    }

    /* Toggle Switches */
    .toggle-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      background: var(--bg-tertiary, #0d0d12);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
    }

    .toggle-info h4 {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary, #f8fafc);
      margin: 0 0 0.25rem;
    }

    .toggle-info p {
      font-size: 0.875rem;
      color: var(--text-muted, #64748b);
      margin: 0;
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--border-color, #2a2a35);
      border-radius: 26px;
      transition: 0.3s;
    }

    .toggle-slider::before {
      position: absolute;
      content: '';
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }

    .toggle input:checked + .toggle-slider {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
    }

    .toggle input:checked + .toggle-slider::before {
      transform: translateX(22px);
    }

    @media (max-width: 768px) {
      .settings-layout {
        grid-template-columns: 1fr;
      }

      .settings-nav {
        flex-direction: row;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        gap: 0.25rem;
      }

      .settings-nav button {
        flex-shrink: 0;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }

      .settings-nav button svg {
        display: none;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .page-header h1 {
        font-size: 1.5rem;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  activeTab = signal<'profile' | 'account' | 'notifications' | 'privacy'>('profile');
  loading = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);
  saveSuccess = signal(false);
  currentUser = this.authService.currentUser;

  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(300)]],
      location: [''],
      website: [''],
      githubUsername: [''],
      twitterUsername: [''],
      linkedInUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    
    this.profileService.getCurrentProfile().subscribe({
      next: (profile) => {
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
      error: () => {
        // Use current user data as fallback
        const user = this.currentUser();
        if (user) {
          this.profileForm.patchValue({
            displayName: user.displayName
          });
        }
        this.loading.set(false);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || this.saving()) return;

    this.saving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    const request: UpdateProfileRequest = {
      displayName: this.profileForm.get('displayName')?.value,
      bio: this.profileForm.get('bio')?.value || undefined,
      location: this.profileForm.get('location')?.value || undefined,
      website: this.profileForm.get('website')?.value || undefined,
      githubUsername: this.profileForm.get('githubUsername')?.value || undefined,
      twitterUsername: this.profileForm.get('twitterUsername')?.value || undefined,
      linkedInUrl: this.profileForm.get('linkedInUrl')?.value || undefined
    };

    this.profileService.updateProfile(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set('Profil güncellenirken bir hata oluştu.');
      }
    });
  }
}
