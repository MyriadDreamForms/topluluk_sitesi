# TechCommunity Türkiye 🇹🇷

Türkiye'nin yazılım geliştiricileri için açık kaynak topluluk platformu. Stack Overflow ve Dev.to'nun Türkçe versiyonu olarak tasarlandı.

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 İçindekiler

- [Özellikler](#-özellikler)
- [Teknoloji Stack](#-teknoloji-stack)
- [Başlangıç](#-başlangıç)
  - [Gereksinimler](#gereksinimler)
  - [Kurulum](#kurulum)
  - [Geliştirme](#geliştirme)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## ✨ Özellikler

### 👤 Kullanıcı Yönetimi
- JWT tabanlı kimlik doğrulama
- E-posta/şifre ile kayıt ve giriş
- Özelleştirilebilir profil sayfaları
- Sosyal medya bağlantıları (GitHub, Twitter, LinkedIn)

### 📝 Blog Yazıları
- Markdown destekli içerik editörü
- Etiket bazlı kategorileme
- Kapak görseli desteği
- Beğeni ve yorum sistemi
- Featured/öne çıkan yazılar

### ❓ Soru & Cevap
- Stack Overflow benzeri Q&A sistemi
- Kabul edilen cevap işaretleme
- Oy verme sistemi (upvote/downvote)
- Markdown formatında sorular ve cevaplar

### 🎉 Etkinlikler
- Online ve offline etkinlik yönetimi
- Etkinlik takvimi
- Katılımcı listesi
- Organizatör profili

### 🔍 Arama ve Keşif
- Unified arama (yazılar, sorular, kullanıcılar)
- Etiket bazlı filtreleme
- Trending ve popüler içerikler
- Kişiselleştirilmiş feed

### 👮 Yönetim Paneli
- Kullanıcı yönetimi
- İçerik moderasyonu
- İstatistik dashboard
- Rol tabanlı yetkilendirme

## 🛠 Teknoloji Stack

### Backend
- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM
- **PostgreSQL** - Veritabanı
- **MediatR** - CQRS pattern
- **FluentValidation** - Input validation
- **JWT** - Authentication
- **Markdig** - Markdown işleme

### Frontend
- **Angular 21** - SPA framework
- **Angular SSR** - Server-side rendering
- **Standalone Components** - Modern Angular mimarisi
- **Signals** - State management
- **SCSS** - Styling

### DevOps & Tools
- **Docker** - Containerization
- **Swagger/OpenAPI** - API documentation
- **Rate Limiting** - API güvenliği

## 🚀 Başlangıç

### Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 22+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

### Kurulum

1. **Repoyu klonlayın**
```bash
git clone https://github.com/your-username/techcommunity-turkey.git
cd techcommunity-turkey
```

2. **PostgreSQL veritabanı oluşturun**
```sql
CREATE DATABASE techcommunity;
```

3. **Backend ayarları**
```bash
cd backend/src/TechCommunity.API
# appsettings.Development.json dosyasında connection string'i güncelleyin
```

4. **Backend'i başlatın**
```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/TechCommunity.API
```

5. **Frontend'i başlatın**
```bash
cd frontend
npm install
npm run dev
```

### Geliştirme

| Komut | Açıklama |
|-------|----------|
| `dotnet run` | Backend API'yi başlatır (http://localhost:5000) |
| `npm run dev` | Frontend dev server (http://localhost:4200) |
| `npm run build` | Production build |
| `npm run build:ssr` | SSR production build |

### Environment Variables

Backend (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=techcommunity;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "your-super-secret-key-minimum-32-characters",
    "Issuer": "TechCommunity",
    "Audience": "TechCommunity"
  }
}
```

## 📁 Proje Yapısı

```
├── backend/
│   ├── src/
│   │   ├── TechCommunity.API/          # Web API layer
│   │   │   ├── Controllers/            # API endpoints
│   │   │   ├── Middleware/             # Exception, security handling
│   │   │   └── Models/                 # Request/Response models
│   │   ├── TechCommunity.Application/  # Business logic layer
│   │   │   ├── Common/                 # Shared utilities
│   │   │   └── Features/               # CQRS commands/queries
│   │   ├── TechCommunity.Domain/       # Domain entities
│   │   │   ├── Entities/               # Domain models
│   │   │   └── Enums/                  # Enumerations
│   │   └── TechCommunity.Infrastructure/  # Data access
│   │       ├── Persistence/            # EF Core DbContext
│   │       └── Services/               # External services
│   └── TechCommunity.sln
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                   # Guards, services, interceptors
│   │   │   ├── features/               # Feature modules
│   │   │   │   ├── auth/               # Authentication
│   │   │   │   ├── posts/              # Blog posts
│   │   │   │   ├── questions/          # Q&A
│   │   │   │   ├── events/             # Events
│   │   │   │   ├── profile/            # User profiles
│   │   │   │   ├── admin/              # Admin panel
│   │   │   │   └── search/             # Search
│   │   │   └── shared/                 # Shared components
│   │   ├── environments/               # Environment configs
│   │   └── styles/                     # Global styles
│   ├── angular.json
│   └── package.json
├── specs/                              # Feature specifications
└── README.md
```

## 📚 API Dokümantasyonu

API dokümantasyonu Swagger UI üzerinden erişilebilir:

- **Development**: http://localhost:5000/swagger
- **Production**: https://api.techcommunity.com.tr/swagger

### Temel Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Kullanıcı girişi |
| GET | `/api/posts` | Blog yazılarını listele |
| POST | `/api/posts` | Yeni yazı oluştur |
| GET | `/api/questions` | Soruları listele |
| POST | `/api/questions` | Yeni soru sor |
| GET | `/api/events` | Etkinlikleri listele |
| GET | `/api/search` | Unified arama |
| GET | `/api/feed` | Kişiselleştirilmiş feed |

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen aşağıdaki adımları izleyin:

1. Repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesajları

[Conventional Commits](https://www.conventionalcommits.org/) formatını kullanıyoruz:

- `feat:` - Yeni özellik
- `fix:` - Bug düzeltme
- `docs:` - Dokümantasyon
- `style:` - Kod formatı
- `refactor:` - Refactoring
- `test:` - Test ekleme
- `chore:` - Bakım işleri

### Kod Standartları

- **Backend**: C# coding conventions, async/await pattern
- **Frontend**: Angular style guide, standalone components
- **Veritabanı**: PostgreSQL naming conventions

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- Tüm katkıda bulunanlara
- Açık kaynak topluluğuna
- Türk yazılımcı topluluğuna

---

<p align="center">
  Made with ❤️ in Türkiye
</p>
