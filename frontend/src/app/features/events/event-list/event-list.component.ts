import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EventsService, EventDto } from '../events.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="events-page">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">Etkinlikler</h1>
            <p class="page-desc">
              Teknoloji topluluğunun buluşma noktası. Meetup'lar, konferanslar ve workshoplar.
            </p>
          </div>
          <a routerLink="/events/new" class="btn btn-primary">
            + Etkinlik Oluştur
          </a>
        </div>

        <div class="events-toolbar">
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              [class.active]="activeFilter() === 'upcoming'"
              (click)="setFilter('upcoming')"
            >
              Yaklaşan
            </button>
            <button 
              class="filter-tab" 
              [class.active]="activeFilter() === 'past'"
              (click)="setFilter('past')"
            >
              Geçmiş
            </button>
          </div>

          <div class="type-filters">
            <button 
              class="type-btn" 
              [class.active]="typeFilter() === 'all'"
              (click)="setTypeFilter('all')"
            >
              Tümü
            </button>
            <button 
              class="type-btn" 
              [class.active]="typeFilter() === 'online'"
              (click)="setTypeFilter('online')"
            >
              🌐 Online
            </button>
            <button 
              class="type-btn" 
              [class.active]="typeFilter() === 'offline'"
              (click)="setTypeFilter('offline')"
            >
              📍 Yüz Yüze
            </button>
            <button 
              class="type-btn" 
              [class.active]="typeFilter() === 'hybrid'"
              (click)="setTypeFilter('hybrid')"
            >
              🔄 Hibrit
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-container">
            <app-loading-spinner />
          </div>
        } @else {
          <div class="events-grid">
            @for (event of filteredEvents(); track event.id) {
              <article class="event-card">
                <div class="event-image" [style.background-image]="'url(' + (event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400') + ')'">
                  <div class="event-type-badge" [class]="event.eventType.toLowerCase()">
                    {{ getEventTypeIcon(event.eventType) }} {{ getEventTypeLabel(event.eventType) }}
                  </div>
                </div>
                
                <div class="event-content">
                  <div class="event-date">
                    <div class="date-box">
                      <span class="date-day">{{ event.startDate | date:'dd' }}</span>
                      <span class="date-month">{{ event.startDate | date:'MMM' }}</span>
                    </div>
                    <div class="date-time">
                      <span class="time">{{ event.startDate | date:'HH:mm' }}</span>
                      @if (event.endDate) {
                        <span class="time-separator">-</span>
                        <span class="time">{{ event.endDate | date:'HH:mm' }}</span>
                      }
                    </div>
                  </div>

                  <h3 class="event-title">
                    <a [routerLink]="['/events', event.slug]">{{ event.title }}</a>
                  </h3>
                  
                  <p class="event-description">{{ event.description }}</p>

                  <div class="event-location">
                    @if (event.eventType === 'Online') {
                      <span class="location-icon">🌐</span>
                      <span>Online Etkinlik</span>
                    } @else {
                      <span class="location-icon">📍</span>
                      <span>{{ event.location || 'Konum belirtilmedi' }}</span>
                    }
                  </div>

                  <div class="event-footer">
                    <div class="event-organizer">
                      <div class="organizer-avatar">{{ event.createdByDisplayName.charAt(0) }}</div>
                      <span class="organizer-name">{{ event.createdByDisplayName }}</span>
                    </div>
                  </div>
                </div>
              </article>
            } @empty {
              <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>Etkinlik bulunamadı</h3>
                <p>Bu kriterlere uygun etkinlik yok.</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--text-primary, #ffffff);
    }

    .page-desc {
      color: var(--text-muted, #8a8a8a);
      font-size: 1rem;
      margin: 0;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-primary:hover {
      box-shadow: 0 0 24px rgba(255, 109, 90, 0.4);
      transform: translateY(-2px);
    }

    .events-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-tabs {
      display: flex;
      background: var(--bg-secondary, #17171c);
      border-radius: 10px;
      padding: 4px;
    }

    .filter-tab {
      background: transparent;
      border: none;
      color: var(--text-muted, #8a8a8a);
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .filter-tab.active {
      background: rgba(255, 109, 90, 0.15);
      color: #ff6d5a;
    }

    .type-filters {
      display: flex;
      gap: 0.5rem;
    }

    .type-btn {
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-muted, #8a8a8a);
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .type-btn:hover {
      border-color: var(--text-muted);
      color: var(--text-primary);
    }

    .type-btn.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem 0;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .event-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
    }

    .event-card:hover {
      border-color: #ff6d5a;
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .event-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .event-type-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    .event-type-badge.online {
      background: rgba(6, 182, 212, 0.9);
      color: white;
    }

    .event-type-badge.offline {
      background: rgba(34, 197, 94, 0.9);
      color: white;
    }

    .event-type-badge.hybrid {
      background: rgba(124, 58, 237, 0.9);
      color: white;
    }

    .free-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(255, 109, 90, 0.9);
      color: white;
    }

    .event-content {
      padding: 1.25rem;
    }

    .event-date {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .date-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      min-width: 50px;
    }

    .date-day {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }

    .date-month {
      font-size: 0.65rem;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .date-time {
      font-size: 0.875rem;
      color: var(--text-muted, #8a8a8a);
    }

    .time-separator {
      margin: 0 0.25rem;
    }

    .event-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .event-title a {
      color: var(--text-primary, #ffffff);
      text-decoration: none;
      transition: color 0.15s;
    }

    .event-title a:hover {
      color: #ff6d5a;
    }

    .event-description {
      font-size: 0.875rem;
      color: var(--text-muted, #8a8a8a);
      margin: 0 0 0.75rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .event-location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted, #8a8a8a);
      margin-bottom: 1rem;
    }

    .location-icon {
      font-size: 1rem;
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color, #2a2a35);
      margin-bottom: 0.75rem;
    }

    .event-organizer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .organizer-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6d5a, #ff5142);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .organizer-name {
      font-size: 0.8rem;
      color: var(--text-secondary, #b4b4b4);
    }

    .event-attendees {
      font-size: 0.8rem;
      color: var(--text-muted, #8a8a8a);
    }

    .attendee-count {
      font-weight: 600;
      color: var(--text-primary, #ffffff);
    }

    .attendee-max {
      opacity: 0.7;
    }

    .event-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .tag {
      background: rgba(255, 109, 90, 0.1);
      color: #ff6d5a;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 500;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted, #8a8a8a);
      margin: 0;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
      }

      .events-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .type-filters {
        flex-wrap: wrap;
        justify-content: center;
      }

      .events-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EventListComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  
  loading = signal(true);
  events = signal<EventDto[]>([]);
  filteredEvents = signal<EventDto[]>([]);
  activeFilter = signal<'upcoming' | 'past'>('upcoming');
  typeFilter = signal<'all' | 'online' | 'offline' | 'hybrid'>('all');

  ngOnInit(): void {
    this.loadEvents();
  }

  setFilter(filter: 'upcoming' | 'past'): void {
    this.activeFilter.set(filter);
    this.applyFilters();
  }

  setTypeFilter(type: 'all' | 'online' | 'offline' | 'hybrid'): void {
    this.typeFilter.set(type);
    this.applyFilters();
  }

  getEventTypeIcon(type: string): string {
    switch (type) {
      case 'Online': return '🌐';
      case 'Offline': return '📍';
      case 'Hybrid': return '🔄';
      default: return '';
    }
  }

  getEventTypeLabel(type: string): string {
    switch (type) {
      case 'Online': return 'Online';
      case 'Offline': return 'Yüz Yüze';
      case 'Hybrid': return 'Hibrit';
      default: return type;
    }
  }

  private applyFilters(): void {
    const now = new Date();
    let filtered = this.events();

    // Time filter
    if (this.activeFilter() === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.startDate) >= now);
    } else {
      filtered = filtered.filter(e => new Date(e.startDate) < now);
    }

    // Type filter
    if (this.typeFilter() !== 'all') {
      const typeMap: Record<string, string> = {
        'online': 'Online',
        'offline': 'Offline',
        'hybrid': 'Hybrid'
      };
      filtered = filtered.filter(e => e.eventType === typeMap[this.typeFilter()]);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return this.activeFilter() === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    this.filteredEvents.set(filtered);
  }

  private loadEvents(): void {
    this.eventsService.getEvents('all', 1, 50).subscribe({
      next: (response) => {
        this.events.set(response.items);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
