import { Routes } from '@angular/router';
import { authGuard, backOfficeGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'nachhilfe',
        loadComponent: () =>
          import('./features/subjects/nachhilfe-landing.component').then(
            (m) => m.NachhilfeLandingComponent,
          ),
      },
      {
        path: 'nachhilfe/:slug',
        loadComponent: () =>
          import('./features/subjects/subject-detail.component').then(
            (m) => m.SubjectDetailComponent,
          ),
      },
      {
        path: 'faecher',
        redirectTo: 'nachhilfe',
        pathMatch: 'full',
      },
      {
        path: 'faecher/:slug',
        redirectTo: 'nachhilfe/:slug',
      },
      {
        path: 'coaching',
        loadComponent: () =>
          import('./features/coaching/coaching-list.component').then(
            (m) => m.CoachingListComponent,
          ),
      },
      {
        path: 'coaching/:slug',
        loadComponent: () =>
          import('./features/coaching/coaching-detail.component').then(
            (m) => m.CoachingDetailComponent,
          ),
      },
      {
        path: 'tests',
        loadComponent: () =>
          import('./features/tests/test-catalog.component').then((m) => m.TestCatalogComponent),
      },
      {
        path: 'attempts/:attemptId',
        loadComponent: () =>
          import('./features/tests/attempt-result.component').then((m) => m.AttemptResultComponent),
      },
      {
        path: 'tests/:slug',
        loadComponent: () =>
          import('./features/tests/test-taking.component').then((m) => m.TestTakingComponent),
      },
      {
        path: 'team',
        loadComponent: () => import('./features/team/team.component').then((m) => m.TeamComponent),
      },
      {
        path: 'ueber-uns',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'kontakt',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then((m) => m.FaqComponent),
      },
      {
        path: 'preise',
        loadComponent: () =>
          import('./features/pricing/pricing.component').then((m) => m.PricingComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'registrieren',
        loadComponent: () =>
          import('./features/auth/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'mein-konto',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/account/account.component').then((m) => m.AccountComponent),
      },
      {
        path: 'impressum',
        loadComponent: () =>
          import('./features/legal/impressum.component').then((m) => m.ImpressumComponent),
      },
      {
        path: 'datenschutz',
        loadComponent: () =>
          import('./features/legal/datenschutz.component').then((m) => m.DatenschutzComponent),
      },
      {
        path: 'agb',
        loadComponent: () => import('./features/legal/agb.component').then((m) => m.AgbComponent),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [backOfficeGuard],
    canActivateChild: [backOfficeGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
