import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination" *ngIf="totalPages() > 1" aria-label="Sayfalama">
      <ul class="pagination-list">
        <li>
          <button 
            class="pagination-btn" 
            [disabled]="!hasPreviousPage()"
            (click)="onPageChange(currentPage() - 1)"
            aria-label="Önceki sayfa">
            <span class="pagination-icon">‹</span>
            <span class="sr-only">Önceki</span>
          </button>
        </li>
        
        @for (page of visiblePages(); track page) {
          @if (page === -1) {
            <li class="pagination-ellipsis">...</li>
          } @else {
            <li>
              <button 
                class="pagination-btn"
                [class.active]="page === currentPage()"
                (click)="onPageChange(page)"
                [attr.aria-current]="page === currentPage() ? 'page' : null">
                {{ page }}
              </button>
            </li>
          }
        }
        
        <li>
          <button 
            class="pagination-btn" 
            [disabled]="!hasNextPage()"
            (click)="onPageChange(currentPage() + 1)"
            aria-label="Sonraki sayfa">
            <span class="pagination-icon">›</span>
            <span class="sr-only">Sonraki</span>
          </button>
        </li>
      </ul>
      
      <div class="pagination-info">
        Toplam {{ totalCount() }} kayıt, Sayfa {{ currentPage() }} / {{ totalPages() }}
      </div>
    </nav>
  `,
  styles: [`
    .pagination {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0;
    }

    .pagination-list {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      gap: 0.25rem;
    }

    .pagination-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      height: 2.5rem;
      padding: 0 0.75rem;
      border: 1px solid var(--border-color, #e2e8f0);
      background: var(--bg-secondary, #fff);
      color: var(--text-primary, #1a202c);
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--primary-color, #3182ce);
      color: white;
      border-color: var(--primary-color, #3182ce);
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-btn.active {
      background: var(--primary-color, #3182ce);
      color: white;
      border-color: var(--primary-color, #3182ce);
    }

    .pagination-ellipsis {
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      color: var(--text-muted, #718096);
    }

    .pagination-icon {
      font-size: 1.25rem;
      line-height: 1;
    }

    .pagination-info {
      font-size: 0.875rem;
      color: var(--text-muted, #718096);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalCount = input.required<number>();
  hasPreviousPage = input<boolean>(false);
  hasNextPage = input<boolean>(false);
  
  pageChange = output<number>();

  visiblePages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (current > 3) {
        pages.push(-1); // ellipsis
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push(-1); // ellipsis
      }
      
      pages.push(total);
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }
}
