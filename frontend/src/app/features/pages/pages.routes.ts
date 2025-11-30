import { Routes } from '@angular/router';

export const PAGES_ROUTES: Routes = [
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent),
    title: 'Hakkımızda | TechCommunity'
  },
  {
    path: 'guidelines',
    loadComponent: () => import('./guidelines/guidelines.component').then(m => m.GuidelinesComponent),
    title: 'Topluluk Kuralları | TechCommunity'
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent),
    title: 'Sıkça Sorulan Sorular | TechCommunity'
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent),
    title: 'İletişim | TechCommunity'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Gizlilik Politikası | TechCommunity'
  },
  {
    path: 'terms',
    loadComponent: () => import('./terms/terms.component').then(m => m.TermsComponent),
    title: 'Kullanım Şartları | TechCommunity'
  },
  {
    path: 'cookies',
    loadComponent: () => import('./cookies/cookies.component').then(m => m.CookiesComponent),
    title: 'Çerez Politikası | TechCommunity'
  }
];
