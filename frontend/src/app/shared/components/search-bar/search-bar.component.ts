import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar" [class.expanded]="isExpanded">
      <button class="search-toggle" (click)="toggleExpand()" *ngIf="!isExpanded">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      @if (isExpanded) {
        <div class="search-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Ara..." 
            [(ngModel)]="searchQuery"
            (keyup.enter)="search()"
            (blur)="onBlur()"
            #searchInput
          />
          <button class="close-btn" (click)="collapse()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .search-bar {
      position: relative;
    }

    .search-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: 1px solid var(--border-color, #2a2a35);
      border-radius: 10px;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: all 0.2s;
    }

    .search-toggle:hover {
      border-color: #ff6d5a;
      color: #ff6d5a;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--bg-secondary, #17171c);
      border: 1px solid #ff6d5a;
      border-radius: 10px;
      min-width: 300px;
    }

    .search-input-wrapper svg {
      color: var(--text-muted, #64748b);
      flex-shrink: 0;
    }

    .search-input-wrapper input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.9rem;
      background: transparent;
      color: var(--text-primary, #f8fafc);
    }

    .search-input-wrapper input::placeholder {
      color: var(--text-muted, #64748b);
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      background: transparent;
      border: none;
      color: var(--text-muted, #64748b);
      cursor: pointer;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #ff6d5a;
    }

    @media (max-width: 768px) {
      .search-input-wrapper {
        min-width: 200px;
      }
    }
  `]
})
export class SearchBarComponent {
  private readonly router = inject(Router);

  @Output() searchSubmit = new EventEmitter<string>();

  searchQuery = '';
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = true;
    setTimeout(() => {
      const input = document.querySelector('.search-input-wrapper input') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  collapse(): void {
    this.isExpanded = false;
    this.searchQuery = '';
  }

  onBlur(): void {
    if (!this.searchQuery.trim()) {
      setTimeout(() => this.collapse(), 200);
    }
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchSubmit.emit(this.searchQuery);
      this.collapse();
    }
  }
}
