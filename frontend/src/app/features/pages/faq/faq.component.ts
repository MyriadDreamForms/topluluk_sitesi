import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sıkça Sorulan Sorular</h1>
        <p class="subtitle">TechCommunity hakkında merak edilenler</p>
      </div>
      
      <div class="page-content">
        <div class="faq-list">
          @for (item of faqItems(); track item.question; let i = $index) {
            <div class="faq-item" [class.open]="item.isOpen">
              <button class="faq-question" (click)="toggleItem(i)">
                <span>{{ item.question }}</span>
                <span class="icon">{{ item.isOpen ? '−' : '+' }}</span>
              </button>
              @if (item.isOpen) {
                <div class="faq-answer">
                  <p>{{ item.answer }}</p>
                </div>
              }
            </div>
          }
        </div>

        <div class="contact-box">
          <h3>Sorunuz mu var?</h3>
          <p>
            Aradığınız cevabı bulamadıysanız, bizimle iletişime geçmekten çekinmeyin.
          </p>
          <a routerLink="/contact" class="btn btn-primary">İletişime Geç</a>
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

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .faq-item {
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 8px;
      overflow: hidden;
    }

    .faq-item.open {
      border-color: var(--primary-color, #3182ce);
    }

    .faq-question {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary, #1a202c);
      transition: background 0.15s;
    }

    .faq-question:hover {
      background: var(--bg-muted, #f7fafc);
    }

    .faq-item.open .faq-question {
      background: var(--primary-light, #ebf8ff);
    }

    .icon {
      font-size: 1.25rem;
      font-weight: 300;
      color: var(--text-muted, #718096);
    }

    .faq-answer {
      padding: 0 1.25rem 1.25rem;
    }

    .faq-answer p {
      margin: 0;
      color: var(--text-secondary, #4a5568);
      line-height: 1.7;
    }

    .contact-box {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color, #e2e8f0);
      text-align: center;
    }

    .contact-box h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.5rem;
    }

    .contact-box p {
      color: var(--text-muted, #718096);
      margin: 0 0 1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.15s;
    }

    .btn-primary {
      background: var(--primary-color, #3182ce);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-hover, #2c5282);
    }
  `]
})
export class FaqComponent {
  faqItems = signal<FaqItem[]>([
    {
      question: 'TechCommunity\'ye nasıl üye olabilirim?',
      answer: 'Ana sayfadaki "Kayıt Ol" butonuna tıklayarak e-posta adresiniz veya sosyal medya hesaplarınızla hızlıca üye olabilirsiniz. Üyelik tamamen ücretsizdir.',
      isOpen: false
    },
    {
      question: 'Yazı paylaşmak için ne yapmam gerekiyor?',
      answer: 'Üye girişi yaptıktan sonra profil menüsünden "Yeni Yazı" seçeneğini kullanarak yazınızı paylaşabilirsiniz. Markdown formatını destekliyoruz.',
      isOpen: false
    },
    {
      question: 'Soru sormak ücretli mi?',
      answer: 'Hayır, TechCommunity\'de soru sormak ve cevap vermek tamamen ücretsizdir. Amacımız bilgi paylaşımını desteklemektir.',
      isOpen: false
    },
    {
      question: 'Cevabımı nasıl kabul edilen cevap olarak işaretleyebilirim?',
      answer: 'Soruyu soran kişi olarak, en yararlı cevabın yanındaki onay işaretine tıklayarak kabul edilen cevabı seçebilirsiniz.',
      isOpen: false
    },
    {
      question: 'İçeriklerimi düzenleyebilir veya silebilir miyim?',
      answer: 'Evet, kendi paylaştığınız yazıları, soruları ve cevapları istediğiniz zaman düzenleyebilir veya silebilirsiniz.',
      isOpen: false
    },
    {
      question: 'Uygunsuz içerik gördüğümde ne yapmalıyım?',
      answer: 'İçeriğin yanındaki "Bildir" butonunu kullanarak moderatör ekibimize iletebilirsiniz. Tüm bildiriler incelenir ve gerekli işlemler yapılır.',
      isOpen: false
    },
    {
      question: 'Etkinliklere nasıl katılabilirim?',
      answer: 'Etkinlikler sayfasından yaklaşan etkinlikleri görebilir ve "Katıl" butonuyla kayıt olabilirsiniz. Online etkinlikler için link paylaşılır.',
      isOpen: false
    },
    {
      question: 'Hesabımı nasıl silerim?',
      answer: 'Profil ayarlarınızdan "Hesabı Sil" seçeneğini kullanabilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinir.',
      isOpen: false
    }
  ]);

  toggleItem(index: number): void {
    this.faqItems.update(items => 
      items.map((item, i) => ({
        ...item,
        isOpen: i === index ? !item.isOpen : item.isOpen
      }))
    );
  }
}
