# Data Model: Türkiye Teknoloji Topluluk Platformu (MVP)

**Date**: 2024-11-30  
**Feature**: [spec.md](spec.md) | [plan.md](plan.md)

## Overview

Bu doküman, platform için veritabanı şemasını ve entity ilişkilerini tanımlar. EF Core Code-First yaklaşımı ile PostgreSQL veritabanı kullanılacaktır.

---

## Entity Relationship Diagram (Conceptual)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │──────<│    Post     │>──────│    Tag      │
│             │       │             │       │             │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       │              ┌──────┴──────┐              │
       │              │             │              │
       ▼              ▼             │              │
┌─────────────┐ ┌─────────────┐     │       ┌──────┴──────┐
│  Question   │─│   Answer    │     │       │  PostTag    │
│             │ │             │     │       │(Junction)   │
└──────┬──────┘ └──────┬──────┘     │       └─────────────┘
       │               │            │
       │        ┌──────┴──────┐     │       ┌─────────────┐
       └───────>│   Comment   │<────┘       │QuestionTag  │
                │(Polymorphic)│             │(Junction)   │
                └─────────────┘             └─────────────┘
                
┌─────────────┐       ┌─────────────┐
│    Event    │──────<│    User     │
│             │       │(CreatedBy)  │
└─────────────┘       └─────────────┘

┌─────────────┐
│RefreshToken │──────<│    User     │
│             │       │             │
└─────────────┘       └─────────────┘
```

---

## Entities

### 1. User (Kullanıcı)

Platform üyesi. Kimlik doğrulama ve profil bilgilerini içerir.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz kullanıcı kimliği |
| `Email` | string(256) | Unique, Required | E-posta adresi (login için) |
| `PasswordHash` | string(512) | Required | Şifre hash'i (BCrypt) |
| `Username` | string(50) | Unique, Required | Görünen kullanıcı adı |
| `DisplayName` | string(100) | Nullable | Görüntülenen isim |
| `Bio` | string(500) | Nullable | Biyografi |
| `AvatarUrl` | string(500) | Nullable | Avatar resim URL'i |
| `GitHubUrl` | string(200) | Nullable | GitHub profil linki |
| `TwitterUrl` | string(200) | Nullable | Twitter profil linki |
| `LinkedInUrl` | string(200) | Nullable | LinkedIn profil linki |
| `WebsiteUrl` | string(200) | Nullable | Kişisel site linki |
| `Role` | enum | Required | Admin, Moderator, User |
| `IsBanned` | bool | Default: false | Yasaklanma durumu |
| `BanReason` | string(500) | Nullable | Yasaklanma nedeni |
| `BannedAt` | DateTime? | Nullable | Yasaklanma tarihi |
| `CreatedAt` | DateTime | Required | Kayıt tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme tarihi |
| `LastLoginAt` | DateTime? | Nullable | Son giriş tarihi |

**Indexes**:
- `IX_User_Email` (Unique)
- `IX_User_Username` (Unique)
- `IX_User_Role`

**Relationships**:
- `Posts` → 1:N → Post
- `Questions` → 1:N → Question
- `Answers` → 1:N → Answer
- `Comments` → 1:N → Comment
- `CreatedEvents` → 1:N → Event
- `RefreshTokens` → 1:N → RefreshToken

---

### 2. Post (Blog Yazısı)

Kullanıcı tarafından oluşturulan blog içeriği.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz post kimliği |
| `Title` | string(200) | Required | Başlık |
| `Slug` | string(250) | Required, Unique | SEO-friendly URL slug |
| `Content` | text | Required, Max 50000 | Markdown içerik |
| `ContentHtml` | text | Nullable | Render edilmiş HTML (cache) |
| `AuthorId` | GUID | FK → User | Yazar |
| `ViewCount` | int | Default: 0 | Görüntülenme sayısı |
| `IsPublished` | bool | Default: true | Yayın durumu |
| `IsHidden` | bool | Default: false | Moderasyon gizleme |
| `HiddenReason` | string(500) | Nullable | Gizleme nedeni |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme |
| `PublishedAt` | DateTime? | Nullable | Yayın tarihi |
| `SearchVector` | tsvector | Generated | FTS için Türkçe vector |

**Indexes**:
- `IX_Post_AuthorId`
- `IX_Post_Slug` (Unique)
- `IX_Post_CreatedAt` (DESC)
- `IX_Post_ViewCount` (DESC)
- `IX_Post_SearchVector` (GIN)
- `IX_Post_IsPublished_IsHidden`

**Relationships**:
- `Author` → N:1 → User
- `Tags` → N:M → Tag (via PostTag)
- `Comments` → 1:N → Comment

---

### 3. Question (Soru)

Topluluk tarafından cevaplanacak teknik soru.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz soru kimliği |
| `Title` | string(200) | Required | Soru başlığı |
| `Slug` | string(250) | Required, Unique | SEO-friendly URL slug |
| `Body` | text | Required, Max 30000 | Soru detayı (markdown) |
| `BodyHtml` | text | Nullable | Render edilmiş HTML |
| `AuthorId` | GUID | FK → User | Soru sahibi |
| `AcceptedAnswerId` | GUID? | FK → Answer | Kabul edilen cevap |
| `ViewCount` | int | Default: 0 | Görüntülenme sayısı |
| `AnswerCount` | int | Default: 0 | Cevap sayısı (denormalize) |
| `IsHidden` | bool | Default: false | Moderasyon gizleme |
| `HiddenReason` | string(500) | Nullable | Gizleme nedeni |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme |
| `SearchVector` | tsvector | Generated | FTS için Türkçe vector |

**Indexes**:
- `IX_Question_AuthorId`
- `IX_Question_Slug` (Unique)
- `IX_Question_CreatedAt` (DESC)
- `IX_Question_AnswerCount` (DESC)
- `IX_Question_SearchVector` (GIN)
- `IX_Question_AcceptedAnswerId`

**Relationships**:
- `Author` → N:1 → User
- `AcceptedAnswer` → 1:1 → Answer (nullable)
- `Answers` → 1:N → Answer
- `Tags` → N:M → Tag (via QuestionTag)

---

### 4. Answer (Cevap)

Soruya verilen yanıt.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz cevap kimliği |
| `Body` | text | Required, Max 30000 | Cevap içeriği (markdown) |
| `BodyHtml` | text | Nullable | Render edilmiş HTML |
| `QuestionId` | GUID | FK → Question | İlgili soru |
| `AuthorId` | GUID | FK → User | Cevap yazarı |
| `IsAccepted` | bool | Default: false | Kabul edilen cevap mı |
| `IsHidden` | bool | Default: false | Moderasyon gizleme |
| `HiddenReason` | string(500) | Nullable | Gizleme nedeni |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme |

**Indexes**:
- `IX_Answer_QuestionId`
- `IX_Answer_AuthorId`
- `IX_Answer_CreatedAt`
- `IX_Answer_QuestionId_IsAccepted`

**Relationships**:
- `Question` → N:1 → Question
- `Author` → N:1 → User
- `Comments` → 1:N → Comment

---

### 5. Comment (Yorum)

Post veya cevaba yapılan yorum. Polimorfik ilişki.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz yorum kimliği |
| `Body` | string(2000) | Required | Yorum içeriği |
| `AuthorId` | GUID | FK → User | Yorum yazarı |
| `PostId` | GUID? | FK → Post | İlgili post (nullable) |
| `AnswerId` | GUID? | FK → Answer | İlgili cevap (nullable) |
| `IsHidden` | bool | Default: false | Moderasyon gizleme |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme |

**Constraints**:
- CHECK: `(PostId IS NOT NULL AND AnswerId IS NULL) OR (PostId IS NULL AND AnswerId IS NOT NULL)`

**Indexes**:
- `IX_Comment_PostId`
- `IX_Comment_AnswerId`
- `IX_Comment_AuthorId`
- `IX_Comment_CreatedAt`

**Relationships**:
- `Author` → N:1 → User
- `Post` → N:1 → Post (nullable)
- `Answer` → N:1 → Answer (nullable)

---

### 6. Tag (Etiket)

İçerikleri kategorize eden etiket.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz tag kimliği |
| `Name` | string(30) | Unique, Required | Tag adı (küçük harf) |
| `Slug` | string(30) | Unique, Required | URL-safe slug |
| `Description` | string(500) | Nullable | Tag açıklaması |
| `PostCount` | int | Default: 0 | İlişkili post sayısı (denormalize) |
| `QuestionCount` | int | Default: 0 | İlişkili soru sayısı (denormalize) |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |

**Indexes**:
- `IX_Tag_Name` (Unique)
- `IX_Tag_Slug` (Unique)
- `IX_Tag_PostCount` (DESC)
- `IX_Tag_QuestionCount` (DESC)

**Relationships**:
- `Posts` → N:M → Post (via PostTag)
- `Questions` → N:M → Question (via QuestionTag)

---

### 7. PostTag (Junction Table)

Post-Tag çoklu ilişki tablosu.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `PostId` | GUID | PK, FK → Post | İlgili post |
| `TagId` | GUID | PK, FK → Tag | İlgili tag |

**Indexes**:
- Composite PK: `(PostId, TagId)`
- `IX_PostTag_TagId`

---

### 8. QuestionTag (Junction Table)

Question-Tag çoklu ilişki tablosu.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `QuestionId` | GUID | PK, FK → Question | İlgili soru |
| `TagId` | GUID | PK, FK → Tag | İlgili tag |

**Indexes**:
- Composite PK: `(QuestionId, TagId)`
- `IX_QuestionTag_TagId`

---

### 9. Event (Etkinlik)

Topluluk etkinliği duyurusu.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz etkinlik kimliği |
| `Title` | string(200) | Required | Etkinlik başlığı |
| `Slug` | string(250) | Required, Unique | SEO-friendly URL slug |
| `Description` | text | Required, Max 5000 | Etkinlik açıklaması |
| `DescriptionHtml` | text | Nullable | Render edilmiş HTML |
| `EventType` | enum | Required | Online, Offline |
| `StartDate` | DateTime | Required | Başlangıç tarihi/saati |
| `EndDate` | DateTime? | Nullable | Bitiş tarihi/saati |
| `Location` | string(500) | Nullable | Fiziksel adres (offline için) |
| `OnlineUrl` | string(500) | Nullable | Online katılım linki |
| `ImageUrl` | string(500) | Nullable | Etkinlik görseli |
| `CreatedById` | GUID | FK → User | Oluşturan kullanıcı |
| `IsPublished` | bool | Default: true | Yayın durumu |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `UpdatedAt` | DateTime? | Nullable | Son güncelleme |

**Indexes**:
- `IX_Event_Slug` (Unique)
- `IX_Event_StartDate`
- `IX_Event_CreatedById`
- `IX_Event_IsPublished_StartDate`

**Relationships**:
- `CreatedBy` → N:1 → User

---

### 10. RefreshToken

JWT refresh token takibi.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `Id` | GUID | PK | Benzersiz token kimliği |
| `UserId` | GUID | FK → User | Token sahibi |
| `Token` | string(512) | Required | Token hash |
| `TokenFamily` | GUID | Required | Token ailesi (rotation için) |
| `ExpiresAt` | DateTime | Required | Geçerlilik süresi |
| `CreatedAt` | DateTime | Required | Oluşturma tarihi |
| `RevokedAt` | DateTime? | Nullable | İptal tarihi |
| `ReplacedByTokenId` | GUID? | FK → RefreshToken | Yerine geçen token |
| `CreatedByIp` | string(45) | Nullable | Oluşturan IP |
| `RevokedByIp` | string(45) | Nullable | İptal eden IP |

**Indexes**:
- `IX_RefreshToken_UserId`
- `IX_RefreshToken_Token` (Unique)
- `IX_RefreshToken_TokenFamily`
- `IX_RefreshToken_ExpiresAt`

**Relationships**:
- `User` → N:1 → User
- `ReplacedByToken` → 1:1 → RefreshToken (self-reference)

---

## Enums

### UserRole

```csharp
public enum UserRole
{
    User = 0,
    Moderator = 1,
    Admin = 2
}
```

### EventType

```csharp
public enum EventType
{
    Online = 0,
    Offline = 1
}
```

---

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| User | Email | Valid email format |
| User | Password | Min 8 chars, mixed case + number recommended |
| User | Username | 3-50 chars, alphanumeric + underscore |
| User | Bio | Max 500 chars |
| Post | Title | 1-200 chars |
| Post | Content | 1-50000 chars |
| Post | Tags | 1-5 tags required |
| Question | Title | 1-200 chars |
| Question | Body | 1-30000 chars |
| Question | Tags | 1-5 tags required |
| Answer | Body | 1-30000 chars |
| Comment | Body | 1-2000 chars |
| Tag | Name | 1-30 chars, lowercase, no spaces |
| Event | Title | 1-200 chars |
| Event | StartDate | Must be in future (for new events) |

---

## State Transitions

### User States

```
[Active] ──ban()──> [Banned]
[Banned] ──unban()──> [Active]
```

### Post/Question States

```
[Draft] ──publish()──> [Published]
[Published] ──hide()──> [Hidden]
[Hidden] ──unhide()──> [Published]
[Published] ──delete()──> [Deleted]
```

### Answer Acceptance

```
[Unaccepted] ──accept()──> [Accepted]
[Accepted] ──unaccept()──> [Unaccepted]
```

Note: Per question, only one answer can be accepted at a time.

---

## Denormalization Strategy

Performans için denormalize edilen alanlar:

| Entity | Field | Source | Update Trigger |
|--------|-------|--------|----------------|
| Tag | PostCount | COUNT(PostTag) | PostTag insert/delete |
| Tag | QuestionCount | COUNT(QuestionTag) | QuestionTag insert/delete |
| Question | AnswerCount | COUNT(Answer) | Answer insert/delete |

Bu alanlar trigger veya application-level event ile güncellenecek.

---

## Full-Text Search Configuration

PostgreSQL Türkçe FTS için:

```sql
-- Türkçe text search config oluştur (varsa kontrol et)
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS turkish (COPY = pg_catalog.simple);

-- Post search vector (title + content)
ALTER TABLE "Posts" ADD COLUMN "SearchVector" tsvector 
    GENERATED ALWAYS AS (
        setweight(to_tsvector('turkish', coalesce("Title", '')), 'A') ||
        setweight(to_tsvector('turkish', coalesce("Content", '')), 'B')
    ) STORED;

CREATE INDEX "IX_Post_SearchVector" ON "Posts" USING GIN ("SearchVector");

-- Question search vector (title + body)
ALTER TABLE "Questions" ADD COLUMN "SearchVector" tsvector 
    GENERATED ALWAYS AS (
        setweight(to_tsvector('turkish', coalesce("Title", '')), 'A') ||
        setweight(to_tsvector('turkish', coalesce("Body", '')), 'B')
    ) STORED;

CREATE INDEX "IX_Question_SearchVector" ON "Questions" USING GIN ("SearchVector");
```
