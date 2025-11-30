import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  questionCount: number;
  color?: string;
}

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="container">
      <div class="tags-page">
        <div class="page-header">
          <h1 class="page-title">Etiketler</h1>
          <p class="page-desc">
            Konulara göre içerikleri keşfedin. Etiketler yazıları ve soruları kategorize etmeye yardımcı olur.
          </p>
        </div>

        <div class="tags-toolbar">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Etiket ara..." 
              [(ngModel)]="searchQuery"
              (input)="filterTags()"
            />
          </div>

          <div class="sort-options">
            <button 
              class="sort-btn" 
              [class.active]="sortBy() === 'popular'"
              (click)="setSortBy('popular')"
            >
              Popüler
            </button>
            <button 
              class="sort-btn" 
              [class.active]="sortBy() === 'name'"
              (click)="setSortBy('name')"
            >
              A-Z
            </button>
            <button 
              class="sort-btn" 
              [class.active]="sortBy() === 'new'"
              (click)="setSortBy('new')"
            >
              Yeni
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-container">
            <app-loading-spinner />
          </div>
        } @else {
          <div class="tags-grid">
            @for (tag of filteredTags(); track tag.id) {
              <a [routerLink]="['/tags', tag.slug]" class="tag-card">
                <div class="tag-header">
                  <span class="tag-name" [style.color]="tag.color || '#ff6d5a'">
                    #{{ tag.name }}
                  </span>
                </div>
                <p class="tag-description">{{ tag.description }}</p>
                <div class="tag-stats">
                  <span class="stat">
                    <strong>{{ tag.postCount }}</strong> yazı
                  </span>
                  <span class="stat">
                    <strong>{{ tag.questionCount }}</strong> soru
                  </span>
                </div>
              </a>
            } @empty {
              <div class="empty-state">
                <div class="empty-icon">🏷️</div>
                <h3>Etiket bulunamadı</h3>
                <p>Arama kriterlerinize uygun etiket yok.</p>
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
      margin-bottom: 2rem;
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

    .tags-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      padding: 0.5rem 0.75rem;
      flex: 1;
      max-width: 300px;
      transition: all 0.2s;
    }

    .search-box:focus-within {
      border-color: #ff6d5a;
    }

    .search-icon {
      width: 16px;
      height: 16px;
      color: var(--text-muted, #8a8a8a);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      font-size: 0.875rem;
      color: var(--text-primary, #ffffff);
    }

    .search-input::placeholder {
      color: var(--text-muted, #8a8a8a);
    }

    .sort-options {
      display: flex;
      gap: 0.5rem;
    }

    .sort-btn {
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-muted, #8a8a8a);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s;
    }

    .sort-btn:hover {
      border-color: var(--text-muted);
      color: var(--text-primary);
    }

    .sort-btn.active {
      background: rgba(255, 109, 90, 0.1);
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 3rem 0;
    }

    .tags-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .tag-card {
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
      padding: 1.25rem;
      text-decoration: none;
      transition: all 0.2s;
    }

    .tag-card:hover {
      border-color: #ff6d5a;
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .tag-header {
      margin-bottom: 0.75rem;
    }

    .tag-name {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .tag-description {
      font-size: 0.875rem;
      color: var(--text-muted, #8a8a8a);
      margin: 0 0 1rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tag-stats {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--text-light, #6a6a6a);
    }

    .tag-stats strong {
      color: var(--text-primary, #ffffff);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 12px;
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

    @media (max-width: 640px) {
      .tags-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-box {
        max-width: none;
      }

      .sort-options {
        justify-content: center;
      }
    }
  `]
})
export class TagListComponent implements OnInit {
  loading = signal(true);
  tags = signal<Tag[]>([]);
  filteredTags = signal<Tag[]>([]);
  sortBy = signal<'popular' | 'name' | 'new'>('popular');
  searchQuery = '';

  ngOnInit(): void {
    this.loadTags();
  }

  setSortBy(sort: 'popular' | 'name' | 'new'): void {
    this.sortBy.set(sort);
    this.sortTags();
  }

  filterTags(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredTags.set(this.tags());
    } else {
      this.filteredTags.set(
        this.tags().filter(tag => 
          tag.name.toLowerCase().includes(query) ||
          tag.description.toLowerCase().includes(query)
        )
      );
    }
    this.sortTags();
  }

  private sortTags(): void {
    const sorted = [...this.filteredTags()];
    switch (this.sortBy()) {
      case 'popular':
        sorted.sort((a, b) => (b.postCount + b.questionCount) - (a.postCount + a.questionCount));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
        break;
      case 'new':
        // For now, reverse of popular (would use createdAt in real implementation)
        sorted.sort((a, b) => (a.postCount + a.questionCount) - (b.postCount + b.questionCount));
        break;
    }
    this.filteredTags.set(sorted);
  }

  private loadTags(): void {
    // Simulated data - will be replaced with actual API call
    setTimeout(() => {
      const mockTags: Tag[] = [
        {
          id: '1',
          name: 'JavaScript',
          slug: 'javascript',
          description: 'Web geliştirmenin temel programlama dili. Frontend ve backend geliştirme için kullanılır.',
          postCount: 234,
          questionCount: 156,
          color: '#f7df1e'
        },
        {
          id: '2',
          name: 'TypeScript',
          slug: 'typescript',
          description: 'JavaScript\'in tip güvenli süper kümesi. Büyük ölçekli uygulamalar için idealdir.',
          postCount: 189,
          questionCount: 98,
          color: '#3178c6'
        },
        {
          id: '3',
          name: 'Angular',
          slug: 'angular',
          description: 'Google tarafından geliştirilen güçlü frontend framework. Kurumsal uygulamalar için tercih edilir.',
          postCount: 145,
          questionCount: 87,
          color: '#dd0031'
        },
        {
          id: '4',
          name: 'React',
          slug: 'react',
          description: 'Facebook tarafından geliştirilen popüler UI kütüphanesi. Component tabanlı geliştirme yaklaşımı.',
          postCount: 198,
          questionCount: 134,
          color: '#61dafb'
        },
        {
          id: '5',
          name: 'Vue.js',
          slug: 'vuejs',
          description: 'Progresif JavaScript framework. Öğrenmesi kolay, güçlü ve esnek.',
          postCount: 112,
          questionCount: 67,
          color: '#42b883'
        },
        {
          id: '6',
          name: 'Node.js',
          slug: 'nodejs',
          description: 'JavaScript runtime. Sunucu tarafı uygulama geliştirmek için kullanılır.',
          postCount: 156,
          questionCount: 89,
          color: '#339933'
        },
        {
          id: '7',
          name: 'Python',
          slug: 'python',
          description: 'Çok amaçlı programlama dili. Veri bilimi, web geliştirme ve otomasyon için popüler.',
          postCount: 178,
          questionCount: 112,
          color: '#3776ab'
        },
        {
          id: '8',
          name: 'C#',
          slug: 'csharp',
          description: 'Microsoft tarafından geliştirilen nesne yönelimli programlama dili. .NET platformu için temel.',
          postCount: 98,
          questionCount: 54,
          color: '#512bd4'
        },
        {
          id: '9',
          name: '.NET',
          slug: 'dotnet',
          description: 'Microsoft\'un cross-platform geliştirme platformu. Web, masaüstü ve mobil uygulamalar için.',
          postCount: 87,
          questionCount: 45,
          color: '#512bd4'
        },
        {
          id: '10',
          name: 'Docker',
          slug: 'docker',
          description: 'Konteyner teknolojisi. Uygulamaları izole ortamlarda çalıştırmak için kullanılır.',
          postCount: 76,
          questionCount: 38,
          color: '#2496ed'
        },
        {
          id: '11',
          name: 'Kubernetes',
          slug: 'kubernetes',
          description: 'Konteyner orkestrasyon platformu. Mikroservis mimarisi için idealdir.',
          postCount: 54,
          questionCount: 32,
          color: '#326ce5'
        },
        {
          id: '12',
          name: 'PostgreSQL',
          slug: 'postgresql',
          description: 'Güçlü açık kaynak ilişkisel veritabanı. Kurumsal uygulamalar için tercih edilir.',
          postCount: 67,
          questionCount: 41,
          color: '#336791'
        },
        {
          id: '13',
          name: 'MongoDB',
          slug: 'mongodb',
          description: 'NoSQL document veritabanı. Esnek şema yapısı ve yüksek performans sunar.',
          postCount: 58,
          questionCount: 35,
          color: '#47a248'
        },
        {
          id: '14',
          name: 'Git',
          slug: 'git',
          description: 'Dağıtık versiyon kontrol sistemi. Kod yönetimi ve ekip çalışması için vazgeçilmez.',
          postCount: 89,
          questionCount: 56,
          color: '#f05032'
        },
        {
          id: '15',
          name: 'DevOps',
          slug: 'devops',
          description: 'Geliştirme ve operasyon süreçlerini birleştiren kültür ve pratikler.',
          postCount: 72,
          questionCount: 28,
          color: '#ff6d5a'
        },
        {
          id: '16',
          name: 'Machine Learning',
          slug: 'machine-learning',
          description: 'Yapay zeka alt dalı. Veriden öğrenen algoritmalar ve modeller.',
          postCount: 94,
          questionCount: 67,
          color: '#ff6f00'
        }
      ];

      this.tags.set(mockTags);
      this.filteredTags.set(mockTags);
      this.sortTags();
      this.loading.set(false);
    }, 300);
  }
}
