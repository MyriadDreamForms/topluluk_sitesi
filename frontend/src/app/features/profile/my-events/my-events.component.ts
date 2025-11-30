import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService, EventDetailDto } from '../../events/events.service';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-events-container">
      <div class="my-events-header">
        <h1>📅 Kayıtlı Etkinliklerim</h1>
        <p class="subtitle">Kayıt olduğunuz yaklaşan etkinlikler</p>
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Etkinlikler yükleniyor...</p>
        </div>
      } @else if (events().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>Henüz kayıtlı etkinliğiniz yok</h3>
          <p>Yaklaşan etkinliklere göz atın ve ilginizi çekenlere kayıt olun.</p>
          <a routerLink="/events" class="btn btn-primary">
            Etkinlikleri Keşfet
          </a>
        </div>
      } @else {
        <div class="events-list">
          @for (event of events(); track event.id) {
            <div class="event-card">
              <div class="event-image">
                @if (event.imageUrl) {
                  <img [src]="event.imageUrl" [alt]="event.title">
                } @else {
                  <div class="placeholder-image">📅</div>
                }
                <span class="event-type" [class]="event.eventType.toLowerCase()">
                  {{ getEventTypeLabel(event.eventType) }}
                </span>
              </div>
              
              <div class="event-content">
                <div class="event-date">
                  <span class="date-icon">🗓️</span>
                  {{ formatDate(event.startDate) }}
                </div>
                
                <h3 class="event-title">
                  <a [routerLink]="['/events', event.slug]">{{ event.title }}</a>
                </h3>
                
                <p class="event-description">{{ event.description }}</p>
                
                <div class="event-meta">
                  @if (event.location) {
                    <span class="location">📍 {{ event.location }}</span>
                  }
                  @if (event.onlineUrl) {
                    <span class="online">🌐 Online Katılım</span>
                  }
                </div>

                <div class="event-actions">
                  <a [routerLink]="['/events', event.slug]" class="btn btn-secondary">
                    Detayları Gör
                  </a>
                  <button 
                    class="btn btn-cancel" 
                    (click)="cancelRegistration(event)"
                    [disabled]="cancellingId() === event.id"
                  >
                    @if (cancellingId() === event.id) {
                      İptal ediliyor...
                    } @else {
                      Kaydı İptal Et
                    }
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (message()) {
        <div class="message" [class.success]="messageSuccess()" [class.error]="!messageSuccess()">
          {{ message() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .my-events-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .my-events-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: var(--text-primary, #e0e0e0);
        margin: 0 0 0.5rem 0;
      }

      .subtitle {
        color: var(--text-secondary, #9ca3af);
        font-size: 1rem;
        margin: 0;
      }
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem;
      color: var(--text-secondary, #9ca3af);

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--bg-tertiary, #2a2a35);
        border-top-color: var(--primary, #ff6d5a);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-secondary, #17171c);
      border-radius: 12px;
      border: 1px solid var(--border-color, #2a2a35);

      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      h3 {
        color: var(--text-primary, #e0e0e0);
        font-size: 1.5rem;
        margin: 0 0 0.5rem 0;
      }

      p {
        color: var(--text-secondary, #9ca3af);
        margin: 0 0 1.5rem 0;
      }
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .event-card {
      display: flex;
      gap: 1.5rem;
      background: var(--bg-secondary, #17171c);
      border-radius: 12px;
      border: 1px solid var(--border-color, #2a2a35);
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:hover {
        border-color: var(--primary, #ff6d5a);
        box-shadow: 0 4px 20px rgba(255, 109, 90, 0.1);
      }
    }

    .event-image {
      width: 200px;
      min-height: 180px;
      position: relative;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary, #2a2a35);
        font-size: 3rem;
      }

      .event-type {
        position: absolute;
        top: 0.75rem;
        left: 0.75rem;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;

        &.offline {
          background: #4ade80;
          color: #000;
        }

        &.online {
          background: #60a5fa;
          color: #000;
        }

        &.hybrid {
          background: #a78bfa;
          color: #000;
        }
      }
    }

    .event-content {
      flex: 1;
      padding: 1.5rem 1.5rem 1.5rem 0;
      display: flex;
      flex-direction: column;
    }

    .event-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary, #ff6d5a);
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .event-title {
      margin: 0 0 0.75rem 0;
      font-size: 1.25rem;

      a {
        color: var(--text-primary, #e0e0e0);
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: var(--primary, #ff6d5a);
        }
      }
    }

    .event-description {
      color: var(--text-secondary, #9ca3af);
      font-size: 0.9rem;
      margin: 0 0 0.75rem 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: var(--text-secondary, #9ca3af);
    }

    .event-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      border: none;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: var(--primary, #ff6d5a);
      color: #fff;

      &:hover:not(:disabled) {
        background: #ff8577;
      }
    }

    .btn-secondary {
      background: var(--bg-tertiary, #2a2a35);
      color: var(--text-primary, #e0e0e0);

      &:hover:not(:disabled) {
        background: #3a3a45;
      }
    }

    .btn-cancel {
      background: transparent;
      border: 1px solid #ef4444;
      color: #ef4444;

      &:hover:not(:disabled) {
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .message {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      animation: slideIn 0.3s ease;
      z-index: 1000;

      &.success {
        background: #4ade80;
        color: #000;
      }

      &.error {
        background: #ef4444;
        color: #fff;
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .event-card {
        flex-direction: column;
      }

      .event-image {
        width: 100%;
        height: 180px;
      }

      .event-content {
        padding: 1.25rem;
      }

      .event-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MyEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  events = signal<EventDetailDto[]>([]);
  loading = signal(true);
  cancellingId = signal<string | null>(null);
  message = signal('');
  messageSuccess = signal(false);

  ngOnInit() {
    this.loadMyEvents();
  }

  loadMyEvents() {
    this.loading.set(true);
    this.eventsService.getMyRegisteredEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showMessage('Etkinlikler yüklenirken hata oluştu.', false);
      }
    });
  }

  cancelRegistration(event: EventDetailDto) {
    this.cancellingId.set(event.id);
    this.eventsService.cancelRegistration(event.id).subscribe({
      next: (response) => {
        this.cancellingId.set(null);
        if (response.success) {
          // Remove from list
          this.events.update(events => events.filter(e => e.id !== event.id));
          this.showMessage(`"${event.title}" etkinliğinden kaydınız iptal edildi.`, true);
        } else {
          this.showMessage(response.message || 'Kayıt iptal edilemedi.', false);
        }
      },
      error: () => {
        this.cancellingId.set(null);
        this.showMessage('Kayıt iptal edilirken hata oluştu.', false);
      }
    });
  }

  getEventTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'Online': 'Online',
      'Offline': 'Yüz Yüze',
      'Hybrid': 'Hibrit'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('tr-TR', options);
  }

  private showMessage(text: string, success: boolean) {
    this.message.set(text);
    this.messageSuccess.set(success);
    setTimeout(() => this.message.set(''), 4000);
  }
}
