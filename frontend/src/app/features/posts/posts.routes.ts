import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./post-list/post-list.component').then(m => m.PostListComponent),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () => import('./post-editor/post-editor.component').then(m => m.PostEditorComponent),
  },
  {
    path: ':slug',
    loadComponent: () => import('./post-detail/post-detail.component').then(m => m.PostDetailComponent),
  },
  {
    path: ':slug/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./post-editor/post-editor.component').then(m => m.PostEditorComponent),
  }
];
