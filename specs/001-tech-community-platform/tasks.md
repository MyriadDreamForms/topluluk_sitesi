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

- [ ] T001 Create backend solution with Clean Architecture projects in backend/
- [ ] T002 Initialize .NET 10 solution file backend/TechCommunity.sln
- [ ] T003 [P] Create TechCommunity.Domain project in backend/src/TechCommunity.Domain/
- [ ] T004 [P] Create TechCommunity.Application project in backend/src/TechCommunity.Application/
- [ ] T005 [P] Create TechCommunity.Infrastructure project in backend/src/TechCommunity.Infrastructure/
- [ ] T006 [P] Create TechCommunity.API project in backend/src/TechCommunity.API/
- [ ] T007 Setup project references (Domain → none, Application → Domain, Infrastructure → Application, API → all)
- [ ] T008 [P] Initialize Angular 21 project with SSR in frontend/
- [ ] T009 [P] Configure Angular routing with lazy loading in frontend/src/app/app.routes.ts
- [ ] T010 [P] Setup Angular environments in frontend/src/environments/
- [ ] T011 [P] Configure ESLint and Prettier for backend in backend/.editorconfig
- [ ] T012 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Backend Core Infrastructure

- [ ] T013 Add NuGet packages (MediatR, FluentValidation, BCrypt.Net) to backend projects
- [ ] T014 Create base entity classes in backend/src/TechCommunity.Domain/Common/BaseEntity.cs
- [ ] T015 [P] Create UserRole enum in backend/src/TechCommunity.Domain/Enums/UserRole.cs
- [ ] T016 [P] Create EventType enum in backend/src/TechCommunity.Domain/Enums/EventType.cs
- [ ] T017 Create User entity in backend/src/TechCommunity.Domain/Entities/User.cs
- [ ] T018 [P] Create Post entity in backend/src/TechCommunity.Domain/Entities/Post.cs
- [ ] T019 [P] Create Question entity in backend/src/TechCommunity.Domain/Entities/Question.cs
- [ ] T020 [P] Create Answer entity in backend/src/TechCommunity.Domain/Entities/Answer.cs
- [ ] T021 [P] Create Comment entity in backend/src/TechCommunity.Domain/Entities/Comment.cs
- [ ] T022 [P] Create Tag entity in backend/src/TechCommunity.Domain/Entities/Tag.cs
- [ ] T023 [P] Create Event entity in backend/src/TechCommunity.Domain/Entities/Event.cs
- [ ] T024 [P] Create RefreshToken entity in backend/src/TechCommunity.Domain/Entities/RefreshToken.cs
- [ ] T025 [P] Create PostTag junction entity in backend/src/TechCommunity.Domain/Entities/PostTag.cs
- [ ] T026 [P] Create QuestionTag junction entity in backend/src/TechCommunity.Domain/Entities/QuestionTag.cs
- [ ] T027 Setup ApplicationDbContext in backend/src/TechCommunity.Infrastructure/Persistence/ApplicationDbContext.cs
- [ ] T028 [P] Create User EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/UserConfiguration.cs
- [ ] T029 [P] Create Post EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/PostConfiguration.cs
- [ ] T030 [P] Create Question EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/QuestionConfiguration.cs
- [ ] T031 [P] Create Answer EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/AnswerConfiguration.cs
- [ ] T032 [P] Create Comment EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/CommentConfiguration.cs
- [ ] T033 [P] Create Tag EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/TagConfiguration.cs
- [ ] T034 [P] Create Event EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/EventConfiguration.cs
- [ ] T035 [P] Create RefreshToken EF configuration in backend/src/TechCommunity.Infrastructure/Persistence/Configurations/RefreshTokenConfiguration.cs
- [ ] T036 Create initial EF migration in backend/src/TechCommunity.Infrastructure/Persistence/Migrations/
- [ ] T037 Configure PostgreSQL Turkish FTS in migration for Posts and Questions SearchVector columns
- [ ] T038 Create IApplicationDbContext interface in backend/src/TechCommunity.Application/Common/Interfaces/IApplicationDbContext.cs
- [ ] T039 [P] Create ICurrentUserService interface in backend/src/TechCommunity.Application/Common/Interfaces/ICurrentUserService.cs
- [ ] T040 [P] Create IJwtService interface in backend/src/TechCommunity.Application/Common/Interfaces/IJwtService.cs
- [ ] T041 [P] Create ISlugService interface in backend/src/TechCommunity.Application/Common/Interfaces/ISlugService.cs
- [ ] T042 [P] Create IMarkdownService interface in backend/src/TechCommunity.Application/Common/Interfaces/IMarkdownService.cs
- [ ] T043 [P] Create ICacheService interface in backend/src/TechCommunity.Application/Common/Interfaces/ICacheService.cs
- [ ] T044 Setup MediatR pipeline behaviors in backend/src/TechCommunity.Application/Common/Behaviors/
- [ ] T045 [P] Create ValidationBehavior in backend/src/TechCommunity.Application/Common/Behaviors/ValidationBehavior.cs
- [ ] T046 [P] Create LoggingBehavior in backend/src/TechCommunity.Application/Common/Behaviors/LoggingBehavior.cs
- [ ] T047 Create custom exceptions in backend/src/TechCommunity.Application/Common/Exceptions/
- [ ] T048 [P] Create NotFoundException in backend/src/TechCommunity.Application/Common/Exceptions/NotFoundException.cs
- [ ] T049 [P] Create ValidationException in backend/src/TechCommunity.Application/Common/Exceptions/ValidationException.cs
- [ ] T050 [P] Create ForbiddenException in backend/src/TechCommunity.Application/Common/Exceptions/ForbiddenException.cs
- [ ] T051 [P] Create UnauthorizedException in backend/src/TechCommunity.Application/Common/Exceptions/UnauthorizedException.cs
- [ ] T052 Implement JwtService in backend/src/TechCommunity.Infrastructure/Services/Identity/JwtService.cs
- [ ] T052a Configure JWT expiry (30min access, 7day refresh) and session timeout (FR-005) in backend/src/TechCommunity.API/appsettings.json
- [ ] T053 [P] Implement SlugService (Turkish char support) in backend/src/TechCommunity.Infrastructure/Services/SlugService.cs
- [ ] T054 [P] Implement MarkdownService in backend/src/TechCommunity.Infrastructure/Services/MarkdownService.cs
- [ ] T055 [P] Implement CacheService (IMemoryCache) in backend/src/TechCommunity.Infrastructure/Services/Caching/CacheService.cs
- [ ] T056 [P] Implement CurrentUserService in backend/src/TechCommunity.Infrastructure/Services/Identity/CurrentUserService.cs
- [ ] T057 Create DependencyInjection for Infrastructure in backend/src/TechCommunity.Infrastructure/DependencyInjection.cs
- [ ] T058 Create DependencyInjection for Application in backend/src/TechCommunity.Application/DependencyInjection.cs
- [ ] T059 Setup Program.cs with DI, CORS, JWT auth in backend/src/TechCommunity.API/Program.cs
- [ ] T060 Create global exception handler middleware in backend/src/TechCommunity.API/Middleware/ExceptionHandlingMiddleware.cs
- [ ] T061 [P] Create standard API response wrapper in backend/src/TechCommunity.API/Models/ApiResponse.cs
- [ ] T062 [P] Create pagination request/response models in backend/src/TechCommunity.Application/Common/Models/PaginatedList.cs
- [ ] T063 Configure rate limiting middleware in backend/src/TechCommunity.API/Program.cs
- [ ] T064 Configure Swagger/OpenAPI in backend/src/TechCommunity.API/Program.cs

### Frontend Core Infrastructure

- [ ] T065 Create core module structure in frontend/src/app/core/
- [ ] T066 [P] Create AuthService with JWT handling in frontend/src/app/core/auth/auth.service.ts
- [ ] T067 [P] Create AuthInterceptor for token injection in frontend/src/app/core/interceptors/auth.interceptor.ts
- [ ] T068 [P] Create ErrorInterceptor for global error handling in frontend/src/app/core/interceptors/error.interceptor.ts
- [ ] T069 [P] Create AuthGuard for protected routes in frontend/src/app/core/guards/auth.guard.ts
- [ ] T070 [P] Create AdminGuard for admin routes in frontend/src/app/core/guards/admin.guard.ts
- [ ] T071 [P] Create ApiService base class in frontend/src/app/core/services/api.service.ts
- [ ] T072 Create shared module structure in frontend/src/app/shared/
- [ ] T073 [P] Create LoadingSpinnerComponent in frontend/src/app/shared/components/loading-spinner/
- [ ] T074 [P] Create PaginationComponent in frontend/src/app/shared/components/pagination/
- [ ] T075 [P] Create MarkdownViewerComponent in frontend/src/app/shared/components/markdown-viewer/
- [ ] T076 [P] Create TagListComponent in frontend/src/app/shared/components/tag-list/
- [ ] T077 [P] Create UserAvatarComponent in frontend/src/app/shared/components/user-avatar/
- [ ] T078 [P] Create TimeAgoPipe in frontend/src/app/shared/pipes/time-ago.pipe.ts
- [ ] T079 [P] Create TruncatePipe in frontend/src/app/shared/pipes/truncate.pipe.ts
- [ ] T080 Create main layout component in frontend/src/app/layouts/main-layout/
- [ ] T081 [P] Create HeaderComponent in frontend/src/app/layouts/main-layout/header/
- [ ] T082 [P] Create FooterComponent in frontend/src/app/layouts/main-layout/footer/
- [ ] T083 [P] Create SidebarComponent in frontend/src/app/layouts/main-layout/sidebar/
- [ ] T084 Configure SSR with Angular Universal in frontend/angular.json and frontend/server.ts
- [ ] T085 Setup SEO service for dynamic meta tags in frontend/src/app/core/services/seo.service.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Kullanıcı Kaydı ve Profil (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar e-posta/şifre ile kayıt olabilir, giriş yapabilir ve profillerini yönetebilir

**Independent Test**: Kayıt formu doldurularak hesap oluşturulabilir, giriş yapılabilir, profil görüntülenebilir ve düzenlenebilir

### Backend - Auth Feature

- [ ] T086 [P] [US1] Create RegisterCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommand.cs
- [ ] T087 [P] [US1] Create RegisterCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommandValidator.cs
- [ ] T088 [US1] Create RegisterCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Register/RegisterCommandHandler.cs
- [ ] T089 [P] [US1] Create LoginCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommand.cs
- [ ] T090 [P] [US1] Create LoginCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommandValidator.cs
- [ ] T091 [US1] Create LoginCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Login/LoginCommandHandler.cs
- [ ] T092 [P] [US1] Create RefreshTokenCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/RefreshToken/RefreshTokenCommand.cs
- [ ] T093 [US1] Create RefreshTokenCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/RefreshToken/RefreshTokenCommandHandler.cs
- [ ] T094 [P] [US1] Create LogoutCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/Logout/LogoutCommand.cs
- [ ] T095 [US1] Create LogoutCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/Logout/LogoutCommandHandler.cs
- [ ] T095a [P] [US1] Create ForgotPasswordCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommand.cs
- [ ] T095b [P] [US1] Create ForgotPasswordCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommandValidator.cs
- [ ] T095c [US1] Create ForgotPasswordCommandHandler (generate reset token, send email) in backend/src/TechCommunity.Application/Features/Auth/Commands/ForgotPassword/ForgotPasswordCommandHandler.cs
- [ ] T095d [P] [US1] Create ResetPasswordCommand in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommand.cs
- [ ] T095e [P] [US1] Create ResetPasswordCommandValidator in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommandValidator.cs
- [ ] T095f [US1] Create ResetPasswordCommandHandler in backend/src/TechCommunity.Application/Features/Auth/Commands/ResetPassword/ResetPasswordCommandHandler.cs
- [ ] T096 [P] [US1] Create AuthDto in backend/src/TechCommunity.Application/Features/Auth/DTOs/AuthDto.cs
- [ ] T097 [US1] Create AuthController in backend/src/TechCommunity.API/Controllers/AuthController.cs

### Backend - Users Feature

- [ ] T098 [P] [US1] Create GetCurrentUserQuery in backend/src/TechCommunity.Application/Features/Users/Queries/GetCurrentUser/GetCurrentUserQuery.cs
- [ ] T099 [US1] Create GetCurrentUserQueryHandler in backend/src/TechCommunity.Application/Features/Users/Queries/GetCurrentUser/GetCurrentUserQueryHandler.cs
- [ ] T100 [P] [US1] Create UpdateProfileCommand in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommand.cs
- [ ] T101 [P] [US1] Create UpdateProfileCommandValidator in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommandValidator.cs
- [ ] T102 [US1] Create UpdateProfileCommandHandler in backend/src/TechCommunity.Application/Features/Users/Commands/UpdateProfile/UpdateProfileCommandHandler.cs
- [ ] T103 [P] [US1] Create UploadAvatarCommand in backend/src/TechCommunity.Application/Features/Users/Commands/UploadAvatar/UploadAvatarCommand.cs
- [ ] T104 [US1] Create UploadAvatarCommandHandler in backend/src/TechCommunity.Application/Features/Users/Commands/UploadAvatar/UploadAvatarCommandHandler.cs
- [ ] T105 [P] [US1] Create UserProfileDto in backend/src/TechCommunity.Application/Features/Users/DTOs/UserProfileDto.cs
- [ ] T106 [P] [US1] Create UserSummaryDto in backend/src/TechCommunity.Application/Features/Users/DTOs/UserSummaryDto.cs
- [ ] T107 [US1] Implement IFileStorageService interface and local storage in backend/src/TechCommunity.Infrastructure/Services/FileStorage/
- [ ] T108 [US1] Create UsersController in backend/src/TechCommunity.API/Controllers/UsersController.cs

### Frontend - Auth Feature

- [ ] T109 [P] [US1] Create auth feature module in frontend/src/app/features/auth/
- [ ] T110 [P] [US1] Create auth routes in frontend/src/app/features/auth/auth.routes.ts
- [ ] T111 [P] [US1] Create RegisterComponent in frontend/src/app/features/auth/register/register.component.ts
- [ ] T112 [P] [US1] Create LoginComponent in frontend/src/app/features/auth/login/login.component.ts
- [ ] T112a [P] [US1] Create ForgotPasswordComponent in frontend/src/app/features/auth/forgot-password/forgot-password.component.ts
- [ ] T112b [P] [US1] Create ResetPasswordComponent in frontend/src/app/features/auth/reset-password/reset-password.component.ts
- [ ] T113 [P] [US1] Create auth state signal service in frontend/src/app/features/auth/auth-state.service.ts
- [ ] T114 [US1] Integrate AuthService with backend API endpoints

### Frontend - Profile Feature

- [ ] T115 [P] [US1] Create profile feature module in frontend/src/app/features/profile/
- [ ] T116 [P] [US1] Create profile routes in frontend/src/app/features/profile/profile.routes.ts
- [ ] T117 [P] [US1] Create ProfileViewComponent in frontend/src/app/features/profile/profile-view/profile-view.component.ts
- [ ] T118 [P] [US1] Create ProfileEditComponent in frontend/src/app/features/profile/profile-edit/profile-edit.component.ts
- [ ] T119 [P] [US1] Create AvatarUploadComponent in frontend/src/app/features/profile/avatar-upload/avatar-upload.component.ts
- [ ] T120 [US1] Create ProfileService in frontend/src/app/features/profile/profile.service.ts
- [ ] T121 [US1] Setup SSR meta tags for profile pages in ProfileViewComponent

**Checkpoint**: User Story 1 complete - Users can register, login, and manage profiles

---

## Phase 4: User Story 2 - Blog Yazısı (Post) (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar blog yazısı oluşturabilir, okuyabilir ve yorum yapabilir

**Independent Test**: Post oluşturulabilir, listelenebilir, detay görüntülenebilir, yorum eklenebilir

### Backend - Posts Feature

- [ ] T122 [P] [US2] Create CreatePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommand.cs
- [ ] T123 [P] [US2] Create CreatePostCommandValidator in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommandValidator.cs
- [ ] T124 [US2] Create CreatePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/CreatePost/CreatePostCommandHandler.cs
- [ ] T125 [P] [US2] Create UpdatePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/UpdatePost/UpdatePostCommand.cs
- [ ] T126 [US2] Create UpdatePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/UpdatePost/UpdatePostCommandHandler.cs
- [ ] T127 [P] [US2] Create DeletePostCommand in backend/src/TechCommunity.Application/Features/Posts/Commands/DeletePost/DeletePostCommand.cs
- [ ] T128 [US2] Create DeletePostCommandHandler in backend/src/TechCommunity.Application/Features/Posts/Commands/DeletePost/DeletePostCommandHandler.cs
- [ ] T129 [P] [US2] Create GetPostsQuery (paginated) in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPosts/GetPostsQuery.cs
- [ ] T130 [US2] Create GetPostsQueryHandler in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPosts/GetPostsQueryHandler.cs
- [ ] T131 [P] [US2] Create GetPostByIdQuery in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPostById/GetPostByIdQuery.cs
- [ ] T132 [US2] Create GetPostByIdQueryHandler with view count increment in backend/src/TechCommunity.Application/Features/Posts/Queries/GetPostById/GetPostByIdQueryHandler.cs
- [ ] T133 [P] [US2] Create PostDto in backend/src/TechCommunity.Application/Features/Posts/DTOs/PostDto.cs
- [ ] T134 [P] [US2] Create PostDetailDto in backend/src/TechCommunity.Application/Features/Posts/DTOs/PostDetailDto.cs
- [ ] T135 [US2] Create PostsController in backend/src/TechCommunity.API/Controllers/PostsController.cs

### Backend - Comments Feature (for Posts)

- [ ] T136 [P] [US2] Create AddCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommand.cs
- [ ] T137 [P] [US2] Create AddCommentCommandValidator in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommandValidator.cs
- [ ] T138 [US2] Create AddCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/AddComment/AddCommentCommandHandler.cs
- [ ] T139 [P] [US2] Create UpdateCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/UpdateComment/UpdateCommentCommand.cs
- [ ] T140 [US2] Create UpdateCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/UpdateComment/UpdateCommentCommandHandler.cs
- [ ] T141 [P] [US2] Create DeleteCommentCommand in backend/src/TechCommunity.Application/Features/Comments/Commands/DeleteComment/DeleteCommentCommand.cs
- [ ] T142 [US2] Create DeleteCommentCommandHandler in backend/src/TechCommunity.Application/Features/Comments/Commands/DeleteComment/DeleteCommentCommandHandler.cs
- [ ] T143 [P] [US2] Create GetCommentsQuery in backend/src/TechCommunity.Application/Features/Comments/Queries/GetComments/GetCommentsQuery.cs
- [ ] T144 [US2] Create GetCommentsQueryHandler in backend/src/TechCommunity.Application/Features/Comments/Queries/GetComments/GetCommentsQueryHandler.cs
- [ ] T145 [P] [US2] Create CommentDto in backend/src/TechCommunity.Application/Features/Comments/DTOs/CommentDto.cs
- [ ] T146 [US2] Create CommentsController in backend/src/TechCommunity.API/Controllers/CommentsController.cs

### Frontend - Posts Feature

- [ ] T147 [P] [US2] Create posts feature module in frontend/src/app/features/posts/
- [ ] T148 [P] [US2] Create posts routes in frontend/src/app/features/posts/posts.routes.ts
- [ ] T149 [P] [US2] Create PostListComponent in frontend/src/app/features/posts/post-list/post-list.component.ts
- [ ] T150 [P] [US2] Create PostDetailComponent in frontend/src/app/features/posts/post-detail/post-detail.component.ts
- [ ] T151 [P] [US2] Create PostFormComponent in frontend/src/app/features/posts/post-form/post-form.component.ts
- [ ] T152 [P] [US2] Create PostCardComponent in frontend/src/app/features/posts/post-card/post-card.component.ts
- [ ] T153 [P] [US2] Create CommentListComponent in frontend/src/app/shared/components/comment-list/
- [ ] T154 [P] [US2] Create CommentFormComponent in frontend/src/app/shared/components/comment-form/
- [ ] T155 [US2] Create PostsService in frontend/src/app/features/posts/posts.service.ts
- [ ] T156 [US2] Create CommentsService in frontend/src/app/core/services/comments.service.ts
- [ ] T157 [US2] Setup SSR meta tags for post pages (title, description, og:tags)
- [ ] T158 [US2] Integrate MarkdownEditor component in PostFormComponent

**Checkpoint**: User Story 2 complete - Users can create, read, and comment on posts

---

## Phase 5: User Story 3 - Soru-Cevap (Priority: P1) 🎯 MVP

**Goal**: Kullanıcılar soru sorabilir, cevap verebilir ve en iyi cevabı seçebilir

**Independent Test**: Soru oluşturulabilir, cevaplanabilir, cevaba yorum eklenebilir, kabul edilen cevap seçilebilir

### Backend - Questions Feature

- [ ] T159 [P] [US3] Create CreateQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommand.cs
- [ ] T160 [P] [US3] Create CreateQuestionCommandValidator in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommandValidator.cs
- [ ] T161 [US3] Create CreateQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/CreateQuestion/CreateQuestionCommandHandler.cs
- [ ] T162 [P] [US3] Create UpdateQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/UpdateQuestion/UpdateQuestionCommand.cs
- [ ] T163 [US3] Create UpdateQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/UpdateQuestion/UpdateQuestionCommandHandler.cs
- [ ] T164 [P] [US3] Create DeleteQuestionCommand in backend/src/TechCommunity.Application/Features/Questions/Commands/DeleteQuestion/DeleteQuestionCommand.cs
- [ ] T165 [US3] Create DeleteQuestionCommandHandler in backend/src/TechCommunity.Application/Features/Questions/Commands/DeleteQuestion/DeleteQuestionCommandHandler.cs
- [ ] T166 [P] [US3] Create GetQuestionsQuery in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestions/GetQuestionsQuery.cs
- [ ] T167 [US3] Create GetQuestionsQueryHandler in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestions/GetQuestionsQueryHandler.cs
- [ ] T168 [P] [US3] Create GetQuestionByIdQuery in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestionById/GetQuestionByIdQuery.cs
- [ ] T169 [US3] Create GetQuestionByIdQueryHandler in backend/src/TechCommunity.Application/Features/Questions/Queries/GetQuestionById/GetQuestionByIdQueryHandler.cs
- [ ] T170 [P] [US3] Create QuestionDto in backend/src/TechCommunity.Application/Features/Questions/DTOs/QuestionDto.cs
- [ ] T171 [P] [US3] Create QuestionDetailDto in backend/src/TechCommunity.Application/Features/Questions/DTOs/QuestionDetailDto.cs
- [ ] T172 [US3] Create QuestionsController in backend/src/TechCommunity.API/Controllers/QuestionsController.cs

### Backend - Answers Feature

- [ ] T173 [P] [US3] Create AddAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommand.cs
- [ ] T174 [P] [US3] Create AddAnswerCommandValidator in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommandValidator.cs
- [ ] T175 [US3] Create AddAnswerCommandHandler (with AnswerCount update) in backend/src/TechCommunity.Application/Features/Answers/Commands/AddAnswer/AddAnswerCommandHandler.cs
- [ ] T176 [P] [US3] Create UpdateAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/UpdateAnswer/UpdateAnswerCommand.cs
- [ ] T177 [US3] Create UpdateAnswerCommandHandler in backend/src/TechCommunity.Application/Features/Answers/Commands/UpdateAnswer/UpdateAnswerCommandHandler.cs
- [ ] T178 [P] [US3] Create DeleteAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/DeleteAnswer/DeleteAnswerCommand.cs
- [ ] T179 [US3] Create DeleteAnswerCommandHandler in backend/src/TechCommunity.Application/Features/Answers/Commands/DeleteAnswer/DeleteAnswerCommandHandler.cs
- [ ] T180 [P] [US3] Create AcceptAnswerCommand in backend/src/TechCommunity.Application/Features/Answers/Commands/AcceptAnswer/AcceptAnswerCommand.cs
- [ ] T181 [US3] Create AcceptAnswerCommandHandler (unaccept previous, accept new) in backend/src/TechCommunity.Application/Features/Answers/Commands/AcceptAnswer/AcceptAnswerCommandHandler.cs
- [ ] T182 [P] [US3] Create GetAnswersQuery in backend/src/TechCommunity.Application/Features/Answers/Queries/GetAnswers/GetAnswersQuery.cs
- [ ] T183 [US3] Create GetAnswersQueryHandler in backend/src/TechCommunity.Application/Features/Answers/Queries/GetAnswers/GetAnswersQueryHandler.cs
- [ ] T184 [P] [US3] Create AnswerDto in backend/src/TechCommunity.Application/Features/Answers/DTOs/AnswerDto.cs
- [ ] T185 [US3] Create AnswersController in backend/src/TechCommunity.API/Controllers/AnswersController.cs

### Frontend - Questions Feature

- [ ] T186 [P] [US3] Create questions feature module in frontend/src/app/features/questions/
- [ ] T187 [P] [US3] Create questions routes in frontend/src/app/features/questions/questions.routes.ts
- [ ] T188 [P] [US3] Create QuestionListComponent in frontend/src/app/features/questions/question-list/question-list.component.ts
- [ ] T189 [P] [US3] Create QuestionDetailComponent in frontend/src/app/features/questions/question-detail/question-detail.component.ts
- [ ] T190 [P] [US3] Create QuestionFormComponent in frontend/src/app/features/questions/question-form/question-form.component.ts
- [ ] T191 [P] [US3] Create QuestionCardComponent in frontend/src/app/features/questions/question-card/question-card.component.ts
- [ ] T192 [P] [US3] Create AnswerListComponent in frontend/src/app/features/questions/answer-list/answer-list.component.ts
- [ ] T193 [P] [US3] Create AnswerFormComponent in frontend/src/app/features/questions/answer-form/answer-form.component.ts
- [ ] T194 [P] [US3] Create AnswerItemComponent (with accept button) in frontend/src/app/features/questions/answer-item/answer-item.component.ts
- [ ] T195 [US3] Create QuestionsService in frontend/src/app/features/questions/questions.service.ts
- [ ] T196 [US3] Create AnswersService in frontend/src/app/features/questions/answers.service.ts
- [ ] T197 [US3] Setup SSR meta tags for question pages

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
