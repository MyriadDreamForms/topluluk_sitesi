# Tasks: Türkiye Teknoloji Topluluk Platformu (MVP)

**Input**: Design documents from `/specs/001-tech-community-platform/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅

**Total Tasks**: 316 (308 original + 8 remediation tasks)

**Tests**: Test tasks are NOT included (not explicitly requested in specification). Tests can be added later via TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/TechCommunity.{Domain,Application,Infrastructure,API}/`
- **Frontend**: `frontend/src/app/{core,shared,features}/`
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend solution with Clean Architecture projects in backend/
- [X] T002 Initialize .NET 10 solution file backend/TechCommunity.sln
- [X] T003 [P] Create TechCommunity.Domain project in backend/src/TechCommunity.Domain/
- [X] T004 [P] Create TechCommunity.Application project in backend/src/TechCommunity.Application/
- [X] T005 [P] Create TechCommunity.Infrastructure project in backend/src/TechCommunity.Infrastructure/
- [X] T006 [P] Create TechCommunity.API project in backend/src/TechCommunity.API/
- [X] T007 Setup project references (Domain → none, Application → Domain, Infrastructure → Application, API → all)
- [X] T008 [P] Initialize Angular 21 project with SSR in frontend/
- [X] T009 [P] Configure Angular routing with lazy loading in frontend/src/app/app.routes.ts
- [X] T010 [P] Setup Angular environments in frontend/src/environments/
- [X] T011 [P] Configure ESLint and Prettier for backend in backend/.editorconfig
- [X] T012 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Core Infrastructure

- [X] T013 Add NuGet packages (MediatR, FluentValidation, BCrypt.Net) to backend projects
- [X] T014 Create base entity classes in backend/src/TechCommunity.Domain/Common/BaseEntity.cs
- [X] T015 [P] Create UserRole enum in backend/src/TechCommunity.Domain/Enums/UserRole.cs
- [X] T016 [P] Create EventType enum in backend/src/TechCommunity.Domain/Enums/EventType.cs
- [X] T017 Create User entity in backend/src/TechCommunity.Domain/Entities/User.cs
- [X] T018 [P] Create Post entity in backend/src/TechCommunity.Domain/Entities/Post.cs
- [X] T019 [P] Create Question entity in backend/src/TechCommunity.Domain/Entities/Question.cs
- [X] T020 [P] Create Answer entity in backend/src/TechCommunity.Domain/Entities/Answer.cs
- [X] T021 [P] Create Comment entity in backend/src/TechCommunity.Domain/Entities/Comment.cs
- [X] T022 [P] Create Tag entity in backend/src/TechCommunity.Domain/Entities/Tag.cs
- [X] T023 [P] Create Event entity in backend/src/TechCommunity.Domain/Entities/Event.cs
- [X] T024 [P] Create RefreshToken entity in backend/src/TechCommunity.Domain/Entities/RefreshToken.cs
- [X] T025 [P] Create PostTag junction entity in backend/src/TechCommunity.Domain/Entities/PostTag.cs
- [X] T026 [P] Create QuestionTag junction entity in backend/src/TechCommunity.Domain/Entities/QuestionTag.cs
- [X] T027 Setup ApplicationDbContext in backend/src/TechCommunity.Infrastructure/Persistence/ApplicationDbContext.cs
- [X] T028 [P] Create User EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/UserConfiguration.cs
- [X] T029 [P] Create Post EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/PostConfiguration.cs
- [X] T030 [P] Create Question EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/QuestionConfiguration.cs
- [X] T031 [P] Create Answer EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/AnswerConfiguration.cs
- [X] T032 [P] Create Comment EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/CommentConfiguration.cs
- [X] T033 [P] Create Tag EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/TagConfiguration.cs
- [X] T034 [P] Create Event EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/EventConfiguration.cs
- [X] T035 [P] Create RefreshToken EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/RefreshTokenConfiguration.cs
- [X] T036 Create initial EF migration in backend/src/TechCommunity.Infrastructure/Persistence/Migrations/
- [X] T037 Configure PostgreSQL Turkish FTS in migration for Posts and Questions SearchVector columns
- [X] T038 Create IApplicationDbContext interface in backend/src/TechCommunity.Application/Common/Interfaces/IApplicationDbContext.cs
- [X] T039 [P] Create ICurrentUserService interface in backend/src/TechCommunity.Application/Common/Interfaces/ICurrentUserService.cs
- [X] T040 [P] Create IJwtService interface in backend/src/TechCommunity.Application/Common/Interfaces/IJwtService.cs
- [X] T041 [P] Create ISlugService interface in backend/src/TechCommunity.Application/Common/Interfaces/ISlugService.cs
- [X] T042 [P] Create IMarkdownService interface in backend/src/TechCommunity.Application/Common/Interfaces/IMarkdownService.cs
- [X] T043 [P] Create ICacheService interface in backend/src/TechCommunity.Application/Common/Interfaces/ICacheService.cs
- [X] T044 Setup MediatR pipeline behaviors in backend/src/TechCommunity.Application/Common/Behaviors/
- [X] T045 [P] Create ValidationBehavior in backend/src/TechCommunity.Application/Common/Behaviors/ValidationBehavior.cs
- [X] T046 [P] Create LoggingBehavior in backend/src/TechCommunity.Application/Common/Behaviors/LoggingBehavior.cs
- [X] T047 Create custom exceptions in backend/src/TechCommunity.Application/Common/Exceptions/
- [X] T048 [P] Create NotFoundException in backend/src/TechCommunity.Application/Common/Exceptions/NotFoundException.cs
- [X] T049 [P] Create ValidationException in backend/src/TechCommunity.Application/Common/Exceptions/ValidationException.cs
- [X] T050 [P] Create ForbiddenException in backend/src/TechCommunity.Application/Common/Exceptions/ForbiddenException.cs
- [X] T051 [P] Create UnauthorizedException in backend/src/TechCommunity.Application/Common/Exceptions/UnauthorizedException.cs
- [X] T052 Implement JwtService in backend/src/TechCommunity.Infrastructure/Services/Identity/JwtService.cs
- [X] T052a Configure JWT expiry (30min access, 7day refresh) and session timeout (FR-005) in backend/src/TechCommunity.API/appsettings.json
- [X] T053 [P] Implement SlugService (Turkish char support) in backend/src/TechCommunity.Infrastructure/Services/SlugService.cs
- [X] T054 [P] Implement MarkdownService in backend/src/TechCommunity.Infrastructure/Services/MarkdownService.cs
- [X] T055 [P] Implement CacheService (IMemoryCache) in backend/src/TechCommunity.Infrastructure/Services/Caching/CacheService.cs
- [X] T056 [P] Implement CurrentUserService in backend/src/TechCommunity.Infrastructure/Services/Identity/CurrentUserService.cs
- [X] T057 Create DependencyInjection for Infrastructure in backend/src/TechCommunity.Infrastructure/DependencyInjection.cs
- [X] T058 Create DependencyInjection for Application in backend/src/TechCommunity.Application/DependencyInjection.cs
- [X] T059 Setup Program.cs with DI, CORS, JWT auth in backend/src/TechCommunity.API/Program.cs
- [X] T060 Create global exception handler middleware in backend/src/TechCommunity.API/Middleware/ExceptionHandlingMiddleware.cs
- [X] T061 [P] Create standard API response wrapper in backend/src/TechCommunity.API/Models/ApiResponse.cs
- [X] T062 [P] Create pagination request/response models in backend/src/TechCommunity.Application/Common/Models/PaginatedList.cs
- [X] T063 Configure rate limiting middleware in backend/src/TechCommunity.API/Program.cs
- [X] T064 Configure Swagger/OpenAPI in backend/src/TechCommunity.API/Program.cs

### Frontend Core Infrastructure

- [X] T065 Create core module structure in frontend/src/app/core/
- [X] T066 [P] Create AuthService with JWT handling in frontend/src/app/core/auth/auth.service.ts
- [X] T067 [P] Create AuthInterceptor for token injection in frontend/src/app/core/interceptors/auth.interceptor.ts
- [X] T068 [P] Create ErrorInterceptor for global error handling in frontend/src/app/core/interceptors/error.interceptor.ts
- [X] T069 [P] Create AuthGuard for protected routes in frontend/src/app/core/guards/auth.guard.ts
- [X] T070 [P] Create AdminGuard for admin routes in frontend/src/app/core/guards/admin.guard.ts
- [X] T071 [P] Create ApiService base class in frontend/src/app/core/services/api.service.ts
- [X] T072 Create shared module structure in frontend/src/app/shared/
- [X] T073 [P] Create LoadingSpinnerComponent in frontend/src/app/shared/components/loading-spinner/
- [X] T074 [P] Create PaginationComponent in frontend/src/app/shared/components/pagination/
- [X] T075 [P] Create MarkdownViewerComponent in frontend/src/app/shared/components/markdown-viewer/
- [X] T076 [P] Create TagListComponent in frontend/src/app/shared/components/tag-list/
- [X] T077 [P] Create UserAvatarComponent in frontend/src/app/shared/components/user-avatar/
- [X] T078 [P] Create TimeAgoPipe in frontend/src/app/shared/pipes/time-ago.pipe.ts
- [X] T079 [P] Create TruncatePipe in frontend/src/app/shared/pipes/truncate.pipe.ts
- [X] T080 Create main layout component in frontend/src/app/layouts/main-layout/
- [X] T081 [P] Create HeaderComponent in frontend/src/app/layouts/main-layout/header/
- [X] T082 [P] Create FooterComponent in frontend/src/app/layouts/main-layout/footer/
- [X] T083 [P] Create SidebarComponent in frontend/src/app/layouts/main-layout/sidebar/
- [X] T084 Configure SSR with Angular Universal in frontend/angular.json and frontend/server.ts
- [X] T085 Setup SEO service for dynamic meta tags in frontend/src/app/core/services/seo.service.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Kullanıcı Kaydı ve Profil (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar e-posta/şifre ile kayıt olabilir, giriş yapabilir ve profillerini yönetebilir

**Independent Test**: Kayıt formu doldurularak hesap oluşturulabilir, giriş yapılabilir, profil görüntülenebilir ve düzenlenebilir

### Backend - Auth Feature

- [X] T086 [P] [US1] Create RegisterCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommand.cs
- [X] T087 [P] [US1] Create RegisterCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommandValidator.cs
- [X] T088 [US1] Create RegisterCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommandHandler.cs
- [X] T089 [P] [US1] Create LoginCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommand.cs
- [X] T090 [P] [US1] Create LoginCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommandValidator.cs
- [X] T091 [US1] Create LoginCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommandHandler.cs
- [X] T092 [P] [US1] Create RefreshTokenCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/RefreshToken/RefreshTokenCommand.cs
- [X] T093 [US1] Create RefreshTokenCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/RefreshToken/RefreshTokenCommandHandler.cs
- [X] T094 [P] [US1] Create LogoutCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Logout/LogoutCommand.cs
- [X] T095 [US1] Create LogoutCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Logout/LogoutCommandHandler.cs
- [X] T095a [P] [US1] Create ForgotPasswordCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommand.cs
- [X] T095b [P] [US1] Create ForgotPasswordCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommandValidator.cs
- [X] T095c [US1] Create ForgotPasswordCommandHandler (generate reset token, send email) in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommandHandler.cs
- [X] T095d [P] [US1] Create ResetPasswordCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommand.cs
- [X] T095e [P] [US1] Create ResetPasswordCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommandValidator.cs
- [X] T095f [US1] Create ResetPasswordCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommandHandler.cs
- [X] T096 [P] [US1] Create AuthDto in backend/src/TechCommunity.Application/Features/Auth/DTOs/AuthDto.cs
- [X] T097 [US1] Create AuthController in backend/src/TechCommunity.API/Controllers/AuthController.cs

### Backend - Users Feature

- [X] T098 [P] [US1] Create GetCurrentUserQuery in backend/src/TechCommunity.Application/Features/Users/Queries/GetCurrentUser/GetCurrentUserQuery.cs
- [X] T099 [US1] Create GetCurrentUserQueryHandler in backend/src/TechCommunity.Application/Features/Users/Queries/GetCurrentUser/GetCurrentUserQueryHandler.cs
- [X] T100 [P] [US1] Create UpdateProfileCommand in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommand.cs
- [X] T101 [P] [US1] Create UpdateProfileCommandValidator in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommandValidator.cs
- [X] T102 [US1] Create UpdateProfileCommandHandler in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommandHandler.cs
- [X] T103 [P] [US1] Create UploadAvatarCommand in backend/src/TechCommunity.Application/Features/Users/Commands/UploadAvatar/UploadAvatarCommand.cs
- [X] T104 [US1] Create UploadAvatarCommandHandler in backend/src/TechCommunity.Application/Features/Users/Commands/UploadAvatar/UploadAvatarCommandHandler.cs
- [X] T105 [P] [US1] Create UserProfileDto in backend/src/TechCommunity.Application/Features/Users/DTOs/UserProfileDto.cs
- [X] T106 [P] [US1] Create UserSummaryDto in backend/src/TechCommunity.Application/Features/Users/DTOs/UserSummaryDto.cs
- [X] T107 [US1] Implement IFileStorageService interface and local storage in backend/src/TechCommunity.Infrastructure/Services/FileStorage/
- [X] T108 [US1] Create UsersController in backend/src/TechCommunity.API/Controllers/UsersController.cs

### Frontend - Auth Feature

- [X] T109 [P] [US1] Create auth feature module in frontend/src/app/features/auth/
- [X] T110 [P] [US1] Create auth routes in frontend/src/app/features/auth/auth.routes.ts
- [X] T111 [P] [US1] Create RegisterComponent in frontend/src/app/features/auth/register/register.component.ts
- [X] T112 [P] [US1] Create LoginComponent in frontend/src/app/features/auth/login/login.component.ts
- [X] T112a [P] [US1] Create ForgotPasswordComponent in frontend/src/app/features/auth/forgot-password/forgot-password.component.ts
- [X] T112b [P] [US1] Create ResetPasswordComponent in frontend/src/app/features/auth/reset-password/reset-password.component.ts
- [X] T113 [P] [US1] Create auth state signal service in frontend/src/app/features/auth/auth-state.service.ts
- [X] T114 [US1] Integrate AuthService with backend API endpoints

### Frontend - Profile Feature

- [X] T115 [P] [US1] Create profile feature module in frontend/src/app/features/profile/
- [X] T116 [P] [US1] Create profile routes in frontend/src/app/features/profile/profile.routes.ts
- [X] T117 [P] [US1] Create ProfileViewComponent in frontend/src/app/features/profile/profile-view/profile-view.component.ts
- [X] T118 [P] [US1] Create ProfileEditComponent in frontend/src/app/features/profile/profile-edit/profile-edit.component.ts
- [X] T119 [P] [US1] Create AvatarUploadComponent in frontend/src/app/features/profile/avatar-upload/avatar-upload.component.ts
- [X] T120 [US1] Create ProfileService in frontend/src/app/features/profile/profile.service.ts
- [X] T121 [US1] Setup SSR meta tags for profile pages in ProfileViewComponent

**Checkpoint**: User Story 1 complete ✓ - Users can register, login, and manage profiles

---

## Phase 4: User Story 2 - Blog Yazısı (Post) (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar blog yazısı oluşturabilir, okuyabilir ve yorum yapabilir

**Independent Test**: Post oluşturulabilir, listelenebilir, detay görüntülenebilir, yorum eklenebilir

### Backend - Posts Feature

- [X] T122 [P] [US2] Create CreatePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommand.cs
- [X] T123 [P] [US2] Create CreatePostCommandValidator in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommandValidator.cs
- [X] T124 [US2] Create CreatePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommandHandler.cs
- [X] T125 [P] [US2] Create UpdatePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/UpdatePost/UpdatePostCommand.cs
- [X] T126 [US2] Create UpdatePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs
- [X] T127 [P] [US2] Create DeletePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/DeletePost/DeletePostCommand.cs
- [X] T128 [US2] Create DeletePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/DeletePost/DeletePostCommandHandler.cs
- [X] T129 [P] [US2] Create GetPostsQuery (paginated) in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPosts/GetPostsQuery.cs
- [X] T130 [US2] Create GetPostsQueryHandler in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPosts/GetPostsQueryHandler.cs
- [X] T131 [P] [US2] Create GetPostByIdQuery in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPostById/GetPostByIdQuery.cs
- [X] T132 [US2] Create GetPostByIdQueryHandler with view count increment in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPostById/GetPostByIdQueryHandler.cs
- [X] T133 [P] [US2] Create PostDto in backend/src/TechCommunity.Application/Features/Posts/DTOs/PostDto.cs
- [X] T134 [P] [US2] Create PostDetailDto in backend/src/TechCommunity.Application/Features/Posts/DTOs/PostDetailDto.cs
- [X] T135 [US2] Create PostsController in backend/src/TechCommunity.API/Controllers/PostsController.cs

### Backend - Comments Feature (for Posts)

- [X] T136 [P] [US2] Create AddCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommand.cs
- [X] T137 [P] [US2] Create AddCommentCommandValidator in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommandValidator.cs
- [X] T138 [US2] Create AddCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommandHandler.cs
- [X] T139 [P] [US2] Create UpdateCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/UpdateComment/UpdateCommentCommand.cs
- [X] T140 [US2] Create UpdateCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/UpdateComment/UpdateCommentCommandHandler.cs
- [X] T141 [P] [US2] Create DeleteCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/DeleteComment/DeleteCommentCommand.cs
- [X] T142 [US2] Create DeleteCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/DeleteComment/DeleteCommentCommandHandler.cs
- [X] T143 [P] [US2] Create GetCommentsQuery in backend/src/TechCommunity.Application/Features/Comments/Queries/GetComments/GetCommentsQuery.cs
- [X] T144 [US2] Create GetCommentsQueryHandler in backend/src/TechCommunity.Application/Features/Comments/Queries/GetComments/GetCommentsQueryHandler.cs
- [X] T145 [P] [US2] Create CommentDto in backend/src/TechCommunity.Application/Features/Comments/DTOs/CommentDto.cs
- [X] T146 [US2] Create CommentsController in backend/src/TechCommunity.API/Controllers/CommentsController.cs

### Frontend - Posts Feature

- [X] T147 [P] [US2] Create posts feature module in frontend/src/app/features/posts/
- [X] T148 [P] [US2] Create posts routes in frontend/src/app/features/posts/posts.routes.ts
- [X] T149 [P] [US2] Create PostListComponent in frontend/src/app/features/posts/post-list/post-list.component.ts
- [X] T150 [P] [US2] Create PostDetailComponent in frontend/src/app/features/posts/post-detail/post-detail.component.ts
- [X] T151 [P] [US2] Create PostFormComponent in frontend/src/app/features/posts/post-form/post-form.component.ts
- [X] T152 [P] [US2] Create PostCardComponent in frontend/src/app/features/posts/post-card/post-card.component.ts
- [X] T153 [P] [US2] Create CommentListComponent in frontend/src/app/shared/components/comment-list/
- [X] T154 [P] [US2] Create CommentFormComponent in frontend/src/app/shared/components/comment-form/
- [X] T155 [US2] Create PostsService in frontend/src/app/features/posts/posts.service.ts
- [X] T156 [US2] Create CommentsService in frontend/src/app/core/services/comments.service.ts
- [X] T157 [US2] Setup SSR meta tags for post pages (title, description, og:tags)
- [X] T158 [US2] Integrate MarkdownEditor component in PostFormComponent

**Checkpoint**: User Story 2 complete - Users can create, read, and comment on posts

---

## Phase 5: User Story 3 - Soru-Cevap (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar soru sorabilir, cevap verebilir ve en iyi cevabı seçebilir

**Independent Test**: Soru oluşturulabilir, cevaplanabilir, cevaba yorum eklenebilir, kabul edilen cevap seçilebilir

### Backend - Questions Feature

- [X] T159 [P] [US3] Create CreateQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommand.cs
- [X] T160 [P] [US3] Create CreateQuestionCommandValidator in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommandValidator.cs
- [X] T161 [US3] Create CreateQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommandHandler.cs
- [X] T162 [P] [US3] Create UpdateQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/UpdateQuestion/UpdateQuestionCommand.cs
- [X] T163 [US3] Create UpdateQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/UpdateQuestion/UpdateQuestionCommandHandler.cs
- [X] T164 [P] [US3] Create DeleteQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/DeleteQuestion/DeleteQuestionCommand.cs
- [X] T165 [US3] Create DeleteQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/DeleteQuestion/DeleteQuestionCommandHandler.cs
- [X] T166 [P] [US3] Create GetQuestionsQuery in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestions/GetQuestionsQuery.cs
- [X] T167 [US3] Create GetQuestionsQueryHandler in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestions/GetQuestionsQueryHandler.cs
- [X] T168 [P] [US3] Create GetQuestionByIdQuery in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestionById/GetQuestionByIdQuery.cs
- [X] T169 [US3] Create GetQuestionByIdQueryHandler in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestionById/GetQuestionByIdQueryHandler.cs
- [X] T170 [P] [US3] Create QuestionDto in backend/src/TechCommunity.Application/Features/Questions/DTOs/QuestionDto.cs
- [X] T171 [P] [US3] Create QuestionDetailDto in backend/src/TechCommunity.Application/Features/Questions/DTOs/QuestionDetailDto.cs
- [X] T172 [US3] Create QuestionsController in backend/src/TechCommunity.API/Controllers/QuestionsController.cs

### Backend - Answers Feature

- [X] T173 [P] [US3] Create AddAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommand.cs
- [X] T174 [P] [US3] Create AddAnswerCommandValidator in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommandValidator.cs
- [X] T175 [US3] Create AddAnswerCommandHandler (with AnswerCount update) in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommandHandler.cs
- [X] T176 [P] [US3] Create UpdateAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/UpdateAnswer/UpdateAnswerCommand.cs
- [X] T177 [US3] Create UpdateAnswerCommandHandler in backend/src/TechCommunity.Application/Features/Answers/Commands/UpdateAnswer/UpdateAnswerCommandHandler.cs
- [X] T178 [P] [US3] Create DeleteAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/DeleteAnswer/DeleteAnswerCommand.cs
- [X] T179 [US3] Create DeleteAnswerCommandHandler in backend/src/TechCommunity.Application/Features/Answers/Commands/DeleteAnswer/DeleteAnswerCommandHandler.cs
- [X] T180 [P] [US3] Create AcceptAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/AcceptAnswer/AcceptAnswerCommand.cs
- [X] T181 [US3] Create AcceptAnswerCommandHandler (unaccept previous, accept new) in backend/src/TechCommunity.Application/Features/Answers/Commands/AcceptAnswer/AcceptAnswerCommandHandler.cs
- [X] T182 [P] [US3] Create GetAnswersQuery in backend/src/TechCommunity.Application/Features/Answers/Queries/GetAnswers/GetAnswersQuery.cs
- [X] T183 [US3] Create GetAnswersQueryHandler in backend/src/TechCommunity.Application/Features/Answers/Queries/GetAnswers/GetAnswersQueryHandler.cs
- [X] T184 [P] [US3] Create AnswerDto in backend/src/TechCommunity.Application/Features/Answers/DTOs/AnswerDto.cs
- [X] T185 [US3] Create AnswersController in backend/src/TechCommunity.API/Controllers/AnswersController.cs

### Frontend - Questions Feature

- [X] T186 [P] [US3] Create questions feature module in frontend/src/app/features/questions/
- [X] T187 [P] [US3] Create questions routes in frontend/src/app/features/questions/questions.routes.ts
- [X] T188 [P] [US3] Create QuestionListComponent in frontend/src/app/features/questions/question-list/question-list.component.ts
- [X] T189 [P] [US3] Create QuestionDetailComponent in frontend/src/app/features/questions/question-detail/question-detail.component.ts
- [X] T190 [P] [US3] Create QuestionFormComponent in frontend/src/app/features/questions/question-form/question-form.component.ts (implemented as question-ask)
- [X] T191 [P] [US3] Create QuestionCardComponent in frontend/src/app/features/questions/question-card/question-card.component.ts
- [X] T192 [P] [US3] Create AnswerListComponent in frontend/src/app/features/questions/answer-list/answer-list.component.ts (integrated in question-detail)
- [X] T193 [P] [US3] Create AnswerFormComponent in frontend/src/app/features/questions/answer-form/answer-form.component.ts
- [X] T194 [P] [US3] Create AnswerItemComponent (with accept button) in frontend/src/app/features/questions/answer-item/answer-item.component.ts
- [X] T195 [US3] Create QuestionsService in frontend/src/app/features/questions/questions.service.ts
- [X] T196 [US3] Create AnswersService in frontend/src/app/features/questions/answers.service.ts
- [X] T197 [US3] Setup SSR meta tags for question pages

**Checkpoint**: User Story 3 complete - Users can ask questions, answer, and accept answers

---

## Phase 6: User Story 4 - İçerik Keşfi ve Arama (Priority: P2)

**Goal**: Kullanıcılar içerikleri feed'den, arama ile veya tag filtrelemesiyle bulabilir

**Independent Test**: Ana sayfa feed çalışır, arama sonuç döndürür, tag sayfası içerikleri listeler

### Backend - Tags Feature

- [ ] T198 [P] [US4] Create GetTagsQuery in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTags/GetTagsQuery.cs
- [ ] T199 [US4] Create GetTagsQueryHandler (with caching) in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTags/GetTagsQueryHandler.cs
- [ ] T200 [P] [US4] Create GetTagBySlugQuery in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTagBySlug/GetTagBySlugQuery.cs
- [ ] T201 [US4] Create GetTagBySlugQueryHandler in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTagBySlug/GetTagBySlugQueryHandler.cs
- [ ] T202 [P] [US4] Create GetTagContentQuery in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTagContent/GetTagContentQuery.cs
- [ ] T203 [US4] Create GetTagContentQueryHandler in backend/src/TechCommunity.Application/Features/Tags/Queries/GetTagContent/GetTagContentQueryHandler.cs
- [ ] T204 [P] [US4] Create TagDto in backend/src/TechCommunity.Application/Features/Tags/DTOs/TagDto.cs
- [ ] T205 [US4] Create TagsController in backend/src/TechCommunity.API/Controllers/TagsController.cs

### Backend - Search Feature

- [ ] T206 [P] [US4] Create SearchQuery in backend/src/TechCommunity.Application/Features/Search/Queries/Search/SearchQuery.cs
- [ ] T207 [US4] Create SearchQueryHandler (PostgreSQL FTS) in backend/src/TechCommunity.Application/Features/Search/Queries/Search/SearchQueryHandler.cs
- [ ] T208 [P] [US4] Create SearchResultDto in backend/src/TechCommunity.Application/Features/Search/DTOs/SearchResultDto.cs
- [ ] T209 [US4] Create SearchController in backend/src/TechCommunity.API/Controllers/SearchController.cs

### Backend - Feed Feature

- [ ] T210 [P] [US4] Create GetFeedQuery in backend/src/TechCommunity.Application/Features/Feed/Queries/GetFeed/GetFeedQuery.cs
- [ ] T211 [US4] Create GetFeedQueryHandler (recent + popular, with caching) in backend/src/TechCommunity.Application/Features/Feed/Queries/GetFeed/GetFeedQueryHandler.cs
- [ ] T212 [P] [US4] Create FeedItemDto in backend/src/TechCommunity.Application/Features/Feed/DTOs/FeedItemDto.cs
- [ ] T213 [US4] Create FeedController in backend/src/TechCommunity.API/Controllers/FeedController.cs

### Frontend - Home/Feed

- [ ] T214 [P] [US4] Create home feature module in frontend/src/app/features/home/
- [ ] T215 [P] [US4] Create HomeComponent (feed display) in frontend/src/app/features/home/home.component.ts
- [ ] T216 [P] [US4] Create FeedListComponent in frontend/src/app/features/home/feed-list/feed-list.component.ts
- [ ] T217 [P] [US4] Create FeedItemComponent in frontend/src/app/features/home/feed-item/feed-item.component.ts
- [ ] T218 [P] [US4] Create PopularTagsWidget in frontend/src/app/features/home/popular-tags/popular-tags.component.ts
- [ ] T219 [US4] Create FeedService in frontend/src/app/features/home/feed.service.ts

### Frontend - Search Feature

- [ ] T220 [P] [US4] Create search feature module in frontend/src/app/features/search/
- [ ] T221 [P] [US4] Create SearchComponent in frontend/src/app/features/search/search.component.ts
- [ ] T222 [P] [US4] Create SearchBarComponent (header) in frontend/src/app/shared/components/search-bar/
- [ ] T223 [P] [US4] Create SearchResultsComponent in frontend/src/app/features/search/search-results/search-results.component.ts
- [ ] T224 [US4] Create SearchService in frontend/src/app/features/search/search.service.ts

### Frontend - Tags Feature

- [ ] T225 [P] [US4] Create tags feature module in frontend/src/app/features/tags/
- [ ] T226 [P] [US4] Create TagListPageComponent in frontend/src/app/features/tags/tag-list-page/tag-list-page.component.ts
- [ ] T227 [P] [US4] Create TagDetailPageComponent in frontend/src/app/features/tags/tag-detail-page/tag-detail-page.component.ts
- [ ] T228 [US4] Create TagsService in frontend/src/app/features/tags/tags.service.ts
- [ ] T229 [US4] Setup SSR meta tags for tag pages

**Checkpoint**: User Story 4 complete - Users can discover content via feed, search, and tags

---

## Phase 7: User Story 5 - Etkinlik Yönetimi (Priority: P2)

**Goal**: Admin/moderator etkinlik oluşturabilir, kullanıcılar etkinlikleri görüntüleyebilir

**Independent Test**: Etkinlik oluşturulabilir, listelenebilir, detay görüntülenebilir

### Backend - Events Feature

- [ ] T230 [P] [US5] Create CreateEventCommand in backend/src/TechCommunity.Application/Features/Events/Commands/CreateEvent/CreateEventCommand.cs
- [ ] T231 [P] [US5] Create CreateEventCommandValidator in backend/src/TechCommunity.Application/Features/Events/Commands/CreateEvent/CreateEventCommandValidator.cs
- [ ] T232 [US5] Create CreateEventCommandHandler in backend/src/TechCommunity.Application/Features/Events/Commands/CreateEvent/CreateEventCommandHandler.cs
- [ ] T233 [P] [US5] Create UpdateEventCommand in backend/src/TechCommunity.Application/Features/Events/Commands/UpdateEvent/UpdateEventCommand.cs
- [ ] T234 [US5] Create UpdateEventCommandHandler in backend/src/TechCommunity.Application/Features/Events/Commands/UpdateEvent/UpdateEventCommandHandler.cs
- [ ] T235 [P] [US5] Create DeleteEventCommand in backend/src/TechCommunity.Application/Features/Events/Commands/DeleteEvent/DeleteEventCommand.cs
- [ ] T236 [US5] Create DeleteEventCommandHandler in backend/src/TechCommunity.Application/Features/Events/Commands/DeleteEvent/DeleteEventCommandHandler.cs
- [ ] T237 [P] [US5] Create GetEventsQuery (upcoming/past filter) in backend/src/TechCommunity.Application/Features/Events/Queries/GetEvents/GetEventsQuery.cs
- [ ] T238 [US5] Create GetEventsQueryHandler in backend/src/TechCommunity.Application/Features/Events/Queries/GetEvents/GetEventsQueryHandler.cs
- [ ] T239 [P] [US5] Create GetEventByIdQuery in backend/src/TechCommunity.Application/Features/Events/Queries/GetEventById/GetEventByIdQuery.cs
- [ ] T240 [US5] Create GetEventByIdQueryHandler in backend/src/TechCommunity.Application/Features/Events/Queries/GetEventById/GetEventByIdQueryHandler.cs
- [ ] T241 [P] [US5] Create EventDto in backend/src/TechCommunity.Application/Features/Events/DTOs/EventDto.cs
- [ ] T242 [P] [US5] Create EventDetailDto in backend/src/TechCommunity.Application/Features/Events/DTOs/EventDetailDto.cs
- [ ] T243 [US5] Create EventsController in backend/src/TechCommunity.API/Controllers/EventsController.cs

### Frontend - Events Feature

- [ ] T244 [P] [US5] Create events feature module in frontend/src/app/features/events/
- [ ] T245 [P] [US5] Create events routes in frontend/src/app/features/events/events.routes.ts
- [ ] T246 [P] [US5] Create EventListComponent in frontend/src/app/features/events/event-list/event-list.component.ts
- [ ] T247 [P] [US5] Create EventDetailComponent in frontend/src/app/features/events/event-detail/event-detail.component.ts
- [ ] T248 [P] [US5] Create EventFormComponent in frontend/src/app/features/events/event-form/event-form.component.ts
- [ ] T249 [P] [US5] Create EventCardComponent in frontend/src/app/features/events/event-card/event-card.component.ts
- [ ] T250 [P] [US5] Create UpcomingEventsWidget in frontend/src/app/features/home/upcoming-events/upcoming-events.component.ts
- [ ] T251 [US5] Create EventsService in frontend/src/app/features/events/events.service.ts
- [ ] T252 [US5] Setup SSR meta tags for event pages

**Checkpoint**: User Story 5 complete - Events can be created and viewed

---

## Phase 8: User Story 6 - Moderasyon ve Yönetim (Priority: P2)

**Goal**: Admin/moderator içerik gizleyebilir, silebilir ve kullanıcıları banlayabilir

**Independent Test**: Admin paneli çalışır, içerik gizlenebilir/silinebilir, kullanıcı banlanabilir

### Backend - Admin Feature

- [ ] T253 [P] [US6] Create GetUsersQuery (admin) in backend/src/TechCommunity.Application/Features/Admin/Queries/GetUsers/GetUsersQuery.cs
- [ ] T254 [US6] Create GetUsersQueryHandler in backend/src/TechCommunity.Application/Features/Admin/Queries/GetUsers/GetUsersQueryHandler.cs
- [ ] T255 [P] [US6] Create UpdateUserRoleCommand in backend/src/TechCommunity.Application/Features/Admin/Commands/UpdateUserRole/UpdateUserRoleCommand.cs
- [ ] T256 [US6] Create UpdateUserRoleCommandHandler in backend/src/TechCommunity.Application/Features/Admin/Commands/UpdateUserRole/UpdateUserRoleCommandHandler.cs
- [ ] T257 [P] [US6] Create BanUserCommand in backend/src/TechCommunity.Application/Features/Admin/Commands/BanUser/BanUserCommand.cs
- [ ] T258 [US6] Create BanUserCommandHandler in backend/src/TechCommunity.Application/Features/Admin/Commands/BanUser/BanUserCommandHandler.cs
- [ ] T259 [P] [US6] Create UnbanUserCommand in backend/src/TechCommunity.Application/Features/Admin/Commands/UnbanUser/UnbanUserCommand.cs
- [ ] T260 [US6] Create UnbanUserCommandHandler in backend/src/TechCommunity.Application/Features/Admin/Commands/UnbanUser/UnbanUserCommandHandler.cs
- [ ] T261 [P] [US6] Create HideContentCommand in backend/src/TechCommunity.Application/Features/Admin/Commands/HideContent/HideContentCommand.cs
- [ ] T262 [US6] Create HideContentCommandHandler in backend/src/TechCommunity.Application/Features/Admin/Commands/HideContent/HideContentCommandHandler.cs
- [ ] T263 [P] [US6] Create UnhideContentCommand in backend/src/TechCommunity.Application/Features/Admin/Commands/UnhideContent/UnhideContentCommand.cs
- [ ] T264 [US6] Create UnhideContentCommandHandler in backend/src/TechCommunity.Application/Features/Admin/Commands/UnhideContent/UnhideContentCommandHandler.cs
- [ ] T265 [P] [US6] Create AdminUserDto in backend/src/TechCommunity.Application/Features/Admin/DTOs/AdminUserDto.cs
- [ ] T266 [US6] Create AdminController in backend/src/TechCommunity.API/Controllers/AdminController.cs
- [ ] T267 [US6] Add authorization policies for Admin and Moderator roles in Program.cs

### Frontend - Admin Feature

- [ ] T268 [P] [US6] Create admin feature module in frontend/src/app/features/admin/
- [ ] T269 [P] [US6] Create admin routes in frontend/src/app/features/admin/admin.routes.ts
- [ ] T270 [P] [US6] Create AdminDashboardComponent in frontend/src/app/features/admin/admin-dashboard/admin-dashboard.component.ts
- [ ] T271 [P] [US6] Create UserManagementComponent in frontend/src/app/features/admin/user-management/user-management.component.ts
- [ ] T272 [P] [US6] Create ContentModerationComponent in frontend/src/app/features/admin/content-moderation/content-moderation.component.ts
- [ ] T273 [P] [US6] Create UserEditDialogComponent in frontend/src/app/features/admin/user-edit-dialog/user-edit-dialog.component.ts
- [ ] T274 [US6] Create AdminService in frontend/src/app/features/admin/admin.service.ts

**Checkpoint**: User Story 6 complete - Moderation and user management works

---

## Phase 9: User Story 7 - Başka Kullanıcı Profili (Priority: P3)

**Goal**: Kullanıcılar başka kullanıcıların public profillerini görüntüleyebilir

**Independent Test**: Başka kullanıcının profili görüntülenebilir, yazıları ve soruları listelenir

### Backend - Public Profile

- [ ] T275 [P] [US7] Create GetUserByUsernameQuery in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserByUsername/GetUserByUsernameQuery.cs
- [ ] T276 [US7] Create GetUserByUsernameQueryHandler in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserByUsername/GetUserByUsernameQueryHandler.cs
- [ ] T277 [P] [US7] Create GetUserPostsQuery in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserPosts/GetUserPostsQuery.cs
- [ ] T278 [US7] Create GetUserPostsQueryHandler in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserPosts/GetUserPostsQueryHandler.cs
- [ ] T279 [P] [US7] Create GetUserQuestionsQuery in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserQuestions/GetUserQuestionsQuery.cs
- [ ] T280 [US7] Create GetUserQuestionsQueryHandler in backend/src/TechCommunity.Application/Features/Users/Queries/GetUserQuestions/GetUserQuestionsQueryHandler.cs
- [ ] T281 [P] [US7] Create PublicUserProfileDto in backend/src/TechCommunity.Application/Features/Users/DTOs/PublicUserProfileDto.cs
- [ ] T282 [US7] Add public profile endpoints to UsersController

### Frontend - Public Profile

- [ ] T283 [P] [US7] Create PublicProfileComponent in frontend/src/app/features/profile/public-profile/public-profile.component.ts
- [ ] T284 [P] [US7] Create UserPostsTabComponent in frontend/src/app/features/profile/user-posts-tab/user-posts-tab.component.ts
- [ ] T285 [P] [US7] Create UserQuestionsTabComponent in frontend/src/app/features/profile/user-questions-tab/user-questions-tab.component.ts
- [ ] T286 [US7] Update profile routes for public profile viewing
- [ ] T287 [US7] Setup SSR meta tags for public profile pages

**Checkpoint**: User Story 7 complete - Public profiles viewable

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Performance & Caching

- [ ] T288 [P] Implement cache invalidation for tags on content CRUD
- [ ] T289 [P] Implement cache invalidation for feed on new content
- [ ] T290 [P] Add compiled queries for hot paths in repositories
- [ ] T291 Optimize PostgreSQL queries with EXPLAIN ANALYZE

### Security Hardening

- [ ] T292 [P] Add CORS configuration for production domain
- [ ] T293 [P] Add CSP headers in API middleware
- [ ] T294 [P] Implement password strength validation (mixed case, numbers)
- [ ] T295 Add rate limiting fine-tuning per endpoint

### SEO & SSR

- [ ] T296 [P] Add structured data (JSON-LD) for posts in frontend
- [ ] T297 [P] Add structured data (JSON-LD) for questions in frontend
- [ ] T298 [P] Add sitemap.xml generation endpoint
- [ ] T299 [P] Add robots.txt configuration
- [ ] T300 Configure Angular SSR for production build

### Documentation

- [ ] T301 [P] Update quickstart.md with final setup instructions
- [ ] T302 [P] Add API documentation comments to controllers
- [ ] T303 [P] Create README.md with project overview

### Final Validation

- [ ] T304 Run quickstart.md validation end-to-end
- [ ] T305 Verify all API endpoints match openapi.yaml contract
- [ ] T306 Test responsive design on mobile viewport
- [ ] T307 Performance testing: verify p95 API < 500ms
- [ ] T308 Performance testing: verify p95 page load < 2s

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phases 3-9 (User Stories) → Phase 10 (Polish)
```

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3-9)**: All depend on Phase 2 completion
  - P1 Stories (3, 4, 5) can proceed in parallel
  - P2 Stories (6, 7, 8) can proceed in parallel
  - P3 Story (9) can proceed in parallel
- **Polish (Phase 10)**: Depends on all user stories

### User Story Independence

| Story | Dependencies | Can Start After |
|-------|--------------|-----------------|
| US1 (Auth/Profile) | Phase 2 only | Phase 2 complete |
| US2 (Posts) | Phase 2 + US1 (User entity) | Phase 2 complete |
| US3 (Q&A) | Phase 2 + US1 (User entity) | Phase 2 complete |
| US4 (Search/Feed) | Phase 2 + US2 + US3 (content) | US2 or US3 |
| US5 (Events) | Phase 2 + US1 (User entity) | Phase 2 complete |
| US6 (Admin) | Phase 2 + All content stories | US2, US3 |
| US7 (Public Profile) | Phase 2 + US1 + US2 + US3 | US1 complete |

### Parallel Opportunities per Phase

```bash
# Phase 1 - All setup tasks can run in parallel
T003, T004, T005, T006  # Backend project creation
T008, T009, T010        # Frontend setup
T011, T012              # Linting setup

# Phase 2 - Many infrastructure tasks in parallel
T015, T016              # Enums
T018-T026               # Entity creation (all parallel)
T028-T035               # EF Configurations (all parallel)
T045, T046              # Behaviors
T048-T051               # Exceptions
T053, T054, T055, T056  # Services
T066-T070               # Angular core services
T073-T079               # Shared components

# User Stories - Within each story, [P] tasks parallel
# Example: US2 Posts
T122, T123, T125, T127, T129, T131, T133, T134  # Backend parallel
T147-T158                                        # Frontend parallel (partially)
```

---

## Summary

| Category | Count |
|----------|-------|
| **Total Tasks** | 308 |
| **Phase 1 (Setup)** | 12 |
| **Phase 2 (Foundational)** | 73 |
| **Phase 3-9 (User Stories)** | 202 |
| **Phase 10 (Polish)** | 21 |
| **Parallelizable Tasks** | ~180 |

### Tasks per User Story

| User Story | Priority | Tasks | Phase |
|------------|----------|-------|-------|
| US1 - Auth & Profile | P1 | 36 | 3 |
| US2 - Posts | P1 | 37 | 4 |
| US3 - Q&A | P1 | 39 | 5 |
| US4 - Search/Feed | P2 | 32 | 6 |
| US5 - Events | P2 | 23 | 7 |
| US6 - Admin | P2 | 22 | 8 |
| US7 - Public Profile | P3 | 13 | 9 |

### MVP Scope Recommendation

**Minimum Viable Product**: Complete Phases 1-5 (Setup + Foundation + US1 + US2 + US3)

This delivers:
- User registration and authentication
- User profiles
- Blog posts with comments
- Questions and answers with acceptance

**Estimated Task Count for MVP**: 197 tasks
