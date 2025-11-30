import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">
              <span class="logo-icon">🚀</span>
              TechCommunity
            </h3>
            <p class="footer-desc">
              Türkiye'nin en büyük yazılımcı ve teknoloji meraklısı topluluğu. 
              Bilgi paylaş, öğren, büyü.
            </p>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Keşfet</h4>
            <nav class="footer-nav">
              <a routerLink="/posts">Yazılar</a>
              <a routerLink="/questions">Sorular</a>
              <a routerLink="/tags">Etiketler</a>
              <a routerLink="/events">Etkinlikler</a>
            </nav>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Topluluk</h4>
            <nav class="footer-nav">
              <a routerLink="/about">Hakkımızda</a>
              <a routerLink="/guidelines">Topluluk Kuralları</a>
              <a routerLink="/faq">SSS</a>
              <a routerLink="/contact">İletişim</a>
            </nav>
          </div>

          <div class="footer-section">
            <h4 class="footer-heading">Yasal</h4>
            <nav class="footer-nav">
              <a routerLink="/privacy">Gizlilik Politikası</a>
              <a routerLink="/terms">Kullanım Şartları</a>
              <a routerLink="/cookies">Çerez Politikası</a>
            </nav>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} TechCommunity. Tüm hakları saklıdır.</p>
          <div class="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              𝕏
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              ⌘
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-dark, #09090c);
      color: var(--text-secondary, #b4b4b4);
      padding: 4rem 0 2rem;
      margin-top: auto;
      border-top: 1px solid var(--border-color, #2a2a35);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: 2fr repeat(3, 1fr);
      gap: 3rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid var(--border-color, #2a2a35);
    }

    .footer-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--text-primary, #f8fafc);
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .footer-desc {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.7;
      margin: 0;
    }

    .footer-heading {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 1.25rem;
      color: var(--text-muted, #94a3b8);
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-nav a {
      color: var(--text-muted, #94a3b8);
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.15s;
    }

    .footer-nav a:hover {
      color: #ff6d5a;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
    }

    .footer-bottom p {
      font-size: 0.875rem;
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--bg-secondary, #17171c);
      border: 1px solid var(--border-color, #2a2a35);
      color: var(--text-muted, #8a8a8a);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.15s;
    }

    .social-links a:hover {
      border-color: #ff6d5a;
      color: #ff6d5a;
      background: rgba(255, 109, 90, 0.1);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
