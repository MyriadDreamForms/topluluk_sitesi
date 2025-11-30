import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const QUESTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./question-list/question-list.component').then(m => m.QuestionListComponent),
  },
  {
    path: 'ask',
    canActivate: [authGuard],
    loadComponent: () => import('./question-ask/question-ask.component').then(m => m.QuestionAskComponent),
  },
  {
    path: ':slug',
    loadComponent: () => import('./question-detail/question-detail.component').then(m => m.QuestionDetailComponent),
  }
];
