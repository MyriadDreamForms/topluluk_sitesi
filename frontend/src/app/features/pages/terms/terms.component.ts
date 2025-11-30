import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Kullanım Şartları</h1>
        <p class="subtitle">Son güncelleme: Ocak 2025</p>
      </div>
      
      <div class="page-content">
        <section class="terms-section">
          <h2>1. Kabul ve Onay</h2>
          <p>
            TechCommunity platformunu kullanarak bu Kullanım Şartları'nı kabul etmiş olursunuz. 
            Bu şartları kabul etmiyorsanız, platformu kullanmamalısınız. Platformu kullanmaya 
            devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section class="terms-section">
          <h2>2. Hesap Oluşturma</h2>
          <ul>
            <li>Hesap oluşturmak için 13 yaşından büyük olmalısınız</li>
            <li>Doğru ve güncel bilgiler sağlamalısınız</li>
            <li>Hesap güvenliğinizden siz sorumlusunuz</li>
            <li>Hesabınızı başkalarıyla paylaşamazsınız</li>
            <li>Tek bir kişi birden fazla hesap oluşturamaz</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>3. İçerik Kuralları</h2>
          <p>Platformda paylaştığınız içerikler için:</p>
          <ul>
            <li>Telif haklarına saygı gösterin</li>
            <li>Orijinal içerik paylaşın veya kaynak belirtin</li>
            <li>Spam, reklam veya tanıtım yapmayın</li>
            <li>Kişisel saldırı, hakaret veya ayrımcılık yapmayın</li>
            <li>Yasadışı içerik paylaşmayın</li>
            <li>Kötü amaçlı yazılım veya bağlantı paylaşmayın</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>4. Fikri Mülkiyet</h2>
          <p>
            Platformda paylaştığınız içeriklerin telif hakları size aittir. Ancak içerik 
            paylaşarak, TechCommunity'ye bu içeriği platformda gösterme, dağıtma ve 
            arşivleme hakkı vermiş olursunuz. Bu lisans, içeriği silseniz bile geçmiş 
            kopyalar için geçerli kalır.
          </p>
          <p>
            TechCommunity logosu, tasarımı ve altyapısı TechCommunity'ye aittir ve 
            izinsiz kullanılamaz.
          </p>
        </section>

        <section class="terms-section">
          <h2>5. Yasaklanan Davranışlar</h2>
          <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
          <ul>
            <li>Platformun güvenliğini tehlikeye atacak eylemler</li>
            <li>Başkalarının hesaplarına izinsiz erişim</li>
            <li>Otomatik bot veya scraping araçları kullanmak</li>
            <li>Diğer kullanıcıları taciz etmek veya tehdit etmek</li>
            <li>Sahte veya yanıltıcı bilgi yaymak</li>
            <li>Platformu yasadışı amaçlarla kullanmak</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>6. Moderasyon</h2>
          <p>
            TechCommunity ekibi, topluluk kurallarını ihlal eden içerikleri kaldırma 
            ve hesapları askıya alma veya silme hakkını saklı tutar. Moderasyon kararları 
            nihai olmakla birlikte, itiraz mekanizması mevcuttur.
          </p>
        </section>

        <section class="terms-section">
          <h2>7. Sorumluluk Reddi</h2>
          <p>
            Platform "olduğu gibi" sunulmaktadır. TechCommunity:
          </p>
          <ul>
            <li>Kesintisiz veya hatasız hizmet garantisi vermez</li>
            <li>Kullanıcı içeriklerinin doğruluğunu garanti etmez</li>
            <li>Üçüncü taraf bağlantılarından sorumlu değildir</li>
            <li>Dolaylı veya özel zararlardan sorumlu tutulamaz</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>8. Tazminat</h2>
          <p>
            Bu şartları ihlal etmeniz durumunda, TechCommunity'nin uğrayacağı her türlü 
            zarar, masraf ve yasal giderden sorumlu olacağınızı kabul edersiniz.
          </p>
        </section>

        <section class="terms-section">
          <h2>9. Hesap Sonlandırma</h2>
          <p>
            Hesabınızı istediğiniz zaman silebilirsiniz. TechCommunity da bu şartların 
            ihlali durumunda hesabınızı önceden haber vermeksizin askıya alabilir veya 
            silebilir.
          </p>
        </section>

        <section class="terms-section">
          <h2>10. Değişiklikler</h2>
          <p>
            Bu şartları önceden haber vererek değiştirebiliriz. Önemli değişiklikler 
            en az 30 gün önceden duyurulacaktır. Değişikliklerden sonra platformu 
            kullanmaya devam etmeniz, yeni şartları kabul ettiğiniz anlamına gelir.
          </p>
        </section>

        <section class="terms-section">
          <h2>11. Uygulanacak Hukuk</h2>
          <p>
            Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar 
            İstanbul mahkemelerinde çözümlenecektir.
          </p>
        </section>

        <section class="terms-section">
          <h2>12. İletişim</h2>
          <p>
            Bu şartlarla ilgili sorularınız için:
          </p>
          <p>
            <strong>E-posta:</strong> yasal&#64;techcommunity.com.tr<br>
            <strong>Adres:</strong> İstanbul, Türkiye
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
      margin: 0 0 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #718096);
      font-size: 0.875rem;
      margin: 0;
    }

    .page-content {
      background: var(--bg-secondary, #fff);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .terms-section {
      margin-bottom: 2rem;
    }

    .terms-section:last-child {
      margin-bottom: 0;
    }

    .terms-section h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .terms-section p {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin: 0 0 1rem;
    }

    .terms-section p:last-child {
      margin-bottom: 0;
    }

    .terms-section ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .terms-section li {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin-bottom: 0.5rem;
    }

    .terms-section li:last-child {
      margin-bottom: 0;
    }

    .terms-section strong {
      color: var(--text-primary, #1a202c);
    }
  `]
})
export class TermsComponent {}
