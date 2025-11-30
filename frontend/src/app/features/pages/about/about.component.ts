import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Hakkımızda</h1>
      </div>
      
      <div class="page-content">
        <section class="content-section">
          <h2>TechCommunity Nedir?</h2>
          <p>
            TechCommunity, Türkiye'deki yazılımcılar, veri bilimciler, araştırmacılar ve teknoloji 
            meraklılarının buluştuğu bir topluluk platformudur. 2024 yılında kurulan platformumuz, 
            bilgi paylaşımını teşvik etmek ve Türkiye'nin teknoloji ekosistemini güçlendirmek 
            amacıyla hizmet vermektedir.
          </p>
        </section>

        <section class="content-section">
          <h2>Misyonumuz</h2>
          <p>
            Türkiye'deki teknoloji topluluğunu bir araya getirerek, bilgi paylaşımını kolaylaştırmak, 
            işbirliğini artırmak ve herkesin teknoloji alanında gelişmesine katkıda bulunmak.
          </p>
        </section>

        <section class="content-section">
          <h2>Vizyonumuz</h2>
          <p>
            Türkiye'nin en büyük ve en aktif teknoloji topluluğu olmak. Yenilikçi fikirlerin 
            paylaşıldığı, soruların cevap bulduğu ve kariyer fırsatlarının doğduğu bir ekosistem yaratmak.
          </p>
        </section>

        <section class="content-section">
          <h2>Neler Sunuyoruz?</h2>
          <ul class="feature-list">
            <li>
              <strong>Blog Yazıları:</strong> Teknoloji dünyasındaki gelişmeleri, deneyimlerinizi 
              ve bilgilerinizi toplulukla paylaşın.
            </li>
            <li>
              <strong>Soru-Cevap:</strong> Teknik sorunlarınıza topluluktan hızlı ve kaliteli 
              cevaplar alın.
            </li>
            <li>
              <strong>Etkinlikler:</strong> Online ve offline teknoloji etkinliklerine katılın, 
              network oluşturun.
            </li>
            <li>
              <strong>Etiket Sistemi:</strong> İlgi alanlarınıza göre içerikleri keşfedin ve takip edin.
            </li>
          </ul>
        </section>

        <section class="content-section">
          <h2>İletişim</h2>
          <p>
            Sorularınız, önerileriniz veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz:
          </p>
          <p>
            <strong>E-posta:</strong> info&#64;techcommunity.com.tr<br>
            <strong>Twitter:</strong> &#64;techcommunitytr
          </p>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary, #1a202c);
      margin: 0;
    }

    .page-content {
      background: var(--bg-secondary, #fff);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .content-section {
      margin-bottom: 2rem;
    }

    .content-section:last-child {
      margin-bottom: 0;
    }

    .content-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1rem;
    }

    .content-section p {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin: 0 0 1rem;
    }

    .content-section p:last-child {
      margin-bottom: 0;
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-list li {
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
      color: var(--text-secondary, #4a5568);
      line-height: 1.6;
    }

    .feature-list li:last-child {
      border-bottom: none;
    }

    .feature-list strong {
      color: var(--text-primary, #1a202c);
    }
  `]
})
export class AboutComponent {}
