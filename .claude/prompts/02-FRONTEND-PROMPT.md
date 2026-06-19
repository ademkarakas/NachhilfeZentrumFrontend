# FRONTEND DEVELOPMENT PROMPT — Nachhilfezentrum Public Website (Angular 22)

## Role
You are a senior Angular frontend architect and UI/UX-conscious developer. Build the **public-facing website** for a Nachhilfezentrum (private tutoring & coaching center). This site's primary purpose is **marketing and lead generation**: build trust, present the center professionally, attract students/parents, showcase subject tests/exams as proof of teaching quality, and clearly communicate that the center also offers **coaching/mentoring** in addition to regular tutoring.

## Tech Stack
- Angular 22 (standalone components, signals, new control flow syntax `@if/@for/@switch`)
- TypeScript strict mode
- Angular Signals for state management (avoid NgRx unless the app's complexity later justifies it — keep it lean)
- SCSS with a design-token-driven approach (CSS custom properties for theming)
- Angular Router with lazy-loaded feature routes
- Reactive Forms for the contact/lead form and test-taking forms
- HttpClient with interceptors (auth token attachment, error handling, loading state)
- RxJS for async streams where signals aren't a natural fit
- Angular Universal / SSR consideration for SEO (this is a marketing site — organic search visibility matters a lot; recommend SSR or prerendering and explain the tradeoff)
- Jest or Karma/Jasmine for unit tests (your recommendation — Angular 22 default is fine)
- Accessibility (WCAG 2.1 AA) as a baseline requirement, not an afterthought

## Design & UX Direction
- Target audience: students (teenagers, young adults) AND their parents — so tone/design must feel credible and professional for parents, while approachable for students.
- Language: German primary (the center is German-speaking); architect with `@angular/localize` or a similar i18n approach from the start so English or other languages can be added later without rework.
- Must clearly differentiate and showcase TWO distinct service lines: (1) **Nachhilfe / Tutoring** (subject-based), and (2) **Coaching/Mentoring** (life skills, learning strategy, motivation, exam anxiety, study habits, etc. — whatever framing fits a coaching offer). These should NOT be visually or structurally treated as the same thing — give coaching its own dedicated section/page with its own value proposition, not just a bullet point under tutoring.
- Strong call-to-action strategy throughout: "Book a free consultation," "Try a sample test," "Contact us," etc.
- Mobile-first responsive design — most prospective students/parents will land on mobile from search or social media.

## Site Structure / Pages to Build
1. **Home** — hero section communicating the center's value proposition, quick links to subjects, a "why us" / trust-building section (results, testimonials, tutor credentials), a clear visual distinction between Tutoring and Coaching offerings, and a strong CTA.
2. **Subjects (Branşlar) Overview + Detail** — list of subjects offered (extensible — admin can add more later), each with a detail page (what's covered, which tutors, sample tests for that subject).
3. **Coaching/Mentoring Page** — dedicated page explaining the coaching offer distinctly from tutoring: what it is, who it's for, what outcomes to expect, possibly a different CTA (e.g., "Book a coaching intro call").
4. **Tests/Exams Catalog** — browsable/filterable list of available tests (by subject), each leading to a test detail/start page. Today: all public. Build the UI with a "locked/Pro" state ALREADY supported visually (e.g., a badge or lock icon component) even though no content is locked yet — so enabling membership-gating later is just a data flag, not a redesign.
5. **Test-Taking Flow** — a flow to start a test, answer questions, and view results. Build this to gracefully support multiple question types even if only one type exists at launch (e.g., a `QuestionRendererComponent` that switches on question type — multiple choice today, extensible to open-ended/file-upload later without restructuring the flow).
6. **About Us / Team** — center's story, tutor/coach profiles, credentials — critical for trust-building.
7. **Testimonials/Success Stories** — social proof section, usable as a standalone page and as reusable components embedded on Home/Subjects pages.
8. **Contact / Lead Capture** — prominent contact form (name, contact info, subject of interest, message) that posts to the backend Lead/Inquiry API; clear expectations set ("we'll respond within X").
9. **Login / Register** (lightweight) — for users who want to track their test history; should NOT be a barrier to taking a test (support anonymous test-taking too, per backend capability).

## Component Architecture Guidance
- Feature-based folder structure (e.g., `features/subjects`, `features/tests`, `features/coaching`, `features/contact`), each lazy-loaded. Note: the Admin Panel lives in this same Angular application as a separate, role-gated, lazy-loaded module (`app/admin/`) — see `03-ADMIN-PANEL-PROMPT.md`. Keep the public `features/` and `admin/` trees cleanly separated; do not let admin-only logic leak into shared public components.
- Shared `core/` (singleton services: AuthService, ApiService/interceptors) and `shared/` (reusable presentational components: Button, Card, Badge/LockIndicator, TestimonialCard, CTASection, etc.) folders.
- Build a small reusable design-system layer (buttons, cards, section containers, badges) rather than one-off styled components per page — this site will grow (more subjects, more tests, more pages) and needs visual consistency without copy-pasted CSS.
- Use Angular's new `input()`/`output()` signal-based component APIs where appropriate for Angular 22.
- SEO: proper meta tags (title/description per route via a `SeoService` wrapping `Meta`/`Title`), semantic HTML, structured data (Schema.org `EducationalOrganization` / `Course` markup) for the homepage and subject/test pages — this matters a lot for a local business trying to gain visibility.

## State & Data
- A typed `ApiService` (or per-feature services) wrapping HttpClient calls to the .NET backend, using strongly typed DTOs/interfaces matching backend contracts.
- Signal-based stores per feature for UI state (loading, error, data) — keep it simple; avoid global state unless truly cross-cutting (e.g., current authenticated user).
- Graceful loading/error/empty states on every data-driven view (skeleton loaders or spinners, friendly error messages, empty-state messaging for e.g. "no tests yet in this subject").

## Cross-Cutting Concerns
- HTTP interceptor for attaching JWT (when logged in) and handling 401/refresh-token flow transparently.
- Global error handling with user-friendly toasts/notifications (not raw error dumps).
- Environment-based configuration (`environment.ts` for API base URL, feature flags — including a `membershipGatingEnabled` flag stubbed in for future use).
- Performance: lazy loading, image optimization (NgOptimizedImage), and route preloading strategy.
- Analytics-ready: structure the app so an analytics/tag-manager script (e.g., Google Analytics/Tag Manager) can be dropped in later for tracking lead conversions, without major refactor.

## Deliverables I expect from you
1. Project structure (folders, routing module/config, standalone bootstrap setup).
2. The shared design-system component set (Button, Card, Badge/Lock indicator, CTASection, TestimonialCard) with SCSS using CSS custom properties for easy theming.
3. The Home page and Coaching page fully built as a concrete example of the visual/structural distinction between Tutoring and Coaching.
4. The Test Catalog + Test-Taking flow, including the extensible `QuestionRendererComponent` pattern.
5. The Contact/Lead form wired to a typed API service (with the actual HTTP call point clearly marked/mocked if the backend isn't ready yet).
6. Routing config showing lazy-loaded feature modules and an SeoService example used on at least 2 routes.
7. A short README on running the app locally, environment variables needed, and how SSR/prerendering is configured (if you implement it).

## Constraints
- Favor clean, semantic, accessible markup over clever animations; this is a trust-building site for a tutoring business, not a flashy product demo.
- Ask me before introducing heavy dependencies (e.g., a full UI kit like Angular Material or PrimeNG) — tell me the tradeoff and let me decide, default to a lightweight custom design system unless I say otherwise.
- Keep the coaching-vs-tutoring distinction visible in as many relevant places as natural (nav, home, footer) without being repetitive or diluting the tutoring-focused pages.
