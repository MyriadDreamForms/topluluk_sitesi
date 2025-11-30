# Implementation Plan: Türkiye Teknoloji Topluluk Platformu (MVP)

**Branch**: `001-tech-community-platform` | **Date**: 2024-11-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-tech-community-platform/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Türkiye'deki yazılımcılar, veri bilimciler ve teknoloji meraklıları için topluluk platformu MVP'si. Blog postları, soru-cevap, etkinlik duyuruları ve moderasyon sistemi içerir. Angular 21 + .NET 10 Clean Architecture ile modüler monolith backend, PostgreSQL veritabanı ve SEO için SSR desteği.

## Technical Context

**Frontend**:
- **Framework**: Angular 21 (TypeScript)
- **SSR**: Angular Universal (pre-render + dynamic SSR)
- **UI**: Responsive tasarım (desktop + mobile)
- **Module Yapısı**: Feature-based lazy-loaded modüller (auth, profile, posts, questions, events, admin)
- **SEO**: Dinamik title/meta, temiz URL yapısı (/soru/[id]-[slug], /yazi/[id]-[slug], /kullanici/[username])

**Backend**:
- **Framework**: .NET 10 (ASP.NET Core Web API)
- **Architecture**: Clean Architecture (Modüler Monolith)
  - Domain: Entities, Value Objects, Domain Events
  - Application: Use Cases, DTOs, Interfaces
  - Infrastructure: EF Core, External Services, Caching
  - API: Controllers, Middleware, Filters
- **Auth**: JWT (Access Token + Refresh Token), Role-based (Admin, Moderator, User)
- **Validation**: FluentValidation
- **Exception Handling**: Global exception handler, standart API response formatı

**Storage**: PostgreSQL + EF Core (Code First + Migrations)

**Caching**: In-memory cache (IMemoryCache) veya Redis (tag listeleri, ana sayfa feed)

**Testing**: 
- Backend: xUnit + FluentAssertions + Moq
- Frontend: Jasmine + Karma (unit), Cypress (e2e)

**Target Platform**: Web (Linux server deployment)

**Project Type**: Web Application (frontend + backend)

**Performance Goals**: 
- p95 API response < 500ms
- p95 sayfa yükleme < 2sn
- 1000 concurrent users

**Constraints**: 
- MVP'de real-time chat yok
- Gamification yok
- Çoklu dil desteği yok

**Scale/Scope**: 
- 6 ayda 1000 kullanıcı, 5000+ içerik
- SEO organik trafik artışı

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

> **Note**: Constitution template is not configured for this project. Using default software engineering best practices.

| Principle | Status | Notes |
|-----------|--------|-------|
| Clean Architecture | ✅ PASS | Domain, Application, Infrastructure, API katmanları tanımlı |
| Test-First | ✅ PASS | xUnit + Jasmine/Karma/Cypress test stratejisi belirlenmiş |
| Modular Design | ✅ PASS | Feature-based Angular modüller, modüler monolith backend |
| API Standards | ✅ PASS | REST API, standart response formatı, pagination |
| Security | ✅ PASS | JWT auth, role-based authorization, password hashing |

## Project Structure

### Documentation (this feature)

```text
specs/001-tech-community-platform/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── openapi.yaml     # REST API contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web Application Structure: Angular Frontend + .NET Backend

backend/
├── src/
│   ├── TechCommunity.Domain/           # Entities, Value Objects, Enums
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Enums/
│   │   └── Common/
│   ├── TechCommunity.Application/      # Use Cases, DTOs, Interfaces
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   ├── Exceptions/
│   │   │   └── Interfaces/
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   ├── Users/
│   │   │   ├── Posts/
│   │   │   ├── Questions/
│   │   │   ├── Comments/
│   │   │   ├── Tags/
│   │   │   └── Events/
│   │   └── DTOs/
│   ├── TechCommunity.Infrastructure/   # EF Core, External Services
│   │   ├── Persistence/
│   │   │   ├── Configurations/
│   │   │   ├── Migrations/
│   │   │   └── Repositories/
│   │   ├── Services/
│   │   │   ├── Identity/
│   │   │   ├── Caching/
│   │   │   └── FileStorage/
│   │   └── DependencyInjection.cs
│   └── TechCommunity.API/              # Controllers, Middleware
│       ├── Controllers/
│       ├── Middleware/
│       ├── Filters/
│       └── Program.cs
└── tests/
    ├── TechCommunity.Domain.Tests/
    ├── TechCommunity.Application.Tests/
    ├── TechCommunity.Infrastructure.Tests/
    └── TechCommunity.API.Tests/

frontend/
├── src/
│   ├── app/
│   │   ├── core/                       # Singleton services, guards, interceptors
│   │   │   ├── auth/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── services/
│   │   ├── shared/                     # Reusable components, pipes, directives
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── directives/
│   │   ├── features/                   # Feature modules (lazy-loaded)
│   │   │   ├── auth/
│   │   │   ├── profile/
│   │   │   ├── posts/
│   │   │   ├── questions/
│   │   │   ├── events/
│   │   │   ├── search/
│   │   │   └── admin/
│   │   ├── layouts/                    # Page layouts
│   │   └── app.routes.ts
│   ├── assets/
│   ├── environments/
│   └── styles/
├── e2e/                                # Cypress e2e tests
└── angular.json
```

**Structure Decision**: Web Application yapısı seçildi. Backend Clean Architecture ile modüler monolith olarak, Frontend feature-based Angular module yapısı ile organize edildi.

## Complexity Tracking

> Tüm Constitution Check kuralları geçti. Karmaşıklık ihlali yok.
