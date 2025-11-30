import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./event-list/event-list.component').then(m => m.EventListComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: ':slug/edit',
    loadComponent: () => import('./event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: ':slug',
    loadComponent: () => import('./event-detail/event-detail.component').then(m => m.EventDetailComponent),
  }
];
