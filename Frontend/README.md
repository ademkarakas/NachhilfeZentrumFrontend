# Nachhilfezentrum — Frontend (Angular 20, SSR)

Single Angular app containing the **public marketing/e-learning site** and a lazy-loaded,
role-gated **admin module** under `/admin/**`. Angular Material is used only in the admin
module; the public site uses a lightweight custom design system.

> Toolchain note: the plan targets Angular 22, but the installed Angular CLI is 20.3.x.
> All required features (standalone, signals, new control flow, signal `input()/output()`,
> SSR) are available in Angular 20, so the app is built on Angular 20.

## Structure

```
src/app/
  core/      → models (DTO interfaces + enums), auth (JWT+refresh, guards, interceptor),
               api services (PublicApiService, AdminApiService), seo, http interceptors
  shared/    → design system (Button, Card, Badge, LockIndicator, CtaSection, Testimonial,
               Spinner, ToastContainer) + design tokens (src/styles/_tokens.scss)
  features/  → public pages: home, subjects, coaching, tests (catalog + taking + result),
               team, about, contact (lead form), auth (login/register), layout (header/footer)
  admin/     → /admin lazy module (Angular Material): dashboard, subjects (reference CRUD
               with drag-drop reorder), coaching, tests + question builder, leads,
               testimonials, team, site settings
```

## Run

```bash
npm install
npm start            # dev server (SSR) at http://localhost:4200
npm run build        # production build (browser + server bundles)
npm run serve:ssr:Frontend   # run the production SSR server
```

The backend API is expected at `http://localhost:5009/api/v1` in development
(`src/environments/environment.ts`). CORS for `http://localhost:4200` is configured on the
backend.

## SSR configuration notes

Angular's SSR server enforces a host allowlist (SSRF protection) and cannot resolve
relative API URLs through itself. For production (`npm run serve:ssr:Frontend`):

- **Allowed hosts** — set `NG_ALLOWED_HOSTS` (comma-separated) or configure
  `projects.Frontend.architect.build.options.security.allowedHosts` in `angular.json`.
  Example: `NG_ALLOWED_HOSTS=localhost node dist/Frontend/server/server.mjs`.
- **API origin during SSR** — the browser calls the API same-origin (`/api/v1`), but the
  SSR server needs an absolute origin. Set `environment.prod.ssrApiOrigin` to the backend's
  reachable address (default `http://localhost:5009`). `ssrBaseUrlInterceptor` rewrites
  relative API calls to this origin only while rendering on the server.

## Extensibility seams (wired today, not fully built)

- **Question types** — `QuestionRendererComponent` (public) and the admin question builder
  both `@switch` on `questionType`; MultipleChoice is implemented, other types are reserved
  branches. A new type = one new branch + the matching backend command.
- **Membership/Pro gating** — `LockIndicatorComponent` renders the "Pro" lock UI from the
  `RequiresMembership` visibility flag. `environment.membershipGatingEnabled` is a stub;
  no content is actually gated yet.
- **Coaching vs. tutoring** — separate routes, services, nav items and accent colour. Never
  nested under subjects.
```
