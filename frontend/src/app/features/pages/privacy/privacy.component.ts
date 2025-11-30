import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gizlilik Politikası</h1>
        <p class="subtitle">Son güncelleme: Ocak 2025</p>
      </div>
      
      <div class="page-content">
        <section class="policy-section">
          <h2>1. Giriş</h2>
          <p>
            TechCommunity olarak gizliliğinize saygı duyuyor ve kişisel verilerinizi korumayı taahhüt ediyoruz. 
            Bu Gizlilik Politikası, platformumuzu kullanırken hangi verileri topladığımızı, nasıl kullandığımızı 
            ve koruduğumuzu açıklamaktadır.
          </p>
        </section>

        <section class="policy-section">
          <h2>2. Toplanan Veriler</h2>
          <p>Aşağıdaki kişisel verileri toplayabiliriz:</p>
          <ul>
            <li><strong>Hesap Bilgileri:</strong> Ad, e-posta adresi, kullanıcı adı, profil fotoğrafı</li>
            <li><strong>İçerik Verileri:</strong> Paylaştığınız yazılar, sorular, cevaplar ve yorumlar</li>
            <li><strong>Kullanım Verileri:</strong> Platform kullanım istatistikleri, tercihler</li>
            <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, cihaz bilgileri</li>
            <li><strong>Çerez Verileri:</strong> Oturum ve tercih çerezleri</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. Verilerin Kullanımı</h2>
          <p>Topladığımız verileri şu amaçlarla kullanıyoruz:</p>
          <ul>
            <li>Platform hizmetlerinin sağlanması ve iyileştirilmesi</li>
            <li>Kullanıcı hesaplarının yönetimi ve güvenliği</li>
            <li>Kişiselleştirilmiş içerik ve öneriler sunulması</li>
            <li>Topluluk kurallarının uygulanması</li>
            <li>İstatistiksel analizler ve raporlama</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>4. Veri Paylaşımı</h2>
          <p>
            Kişisel verilerinizi üçüncü taraflarla satmıyoruz. Ancak aşağıdaki durumlarda 
            paylaşım yapılabilir:
          </p>
          <ul>
            <li>Yasal zorunluluk halinde yetkili kurumlarla</li>
            <li>Hizmet sağlayıcılarımızla (hosting, analitik vb.)</li>
            <li>Açık rızanız olması durumunda</li>
            <li>Platform güvenliğini korumak için gerekli durumlarda</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>5. Veri Güvenliği</h2>
          <p>
            Verilerinizi korumak için endüstri standardı güvenlik önlemleri uyguluyoruz:
          </p>
          <ul>
            <li>SSL/TLS şifreleme</li>
            <li>Güvenli veri depolama</li>
            <li>Erişim kontrolleri ve yetkilendirme</li>
            <li>Düzenli güvenlik denetimleri</li>
            <li>Personel eğitimi ve gizlilik taahhütleri</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>6. Haklarınız</h2>
          <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Verilerinize erişim ve bilgi talep etme</li>
            <li>Yanlış verilerin düzeltilmesini isteme</li>
            <li>Verilerinizin silinmesini talep etme</li>
            <li>Veri işlemenin kısıtlanmasını isteme</li>
            <li>Verilerinizi taşıma hakkı</li>
            <li>İtiraz hakkı</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>7. Veri Saklama Süresi</h2>
          <p>
            Kişisel verilerinizi, hesabınız aktif olduğu sürece saklarız. Hesabınızı sildiğinizde, 
            verileriniz 30 gün içinde sistemlerimizden kaldırılır. Ancak yasal yükümlülükler 
            nedeniyle bazı veriler daha uzun süre saklanabilir.
          </p>
        </section>

        <section class="policy-section">
          <h2>8. Çocukların Gizliliği</h2>
          <p>
            Platformumuz 13 yaşın altındaki çocuklara yönelik değildir. Bu yaş grubundan 
            bilerek veri toplamıyoruz. Ebeveynler, çocuklarına ait verilerin silinmesi 
            için bizimle iletişime geçebilir.
          </p>
        </section>

        <section class="policy-section">
          <h2>9. Değişiklikler</h2>
          <p>
            Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler 
            olması durumunda sizi e-posta veya platform bildirimi yoluyla bilgilendiririz.
          </p>
        </section>

        <section class="policy-section">
          <h2>10. İletişim</h2>
          <p>
            Gizlilik ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </p>
          <p>
            <strong>E-posta:</strong> gizlilik&#64;techcommunity.com.tr<br>
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

    .policy-section {
      margin-bottom: 2rem;
    }

    .policy-section:last-child {
      margin-bottom: 0;
    }

    .policy-section h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .policy-section p {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin: 0 0 1rem;
    }

    .policy-section p:last-child {
      margin-bottom: 0;
    }

    .policy-section ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .policy-section li {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin-bottom: 0.5rem;
    }

    .policy-section li:last-child {
      margin-bottom: 0;
    }

    .policy-section strong {
      color: var(--text-primary, #1a202c);
    }
  `]
})
export class PrivacyComponent {}
