import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService, AdminUserDto, PaginatedResult } from '../admin.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-users">
      <header class="page-header">
        <div class="header-content">
          <a routerLink="/admin" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Geri
          </a>
          <h1>Kullanıcı Yönetimi</h1>
        </div>
      </header>

      <!-- Filters -->
      <section class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
          />
        </div>
        <div class="filter-buttons">
          <button
            class="filter-btn"
            [class.active]="roleFilter() === null"
            (click)="setRoleFilter(null)"
          >
            Tümü
          </button>
          <button
            class="filter-btn"
            [class.active]="roleFilter() === 'Admin'"
            (click)="setRoleFilter('Admin')"
          >
            Admin
          </button>
          <button
            class="filter-btn"
            [class.active]="roleFilter() === 'Moderator'"
            (click)="setRoleFilter('Moderator')"
          >
            Moderatör
          </button>
          <button
            class="filter-btn"
            [class.active]="roleFilter() === 'User'"
            (click)="setRoleFilter('User')"
          >
            Kullanıcı
          </button>
          <button
            class="filter-btn banned-filter"
            [class.active]="bannedFilter()"
            (click)="toggleBannedFilter()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Yasaklı
          </button>
        </div>
      </section>

      <!-- Users Table -->
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Yükleniyor...</p>
        </div>
      } @else if (usersResult()?.items?.length) {
        <div class="users-table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>E-posta</th>
                <th>Rol</th>
                <th>Durum</th>
                <th>İçerik</th>
                <th>Kayıt Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              @for (user of usersResult()!.items; track user.id) {
                <tr [class.banned]="user.isBanned">
                  <td class="user-cell">
                    <img
                      [src]="user.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username"
                      [alt]="user.displayName || user.username"
                      class="user-avatar"
                    />
                    <div class="user-info">
                      <span class="username">{{ user.displayName || user.username }}</span>
                      <span class="handle">&#64;{{ user.username }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class]="user.role.toLowerCase()">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>
                  <td>
                    @if (user.isBanned) {
                      <span class="status-badge banned">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Yasaklı
                      </span>
                    } @else if (user.isActive) {
                      <span class="status-badge active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Aktif
                      </span>
                    } @else {
                      <span class="status-badge inactive">Pasif</span>
                    }
                  </td>
                  <td class="stats-cell">
                    <span title="Yazı">{{ user.postCount }} yazı</span>
                    <span title="Soru">{{ user.questionCount }} soru</span>
                    <span title="Cevap">{{ user.answerCount }} cevap</span>
                  </td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      @if (!editingUser() || editingUser()?.id !== user.id) {
                        <button
                          class="action-btn edit"
                          (click)="startEditUser(user)"
                          title="Düzenle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        @if (user.isBanned) {
                          <button
                            class="action-btn unban"
                            (click)="unbanUser(user)"
                            title="Yasağı Kaldır"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        } @else {
                          <button
                            class="action-btn ban"
                            (click)="startBanUser(user)"
                            title="Yasakla"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                        }
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p>Kullanıcı bulunamadı</p>
        </div>
      }

      <!-- Edit User Modal -->
      @if (editingUser()) {
        <div class="modal-overlay" (click)="cancelEdit()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Kullanıcı Düzenle</h2>
              <button class="close-btn" (click)="cancelEdit()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="user-preview">
                <img
                  [src]="editingUser()!.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + editingUser()!.username"
                  [alt]="editingUser()!.displayName || editingUser()!.username"
                  class="preview-avatar"
                />
                <div class="preview-info">
                  <span class="preview-name">{{ editingUser()!.displayName || editingUser()!.username }}</span>
                  <span class="preview-email">{{ editingUser()!.email }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Rol</label>
                <select [(ngModel)]="editRole">
                  <option value="User">Kullanıcı</option>
                  <option value="Moderator">Moderatör</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="cancelEdit()">İptal</button>
              <button class="btn-primary" (click)="saveUserRole()">Kaydet</button>
            </div>
          </div>
        </div>
      }

      <!-- Ban User Modal -->
      @if (banningUser()) {
        <div class="modal-overlay" (click)="cancelBan()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Kullanıcıyı Yasakla</h2>
              <button class="close-btn" (click)="cancelBan()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="user-preview warning">
                <img
                  [src]="banningUser()!.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + banningUser()!.username"
                  [alt]="banningUser()!.displayName || banningUser()!.username"
                  class="preview-avatar"
                />
                <div class="preview-info">
                  <span class="preview-name">{{ banningUser()!.displayName || banningUser()!.username }}</span>
                  <span class="preview-email">{{ banningUser()!.email }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>Yasak Sebebi <span class="required">*</span></label>
                <textarea
                  [(ngModel)]="banReason"
                  placeholder="Yasak sebebini açıklayın..."
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Yasak Bitiş Tarihi (Opsiyonel)</label>
                <input type="datetime-local" [(ngModel)]="banUntil" />
                <small>Boş bırakılırsa süresiz yasaklanır</small>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" (click)="cancelBan()">İptal</button>
              <button class="btn-danger" (click)="confirmBan()" [disabled]="!banReason">
                Yasakla
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-users {
      max-width: 1400px;
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
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 1rem;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 8px;
      flex: 1;
      min-width: 250px;
    }

    .search-box svg {
      width: 20px;
      height: 20px;
      color: #64748b;
    }

    .search-box input {
      flex: 1;
      padding: 0.75rem 0;
      background: transparent;
      border: none;
      color: #f8fafc;
      font-size: 0.9375rem;
    }

    .search-box input::placeholder {
      color: #64748b;
    }

    .search-box input:focus {
      outline: none;
    }

    .filter-buttons {
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

    .banned-filter.active {
      background: #ef4444;
      border-color: #ef4444;
    }

    /* Table */
    .users-table-container {
      overflow-x: auto;
      background: #17171c;
      border: 1px solid #2a2a35;
      border-radius: 12px;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #2a2a35;
    }

    .users-table th {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      background: #0d0d12;
    }

    .users-table tbody tr {
      transition: background 0.2s;
    }

    .users-table tbody tr:hover {
      background: #1e1e25;
    }

    .users-table tbody tr.banned {
      background: rgba(239, 68, 68, 0.05);
    }

    .users-table tbody tr:last-child td {
      border-bottom: none;
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .username {
      font-weight: 500;
      color: #f8fafc;
    }

    .handle {
      font-size: 0.875rem;
      color: #64748b;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .role-badge.admin {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .role-badge.moderator {
      background: rgba(168, 85, 247, 0.1);
      color: #c084fc;
    }

    .role-badge.user {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge svg {
      width: 14px;
      height: 14px;
    }

    .status-badge.active {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
    }

    .status-badge.banned {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .status-badge.inactive {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
    }

    .stats-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8125rem;
      color: #94a3b8;
    }

    .actions-cell {
      width: 100px;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn svg {
      width: 16px;
      height: 16px;
    }

    .action-btn.edit {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
    }

    .action-btn.edit:hover {
      background: #6366f1;
      color: white;
    }

    .action-btn.ban {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
    }

    .action-btn.ban:hover {
      background: #ef4444;
      color: white;
    }

    .action-btn.unban {
      background: rgba(34, 197, 94, 0.1);
      color: #4ade80;
    }

    .action-btn.unban:hover {
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

    .user-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #0d0d12;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .user-preview.warning {
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .preview-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    .preview-info {
      display: flex;
      flex-direction: column;
    }

    .preview-name {
      font-weight: 500;
      color: #f8fafc;
    }

    .preview-email {
      font-size: 0.875rem;
      color: #64748b;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
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

    .form-group select,
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: #0d0d12;
      border: 1px solid #2a2a35;
      border-radius: 8px;
      color: #f8fafc;
      font-size: 0.9375rem;
    }

    .form-group select:focus,
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #ff6d5a;
    }

    .form-group small {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.8125rem;
      color: #64748b;
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

    .btn-primary {
      padding: 0.625rem 1.25rem;
      background: #ff6d5a;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #ff5a45;
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
      .admin-users {
        padding: 1rem;
      }

      .page-header h1 {
        font-size: 1.25rem;
      }

      .filters-section {
        flex-direction: column;
      }

      .search-box {
        min-width: auto;
      }

      .filter-buttons {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.5rem;
      }

      .filter-btn {
        white-space: nowrap;
      }

      .users-table th,
      .users-table td {
        padding: 0.75rem;
        font-size: 0.875rem;
      }

      .stats-cell {
        display: none;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);

  usersResult = signal<PaginatedResult<AdminUserDto> | null>(null);
  loading = signal(true);
  roleFilter = signal<string | null>(null);
  bannedFilter = signal(false);
  searchQuery = '';

  editingUser = signal<AdminUserDto | null>(null);
  editRole = 'User';

  banningUser = signal<AdminUserDto | null>(null);
  banReason = '';
  banUntil = '';

  ngOnInit(): void {
    // Check query params for initial filters
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.roleFilter.set(params['role']);
      }
      if (params['isBanned'] === 'true') {
        this.bannedFilter.set(true);
      }
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminService.getUsers({
      role: this.roleFilter() || undefined,
      isBanned: this.bannedFilter() || undefined,
      search: this.searchQuery || undefined
    }).subscribe({
      next: (result) => {
        this.usersResult.set(result);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setRoleFilter(role: string | null): void {
    this.roleFilter.set(role);
    this.loadUsers();
  }

  toggleBannedFilter(): void {
    this.bannedFilter.set(!this.bannedFilter());
    this.loadUsers();
  }

  onSearchChange(): void {
    // Debounce would be nice here in production
    this.loadUsers();
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'Admin': return 'Admin';
      case 'Moderator': return 'Moderatör';
      case 'User': return 'Kullanıcı';
      default: return role;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  startEditUser(user: AdminUserDto): void {
    this.editingUser.set(user);
    this.editRole = user.role;
  }

  cancelEdit(): void {
    this.editingUser.set(null);
  }

  saveUserRole(): void {
    const user = this.editingUser();
    if (!user) return;

    this.adminService.updateUserRole(user.id, this.editRole as 'User' | 'Moderator' | 'Admin').subscribe({
      next: () => {
        this.cancelEdit();
        this.loadUsers();
      }
    });
  }

  startBanUser(user: AdminUserDto): void {
    this.banningUser.set(user);
    this.banReason = '';
    this.banUntil = '';
  }

  cancelBan(): void {
    this.banningUser.set(null);
  }

  confirmBan(): void {
    const user = this.banningUser();
    if (!user || !this.banReason) return;

    this.adminService.banUser(
      user.id,
      this.banReason,
      this.banUntil || undefined
    ).subscribe({
      next: () => {
        this.cancelBan();
        this.loadUsers();
      }
    });
  }

  unbanUser(user: AdminUserDto): void {
    this.adminService.unbanUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }
}
