import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES),
      },
      {
        path: 'posts',
        loadChildren: () => import('./features/posts/posts.routes').then(m => m.POSTS_ROUTES),
      },
      {
        path: 'questions',
        loadChildren: () => import('./features/questions/questions.routes').then(m => m.QUESTIONS_ROUTES),
      },
      {
        path: 'events',
        loadChildren: () => import('./features/events/events.routes').then(m => m.EVENTS_ROUTES),
      },
      {
        path: 'tags',
        loadChildren: () => import('./features/tags/tags.routes').then(m => m.TAGS_ROUTES),
      },
      {
        path: 'search',
        loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES),
      },
      {
        path: 'u',
        loadComponent: () => import('./features/profile/users-list/users-list.component').then(m => m.UsersListComponent),
        title: 'Topluluk Üyeleri | TechCommunity'
      },
      {
        path: 'u/:username',
        loadComponent: () => import('./features/profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
      // Static pages
      {
        path: 'about',
        loadComponent: () => import('./features/pages/about/about.component').then(m => m.AboutComponent),
        title: 'Hakkımızda | TechCommunity'
      },
      {
        path: 'guidelines',
        loadComponent: () => import('./features/pages/guidelines/guidelines.component').then(m => m.GuidelinesComponent),
        title: 'Topluluk Kuralları | TechCommunity'
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/pages/faq/faq.component').then(m => m.FaqComponent),
        title: 'Sıkça Sorulan Sorular | TechCommunity'
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/pages/contact/contact.component').then(m => m.ContactComponent),
        title: 'İletişim | TechCommunity'
      },
      {
        path: 'privacy',
        loadComponent: () => import('./features/pages/privacy/privacy.component').then(m => m.PrivacyComponent),
        title: 'Gizlilik Politikası | TechCommunity'
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/pages/terms/terms.component').then(m => m.TermsComponent),
        title: 'Kullanım Şartları | TechCommunity'
      },
      {
        path: 'cookies',
        loadComponent: () => import('./features/pages/cookies/cookies.component').then(m => m.CookiesComponent),
        title: 'Çerez Politikası | TechCommunity'
      },
    ]
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
