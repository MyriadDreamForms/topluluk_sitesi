import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EventDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventType: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  endDate?: string;
  location?: string;
  onlineUrl?: string;
  imageUrl?: string;
  createdById: string;
  createdByUsername: string;
  createdByDisplayName: string;
  isPublished: boolean;
  createdAt: string;
}

export interface EventDetailDto extends EventDto {
  descriptionHtml?: string;
  organizer: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    title?: string;
  };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventType: 'Online' | 'Offline' | 'Hybrid';
  startDate: string;
  endDate?: string;
  location?: string;
  onlineUrl?: string;
  imageUrl?: string;
}

export interface UpdateEventRequest extends CreateEventRequest {
  isPublished?: boolean;
}

export interface EventsResponse {
  items: EventDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/events`;

  private readonly mockEvents: EventDetailDto[] = [
    {
      id: '1',
      title: 'İstanbul Tech Meetup #42',
      slug: 'istanbul-tech-meetup-42',
      description: 'Frontend teknolojileri ve modern web geliştirme pratikleri üzerine konuşacağımız aylık buluşmamız.',
      descriptionHtml: '<p>Frontend teknolojileri ve modern web geliştirme pratikleri üzerine konuşacağımız aylık buluşmamız.</p><h3>Program</h3><ul><li>18:30 - Açılış ve Networking</li><li>19:00 - React Server Components</li><li>19:45 - Ara</li><li>20:00 - Tailwind CSS Best Practices</li><li>20:45 - Q&A ve Kapanış</li></ul>',
      eventType: 'Offline',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
      location: 'Google Türkiye, Levent, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      createdById: '1',
      createdByUsername: 'techcommunity',
      createdByDisplayName: 'Tech Community TR',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '1',
        username: 'techcommunity',
        displayName: 'Tech Community TR',
        avatarUrl: undefined,
        title: 'Topluluk Yöneticisi'
      }
    },
    {
      id: '2',
      title: 'AI & Machine Learning Workshop',
      slug: 'ai-ml-workshop',
      description: 'Yapay zeka ve makine öğrenimi temellerini öğreneceğiniz uygulamalı workshop. Başlangıç seviyesi.',
      descriptionHtml: '<p>Yapay zeka ve makine öğrenimi temellerini öğreneceğiniz uygulamalı workshop.</p><h3>Neler Öğreneceksiniz?</h3><ul><li>Python ile veri manipülasyonu</li><li>Makine öğrenimi temelleri</li><li>Scikit-learn ile model oluşturma</li><li>Gerçek dünya uygulamaları</li></ul><p><strong>Gereksinimler:</strong> Python temel bilgisi</p>',
      eventType: 'Online',
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      onlineUrl: 'https://zoom.us/j/123456',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      createdById: '2',
      createdByUsername: 'datascience',
      createdByDisplayName: 'Data Science Türkiye',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '2',
        username: 'datascience',
        displayName: 'Data Science Türkiye',
        avatarUrl: undefined,
        title: 'Veri Bilimi Uzmanı'
      }
    },
    {
      id: '3',
      title: 'DevOps & Cloud Native Konferansı',
      slug: 'devops-cloud-native-konferansi',
      description: 'Kubernetes, Docker, CI/CD ve cloud native teknolojiler üzerine tam gün konferans.',
      descriptionHtml: '<p>Kubernetes, Docker, CI/CD ve cloud native teknolojiler üzerine tam gün konferans.</p><h3>Konuşmacılar</h3><ul><li>Mehmet Yılmaz - Kubernetes Güvenliği</li><li>Ayşe Kaya - GitOps ile Infrastructure as Code</li><li>Ali Demir - Microservices Monitoring</li></ul>',
      eventType: 'Hybrid',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      location: 'Bilgi Üniversitesi, Santral İstanbul',
      onlineUrl: 'https://youtube.com/live/xyz',
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      createdById: '3',
      createdByUsername: 'cloudnative',
      createdByDisplayName: 'Cloud Native TR',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '3',
        username: 'cloudnative',
        displayName: 'Cloud Native TR',
        avatarUrl: undefined,
        title: 'DevOps Engineer'
      }
    },
    {
      id: '4',
      title: 'Ankara JavaScript Meetup',
      slug: 'ankara-js-meetup',
      description: 'JavaScript ekosistemi ve modern framework\'ler hakkında sohbet ve networking.',
      descriptionHtml: '<p>JavaScript ekosistemi ve modern framework\'ler hakkında sohbet ve networking.</p><p>Her ay farklı konularda konuşmalar yapıyoruz. Bu ay Vue.js 3 ve Composition API üzerine olacak.</p>',
      eventType: 'Offline',
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'WeWork Ankara, Çankaya',
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      createdById: '4',
      createdByUsername: 'ankarajs',
      createdByDisplayName: 'Ankara JS',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '4',
        username: 'ankarajs',
        displayName: 'Ankara JS',
        avatarUrl: undefined,
        title: 'Frontend Developer'
      }
    },
    {
      id: '5',
      title: 'Startup Weekend Tech Edition',
      slug: 'startup-weekend-tech',
      description: '54 saatlik yoğun girişimcilik deneyimi. Fikir geliştirme, takım oluşturma ve pitch.',
      descriptionHtml: '<p>54 saatlik yoğun girişimcilik deneyimi!</p><h3>Program</h3><ul><li>Cuma 18:00 - Açılış ve Fikir Sunumları</li><li>Cumartesi - Mentor Seansları ve Çalışma</li><li>Pazar 17:00 - Final Pitches</li></ul>',
      eventType: 'Offline',
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'İTÜ Teknokent, Maslak, İstanbul',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      createdById: '5',
      createdByUsername: 'startupweekend',
      createdByDisplayName: 'Startup Weekend TR',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '5',
        username: 'startupweekend',
        displayName: 'Startup Weekend TR',
        avatarUrl: undefined,
        title: 'Etkinlik Organizatörü'
      }
    },
    {
      id: '6',
      title: 'Women in Tech Networking',
      slug: 'women-in-tech-networking',
      description: 'Teknoloji sektöründeki kadınlar için networking ve mentorluk etkinliği.',
      descriptionHtml: '<p>Teknoloji sektöründeki kadınlar için networking ve mentorluk etkinliği.</p><p>Bu etkinlikte:</p><ul><li>Kariyer deneyimleri paylaşımı</li><li>Birebir mentorluk fırsatı</li><li>Networking oturumları</li></ul>',
      eventType: 'Online',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      onlineUrl: 'https://meet.google.com/abc-xyz',
      imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
      createdById: '6',
      createdByUsername: 'womenintech',
      createdByDisplayName: 'Women in Tech TR',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: '6',
        username: 'womenintech',
        displayName: 'Women in Tech TR',
        avatarUrl: undefined,
        title: 'Topluluk Lideri'
      }
    },
    {
      id: '7',
      title: 'Geçmiş: Backend Development Bootcamp',
      slug: 'backend-development-bootcamp',
      description: 'Node.js ve .NET Core ile backend geliştirme bootcamp\'i.',
      descriptionHtml: '<p>Node.js ve .NET Core ile backend geliştirme bootcamp\'i tamamlandı.</p>',
      eventType: 'Offline',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
      location: 'Bahçeşehir Üniversitesi, Beşiktaş',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      createdById: '1',
      createdByUsername: 'techcommunity',
      createdByDisplayName: 'Tech Community TR',
      isPublished: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      organizer: {
        id: '1',
        username: 'techcommunity',
        displayName: 'Tech Community TR',
        avatarUrl: undefined,
        title: 'Topluluk Yöneticisi'
      }
    }
  ];

  getEvents(filter: 'upcoming' | 'past' | 'all' = 'all', page = 1, pageSize = 10): Observable<EventsResponse> {
    const now = new Date();
    let filtered = [...this.mockEvents];

    if (filter === 'upcoming') {
      filtered = filtered.filter(e => new Date(e.startDate) >= now);
      filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (filter === 'past') {
      filtered = filtered.filter(e => new Date(e.startDate) < now);
      filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    const response: EventsResponse = {
      items: paged,
      totalCount: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize)
    };

    return this.http.get<EventsResponse>(this.baseUrl, { params: { filter, page: page.toString(), pageSize: pageSize.toString() } }).pipe(
      catchError(() => of(response).pipe(delay(300)))
    );
  }

  getEventBySlug(slug: string): Observable<EventDetailDto | null> {
    const event = this.mockEvents.find(e => e.slug === slug);
    
    return this.http.get<EventDetailDto>(`${this.baseUrl}/${slug}`).pipe(
      catchError(() => of(event || null).pipe(delay(200)))
    );
  }

  getUpcomingEvents(limit = 5): Observable<EventDto[]> {
    const now = new Date();
    const upcoming = this.mockEvents
      .filter(e => new Date(e.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, limit);

    return this.http.get<EventDto[]>(`${this.baseUrl}/upcoming`, { params: { limit: limit.toString() } }).pipe(
      catchError(() => of(upcoming).pipe(delay(200)))
    );
  }

  createEvent(request: CreateEventRequest): Observable<EventDetailDto> {
    const newEvent: EventDetailDto = {
      id: Date.now().toString(),
      title: request.title,
      slug: this.generateSlug(request.title),
      description: request.description,
      descriptionHtml: `<p>${request.description}</p>`,
      eventType: request.eventType,
      startDate: request.startDate,
      endDate: request.endDate,
      location: request.location,
      onlineUrl: request.onlineUrl,
      imageUrl: request.imageUrl,
      createdById: 'current-user',
      createdByUsername: 'current-user',
      createdByDisplayName: 'Mevcut Kullanıcı',
      isPublished: true,
      createdAt: new Date().toISOString(),
      organizer: {
        id: 'current-user',
        username: 'current-user',
        displayName: 'Mevcut Kullanıcı',
        avatarUrl: undefined,
        title: 'Etkinlik Organizatörü'
      }
    };

    return this.http.post<EventDetailDto>(this.baseUrl, request).pipe(
      catchError(() => of(newEvent).pipe(delay(500)))
    );
  }

  updateEvent(id: string, request: UpdateEventRequest): Observable<EventDetailDto> {
    const existing = this.mockEvents.find(e => e.id === id);
    const updated: EventDetailDto = {
      ...(existing || this.mockEvents[0]),
      ...request,
      descriptionHtml: `<p>${request.description}</p>`
    };

    return this.http.put<EventDetailDto>(`${this.baseUrl}/${id}`, request).pipe(
      catchError(() => of(updated).pipe(delay(500)))
    );
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => of(undefined).pipe(delay(300)))
    );
  }

  private generateSlug(title: string): string {
    const turkishMap: Record<string, string> = {
      'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'I': 'I',
      'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U'
    };
    
    return title
      .split('')
      .map(char => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
