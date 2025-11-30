import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventsService, EventDto } from '../../events/events.service';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="upcoming-events-widget">
      <div class="widget-header">
        <h3 class="widget-title">📅 Yaklaşan Etkinlikler</h3>
        <a routerLink="/events" class="view-all">Tümünü Gör →</a>
      </div>

      @if (loading()) {
        <div class="loading-state">
          @for (i of [1, 2, 3]; track i) {
            <div class="event-skeleton">
              <div class="skeleton-date"></div>
              <div class="skeleton-content">
                <div class="skeleton-title"></div>
                <div class="skeleton-location"></div>
              </div>
            </div>
          }
        </div>
      } @else if (events().length > 0) {
        <div class="events-list">
          @for (event of events(); track event.id) {
            <a [routerLink]="['/events', event.slug]" class="event-item">
              <div class="event-date">
                <span class="date-day">{{ event.startDate | date:'dd' }}</span>
                <span class="date-month">{{ event.startDate | date:'MMM' }}</span>
              </div>
              <div class="event-info">
                <h4 class="event-title">{{ event.title }}</h4>
                <div class="event-meta">
                  <span class="event-type" [class]="event.eventType.toLowerCase()">
                    {{ getEventTypeIcon(event.eventType) }}
                  </span>
                  <span class="event-time">{{ event.startDate | date:'HH:mm' }}</span>
                  @if (event.eventType !== 'Online' && event.location) {
                    <span class="event-location">{{ truncateLocation(event.location) }}</span>
                  } @else {
                    <span class="event-location">Online</span>
                  }
                </div>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="empty-state">
          <p>Yaklaşan etkinlik yok.</p>
          <a routerLink="/events/new" class="create-link">+ Etkinlik Oluştur</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .upcoming-events-widget {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      padding: 1.25rem;
    }

    .widget-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .widget-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      margin: 0;
    }

    .view-all {
      font-size: 0.8rem;
      color: #ff6d5a;
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .event-skeleton {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-primary, #0d0d12);
      border-radius: 10px;
    }

    .skeleton-date {
      width: 44px;
      height: 44px;
      background: var(--border-color, #2a2a35);
      border-radius: 8px;
      animation: pulse 1.5s infinite;
    }

    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .skeleton-title {
      height: 14px;
      width: 80%;
      background: var(--border-color, #2a2a35);
      border-radius: 4px;
      animation: pulse 1.5s infinite;
    }

    .skeleton-location {
      height: 12px;
      width: 60%;
      background: var(--border-color, #2a2a35);
      border-radius: 4px;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .events-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .event-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-primary, #0d0d12);
      border: 1px solid transparent;
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.15s;
    }

    .event-item:hover {
      border-color: var(--border-color, #2a2a35);
      transform: translateX(4px);
    }

    .event-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .date-day {
      font-size: 1rem;
      font-weight: 700;
      color: white;
      line-height: 1;
    }

    .date-month {
      font-size: 0.55rem;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.9);
    }

    .event-info {
      flex: 1;
      min-width: 0;
    }

    .event-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted, #8a8a8a);
    }

    .event-type {
      font-size: 0.8rem;
    }

    .event-time {
      font-weight: 500;
    }

    .event-location {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .empty-state {
      text-align: center;
      padding: 1.5rem 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted, #8a8a8a);
      font-size: 0.875rem;
      margin: 0 0 0.75rem;
    }

    .create-link {
      display: inline-block;
      color: #ff6d5a;
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
    }

    .create-link:hover {
      text-decoration: underline;
    }
  `]
})
export class UpcomingEventsComponent implements OnInit {
  private readonly eventsService = inject(EventsService);

  loading = signal(true);
  events = signal<EventDto[]>([]);

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  getEventTypeIcon(type: string): string {
    switch (type) {
      case 'Online': return '🌐';
      case 'Offline': return '📍';
      case 'Hybrid': return '🔄';
      default: return '';
    }
  }

  truncateLocation(location: string): string {
    const maxLength = 20;
    if (location.length <= maxLength) return location;
    return location.substring(0, maxLength) + '...';
  }

  private loadUpcomingEvents(): void {
    this.eventsService.getUpcomingEvents(5).subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
