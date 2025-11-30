import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then(m => m.ProfileComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./profile-edit/profile-edit.component').then(m => m.ProfileEditComponent),
  },
  {
    path: 'events',
    loadComponent: () => import('./my-events/my-events.component').then(m => m.MyEventsComponent),
    title: 'Kayıtlı Etkinliklerim | TechCommunity'
  }
];
