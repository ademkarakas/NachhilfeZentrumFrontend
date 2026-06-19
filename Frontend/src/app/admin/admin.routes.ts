import { Routes } from '@angular/router';

/**
 * Admin feature routes. The parent /admin route (app.routes) is guarded by
 * backOfficeGuard, so everything here is already role-gated (Admin/Editor).
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'faecher',
        loadComponent: () =>
          import('./subjects/subjects-admin.component').then((m) => m.SubjectsAdminComponent),
      },
      {
        path: 'coaching',
        loadComponent: () =>
          import('./coaching/coaching-admin.component').then((m) => m.CoachingAdminComponent),
      },
      {
        path: 'tests',
        loadComponent: () =>
          import('./tests/tests-admin.component').then((m) => m.TestsAdminComponent),
      },
      {
        path: 'tests/:id',
        loadComponent: () =>
          import('./tests/test-editor.component').then((m) => m.TestEditorComponent),
      },
      {
        path: 'anfragen',
        loadComponent: () =>
          import('./leads/leads-admin.component').then((m) => m.LeadsAdminComponent),
      },
      {
        path: 'testimonials',
        loadComponent: () =>
          import('./testimonials/testimonials-admin.component').then(
            (m) => m.TestimonialsAdminComponent,
          ),
      },
      {
        path: 'team',
        loadComponent: () => import('./team/team-admin.component').then((m) => m.TeamAdminComponent),
      },
      {
        path: 'einstellungen',
        loadComponent: () =>
          import('./settings/settings-admin.component').then((m) => m.SettingsAdminComponent),
      },
    ],
  },
];
