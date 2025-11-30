import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="markdown-content" [innerHTML]="sanitizedHtml()"></div>
  `,
  styles: [`
    .markdown-content {
      line-height: 1.7;
      
      :host ::ng-deep {
        h1, h2, h3, h4, h5, h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.3;
        }
        
        h1 { font-size: 2rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
        h2 { font-size: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
        h3 { font-size: 1.25rem; }
        h4 { font-size: 1rem; }
        
        p {
          margin-bottom: 1em;
        }
        
        a {
          color: var(--primary-color);
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
        
        code {
          background-color: var(--bg-tertiary);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.9em;
        }
        
        pre {
          background-color: var(--bg-tertiary);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
          
          code {
            background: none;
            padding: 0;
          }
        }
        
        blockquote {
          border-left: 4px solid var(--primary-color);
          margin: 1em 0;
          padding: 0.5em 1em;
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          
          p:last-child {
            margin-bottom: 0;
          }
        }
        
        ul, ol {
          margin: 1em 0;
          padding-left: 2em;
          
          li {
            margin-bottom: 0.5em;
          }
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          
          th, td {
            border: 1px solid var(--border-color);
            padding: 0.5em 1em;
            text-align: left;
          }
          
          th {
            background-color: var(--bg-secondary);
            font-weight: 600;
          }
          
          tr:nth-child(even) {
            background-color: var(--bg-secondary);
          }
        }
        
        img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        
        hr {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 2em 0;
        }
        
        .task-list-item {
          list-style: none;
          margin-left: -1.5em;
          
          input[type="checkbox"] {
            margin-right: 0.5em;
          }
        }
      }
    }
  `]
})
export class MarkdownViewerComponent implements OnChanges {
  @Input() content: string = '';
  @Input() sanitize: boolean = true;
  
  private readonly sanitizer = inject(DomSanitizer);
  
  sanitizedHtml = signal<SafeHtml>('');
  
  constructor() {
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.parseMarkdown();
    }
  }
  
  private async parseMarkdown(): Promise<void> {
    if (!this.content) {
      this.sanitizedHtml.set('');
      return;
    }
    
    try {
      const html = await marked(this.content);
      
      if (this.sanitize) {
        // Basic XSS protection - remove script tags and event handlers
        const cleanHtml = this.sanitizeHtml(html);
        this.sanitizedHtml.set(this.sanitizer.bypassSecurityTrustHtml(cleanHtml));
      } else {
        this.sanitizedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      }
    } catch (error) {
      console.error('Markdown parse error:', error);
      this.sanitizedHtml.set(this.content);
    }
  }
  
  private sanitizeHtml(html: string): string {
    // Remove script tags
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    clean = clean.replace(/\s*on\w+\s*=\s*(['"])[^'"]*\1/gi, '');
    clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');
    
    // Remove javascript: URLs
    clean = clean.replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gi, 'href="javascript:void(0)"');
    
    return clean;
  }
}
