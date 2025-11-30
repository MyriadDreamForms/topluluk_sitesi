# [PlatformAdı] Ürün Gereksinim Dokümanı (PRD)

## 1. Ürün Özeti

[PlatformAdı], Türkiye’de **yazılımcıların, veri bilimcilerin, araştırmacıların ve teknoloji meraklılarının** bir araya geldiği, bilgi paylaşımı, soru-cevap, blog yazıları ve etkinlik duyurularını destekleyen bir topluluk platformudur.

Platform;
- Modern bir teknoloji yığını ile geliştirilecek,
- Hem masaüstü hem mobil cihazlarda sorunsuz çalışacak,
- SEO açısından güçlü olacak,
- Yüksek performanslı ve kararlı bir yapı sunacaktır.

## 2. Hedefler ve Başarı Kriterleri

### 2.1 İş Hedefleri

- Türkiye’de teknik topluluklar için referans bir platform olmak.
- İlk 6 ay içinde:
  - En az **1.000 kayıtlı kullanıcı**,
  - Toplam **5.000+ içerik (post, soru, cevap, yorum)**,
  - Aylık **%20 organik trafik artışı**.
- Uzun vadede: Sponsorluklar, iş ilanları ve premium özellikler ile gelir modeli oluşturmak.

### 2.2 Başarı Kriterleri (KPI)

- Aylık aktif kullanıcı (MAU) sayısı.
- Günlük yeni içerik sayısı (post, soru, cevap, yorum).
- Ortalama oturum süresi (>= 5 dakika).
- Organik arama trafiği oranı (SEO başarısı).
- Sunucu yanıt süresi (p95 < 500 ms API, p95 < 2 sn sayfa yüklenmesi).

## 3. Hedef Kitle ve Kullanıcı Personaları

### 3.1 Hedef Kitle

- Junior ve mid-level yazılım geliştiriciler.
- Veri bilimciler ve makine öğrenmesi ile ilgilenenler.
- Üniversite öğrencileri ve akademisyenler.
- Teknoloji meraklıları (güncel gelişmeleri takip edenler).

### 3.2 Örnek Personalar

1. **Ali – Junior Backend Developer**
   - Yeni şeyler öğrenmek istiyor.
   - Türkçe içerik arıyor.
   - Soru sorup cevap alabileceği bir ortam istiyor.

2. **Zeynep – Veri Bilimci**
   - Hem makale benzeri içerik yazmak hem de veri setleri, deneyler hakkında konuşmak istiyor.
   - Etkinlik ve meetup’ları takip etmek istiyor.

3. **Mert – Üniversite Öğrencisi**
   - Kariyerine yön vermek istiyor.
   - Staj ve junior pozisyonlar, öğrenme kaynakları arıyor.
   - Soru sormaktan çekinmeyeceği bir topluluk istiyor.

## 4. Kapsam

### 4.1 MVP Kapsamı

MVP’de mutlaka olması gerekenler:

- Kullanıcı kayıt & giriş (e-posta + şifre, ileride sosyal giriş).
- Profil sayfası (kullanıcı bilgileri, avatar, bio, linkler).
- İçerik tipleri:
  - Blog tarzı **Post** (makale / yazı),
  - **Soru-Cevap** (StackOverflow benzeri),
  - **Yorumlama** (post ve sorulara yorum).
- **Etiketleme** sistemi (Tag).
- **Etkinlik** oluşturma ve listeleme (basit sürüm).
- Arama (başlık, tag ve kullanıcı bazlı basit arama).
- Ana sayfa akışı (son içerikler, popüler içerikler).
- Rol bazlı temel yönetici paneli (içerik ve kullanıcı moderasyonu).
- SEO odaklı URL yapısı (slug kullanımına hazırlık).
- Temel bildirimler (ör. “soruna cevap geldi”, “postuna yorum yapıldı” – MVP’de e-posta zorunlu değil; basit onsite bildirim olabilir).

### 4.2 Gelecek Fazlar (MVP Sonrası)

- Gelişmiş arama (full-text search, filtreler).
- Gerçek zamanlı bildirimler (WebSocket/SignalR).
- Kullanıcı rozetleri, puanlama sistemi (gamification).
- İş ilanları ve proje ilanları.
- Çoklu dil desteği (TR/EN).
- Mobil uygulama (native / hybrid).

## 5. Ana Kullanıcı Senaryoları

1. Kullanıcı e-posta ile kayıt olur, profilini tamamlar.
2. Kullanıcı bir soru oluşturur, ilgili etiketleri ekler.
3. Başka bir kullanıcı soruyu görür, cevap yazar.
4. Kullanıcı teknik bir blog yazısı (post) yazar ve toplulukla paylaşır.
5. Kullanıcı yakın zamanda olacak online/online etkinlikleri listeler ve detayına bakar.
6. Kullanıcı arama çubuğuna anahtar kelime yazarak ilgili soru, post ve kullanıcıları bulur.
7. Yönetici uygunsuz içeriği siler veya kullanıcıyı banlar.

## 6. Fonksiyonel Gereksinimler

### 6.1 Hesap ve Kimlik Yönetimi

- Kullanıcı kayıt:
  - Zorunlu alanlar: e-posta, şifre, kullanıcı adı (unique).
  - E-posta doğrulama için doğrulama linki gönderilebilmeli (MVP’de opsiyonel, mimari hazırlık olsun).
- Giriş:
  - E-posta + şifre ile giriş.
  - JWT tabanlı access & refresh token yapısı.
- Şifre sıfırlama:
  - “Şifremi unuttum” akışı ile e-posta üzerinden reset linki.

### 6.2 Kullanıcı Profil Yönetimi

- Kullanıcı profil alanları:
  - Ad/soyad (opsiyonel), kullanıcı adı (unique, zorunlu),
  - Kısa bio,
  - Profil fotoğrafı (avatar),
  - Sosyal linkler (GitHub, LinkedIn, kişisel site).
- Kullanıcı:
  - Profilini görüntüleyebilmeli,
  - Profilini düzenleyebilmeli.
- Profil sayfasında:
  - Kullanıcının yazdığı postlar,
  - Sorduğu sorular,
  - Verdiği cevaplar listelenmeli.

### 6.3 İçerik Yönetimi (Post, Soru, Cevap, Yorum)

- İçerik tipleri:
  - **Post (Blog/Yazı)**:
    - Başlık, içerik (rich text veya markdown), etiketler, oluşturma tarihi, güncelleme tarihi.
  - **Soru**:
    - Başlık, metin, etiketler.
    - Cevaplar listesi.
  - **Cevap**:
    - Bir soruya bağlı, metin, oylar (ileride), oluşturma tarihi.
  - **Yorum**:
    - Post veya soru/cevap üzerine yorum yazılabilmeli.
- Gereksinimler:
  - Kullanıcı kendi içeriklerini düzenleyip silebilmeli.
  - Yalnızca yetkili kullanıcılar (admin/moderator) başkalarının içeriğini silebilmeli veya gizleyebilmeli.
  - İçerik durumları: aktif, pasif/silinmiş, raporlanmış (MVP’de basit: aktif/silinmiş).

### 6.4 Etkinlikler

- Kullanıcı (belirli rollerde) etkinlik oluşturabilmeli:
  - Başlık, açıklama, tarih/saat, format (online/offline), link veya adres.
- Etkinlik listesi:
  - Yaklaşan etkinlikler varsayılan görünüm.
  - Detay sayfası: açıklama, tarih, saat, link/adres.
- MVP’de kayıt/RSVP zorunlu değil; sadece görüntüleme.

### 6.5 Etiketleme ve Arama

- Etiketler (Tag):
  - İsim, açıklama (opsiyonel), slug.
- Bir post veya soru birden fazla etikete sahip olabilir.
- Arama:
  - Başlık ve içerik üzerinde basit arama (LIKE),
  - Etikete göre filtreleme.
- Gelecekte: full-text search ve gelişmiş filtreler (faz 2).

### 6.6 Bildirimler (MVP Seviyesi)

- Basit onsite bildirim sistemi:
  - Kullanıcının sorusuna cevap geldiğinde,
  - Postuna yorum yapıldığında.
- Bildirimler:
  - Kullanıcıya ait bir liste olarak görüntülenir,
  - Okundu/okunmadı durumu tutulur.

### 6.7 Yönetici Paneli

- Roller:
  - Admin,
  - Moderator,
  - Normal kullanıcı.
- Yönetici yetenekleri:
  - Kullanıcıları listeleme, banlama/askıya alma.
  - İçerikleri listeleme, silme veya gizleme.
  - Raporlanan içerikleri görme (MVP’de basit bir flag alanı).

## 7. Sistem Gereksinimleri (Teknik)

### 7.1 Mimari

- **Frontend:** Angular 21
  - Angular Universal ile SSR veya pre-render yapısı.
- **Backend:** .NET 10 (ASP.NET Core Web API)
  - Katmanlı mimari / Clean Architecture:
    - Domain, Application, Infrastructure, API katmanları.
- **Veritabanı:** PostgreSQL
  - EF Core (Code First + Migrations).

### 7.2 Frontend Gereksinimleri

- Responsive tasarım (masaüstü, tablet, mobil).
- Component-based mimari:
  - core, shared, features (auth, profile, posts, questions, events vb).
- Lazy loading modüller.
- API ile haberleşme için servisler (HttpClient).
- SEO için:
  - Dinamik title ve meta tag yönetimi,
  - Open Graph tag’leri,
  - SSR/Pre-render.

### 7.3 Backend Gereksinimleri

- RESTful API tasarımı.
- JWT tabanlı kimlik doğrulama.
- Veri erişimi için repository/service katmanı.
- Validation (Data Annotations veya FluentValidation).
- Global exception handling middleware.
- Standart API response formatı (başarı/durum mesajı, hata kodları).

### 7.4 Veritabanı Gereksinimleri

- Entity Örnekleri:
  - User, Role, UserProfile,
  - Post, Question, Answer, Comment,
  - Tag, PostTag, QuestionTag,
  - Event.
- PostgreSQL’de:
  - Temel index’ler (ID, foreign key alanları, sık aranan alanlar),
  - İlişkiler (FK) ile referential integrity.
- Migration yönetimi:
  - EF Core migrations ile şema evrimi.

### 7.5 Güvenlik Gereksinimleri

- Şifrelerin güçlü hash algoritmaları ile saklanması.
- JWT token doğrulama ve yenileme.
- CSRF, XSS, SQL injection’a karşı önlemler:
  - Parametrik sorgular (ORM ile doğal),
  - Input validation,
  - HTTP-only cookie opsiyonunun değerlendirilmesi.
- Rate limiting (temel düzeyde) – brute force login denemelerine karşı.

### 7.6 Performans ve Ölçeklenebilirlik

- API yanıt süresi:
  - p95 < 500ms (MVP hedefi).
- Caching:
  - Sık kullanılan veri setleri için (ör. etiket listesi).
- Pagination:
  - Liste API’lerinin tamamında zorunlu.
- N+1 sorgu problemlerinden kaçınma (include, projection).
- İleride: horizontal scale edilebilir bir yapı (stateless API, dış session kullanmama).

### 7.7 Loglama ve İzleme

- Backend’de:
  - Structured logging (örn. Serilog).
  - Hata loglama, request/response loglama (minimum düzeyde).
- İzleme:
  - Sağlık kontrol endpoint’i (/health).
  - Basit monitoringle uptime takibi (external tool ile).

## 8. SEO ve Growth Gereksinimleri

- SSR veya pre-render sayesinde:
  - Arama motorlarının sayfa içeriğini görebilmesi.
- Temiz URL yapısı:
  - /soru/[id]-[slug]
  - /yazi/[id]-[slug]
  - /kullanici/[username]
- Meta etiketleri:
  - Title, description, OG tags.
- JSON-LD (schema.org) için hazırlık:
  - BlogPosting (postlar),
  - QAPage (soru-cevap sayfaları).
- Sitemap.xml ve robots.txt sağlanmalı.
- Temel analitiklerle (Google Analytics vb.) kullanıcı davranış takibi.

## 9. UX / UI Gereksinimleri

- Modern, sade ve okunabilir bir arayüz.
- Karanlık mod (dark mode) uzun vadede hedef, MVP’de opsiyonel.
- Ana sayfada:
  - Son içerikler,
  - Popüler içerikler,
  - Kategoriler/tag’ler.
- Mobil deneyimi:
  - Menülerin kolay erişilebilir olması (hamburger menu),
  - Formların mobilde rahat doldurulabilir olması.

## 10. Analitik ve Ölçümleme

- İzlenecek metrikler:
  - Sayfa görüntüleme sayısı,
  - Kullanıcı başına oturum sayısı,
  - İçerik etkileşim oranı (yorum, cevap, beğeni/oy vb. geldiğinde),
  - Trafik kaynakları (organik / direkt / referral).
- Araçlar:
  - Google Analytics veya benzeri,
  - Backend loglarından temel kullanım istatistikleri.

## 11. Varsayımlar ve Bağımlılıklar

- Kullanıcıların çoğu Türkçe içerik tercih ediyor.
- Kullanıcılar teknik seviyede orta-üst düzey.
- Proje:
  - Angular 21,
  - .NET 10,
  - PostgreSQL üzerinde geliştirilecek.
- CI/CD ve barındırma ortamı (örn. bulut sağlayıcı) ayrıca belirlenecek.

## 12. Kapsam Dışı (MVP İçin)

- Gerçek zamanlı chat veya forum tarzı threadler.
- Gelişmiş gamification (rozete dayalı karmaşık puanlama).
- İş ilanları, proje ilanları (sonraki faz).
- Native mobil uygulamalar.
- Çoklu dil desteği (faz 2+).

## 13. Açık Sorular

- Marka adı kesinleşti mi? ([PlatformAdı] placeholder’ı değişecek).
- Sosyal giriş (Google, GitHub) MVP’de olacak mı, yoksa sonraki faz mı?
- E-posta gönderimi için hangi provider kullanılacak?
- İçerik moderasyonu için topluluk raporlama mekanizması MVP’de ne kadar detaylı olacak?

---

Bu PRD, Türkiye’deki teknik topluluklar için geliştirilecek olan [PlatformAdı] ürününün ilk versiyonu (MVP) için temel gereksinimleri özetlemektedir.
