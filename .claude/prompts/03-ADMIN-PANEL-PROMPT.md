# ADMIN PANEL DEVELOPMENT PROMPT — Nachhilfezentrum Content Management (Angular 22)

## Role
You are a senior Angular frontend architect specializing in internal/admin tooling. Build the **Admin Panel** for a Nachhilfezentrum platform — implemented as a **role-gated, lazy-loaded feature module (`/admin/**` routes) inside the same Angular application as the public site** (this architecture decision is final — do not propose a separate app or an Nx monorepo). Staff/the owner use it to manage all dynamic content on the public site without touching code.

## Tech Stack
- Angular 22 (standalone components, signals, new control flow syntax)
- TypeScript strict mode
- Reactive Forms (forms here are more complex than the public site — multi-step test/question builders, etc.)
- A lightweight admin UI component approach — recommend whether a UI kit (e.g., PrimeNG, Angular Material, or a custom minimal set) makes sense here specifically for admin tooling (data tables, modals, drag-and-drop ordering), since admin tools benefit more from rich pre-built components than the marketing site does. Justify your recommendation, but ask before committing to a heavy dependency.
- HttpClient + interceptors (auth token, error handling) shared/consistent with the public site's API conventions.
- Role-based route guards (Admin/Editor roles — assume at least an `Admin` role exists; consider whether a more limited `Editor` role for content-only management makes sense and propose it).

## Purpose & Scope
This panel is the operational backbone that keeps the public marketing site "alive" and easy to update — the business owner should be able to add a new subject, publish a new test, update the coaching program description, or check new leads without any developer involvement.

## Core Modules to Build

### 1. Dashboard
- At-a-glance overview: number of new leads/inquiries (highlighted/urgent), total tests published, total attempts in the last 7/30 days, quick links to common actions ("Add Test," "Add Subject," "View Leads").

### 2. Subjects (Branş) Management
- CRUD: list, create, edit, archive/soft-delete subjects.
- Fields: name, description, icon/image, display order, visibility (active/inactive on public site).
- Reorder via drag-and-drop (display order matters for the public catalog).

### 3. Coaching/Mentoring Programs Management
- CRUD for coaching program entries — kept as its own distinct module (NOT merged into Subjects) reflecting that coaching is a separate service line from tutoring.
- Fields: title, description, target audience, outcomes/benefits, CTA text/link, optional image.

### 4. Tests/Exams Management (the most complex module)
- List all tests with filters (by subject, by visibility status, by published/draft).
- Test builder: create/edit a test's metadata (title, subject, description, difficulty, estimated duration, visibility — `Public` today, with a `Pro/Members-only` option already in the UI as a forward-looking toggle even if not enforced yet on the backend).
- **Question builder** within a test: add/remove/reorder questions. Since the backend question model is designed to be extensible, build the question-builder UI as a pattern that can support multiple question types via a type-selector + dynamic form (start with Multiple Choice fully implemented; stub the UI pattern — e.g., a `[questionType]` switch in the form — so adding "Open-Ended" or "File Upload" later means adding one new form variant, not rebuilding the builder).
- Draft vs. Published state for tests (don't show unfinished tests on the public site).
- Preview button — admin can preview a test exactly as a public visitor would see it.

### 5. Leads / Inquiries Management
- List of contact-form submissions with filters (new/contacted/closed status, by subject of interest, by date).
- Detail view per lead, ability to add internal notes and change status.
- This is a high-business-value module — prioritize a clean, fast workflow here (the owner will check this often).

### 6. Testimonials / Success Stories Management
- CRUD for testimonials shown on the public site (name, role e.g. "Parent of 9th grader," quote, optional photo, associated subject if relevant, display order, published/unpublished toggle).

### 7. Team / Tutor-Coach Profiles Management
- CRUD for staff profiles shown publicly (name, role — Tutor vs. Coach, bio, subjects taught, credentials, photo).

### 8. Site Content / Settings (lightweight CMS)
- Editable fields for homepage hero text, announcement banner (e.g., for promotions or seasonal messages), contact details (address, phone, email, opening hours), social media links.
- Keep this minimal and structured (not a full rich-text CMS) — a set of well-defined fields the owner can edit safely without breaking layout.

### 9. User & Role Management
- List registered users (students/parents who registered), view their test attempt history (read-only, for support purposes).
- Manage Admin/Editor accounts and roles.

## UX Requirements for Admin Tooling
- Data tables with sorting, filtering, pagination for every list view (Subjects, Tests, Leads, Testimonials, Users).
- Confirmation dialogs before destructive actions (delete/archive).
- Inline validation with clear German-language (or your default admin locale — confirm with me) error messages on all forms.
- Optimistic UI or clear loading/saving indicators on every save action — admin trust in "did my change save?" matters a lot.
- Toast/snackbar notifications for success/failure feedback.
- Responsive enough for tablet use (the owner may manage content on the go), but desktop is the primary target — don't over-invest in mobile-first here like the public site.

## Cross-Cutting Concerns
- Strict route guards: entire admin app behind authentication + Admin/Editor role check; redirect to login if unauthorized.
- Audit-friendly UI: show "last updated by / last updated at" on content where the backend provides it.
- Reuse API DTO/interface types shared conceptually with the public frontend where entities overlap (Subjects, Tests) — recommend whether a shared Angular library (Nx monorepo) makes sense for sharing types/interfaces between the public site and admin panel, and give me the tradeoff (simplicity now vs. shared-code benefits later) rather than assuming.
- Error handling consistent with the public site's interceptor pattern (shared `core` services if monorepo, duplicated-but-consistent pattern if separate apps).

## Deliverables I expect from you
1. Folder structure for the admin module within the existing Angular app (e.g., `src/app/admin/`), including how its routes integrate with the main app's router and how the role guard is applied at the parent route level.
2. The Subjects CRUD module fully built (list + create/edit form + delete confirmation) as the reference pattern for other simple CRUD modules.
3. The Test Builder + Question Builder module, demonstrating the extensible question-type pattern.
4. The Leads management module (list + detail + status update).
5. Route guard implementation for Admin/Editor role protection.
6. A shared `DataTableComponent` (or chosen UI-kit table wrapper) used consistently across modules.
7. A short README on running the admin panel locally, default admin credentials/seeding approach, and how it connects to the same backend as the public site.

## Constraints
- Prioritize admin efficiency and clarity over visual polish — this tool is used internally, not by the public.
- Ask me before choosing a UI kit dependency; give pros/cons.
- Keep the Question Builder's extensibility pattern clearly documented in code comments, since this is the module most likely to need new question types added later.
