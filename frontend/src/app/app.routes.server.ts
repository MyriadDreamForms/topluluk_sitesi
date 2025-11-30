import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic routes - Server-side rendered
  {
    path: 'posts/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'posts/:slug/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'questions/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'events/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'tags/:slug',
    renderMode: RenderMode.Server
  },
  // User profile - Server-side rendered for SEO
  {
    path: 'u/:username',
    renderMode: RenderMode.Server
  },
  // Auth routes - Client-side only
  {
    path: 'auth/**',
    renderMode: RenderMode.Client
  },
  // Admin routes - Client-side only
  {
    path: 'admin/**',
    renderMode: RenderMode.Client
  },
  // Profile routes - Client-side only
  {
    path: 'profile/**',
    renderMode: RenderMode.Client
  },
  // Static routes - Prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
