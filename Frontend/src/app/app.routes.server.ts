import { RenderMode, ServerRoute } from '@angular/ssr';

// Server-render every route on demand. Data-driven routes (subjects, tests, coaching)
// depend on live API content, so prerendering is not appropriate — SSR gives crawlers
// fully-rendered HTML while keeping content fresh.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
