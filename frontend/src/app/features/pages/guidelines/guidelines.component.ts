import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guidelines',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Topluluk Kuralları</h1>
        <p class="subtitle">TechCommunity'de herkesin saygılı ve yapıcı bir ortamda etkileşim kurması için uyulması gereken kurallar.</p>
      </div>
      
      <div class="page-content">
        <section class="content-section">
          <h2>1. Saygılı Olun</h2>
          <p>
            Tüm topluluk üyelerine saygılı davranın. Hakaret, aşağılama, ayrımcılık veya 
            taciz içeren içerikler kesinlikle kabul edilmez. Farklı görüşlere açık olun 
            ve yapıcı eleştiriler sunun.
          </p>
        </section>

        <section class="content-section">
          <h2>2. Kaliteli İçerik Paylaşın</h2>
          <p>
            Paylaştığınız içeriklerin topluluk için değerli olmasına özen gösterin. 
            Spam, reklam veya alakasız içerikler paylaşmaktan kaçının. Sorularınızı 
            net ve anlaşılır bir şekilde sorun.
          </p>
        </section>

        <section class="content-section">
          <h2>3. Telif Haklarına Uyun</h2>
          <p>
            Başkalarının içeriklerini paylaşırken kaynak belirtin. Telif hakkı ihlali 
            yapan içerikler paylaşmayın. Kendi özgün içeriklerinizi oluşturmaya özen gösterin.
          </p>
        </section>

        <section class="content-section">
          <h2>4. Gizlilik ve Güvenlik</h2>
          <p>
            Kişisel bilgilerinizi ve başkalarının kişisel bilgilerini koruyun. 
            Şifre, API anahtarı veya hassas bilgiler paylaşmayın. Güvenlik açıkları 
            keşfederseniz sorumlu bir şekilde bildirin.
          </p>
        </section>

        <section class="content-section">
          <h2>5. Yapıcı Tartışmalar</h2>
          <p>
            Teknik tartışmalarda kişisel saldırılardan kaçının. Argümanlarınızı 
            kanıtlarla destekleyin. Farklı teknoloji tercihlerine saygı gösterin.
          </p>
        </section>

        <section class="content-section">
          <h2>6. Doğru Etiketleme</h2>
          <p>
            İçeriklerinizi doğru etiketlerle işaretleyin. Alakasız veya yanıltıcı 
            etiketler kullanmaktan kaçının. Bu, diğer kullanıcıların içeriğinizi 
            bulmasını kolaylaştırır.
          </p>
        </section>

        <section class="content-section">
          <h2>7. Kural İhlalleri</h2>
          <p>
            Kural ihlallerini gördüğünüzde lütfen bildirin. İhlaller duruma göre 
            uyarı, içerik kaldırma veya hesap askıya alma ile sonuçlanabilir. 
            Tekrarlayan ihlaller kalıcı yasaklamaya yol açabilir.
          </p>
        </section>

        <div class="notice-box">
          <p>
            <strong>Not:</strong> Bu kurallar zaman zaman güncellenebilir. 
            Değişikliklerden haberdar olmak için duyurularımızı takip edin.
          </p>
        </div>
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
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #718096);
      font-size: 1rem;
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
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .content-section:last-of-type {
      margin-bottom: 1.5rem;
      padding-bottom: 0;
      border-bottom: none;
    }

    .content-section h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.75rem;
    }

    .content-section p {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin: 0;
    }

    .notice-box {
      background: var(--primary-light, #ebf8ff);
      border-left: 4px solid var(--primary-color, #3182ce);
      padding: 1rem 1.25rem;
      border-radius: 0 8px 8px 0;
    }

    .notice-box p {
      margin: 0;
      color: var(--text-secondary, #4a5568);
      font-size: 0.875rem;
    }
  `]
})
export class GuidelinesComponent {}
