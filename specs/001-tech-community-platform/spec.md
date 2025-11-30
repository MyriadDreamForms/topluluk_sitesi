# Feature Specification: Türkiye Teknoloji Topluluk Platformu (MVP)

**Feature Branch**: `001-tech-community-platform`  
**Created**: 2024-11-30  
**Status**: Draft  
**Input**: Türkiye'de yazılımcılar, veri bilimciler, araştırmacılar ve teknoloji meraklıları için topluluk platformu. Blog yazıları, soru-cevap, etkinlikler, moderasyon sistemi içeren MVP.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Kullanıcı Kaydı ve Profil Oluşturma (Priority: P1)

Yeni bir teknoloji meraklısı, platforma e-posta ve şifre ile kayıt olur. Kayıt sonrası profilini düzenleyerek avatar, biyografi ve sosyal medya linklerini ekler. Artık içerik oluşturmaya ve topluluğa katılmaya hazırdır.

**Why this priority**: Platform kullanımının temel ön koşulu kullanıcı kimliğidir. Kayıt olmadan hiçbir içerik oluşturulamaz veya etkileşime girilemez.

**Independent Test**: Kayıt formunu doldurarak hesap oluşturulabilir, profil sayfası görüntülenebilir ve düzenlenebilir.

**Acceptance Scenarios**:

1. **Given** kullanıcı kayıt sayfasında, **When** geçerli e-posta ve şifre (min 8 karakter) girer, **Then** hesap oluşturulur ve onay mesajı gösterilir
2. **Given** kullanıcı giriş yapmış, **When** profil düzenleme sayfasına gider, **Then** avatar yükleyebilir, bio ve sosyal linkler ekleyebilir
3. **Given** kullanıcı giriş yapmış, **When** kendi profilini görüntüler, **Then** yazdığı postlar ve sorduğu sorular listelenir
4. **Given** kullanıcı kayıtlı e-posta ile tekrar kayıt olmaya çalışır, **When** formu gönderir, **Then** "Bu e-posta zaten kayıtlı" hatası alır

---

### User Story 2 - Blog Yazısı (Post) Oluşturma ve Okuma (Priority: P1)

Bir yazılımcı, öğrendiği bir teknolojiyi toplulukla paylaşmak için blog yazısı yazar. Başlık, içerik (markdown destekli) ve ilgili etiketleri ekler. Diğer kullanıcılar bu yazıyı okuyabilir ve yorum yapabilir.

**Why this priority**: İçerik oluşturma platformun ana değer önerisidir. Kullanıcılar bilgi paylaşmak için gelir.

**Independent Test**: Yeni post oluşturulabilir, liste ve detay sayfalarında görüntülenebilir, yorum eklenebilir.

**Acceptance Scenarios**:

1. **Given** kullanıcı giriş yapmış, **When** yeni post oluşturma formunu doldurur (başlık, içerik, en az 1 tag), **Then** post yayınlanır ve detay sayfası gösterilir
2. **Given** ziyaretçi veya kullanıcı, **When** post detay sayfasını açar, **Then** yazının tamamı, yazarı, tarihi, etiketleri ve yorumları görüntülenir
3. **Given** kullanıcı giriş yapmış ve post detayında, **When** yorum yazar ve gönderir, **Then** yorum post altında görünür
4. **Given** post sahibi, **When** kendi postunu düzenler, **Then** değişiklikler kaydedilir

---

### User Story 3 - Soru Sorma ve Cevaplama (Priority: P1)

Bir üniversite öğrencisi teknik bir sorunla karşılaşır ve platformda soru sorar. Deneyimli topluluk üyeleri cevap verir. Soru sahibi en yararlı cevabı "kabul edilen cevap" olarak işaretler.

**Why this priority**: Soru-cevap, topluluk etkileşiminin ve bilgi transferinin temel mekanizmasıdır.

**Independent Test**: Soru oluşturulabilir, cevaplanabilir, yorumlanabilir ve en iyi cevap seçilebilir.

**Acceptance Scenarios**:

1. **Given** kullanıcı giriş yapmış, **When** soru formu doldurur (başlık, detay, etiketler), **Then** soru yayınlanır
2. **Given** kullanıcı giriş yapmış ve soru detayında, **When** cevap yazar, **Then** cevap soru altında listelenir
3. **Given** soru sahibi, **When** bir cevabı "kabul edilen cevap" olarak işaretler, **Then** o cevap öne çıkarılır
4. **Given** kullanıcı giriş yapmış, **When** cevaba yorum ekler, **Then** yorum cevap altında görünür

---

### User Story 4 - İçerik Keşfi ve Arama (Priority: P2)

Bir veri bilimci Python ile ilgili içerikleri bulmak ister. Ana sayfada son ve popüler içerikleri görür. Arama çubuğunu kullanarak "pandas" araması yapar veya "python" etiketine tıklayarak filtreleme yapar.

**Why this priority**: Kullanıcıların değerli içeriklere ulaşabilmesi platformun kullanışlılığını belirler.

**Independent Test**: Ana sayfa feed çalışır, arama sonuç döndürür, tag filtreleme çalışır.

**Acceptance Scenarios**:

1. **Given** ziyaretçi ana sayfada, **When** sayfa yüklendiğinde, **Then** son eklenen içerikler ve popüler içerikler listelenir
2. **Given** kullanıcı arama çubuğunda, **When** anahtar kelime girer, **Then** başlık ve içerikte eşleşen sonuçlar döner
3. **Given** kullanıcı bir etikete tıklar, **When** etiket sayfası açılır, **Then** o etikete sahip tüm içerikler listelenir
4. **Given** arama sonucu boş, **When** sonuçlar gösterildiğinde, **Then** "Sonuç bulunamadı" mesajı ve öneriler gösterilir

---

### User Story 5 - Etkinlik Yönetimi (Priority: P2)

Bir topluluk lideri yaklaşan bir online meetup duyurusu yapar. Etkinlik başlığı, açıklaması, tarih/saat, online/offline tipi ve katılım linki ekler. Kullanıcılar etkinlikleri listeler ve detaylarını görüntüler.

**Why this priority**: Etkinlikler topluluk bağını güçlendirir ve üyelerin gerçek hayatta buluşmasını sağlar.

**Independent Test**: Etkinlik oluşturulabilir, listelenebilir, detayları görüntülenebilir.

**Acceptance Scenarios**:

1. **Given** yetkili kullanıcı (admin/moderator), **When** etkinlik formu doldurur, **Then** etkinlik oluşturulur ve listede görünür
2. **Given** ziyaretçi etkinlikler sayfasında, **When** sayfa yüklendiğinde, **Then** yaklaşan etkinlikler tarih sırasına göre listelenir
3. **Given** kullanıcı etkinlik detayında, **When** online etkinlik ise, **Then** katılım linki gösterilir
4. **Given** kullanıcı etkinlik detayında, **When** offline etkinlik ise, **Then** adres bilgisi gösterilir

---

### User Story 6 - Moderasyon ve Yönetim (Priority: P2)

Bir moderatör uygunsuz içerik bildirimi alır. İçeriği inceler ve topluluk kurallarına aykırıysa gizler veya siler. Tekrarlayan ihlallerde kullanıcıyı ban'lar.

**Why this priority**: Sağlıklı topluluk kültürü için moderasyon şarttır. Toksik içerik kullanıcıları uzaklaştırır.

**Independent Test**: İçerik gizlenebilir/silinebilir, kullanıcı ban'lanabilir, admin paneli çalışır.

**Acceptance Scenarios**:

1. **Given** moderatör/admin, **When** uygunsuz içeriği gizler, **Then** içerik normal kullanıcılara görünmez olur
2. **Given** admin, **When** içeriği siler, **Then** içerik kalıcı olarak kaldırılır
3. **Given** admin, **When** kullanıcıyı ban'lar, **Then** kullanıcı giriş yapamaz ve içerik oluşturamaz
4. **Given** admin, **When** kullanıcı rolünü değiştirir, **Then** yeni rol yetkileri geçerli olur

---

### User Story 7 - Başka Kullanıcı Profilini Görüntüleme (Priority: P3)

Bir kullanıcı ilginç bir yazı okur ve yazarın profiline gider. Yazarın biyografisini, sosyal linklerini ve diğer içeriklerini görür.

**Why this priority**: Topluluk üyeleri arasında bağlantı kurulmasını sağlar.

**Independent Test**: Başka kullanıcının public profili görüntülenebilir.

**Acceptance Scenarios**:

1. **Given** ziyaretçi veya kullanıcı, **When** bir yazarın profiline tıklar, **Then** public profil bilgileri görüntülenir
2. **Given** kullanıcı başka bir profilde, **When** sayfa yüklendiğinde, **Then** o kullanıcının postları ve soruları listelenir

---

### Edge Cases

- Kayıt sırasında geçersiz e-posta formatı girilirse uygun hata mesajı gösterilir
- Şifre minimum 8 karakter olmalı, aksi halde form doğrulama hatası verilir
- Çok uzun içerik (örn. 100.000+ karakter) gönderilirse karakter limiti uygulanır
- Aynı anda çok sayıda yorum/içerik gönderilirse rate limiting devreye girer
- Etkinlik tarihi geçmişte seçilirse hata verilir
- Silinmiş içeriğe doğrudan URL ile erişilmeye çalışılırsa 404 sayfası gösterilir
- Banlanmış kullanıcı giriş yapmaya çalışırsa "Hesabınız askıya alındı" mesajı gösterilir
- Yüklenen avatar 2MB'dan büyükse veya desteklenmeyen formatta ise hata verilir

## Requirements *(mandatory)*

### Functional Requirements

**Kimlik Doğrulama ve Kullanıcı Yönetimi**

- **FR-001**: Sistem, e-posta ve şifre ile kullanıcı kaydı yapabilmeli
- **FR-002**: Sistem, e-posta formatını ve şifre gücünü (min 8 karakter) doğrulamalı
- **FR-003**: Sistem, kayıtlı kullanıcıların giriş yapmasını sağlamalı
- **FR-004**: Kullanıcılar şifrelerini sıfırlayabilmeli (e-posta ile link gönderimi)
- **FR-005**: Sistem, oturum yönetimi yapmalı (oturum süresi: 7 gün aktif kalmazsa sonlanır)

**Kullanıcı Profili**

- **FR-006**: Kullanıcılar profil avatar'ı yükleyebilmeli (max 2MB, JPG/PNG formatları)
- **FR-007**: Kullanıcılar biyografi (max 500 karakter) ve sosyal linkler (GitHub, Twitter, LinkedIn, kişisel site) ekleyebilmeli
- **FR-008**: Kullanıcı profil sayfası, o kullanıcının postlarını ve sorularını listelenmeli
- **FR-009**: Profiller, sahipleri hariç herkes için salt okunur görüntülenmeli

**İçerik - Blog Postları**

- **FR-010**: Kullanıcılar blog postları oluşturabilmeli (başlık: max 200 karakter, içerik: markdown destekli, max 50.000 karakter)
- **FR-011**: Postlara en az 1, en fazla 5 tag eklenebilmeli
- **FR-012**: Post sahipleri kendi postlarını düzenleyebilmeli ve silebilmeli
- **FR-013**: Postlar liste ve detay sayfalarında görüntülenebilmeli

**İçerik - Soru-Cevap**

- **FR-014**: Kullanıcılar soru oluşturabilmeli (başlık: max 200 karakter, detay: max 30.000 karakter)
- **FR-015**: Sorulara en az 1, en fazla 5 tag eklenebilmeli
- **FR-016**: Kullanıcılar sorulara cevap yazabilmeli (max 30.000 karakter)
- **FR-017**: Soru sahibi bir cevabı "kabul edilen cevap" olarak işaretleyebilmeli
- **FR-018**: Soru başına yalnızca bir kabul edilen cevap olabilmeli

**Yorumlar**

- **FR-019**: Kullanıcılar postlara ve cevaplara yorum yapabilmeli (max 2.000 karakter)
- **FR-020**: Yorum sahipleri kendi yorumlarını düzenleyebilmeli ve silebilmeli
- **FR-021**: Yorumlar, ilgili içeriğin altında kronolojik sırada gösterilmeli

**Tag Sistemi**

- **FR-022**: Sistem, içerikler için tag (etiket) sistemi sağlamalı
- **FR-023**: Tag'ler benzersiz ve küçük harfli olmalı (max 30 karakter)
- **FR-024**: Kullanıcılar tag'e tıklayarak ilgili tüm içerikleri filtreleyebilmeli

**Etkinlikler**

- **FR-025**: Yetkili kullanıcılar (admin/moderator) etkinlik oluşturabilmeli
- **FR-026**: Etkinlikler başlık, açıklama, tarih/saat, tip (online/offline), link veya adres içermeli
- **FR-027**: Etkinlikler tarih sırasına göre listelenebilmeli (yaklaşan önce)
- **FR-028**: Geçmiş etkinlikler ayrı sekmede veya filtre ile görüntülenebilmeli

**Arama ve Keşif**

- **FR-029**: Sistem, başlık ve içerik metinlerinde arama yapabilmeli
- **FR-030**: Arama sonuçları postlar ve sorular için ayrı kategorize edilmeli
- **FR-031**: Ana sayfa, son eklenen içerikleri göstermeli (sayfalama ile)
- **FR-032**: Ana sayfa, popüler içerikleri göstermeli (görüntülenme/yorum sayısına göre)

**Rol ve Moderasyon**

- **FR-033**: Sistem, üç rol desteklemeli: admin, moderator, normal kullanıcı
- **FR-034**: Admin, tüm içerikleri düzenleyebilmeli, silebilmeli ve kullanıcıları yönetebilmeli
- **FR-035**: Moderator, uygunsuz içerikleri gizleyebilmeli ve silebilmeli
- **FR-036**: Admin, kullanıcıları banlayabilmeli ve ban kaldırabilmeli
- **FR-037**: Banlanmış kullanıcılar giriş yapamamalı ve içerik oluşturamamalı
- **FR-038**: Admin, kullanıcı rollerini değiştirebilmeli

### Key Entities

- **User (Kullanıcı)**: Platform üyesi. E-posta, şifre hash'i, avatar, biyografi, sosyal linkler, rol (admin/moderator/user), ban durumu, kayıt tarihi
- **Post (Blog Yazısı)**: Kullanıcı tarafından oluşturulan teknik içerik. Başlık, içerik (markdown), yazar ilişkisi, oluşturma/güncelleme tarihi, görüntülenme sayısı, tag ilişkileri
- **Question (Soru)**: Kullanıcının sorduğu teknik soru. Başlık, detay, yazar ilişkisi, tarih, kabul edilen cevap ilişkisi, tag ilişkileri
- **Answer (Cevap)**: Soruya verilen yanıt. İçerik, yazar ilişkisi, soru ilişkisi, kabul durumu, tarih
- **Comment (Yorum)**: Post veya cevaba yapılan kısa yorum. İçerik, yazar ilişkisi, ilgili içerik ilişkisi (polimorfik), tarih
- **Tag (Etiket)**: İçerikleri kategorize eden etiket. Ad (benzersiz, küçük harf), ilişkili post ve soru sayısı
- **Event (Etkinlik)**: Topluluk etkinliği. Başlık, açıklama, tarih/saat, tip (online/offline), link veya adres, oluşturan kullanıcı ilişkisi

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Kullanıcı Büyümesi**

- **SC-001**: Platform, lansmandan 6 ay sonra en az 1.000 kayıtlı kullanıcıya ulaşmalı
- **SC-002**: Aylık aktif kullanıcı sayısı (en az 1 içerik etkileşimi) kayıtlı kullanıcıların %20'si olmalı

**İçerik Üretimi**

- **SC-003**: 6 ay içinde toplam 5.000+ içerik üretilmeli (postlar + sorular + cevaplar + yorumlar)
- **SC-004**: Ortalama soru başına en az 1 cevap alınmalı (30 gün içinde)

**Kullanıcı Deneyimi**

- **SC-005**: Kullanıcılar kayıt işlemini 2 dakika içinde tamamlayabilmeli
- **SC-006**: Kullanıcılar içerik oluşturma işlemini 5 dakika içinde tamamlayabilmeli
- **SC-007**: Arama sonuçları 1 saniye içinde gösterilmeli
- **SC-008**: Sayfa yüklenme süresi 2 saniyenin altında olmalı (p95)

**Trafik ve Keşfedilebilirlik**

- **SC-009**: Arama motorlarından gelen organik trafik, aylık bazda artış göstermeli
- **SC-010**: İçeriklerin %80'i arama motorları tarafından indekslenmeli

**Platform Sağlığı**

- **SC-011**: Moderasyon gerektiren içerik oranı %5'in altında kalmalı
- **SC-012**: Kullanıcı şikayetlerine 48 saat içinde yanıt verilmeli

## Assumptions

- MVP'de yalnızca e-posta/şifre ile kimlik doğrulama olacak, sosyal login sonraki fazlarda eklenecek
- Popülerlik sıralaması, görüntülenme sayısı ve yorum sayısının kombinasyonuyla hesaplanacak
- E-posta doğrulaması opsiyonel olacak (spam önleme için CAPTCHA kullanılabilir)
- İçerik dili varsayılan Türkçe olacak, çoklu dil desteği sonraki fazlarda gelecek
- Rate limiting standart değerler: dakikada 10 içerik oluşturma, saniyede 1 yorum
- Etkinlik oluşturma yetkisi admin ve moderatörlerde olacak
- Arama full-text arama olacak, gelişmiş semantik arama sonraki fazlarda eklenecek

## Out of Scope (MVP Dışı)

- Gerçek zamanlı chat / mesajlaşma
- Rozet ve karma sistemi (gamification)
- İş ilanları
- Çoklu dil desteği (i18n)
- Sosyal login (Google, GitHub, vb.)
- Bildirim sistemi (e-posta ve push)
- Mobil uygulama
