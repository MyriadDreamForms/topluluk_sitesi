import { Routes } from '@angular/router';

export const TAGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tag-list/tag-list.component').then(m => m.TagListComponent),
  },
  {
    path: ':slug',
    loadComponent: () => import('./tag-detail/tag-detail.component').then(m => m.TagDetailComponent),
  }
];
