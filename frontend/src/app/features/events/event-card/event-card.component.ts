import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventDto } from '../events.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="event-card" [class.compact]="compact">
      <div class="event-image" [style.background-image]="'url(' + (event.imageUrl || defaultImage) + ')'">
        <div class="event-type-badge" [class]="event.eventType.toLowerCase()">
          {{ eventTypeIcon() }} {{ eventTypeLabel() }}
        </div>
      </div>
      
      <div class="event-content">
        <div class="event-date">
          <div class="date-box">
            <span class="date-day">{{ event.startDate | date:'dd' }}</span>
            <span class="date-month">{{ event.startDate | date:'MMM' }}</span>
          </div>
          <div class="date-info">
            <span class="date-time">{{ event.startDate | date:'HH:mm' }}</span>
            @if (event.endDate) {
              <span class="time-separator">-</span>
              <span class="date-time">{{ event.endDate | date:'HH:mm' }}</span>
            }
            <span class="date-full">{{ event.startDate | date:'EEEE' }}</span>
          </div>
        </div>

        <h3 class="event-title">
          <a [routerLink]="['/events', event.slug]">{{ event.title }}</a>
        </h3>
        
        @if (!compact) {
          <p class="event-description">{{ event.description }}</p>
        }

        <div class="event-location">
          @if (event.eventType === 'Online') {
            <span class="location-icon">🌐</span>
            <span>Online Etkinlik</span>
          } @else {
            <span class="location-icon">📍</span>
            <span>{{ event.location || 'Konum belirtilmedi' }}</span>
          }
        </div>

        @if (!compact) {
          <div class="event-footer">
            <div class="event-organizer">
              <div class="organizer-avatar">{{ event.createdByDisplayName.charAt(0) }}</div>
              <span class="organizer-name">{{ event.createdByDisplayName }}</span>
            </div>
          </div>
        }
      </div>
    </article>
  `,
  styles: [`
    .event-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .event-card:hover {
      border-color: #ff6d5a;
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .event-card.compact {
      flex-direction: row;
      border-radius: 12px;
    }

    .event-card.compact:hover {
      transform: translateY(-2px);
    }

    .event-image {
      height: 160px;
      background-size: cover;
      background-position: center;
      position: relative;
      flex-shrink: 0;
    }

    .compact .event-image {
      width: 120px;
      height: 100%;
      min-height: 100px;
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

    .compact .event-type-badge {
      top: 8px;
      left: 8px;
      padding: 0.25rem 0.5rem;
      font-size: 0.65rem;
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

    .event-content {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .compact .event-content {
      padding: 1rem;
    }

    .event-date {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .compact .event-date {
      margin-bottom: 0.5rem;
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

    .compact .date-box {
      padding: 0.35rem 0.5rem;
      min-width: 40px;
    }

    .date-day {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1;
    }

    .compact .date-day {
      font-size: 1rem;
    }

    .date-month {
      font-size: 0.65rem;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .compact .date-month {
      font-size: 0.55rem;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .date-time {
      font-size: 0.875rem;
      color: var(--text-primary, #ffffff);
      font-weight: 500;
    }

    .compact .date-time {
      font-size: 0.75rem;
    }

    .time-separator {
      margin: 0 0.25rem;
      color: var(--text-muted, #8a8a8a);
    }

    .date-full {
      font-size: 0.75rem;
      color: var(--text-muted, #8a8a8a);
    }

    .compact .date-full {
      display: none;
    }

    .event-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      line-height: 1.4;
    }

    .compact .event-title {
      font-size: 0.95rem;
      margin-bottom: 0.375rem;
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
      margin-top: auto;
    }

    .compact .event-location {
      font-size: 0.75rem;
    }

    .location-icon {
      font-size: 0.9rem;
    }

    .compact .location-icon {
      font-size: 0.8rem;
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-color, #2a2a35);
      margin-top: 0.75rem;
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
  `]
})
export class EventCardComponent {
  @Input({ required: true }) event!: EventDto;
  @Input() compact = false;

  readonly defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400';

  eventTypeIcon = computed(() => {
    switch (this.event.eventType) {
      case 'Online': return '🌐';
      case 'Offline': return '📍';
      case 'Hybrid': return '🔄';
      default: return '';
    }
  });

  eventTypeLabel = computed(() => {
    switch (this.event.eventType) {
      case 'Online': return 'Online';
      case 'Offline': return 'Yüz Yüze';
      case 'Hybrid': return 'Hibrit';
      default: return this.event.eventType;
    }
  });
}
