import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { EventsService, EventDetailDto } from '../events.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      @if (loading()) {
        <div class="loading-container">
          <app-loading-spinner />
        </div>
      } @else if (event()) {
        <article class="event-detail">
          <!-- Hero Section -->
          <div class="event-hero" [style.background-image]="'url(' + (event()!.imageUrl || defaultImage) + ')'">
            <div class="hero-overlay">
              <div class="hero-content">
                <div class="event-type-badge" [class]="event()!.eventType.toLowerCase()">
                  {{ eventTypeIcon() }} {{ eventTypeLabel() }}
                </div>
                <h1 class="event-title">{{ event()!.title }}</h1>
                <p class="event-description">{{ event()!.description }}</p>
              </div>
            </div>
          </div>

          <div class="event-body">
            <div class="event-main">
              <!-- Date & Time Card -->
              <div class="info-card date-card">
                <div class="card-icon">📅</div>
                <div class="card-content">
                  <h3>Tarih ve Saat</h3>
                  <div class="date-info">
                    <div class="date-primary">
                      {{ event()!.startDate | date:'d MMMM yyyy, EEEE' }}
                    </div>
                    <div class="date-time">
                      {{ event()!.startDate | date:'HH:mm' }}
                      @if (event()!.endDate) {
                        <span> - {{ event()!.endDate | date:'HH:mm' }}</span>
                      }
                    </div>
                  </div>
                </div>
                <button class="add-calendar-btn" (click)="addToCalendar()">
                  + Takvime Ekle
                </button>
              </div>

              <!-- Location Card -->
              <div class="info-card location-card">
                <div class="card-icon">
                  @if (event()!.eventType === 'Online') {
                    🌐
                  } @else {
                    📍
                  }
                </div>
                <div class="card-content">
                  <h3>Konum</h3>
                  @if (event()!.eventType === 'Online') {
                    <div class="location-text">Online Etkinlik</div>
                    @if (event()!.onlineUrl) {
                      <a [href]="event()!.onlineUrl" target="_blank" class="location-link">
                        Etkinliğe Katıl →
                      </a>
                    }
                  } @else {
                    <div class="location-text">{{ event()!.location }}</div>
                    @if (event()!.onlineUrl && event()!.eventType === 'Hybrid') {
                      <a [href]="event()!.onlineUrl" target="_blank" class="location-link">
                        Online Katılım →
                      </a>
                    }
                  }
                </div>
              </div>

              <!-- Description -->
              <div class="content-section">
                <h2>Etkinlik Detayları</h2>
                @if (event()!.descriptionHtml) {
                  <div class="description-content" [innerHTML]="event()!.descriptionHtml"></div>
                } @else {
                  <p class="description-content">{{ event()!.description }}</p>
                }
              </div>
            </div>

            <!-- Sidebar -->
            <aside class="event-sidebar">
              <!-- Organizer Card -->
              <div class="sidebar-card organizer-card">
                <h3>Organizatör</h3>
                <div class="organizer-info">
                  <div class="organizer-avatar">
                    {{ event()!.organizer.displayName.charAt(0) }}
                  </div>
                  <div class="organizer-details">
                    <a [routerLink]="['/users', event()!.organizer.username]" class="organizer-name">
                      {{ event()!.organizer.displayName }}
                    </a>
                    @if (event()!.organizer.title) {
                      <span class="organizer-title">{{ event()!.organizer.title }}</span>
                    }
                  </div>
                </div>
              </div>

              <!-- Share Card -->
              <div class="sidebar-card share-card">
                <h3>Paylaş</h3>
                <div class="share-buttons">
                  <button class="share-btn twitter" (click)="shareTwitter()">
                    𝕏
                  </button>
                  <button class="share-btn linkedin" (click)="shareLinkedIn()">
                    in
                  </button>
                  <button class="share-btn copy" (click)="copyLink()">
                    {{ copied() ? '✓' : '🔗' }}
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="sidebar-actions">
                @if (isLoggedIn()) {
                  @if (isRegistered()) {
                    <button 
                      class="btn btn-registered btn-block" 
                      (click)="cancelRegistration()"
                      [disabled]="registering()"
                    >
                      @if (registering()) {
                        İptal ediliyor...
                      } @else {
                        ✓ Kayıtlısınız - İptal Et
                      }
                    </button>
                  } @else {
                    <button 
                      class="btn btn-primary btn-block" 
                      (click)="registerForEvent()"
                      [disabled]="registering()"
                    >
                      @if (registering()) {
                        Kayıt yapılıyor...
                      } @else {
                        Kayıt Ol
                      }
                    </button>
                  }
                } @else {
                  <a routerLink="/auth/login" [queryParams]="{returnUrl: currentUrl}" class="btn btn-primary btn-block">
                    Kayıt Olmak İçin Giriş Yap
                  </a>
                }
                @if (registrationMessage()) {
                  <div class="registration-message" [class.success]="registrationSuccess()" [class.error]="!registrationSuccess()">
                    {{ registrationMessage() }}
                  </div>
                }
                <a routerLink="/events" class="btn btn-secondary btn-block">
                  ← Tüm Etkinlikler
                </a>
              </div>
            </aside>
          </div>
        </article>
      } @else {
        <div class="not-found">
          <div class="not-found-icon">📅</div>
          <h2>Etkinlik Bulunamadı</h2>
          <p>Aradığınız etkinlik mevcut değil veya kaldırılmış olabilir.</p>
          <a routerLink="/events" class="btn btn-primary">
            Tüm Etkinlikler
          </a>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem 2rem;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
    }

    .event-hero {
      height: 320px;
      background-size: cover;
      background-position: center;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 2rem;
      position: relative;
    }

    .hero-overlay {
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(13, 13, 18, 0.95), rgba(13, 13, 18, 0.3));
      display: flex;
      align-items: flex-end;
      padding: 2rem;
    }

    .hero-content {
      max-width: 800px;
    }

    .event-type-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1rem;
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

    .event-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.75rem;
      line-height: 1.3;
    }

    .event-description {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      line-height: 1.5;
    }

    .event-body {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
    }

    .event-main {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .card-icon {
      font-size: 1.5rem;
      width: 48px;
      height: 48px;
      background: rgba(255, 109, 90, 0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
    }

    .card-content h3 {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted, #8a8a8a);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.5rem;
    }

    .date-primary {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
    }

    .date-time {
      font-size: 0.95rem;
      color: var(--text-muted, #8a8a8a);
      margin-top: 0.25rem;
    }

    .add-calendar-btn {
      background: rgba(255, 109, 90, 0.1);
      border: 1px solid rgba(255, 109, 90, 0.3);
      color: #ff6d5a;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .add-calendar-btn:hover {
      background: rgba(255, 109, 90, 0.2);
      border-color: #ff6d5a;
    }

    .location-text {
      font-size: 1rem;
      color: var(--text-primary, #ffffff);
    }

    .location-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: #ff6d5a;
      font-size: 0.9rem;
      text-decoration: none;
      font-weight: 500;
    }

    .location-link:hover {
      text-decoration: underline;
    }

    .content-section {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .content-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      margin: 0 0 1rem;
    }

    .description-content {
      font-size: 1rem;
      color: var(--text-secondary, #b4b4b4);
      line-height: 1.7;
    }

    .description-content :global(h3) {
      color: var(--text-primary, #ffffff);
      font-size: 1.1rem;
      margin: 1.5rem 0 0.75rem;
    }

    .description-content :global(ul) {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }

    .description-content :global(li) {
      margin: 0.375rem 0;
    }

    .description-content :global(p) {
      margin: 0.75rem 0;
    }

    .event-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sidebar-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.25rem;
    }

    .sidebar-card h3 {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted, #8a8a8a);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 1rem;
    }

    .organizer-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .organizer-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6d5a, #ff5142);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .organizer-details {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .organizer-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #ffffff);
      text-decoration: none;
    }

    .organizer-name:hover {
      color: #ff6d5a;
    }

    .organizer-title {
      font-size: 0.85rem;
      color: var(--text-muted, #8a8a8a);
    }

    .share-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .share-btn {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      border: 1px solid var(--border-color, #2a2a35);
      background: var(--bg-primary, #0d0d12);
      color: var(--text-primary, #ffffff);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .share-btn:hover {
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .share-btn.twitter:hover {
      background: rgba(29, 155, 240, 0.1);
      border-color: #1d9bf0;
      color: #1d9bf0;
    }

    .share-btn.linkedin:hover {
      background: rgba(10, 102, 194, 0.1);
      border-color: #0a66c2;
      color: #0a66c2;
    }

    .sidebar-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.875rem 1.25rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff6d5a 0%, #ff5142 100%);
      color: white;
    }

    .btn-primary:hover {
      box-shadow: 0 0 24px rgba(255, 109, 90, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-registered {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #22c55e;
    }

    .btn-registered:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ef4444;
    }

    .btn-registered:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .registration-message {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      text-align: center;
    }

    .registration-message.success {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #22c55e;
    }

    .registration-message.error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }

    .btn-secondary {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-primary, #ffffff);
    }

    .btn-secondary:hover {
      border-color: var(--text-muted);
    }

    .btn-block {
      display: block;
      width: 100%;
    }

    .not-found {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 16px;
    }

    .not-found-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
    }

    .not-found h2 {
      font-size: 1.5rem;
      color: var(--text-primary, #ffffff);
      margin: 0 0 0.75rem;
    }

    .not-found p {
      color: var(--text-muted, #8a8a8a);
      margin: 0 0 1.5rem;
    }

    @media (max-width: 900px) {
      .event-body {
        grid-template-columns: 1fr;
      }

      .event-hero {
        height: 240px;
      }

      .event-title {
        font-size: 1.5rem;
      }

      .hero-overlay {
        padding: 1.5rem;
      }

      .info-card {
        flex-wrap: wrap;
      }

      .add-calendar-btn {
        width: 100%;
        margin-top: 0.75rem;
      }
    }
  `]
})
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);
  private readonly authService = inject(AuthService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  loading = signal(true);
  event = signal<EventDetailDto | null>(null);
  copied = signal(false);
  
  // Registration state
  isRegistered = signal(false);
  registering = signal(false);
  registrationMessage = signal<string | null>(null);
  registrationSuccess = signal(false);

  readonly defaultImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

  isLoggedIn = computed(() => this.authService.isAuthenticated());
  currentUrl = '';

  eventTypeIcon = computed(() => {
    const e = this.event();
    if (!e) return '';
    switch (e.eventType) {
      case 'Online': return '🌐';
      case 'Offline': return '📍';
      case 'Hybrid': return '🔄';
      default: return '';
    }
  });

  eventTypeLabel = computed(() => {
    const e = this.event();
    if (!e) return '';
    switch (e.eventType) {
      case 'Online': return 'Online';
      case 'Offline': return 'Yüz Yüze';
      case 'Hybrid': return 'Hibrit';
      default: return e.eventType;
    }
  });

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadEvent(slug);
    } else {
      this.loading.set(false);
    }
  }

  registerForEvent(): void {
    const e = this.event();
    if (!e || this.registering()) return;

    this.registering.set(true);
    this.registrationMessage.set(null);

    this.eventsService.registerForEvent(e.id).subscribe({
      next: (response) => {
        this.isRegistered.set(true);
        this.registrationSuccess.set(true);
        this.registrationMessage.set(response.message);
        this.registering.set(false);
        
        // Clear message after 5 seconds
        setTimeout(() => this.registrationMessage.set(null), 5000);
      },
      error: (err) => {
        this.registrationSuccess.set(false);
        this.registrationMessage.set(err.error?.message || 'Kayıt sırasında bir hata oluştu.');
        this.registering.set(false);
      }
    });
  }

  cancelRegistration(): void {
    const e = this.event();
    if (!e || this.registering()) return;

    this.registering.set(true);
    this.registrationMessage.set(null);

    this.eventsService.cancelRegistration(e.id).subscribe({
      next: (response) => {
        this.isRegistered.set(false);
        this.registrationSuccess.set(true);
        this.registrationMessage.set(response.message);
        this.registering.set(false);
        
        setTimeout(() => this.registrationMessage.set(null), 5000);
      },
      error: (err) => {
        this.registrationSuccess.set(false);
        this.registrationMessage.set(err.error?.message || 'İptal sırasında bir hata oluştu.');
        this.registering.set(false);
      }
    });
  }

  addToCalendar(): void {
    const e = this.event();
    if (!e) return;

    const startDate = new Date(e.startDate);
    const endDate = e.endDate ? new Date(e.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(e.description)}&location=${encodeURIComponent(e.location || e.onlineUrl || '')}`;

    window.open(calendarUrl, '_blank');
  }

  shareTwitter(): void {
    const e = this.event();
    if (!e) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(e.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }

  shareLinkedIn(): void {
    const e = this.event();
    if (!e) return;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=550,height=420');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  private loadEvent(slug: string): void {
    this.eventsService.getEventBySlug(slug).subscribe({
      next: (event) => {
        this.event.set(event);
        if (event) {
          this.updateMeta(event);
          // Check if user is registered
          if (this.isLoggedIn()) {
            this.checkRegistrationStatus(event.id);
          }
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private checkRegistrationStatus(eventId: string): void {
    this.eventsService.checkRegistration(eventId).subscribe({
      next: (response) => {
        this.isRegistered.set(response.isRegistered);
      },
      error: () => {
        this.isRegistered.set(false);
      }
    });
  }

  private updateMeta(event: EventDetailDto): void {
    this.title.setTitle(`${event.title} | Etkinlikler | Tech Community`);
    this.meta.updateTag({ name: 'description', content: event.description });
    this.meta.updateTag({ property: 'og:title', content: event.title });
    this.meta.updateTag({ property: 'og:description', content: event.description });
    this.meta.updateTag({ property: 'og:type', content: 'event' });
    if (event.imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: event.imageUrl });
    }
  }
}
