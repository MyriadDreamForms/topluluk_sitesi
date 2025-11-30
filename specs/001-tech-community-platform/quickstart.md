# Quickstart: Türkiye Teknoloji Topluluk Platformu

**Date**: 2024-11-30  
**Feature**: [spec.md](spec.md) | [plan.md](plan.md)

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| .NET SDK | 10.0+ | Backend development |
| Node.js | 20.x LTS | Frontend development |
| PostgreSQL | 16+ | Database |
| Angular CLI | 21.x | Frontend tooling |
| Git | 2.40+ | Version control |

### Optional

| Software | Version | Purpose |
|----------|---------|---------|
| Docker Desktop | Latest | Container development |
| VS Code | Latest | Recommended IDE |
| Rider / VS 2024 | Latest | .NET IDE |

---

## Quick Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd topluluk-platform
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Restore dependencies
dotnet restore

# Setup user secrets for development
dotnet user-secrets init --project src/TechCommunity.API

# Configure connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" \
  "Host=localhost;Database=techcommunity;Username=postgres;Password=your_password" \
  --project src/TechCommunity.API

# Configure JWT settings
dotnet user-secrets set "Jwt:SecretKey" "your-super-secret-key-min-32-chars" \
  --project src/TechCommunity.API
dotnet user-secrets set "Jwt:Issuer" "http://localhost:5000" \
  --project src/TechCommunity.API
dotnet user-secrets set "Jwt:Audience" "http://localhost:4200" \
  --project src/TechCommunity.API

# Run database migrations
dotnet ef database update --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API

# Run backend
dotnet run --project src/TechCommunity.API
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

Frontend runs at: `http://localhost:4200`

### 4. Verify Setup

1. Open `http://localhost:4200` in browser
2. API health check: `http://localhost:5000/health`
3. Swagger UI: `http://localhost:5000/swagger`

---

## Project Structure

```
topluluk-platform/
├── backend/
│   ├── src/
│   │   ├── TechCommunity.Domain/           # Entities, Enums
│   │   ├── TechCommunity.Application/      # Use Cases, DTOs
│   │   ├── TechCommunity.Infrastructure/   # EF Core, Services
│   │   └── TechCommunity.API/              # Controllers, Middleware
│   └── tests/
│       ├── TechCommunity.Domain.Tests/
│       ├── TechCommunity.Application.Tests/
│       └── TechCommunity.API.Tests/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                       # Auth, Guards, Interceptors
│   │   │   ├── shared/                     # Shared Components
│   │   │   └── features/                   # Feature Modules
│   │   └── environments/
│   └── e2e/                                # E2E Tests
├── specs/                                  # Feature Specifications
└── docker-compose.yml                      # Container Setup
```

---

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run e2e
```

### Database Migrations

```bash
cd backend

# Add new migration
dotnet ef migrations add <MigrationName> \
  --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API

# Update database
dotnet ef database update \
  --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API

# Generate SQL script
dotnet ef migrations script --idempotent \
  --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API \
  -o migrations.sql
```

### Building for Production

```bash
# Backend
cd backend
dotnet publish src/TechCommunity.API -c Release -o ./publish

# Frontend
cd frontend
npm run build:ssr
```

---

## Configuration

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=techcommunity;Username=postgres;Password=***"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-at-least-32-characters",
    "Issuer": "https://api.platform.dev",
    "Audience": "https://platform.dev",
    "AccessTokenExpirationMinutes": 30,
    "RefreshTokenExpirationDays": 7
  },
  "RateLimiting": {
    "GeneralLimit": 100,
    "ContentCreationLimit": 10,
    "AuthLimit": 5
  },
  "Caching": {
    "TagsCacheDurationMinutes": 10,
    "FeedCacheDurationMinutes": 2
  }
}
```

### Frontend (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api/v1',
  appName: 'Topluluk Platformu'
};
```

---

## Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: techcommunity
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=db;Database=techcommunity;Username=postgres;Password=postgres
    depends_on:
      - db

  web:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:4000"
    depends_on:
      - api

volumes:
  postgres_data:
```

---

## Common Tasks

### Create Admin User

```bash
# Via API (after registration)
curl -X PATCH http://localhost:5000/api/v1/admin/users/{userId}/role \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'

# Or via database
psql -d techcommunity -c "UPDATE \"Users\" SET \"Role\" = 2 WHERE \"Email\" = 'admin@example.com';"
```

### Seed Sample Data

```bash
cd backend
dotnet run --project src/TechCommunity.API -- --seed
```

### Clear Cache

```bash
# Via API endpoint (admin only)
curl -X POST http://localhost:5000/api/v1/admin/cache/clear \
  -H "Authorization: Bearer {admin_token}"
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :5000
kill -9 <pid>
```

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check connection string in user secrets
3. Verify database exists: `psql -l`
4. Check firewall/port access

### Migration Errors

```bash
# Reset database (development only!)
dotnet ef database drop --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API --force

dotnet ef database update --project src/TechCommunity.Infrastructure \
  --startup-project src/TechCommunity.API
```

### Angular Build Errors

```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

---

## API Documentation

- **Swagger UI**: `http://localhost:5000/swagger`
- **OpenAPI Spec**: [contracts/openapi.yaml](contracts/openapi.yaml)
- **Postman Collection**: `docs/postman_collection.json` (to be generated)

---

## Next Steps

1. Review [spec.md](spec.md) for feature requirements
2. Review [data-model.md](data-model.md) for database schema
3. Review [contracts/openapi.yaml](contracts/openapi.yaml) for API endpoints
4. Check [research.md](research.md) for technology decisions
5. Start implementation with `/speckit.tasks` command
