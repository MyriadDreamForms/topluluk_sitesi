# Research: Türkiye Teknoloji Topluluk Platformu (MVP)

**Date**: 2024-11-30  
**Feature**: [spec.md](spec.md) | [plan.md](plan.md)

## Overview

Bu doküman, teknoloji yığını için araştırma bulgularını ve en iyi pratikleri içerir. Tüm NEEDS CLARIFICATION maddeleri çözümlenmiştir.

---

## 1. Angular 21 SSR (Angular Universal)

### SSR Yaklaşımı

**Decision**: Angular 21 Hybrid Rendering (`RenderMode` yapılandırması)

**Rationale**: Angular 21, route bazında SSR, SSG ve CSR karışımına izin veren hibrit rendering sunuyor. Bu sayede:
- Dinamik içerikler (feed, profiller) için SSR
- Statik sayfalar (hakkında, SSS) için pre-rendering
- Admin paneli gibi yoğun etkileşimli sayfalar için CSR

**Alternatives considered**:
- Pure SSR: Sunucu maliyeti yüksek, daha karmaşık
- Pure CSR: Zayıf SEO, yavaş ilk yükleme
- Full SSG: Dinamik topluluk içeriği için uygun değil

### SEO Optimizasyonu

**Decision**: Angular'ın built-in `Meta` ve `Title` servisleri + HttpClient transfer cache

**Rationale**: 
- `Meta` servisi dinamik meta tag'leri yönetir
- Transfer cache, SSR sırasında fetch edilen verileri client'a aktarır (duplicate request önler)
- `DOCUMENT` token ile canonical link enjeksiyonu

**Alternatives considered**: Üçüncü parti SEO kütüphaneleri (gereksiz overhead)

### Module Organizasyonu

**Decision**: Feature-based lazy-loaded standalone components

**Rationale**: Angular 21, NgModules yerine standalone component'ları tercih ediyor. Feature klasörleri (`/features/posts`, `/features/questions`, vb.) ile lazy loading route yapılandırmasıyla sağlanır.

### State Management

**Decision**: Angular Signals (component/local state) + Services (shared state)

**Rationale**: 
- Signals, Angular v21'de stable ve fine-grained change detection sağlıyor
- MVP için Signals + Services, NgRx'ten daha basit
- `computed()` ve `effect()` ile türetilmiş state

**Alternatives considered**:
- NgRx: MVP için overkill, fazla boilerplate
- RxJS-only services: Signals daha sezgisel

### SSR Performance

**Decision**: `HttpTransferCacheOptions`, `afterNextRender()`, route-level render mode

**Rationale**:
- Transfer cache hydration sırasında duplicate API çağrılarını önler
- `afterNextRender()` browser-only API'leri güvenle handle eder
- Route bazında render mode seçimi sunucu yükünü optimize eder

---

## 2. .NET 10 Clean Architecture

### Klasör Yapısı

**Decision**: 4 katmanlı Clean Architecture: `Domain`, `Application`, `Infrastructure`, `WebAPI`

**Rationale**: Net sorumluluk ayrımı:
- **Domain**: Bağımsız, iş kuralları ve entity'ler
- **Application**: Use case'ler, DTO'lar, interface tanımları
- **Infrastructure**: EF Core, external servisler, repository implementasyonları
- **WebAPI**: Controller'lar, middleware, DI konfigürasyonu

**Alternatives considered**:
- Single project: Büyüdükçe bakım zorlaşır
- Microservices: MVP için erken optimizasyon

### CQRS with MediatR

**Decision**: MediatR ile Command/Query ayrımı

**Rationale**:
- Clean decoupling sağlar
- Pipeline behaviors ile cross-cutting concerns (validation, logging)
- Test edilebilir handler'lar
- İleride read/write ölçeklendirmesi için hazırlık

**Alternatives considered**:
- Direct service calls: Tight coupling
- No CQRS: İleride ölçeklendirmesi zor

### Repository Pattern

**Decision**: Karmaşık sorgular için Repository pattern, basit CRUD için direkt EF Core

**Rationale**: Hibrit yaklaşım:
- Repository pattern karmaşık sorgular ve testing için
- Basit operasyonlar için DbContext kullanımı boilerplate azaltır
- Microsoft rehberliği: Repository + Unit of Work karmaşık senaryolar için

---

## 3. JWT Authentication with Refresh Tokens

### Token Flow

**Decision**: Kısa ömürlü access token (15-30 dk) + uzun ömürlü refresh token (7 gün) + rotation

**Rationale**:
- Kısa access token, ele geçirilme durumunda hasar penceresini sınırlar
- Refresh token rotation, her kullanımda eski token'ı geçersiz kılar
- Token hırsızlığı tespit edilebilir

### Token Storage

**Decision**: Access token → memory (Angular service), Refresh token → HttpOnly secure cookie

**Rationale**:
- HttpOnly cookie XSS ile erişilemez
- Memory'deki access token sayfa kapanınca temizlenir
- `SameSite=Strict` ile CSRF önlenir

**Alternatives considered**:
- localStorage: XSS'e açık
- İkisi de cookie: Büyük payload, CSRF endişesi
- İkisi de memory: Sayfa yenilemede kayıp, kötü UX

### Token Rotation

**Decision**: Refresh token rotation + reuse detection

**Rationale**:
- Her refresh işlemi yeni refresh token üretir, eskisini geçersiz kılar
- Eski token tekrar kullanılırsa tüm token ailesi iptal edilir (hırsızlık göstergesi)

### .NET Implementasyonu

**Decision**: `AddJwtBearer()` + custom refresh token endpoint + veritabanında token family tracking

**Rationale**:
- Built-in JWT validation access token'ları handle eder
- Custom endpoint refresh için token family takibi ve iptal sağlar
- Token hash saklanır, düz metin değil

**Alternatives considered**:
- IdentityServer: MVP için overkill
- Duende IdentityServer: Lisans maliyeti

---

## 4. PostgreSQL with EF Core

### Migration Stratejisi

**Decision**: Code-first migrations + idempotent scripts + ayrı migration projesi

**Rationale**:
- Code-first şemayı domain ile senkron tutar
- Idempotent scripts (`dotnet ef migrations script --idempotent`) CI/CD için güvenli
- Ayrı proje runtime migration assembly yüklemesini önler

### Türkçe Full-Text Search

**Decision**: PostgreSQL native FTS + Türkçe dictionary konfigürasyonu (Npgsql)

**Rationale**:
- PostgreSQL built-in Türkçe text search konfigürasyonu var
- `NpgsqlTsVector` kolonu + GIN index
- `HasGeneratedTsVectorColumn()` ile otomatik vector güncellemesi

```csharp
modelBuilder.Entity<Post>()
    .HasGeneratedTsVectorColumn(
        p => p.SearchVector,
        "turkish",  // Türkçe text search config
        p => new { p.Title, p.Content })
    .HasIndex(p => p.SearchVector)
    .HasMethod("GIN");
```

**Alternatives considered**:
- Elasticsearch: MVP için operasyonel yük
- LIKE sorguları: Düşük performans, stemming yok
- External search service: Ek maliyet/karmaşıklık

### Performance Optimizasyonu

**Decision**: Stratejik indexing + compiled queries + connection pooling

**Rationale**:
- Sık sorgulanan kolonlara index (tags, user_id, created_at)
- Hot path'ler için `EF.CompileAsyncQuery()`
- Npgsql connection pooling varsayılan olarak aktif

---

## 5. Caching Stratejisi

### Cache Implementasyonu

**Decision**: MVP için `IMemoryCache`, Redis'e migration için hazırlık

**Rationale**:
- `IMemoryCache` sıfır altyapı maliyeti, tek sunucu MVP için yeterli
- `IDistributedCache` interface kullanımı Redis'e sorunsuz geçiş sağlar
- Çoklu sunucu veya yüksek trafik için Redis önerilir

### Cache Invalidation

**Decision**: Time-based expiration (sliding + absolute) + event-driven invalidation

**Rationale**:
- Sliding expiration (örn. 5 dk) + absolute expiration (örn. 30 dk) kombinasyonu
- Write operasyonlarında domain events veya MediatR notifications ile invalidation

### Neyi Cache'leyeceğiz

| Öncelik | İçerik | TTL | Invalidation |
|---------|--------|-----|--------------|
| **Yüksek** | Tag listesi | 10 dk sliding, 1 saat absolute | Tag CRUD işlemlerinde |
| **Yüksek** | Popüler postlar | 5 dk sliding, 30 dk absolute | Post güncellemelerinde |
| **Orta** | Feed sonuçları | 2 dk sliding | Yeni içerik eklendiğinde |
| **Düşük** | Post metadata | 5 dk sliding | Post güncellemelerinde |
| **Cache'leme** | Kullanıcı-özel veri | - | Kişiselleştirilmiş, cache'lenmez |

---

## 6. URL Yapısı ve SEO

### Türkçe Karakterler ve Slug

**Decision**: Türkçe karakterleri ASCII'ye çevir, slug oluştur

**Rationale**: SEO-friendly ve browser-safe URL'ler:
- `ş → s`, `ı → i`, `ğ → g`, `ü → u`, `ö → o`, `ç → c`
- Boşluklar tire (`-`) ile değiştirilir
- Küçük harf, özel karakterler kaldırılır

**URL Örnekleri**:
- Post: `/yazi/123-angular-ile-ssr-uygulamasi`
- Soru: `/soru/456-typescript-generics-nasil-kullanilir`
- Kullanıcı: `/kullanici/mehmet-yilmaz`
- Etiket: `/etiket/javascript`
- Etkinlik: `/etkinlik/789-istanbul-tech-meetup`

---

## 7. Rate Limiting

**Decision**: AspNetCoreRateLimit veya .NET 10 built-in rate limiting

**Rationale**: .NET 10 built-in rate limiting middleware sağlıyor:
- Fixed window, sliding window, token bucket algoritmaları
- Endpoint bazında konfigürasyon
- IP veya kullanıcı bazında limit

**Limitler**:
- Genel API: 100 request/dakika
- İçerik oluşturma: 10 request/dakika
- Yorum: 60 request/dakika
- Auth: 5 login denemesi/dakika

---

## Summary Table

| Alan | Karar | Karmaşıklık | Ölçeklendirme Yolu |
|------|-------|-------------|---------------------|
| Angular SSR | Hybrid rendering (RenderMode) | Orta | Edge deployment destekler |
| State Management | Signals + Services | Düşük | Gerekirse NgRx'e geçiş |
| Backend Architecture | Clean Architecture + CQRS | Orta | Microservices extraction destekler |
| Auth | JWT + Refresh Token rotation | Orta | OAuth provider'lar eklenebilir |
| Database | PostgreSQL FTS (Türkçe) | Orta | Read replica, partitioning |
| Caching | IMemoryCache → Redis | Düşük | IDistributedCache abstraction |

---

## Referanslar

- [Angular SSR Documentation](https://angular.dev/guide/ssr)
- [.NET Clean Architecture Template](https://github.com/jasontaylordev/CleanArchitecture)
- [PostgreSQL Turkish Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [JWT Best Practices (OWASP)](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet_for_Java.html)
- [.NET Rate Limiting](https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit)
