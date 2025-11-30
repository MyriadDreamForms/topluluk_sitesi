import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Çerez Politikası</h1>
        <p class="subtitle">Son güncelleme: Ocak 2025</p>
      </div>
      
      <div class="page-content">
        <section class="cookie-section">
          <h2>Çerez Nedir?</h2>
          <p>
            Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır. 
            Bu dosyalar, siteyi tekrar ziyaret ettiğinizde sizi tanımaya, tercihlerinizi 
            hatırlamaya ve deneyiminizi iyileştirmeye yardımcı olur.
          </p>
        </section>

        <section class="cookie-section">
          <h2>Kullandığımız Çerez Türleri</h2>
          
          <div class="cookie-type">
            <h3>🔒 Zorunlu Çerezler</h3>
            <p>
              Platformun düzgün çalışması için gerekli çerezlerdir. Bunlar olmadan 
              giriş yapma, form gönderme gibi temel işlevler çalışmaz.
            </p>
            <table>
              <tr>
                <th>Çerez Adı</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
              <tr>
                <td>auth_token</td>
                <td>Oturum yönetimi</td>
                <td>7 gün</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Güvenlik</td>
                <td>Oturum</td>
              </tr>
              <tr>
                <td>session_id</td>
                <td>Oturum takibi</td>
                <td>Oturum</td>
              </tr>
            </table>
          </div>

          <div class="cookie-type">
            <h3>📊 Analitik Çerezler</h3>
            <p>
              Platformun nasıl kullanıldığını anlamamıza yardımcı olur. Anonim veriler 
              toplayarak hizmeti iyileştirmemizi sağlar.
            </p>
            <table>
              <tr>
                <th>Çerez Adı</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Google Analytics</td>
                <td>2 yıl</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Kullanıcı ayrımı</td>
                <td>24 saat</td>
              </tr>
            </table>
          </div>

          <div class="cookie-type">
            <h3>⚙️ Tercih Çerezleri</h3>
            <p>
              Dil, tema ve diğer tercihlerinizi hatırlamamızı sağlar.
            </p>
            <table>
              <tr>
                <th>Çerez Adı</th>
                <th>Amaç</th>
                <th>Süre</th>
              </tr>
              <tr>
                <td>theme</td>
                <td>Tema tercihi</td>
                <td>1 yıl</td>
              </tr>
              <tr>
                <td>language</td>
                <td>Dil tercihi</td>
                <td>1 yıl</td>
              </tr>
              <tr>
                <td>cookie_consent</td>
                <td>Çerez onayı</td>
                <td>1 yıl</td>
              </tr>
            </table>
          </div>
        </section>

        <section class="cookie-section">
          <h2>Üçüncü Taraf Çerezleri</h2>
          <p>
            Platformumuzda aşağıdaki üçüncü taraf hizmetleri kullanılabilir ve bu 
            hizmetler kendi çerezlerini yerleştirebilir:
          </p>
          <ul>
            <li><strong>Google Analytics:</strong> Kullanım istatistikleri</li>
            <li><strong>Cloudflare:</strong> Güvenlik ve performans</li>
            <li><strong>YouTube:</strong> Gömülü videolar</li>
          </ul>
        </section>

        <section class="cookie-section">
          <h2>Çerezleri Yönetme</h2>
          <p>
            Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz. Aşağıdaki seçeneklere sahipsiniz:
          </p>
          <ul>
            <li>Tüm çerezleri engelleme</li>
            <li>Sadece üçüncü taraf çerezlerini engelleme</li>
            <li>Belirli sitelerin çerezlerini engelleme</li>
            <li>Mevcut çerezleri silme</li>
          </ul>
          
          <div class="browser-links">
            <h3>Tarayıcı Çerez Ayarları</h3>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/tr/kb/cerezleri-silme" target="_blank" rel="noopener">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/tr-tr/windows/microsoft-edge-de-tanımlama-bilgilerini-silme" target="_blank" rel="noopener">
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section class="cookie-section">
          <h2>Çerezleri Engellemenin Etkileri</h2>
          <div class="warning-box">
            <p>
              ⚠️ <strong>Önemli:</strong> Zorunlu çerezleri engellemeniz durumunda 
              platformun bazı özellikleri düzgün çalışmayabilir. Örneğin:
            </p>
            <ul>
              <li>Oturum açık kalmayabilir</li>
              <li>Tercihleriniz kaydedilmeyebilir</li>
              <li>Bazı güvenlik özellikleri çalışmayabilir</li>
            </ul>
          </div>
        </section>

        <section class="cookie-section">
          <h2>Değişiklikler</h2>
          <p>
            Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Değişiklikler 
            bu sayfada yayınlanacak ve önemli değişiklikler için bildirim yapılacaktır.
          </p>
        </section>

        <section class="cookie-section">
          <h2>İletişim</h2>
          <p>
            Çerezlerle ilgili sorularınız için:
          </p>
          <p>
            <strong>E-posta:</strong> gizlilik&#64;techcommunity.com.tr
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

    .cookie-section {
      margin-bottom: 2.5rem;
    }

    .cookie-section:last-child {
      margin-bottom: 0;
    }

    .cookie-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    .cookie-section p {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin: 0 0 1rem;
    }

    .cookie-type {
      background: var(--bg-muted, #f7fafc);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .cookie-type:last-child {
      margin-bottom: 0;
    }

    .cookie-type h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.75rem;
    }

    .cookie-type p {
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    th, td {
      padding: 0.5rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }

    th {
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      background: rgba(0, 0, 0, 0.02);
    }

    td {
      color: var(--text-secondary, #4a5568);
    }

    ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    li {
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
      margin-bottom: 0.5rem;
    }

    li:last-child {
      margin-bottom: 0;
    }

    .browser-links {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
    }

    .browser-links h3 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.75rem;
    }

    .browser-links a {
      color: var(--primary-color, #3182ce);
      text-decoration: none;
    }

    .browser-links a:hover {
      text-decoration: underline;
    }

    .warning-box {
      background: var(--warning-light, #fffbeb);
      border: 1px solid var(--warning-color, #f59e0b);
      border-radius: 8px;
      padding: 1rem 1.25rem;
    }

    .warning-box p {
      margin: 0 0 0.5rem;
    }

    .warning-box ul {
      margin-bottom: 0;
    }

    strong {
      color: var(--text-primary, #1a202c);
    }
  `]
})
export class CookiesComponent {}
