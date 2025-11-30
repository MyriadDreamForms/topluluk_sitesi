import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, ContentModerationDto, PaginatedResult } from '../admin.service';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-content">
      <header class="page-header">
        <div class="header-content">
          <a routerLink="/admin" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Geri
          </a>
          <h1>İçerik Moderasyonu</h1>
        </div>
      </header>

      <!-- Filters -->
      <section class="filters-section">
        <div class="filter-buttons">
          <button
            class="filter-btn"
            [class.active]="contentTypeFilter() === null"
            (click)="setContentTypeFilter(null)"
          >
            Tümü
          </button>
          <button
            class="filter-btn"
            [class.active]="contentTypeFilter() === 'Post'"
            (click)="setContentTypeFilter('Post')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Yazılar
          </button>
          <button
            class="filter-btn"
            [class.active]="contentTypeFilter() === 'Question'"
            (click)="setContentTypeFilter('Question')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Sorular
          </button>
          <button
            class="filter-btn"
            [class.active]="contentTypeFilter() === 'Answer'"
            (click)="setContentTypeFilter('Answer')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            Cevaplar
          </button>
          <button
            class="filter-btn"
            [class.active]="contentTypeFilter() === 'Comment'"
            (click)="setContentTypeFilter('Comment')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            Yorumlar
          </button>
        </div>
        <div class="status-filters">
          <button
            class="filter-btn"
            [class.active]="hiddenFilter() === null"
            (click)="setHiddenFilter(null)"
          >
            Tümü
          </button>
          <button
            class="filter-btn hidden-filter"
            [class.active]="hiddenFilter() === true"
            (click)="setHiddenFilter(true)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
            Gizli
          </button>
          <button
            class="filter-btn reported-filter"
            [class.active]="hasReportsFilter()"
            (click)="toggleReportsFilter()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Şikayet Edilen
          </button>
        </div>
      </section>

      <!-- Content List -->
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      } @else if (contentResult()?.items?.length) {
        <div class="content-list">
          @for (content of contentResult()!.items; track content.id) {
            <div class="content-card" [class.hidden]="content.isHidden">
              <div class="content-header">
                <span class="content-type" [class]="content.contentType.toLowerCase()">
                  @switch (content.contentType) {
                    @case ('Post') {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Yazı
                    }
                    @case ('Question') {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                      </svg>
                      Soru
                    }
                    @case ('Answer') {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                      Cevap
                    }
                    @case ('Comment') {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      Yorum
                    }
                  }
                </span>
                @if (content.isHidden) {
                  <span class="hidden-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    Gizli
                  </span>
                }
                @if (content.reportCount > 0) {
                  <span class="report-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {{ content.reportCount }} şikayet
                  </span>
                }
              </div>

              <div class="content-body">
                <h3 class="content-title">{{ content.title }}</h3>
                @if (content.excerpt) {
                  <p class="content-excerpt">{{ content.excerpt }}</p>
                }
                @if (content.isHidden && content.hiddenReason) {
                  <p class="hidden-reason">
                    <strong>Gizleme Sebebi:</strong> {{ content.hiddenReason }}
                  </p>
                }
              </div>

              <div class="content-footer">
                <div class="author-info">
                  <span class="author-name">{{ content.authorDisplayName }}</span>
                  <span class="author-handle">&#64;{{ content.authorUsername }}</span>
                </div>
                <span class="content-date">{{ formatDate(content.createdAt) }}</span>
              </div>

              <div class="content-actions">
                @if (content.isHidden) {
                  <button class="action-btn unhide" (click)="unhideContent(content)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Göster
                  </button>
                } @else {
                  <button class="action-btn hide" (click)="startHideContent(content)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    Gizle
                  </button>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <p>İçerik bulunamadı</p>
        </div>
      }

      <!-- Hide Content Modal -->
      @if (hidingContent()) {
        <div class="modal-overlay" (click)="cancelHide()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>İçeriği Gizle</h2>
              <button class="close-btn" (click)="cancelHide()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="content-preview">
                <span class="preview-type">{{ getContentTypeLabel(hidingContent()!.contentType) }}</span>
                <h4>{{ hidingContent()!.title }}</h4>
                <p class="preview-author">{{ hidingContent()!.authorDisplayName }}</p>
              </div>
              <div class="form-group">
                <label>Gizleme Sebebi <span class="required">*</span></label>
                <textarea
                  [(ngModel)]="hideReason"
                  placeholder="Gizleme sebebini açıklayın..."
                  rows="3"
                ></textarea>
              </div>
              <div class="quick-reasons">
                <span class="quick-label">Hızlı Seçim:</span>
                <button type="button" (click)="setQuickReason('Spam/Reklam içeriği')">Spam</button>
                <button type="button" (click)="setQuickReason('Hakaret içeren içerik')">Hakaret</button>
                <button type="button" (click)="setQuickReason('Uygunsuz içerik')">Uygunsuz</button>
                <button type="button" (click)="setQuickReason('Tekrarlı içerik')">Tekrar</button>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="cancelHide()">İptal</button>
              <button class="btn-danger" (click)="confirmHide()" [disabled]="!hideReason">
                Gizle
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      background: #17171c;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .back-link:hover {
      color: #f8fafc;
      background: #2a2a35;
    }

    .back-link svg {
      width: 16px;
      height: 16px;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0;
    }

    /* Filters */
    .filters-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .filter-buttons,
    .status-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 6px;
      color: #94a3b8;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #ff6d5a;
      color: #f8fafc;
    }

    .filter-btn.active {
      background: #ff6d5a;
      border-color: #ff6d5a;
      color: white;
    }

    .filter-btn svg {
      width: 16px;
      height: 16px;
    }

    .hidden-filter.active {
      background: #6b7280;
      border-color: #6b7280;
    }

    .reported-filter.active {
      background: #f59e0b;
      border-color: #f59e0b;
    }

    /* Content List */
    .content-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .content-card {
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      padding: 1.25rem;
      transition: all 0.2s;
    }

    .content-card:hover {
      border-color: #3a3a45;
    }

    .content-card.hidden {
      background: rgba(107, 114, 128, 0.05);
      border-color: #4b5563;
    }

    .content-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .content-type {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .content-type svg {
      width: 14px;
      height: 14px;
    }

    .content-type.post {
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
    }

    .content-type.question {
      background: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
    }

    .content-type.answer {
      background: rgba(168, 85, 247, 0.1);
      color: #c084fc;
    }

    .content-type.comment {
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
    }

    .hidden-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      background: rgba(107, 114, 128, 0.1);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #9ca3af;
    }

    .hidden-badge svg {
      width: 14px;
      height: 14px;
    }

    .report-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      background: rgba(245, 158, 11, 0.1);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #fbbf24;
    }

    .report-badge svg {
      width: 14px;
      height: 14px;
    }

    .content-body {
      margin-bottom: 1rem;
    }

    .content-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .content-excerpt {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }

    .hidden-reason {
      margin-top: 0.75rem;
      padding: 0.75rem;
      background: rgba(107, 114, 128, 0.1);
      border-radius: 6px;
      font-size: 0.8125rem;
      color: #9ca3af;
    }

    .hidden-reason strong {
      color: #f8fafc;
    }

    .content-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #2a2a35;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .author-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #f8fafc;
    }

    .author-handle {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .content-date {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .content-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .action-btn.hide {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .action-btn.hide:hover {
      background: #ef4444;
      color: white;
    }

    .action-btn.unhide {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
    }

    .action-btn.unhide:hover {
      background: #22c55e;
      color: white;
    }

    /* Loading */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      color: #94a3b8;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #2a2a35;
      border-top-color: #ff6d5a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      color: #64748b;
    }

    .empty-state svg {
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      width: 100%;
      max-width: 480px;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #2a2a35;
    }

    .modal-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      background: transparent;
      border: none;
      color: #64748b;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #2a2a35;
      color: #f8fafc;
    }

    .close-btn svg {
      width: 20px;
      height: 20px;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .content-preview {
      padding: 1rem;
      background: #0d0d12;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .preview-type {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .content-preview h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #f8fafc;
      margin: 0.5rem 0;
    }

    .preview-author {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
      margin-bottom: 0.5rem;
    }

    .form-group .required {
      color: #ef4444;
    }

    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #0d0d12;
      border: 1px solid #2a2a35;
      border-radius: 8px;
      color: #f8fafc;
      font-size: 0.9375rem;
      resize: vertical;
    }

    .form-group textarea:focus {
      outline: none;
      border-color: #ff6d5a;
    }

    .quick-reasons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
    }

    .quick-label {
      font-size: 0.8125rem;
      color: #64748b;
    }

    .quick-reasons button {
      padding: 0.375rem 0.75rem;
      background: #2a2a35;
      border: none;
      border-radius: 6px;
      color: #94a3b8;
      font-size: 0.8125rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .quick-reasons button:hover {
      background: #3a3a45;
      color: #f8fafc;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid #2a2a35;
    }

    .btn-secondary {
      padding: 0.625rem 1.25rem;
      background: #2a2a35;
      border: none;
      border-radius: 6px;
      color: #f8fafc;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #3a3a45;
    }

    .btn-danger {
      padding: 0.625rem 1.25rem;
      background: #ef4444;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .admin-content {
        padding: 1rem;
      }

      .page-header h1 {
        font-size: 1.25rem;
      }

      .filter-buttons {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.5rem;
      }

      .filter-btn {
        white-space: nowrap;
      }

      .content-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class AdminContentComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  contentResult = signal<PaginatedResult<ContentModerationDto> | null>(null);
  loading = signal(true);
  contentTypeFilter = signal<string | null>(null);
  hiddenFilter = signal<boolean | null>(null);
  hasReportsFilter = signal(false);

  hidingContent = signal<ContentModerationDto | null>(null);
  hideReason = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['contentType']) {
        this.contentTypeFilter.set(params['contentType']);
      }
      if (params['isHidden'] === 'true') {
        this.hiddenFilter.set(true);
      }
      if (params['hasReports'] === 'true') {
        this.hasReportsFilter.set(true);
      }
      this.loadContent();
    });
  }

  loadContent(): void {
    this.loading.set(true);
    this.adminService.getContent({
      contentType: this.contentTypeFilter() || undefined,
      isHidden: this.hiddenFilter() ?? undefined,
      hasReports: this.hasReportsFilter() || undefined
    }).subscribe({
      next: (result) => {
        this.contentResult.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setContentTypeFilter(type: string | null): void {
    this.contentTypeFilter.set(type);
    this.loadContent();
  }

  setHiddenFilter(hidden: boolean | null): void {
    this.hiddenFilter.set(hidden);
    this.loadContent();
  }

  toggleReportsFilter(): void {
    this.hasReportsFilter.set(!this.hasReportsFilter());
    this.loadContent();
  }

  getContentTypeLabel(type: string): string {
    switch (type) {
      case 'Post': return 'Yazı';
      case 'Question': return 'Soru';
      case 'Answer': return 'Cevap';
      case 'Comment': return 'Yorum';
      default: return type;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startHideContent(content: ContentModerationDto): void {
    this.hidingContent.set(content);
    this.hideReason = '';
  }

  cancelHide(): void {
    this.hidingContent.set(null);
  }

  setQuickReason(reason: string): void {
    this.hideReason = reason;
  }

  confirmHide(): void {
    const content = this.hidingContent();
    if (!content || !this.hideReason) return;

    this.adminService.hideContent(content.contentType, content.id, this.hideReason).subscribe({
      next: () => {
        this.cancelHide();
        this.loadContent();
      }
    });
  }

  unhideContent(content: ContentModerationDto): void {
    this.adminService.unhideContent(content.contentType, content.id).subscribe({
      next: () => {
        this.loadContent();
      }
    });
  }
}
