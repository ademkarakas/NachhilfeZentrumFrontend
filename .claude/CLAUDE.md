# CLAUDE.md — Nachhilfezentrum Platform

This file gives Claude (via claude.ai / Claude Code) persistent project context. Keep it accurate and update it as decisions are finalized — Claude will read this at the start of every session in this project.

## Project Overview

A web platform for a **Nachhilfezentrum** (private tutoring & coaching center) with two goals:
1. **Marketing/visibility**: a public, SEO-friendly site to attract students and parents, build trust, and generate leads.
2. **E-learning/proof-of-quality**: a catalog of subject-based tests/exams that visitors (and later, registered/Pro members) can take, demonstrating teaching quality.

The business explicitly offers **two distinct service lines** that must be communicated separately throughout the product:
- **Nachhilfe (Tutoring)** — subject-based instruction (Math, German, English, etc. — extensible list).
- **Coaching/Mentoring** — a separate, non-subject-based offering (study skills, motivation, exam anxiety, etc.). This must never be visually or structurally subordinated to tutoring — it gets its own pages/sections/CRUD module.

## Repository Structure

```
nachhilfe-platform/
  backend/
    src/
      Domain/
      Application/
      Infrastructure/
      Api/
    tests/
  frontend/                  → Angular 22, single app containing:
    src/app/
      features/              → public marketing + e-learning pages
      admin/                 → role-gated admin module, lazy-loaded under /admin route
      core/                  → singleton services (auth, http interceptors)
      shared/                → reusable design-system components
  docs/
    SKILLS.md
    01-BACKEND-PROMPT.md
    02-FRONTEND-PROMPT.md
    03-ADMIN-PANEL-PROMPT.md
```

Note: the Admin Panel is NOT a separate Angular application. It is a lazy-loaded, role-gated feature module (`/admin/**` routes) inside the same Angular app as the public site. This was a deliberate decision (see Architecture Decisions below) to avoid maintaining two separate Angular projects for a single small business. The `03-ADMIN-PANEL-PROMPT.md` content still applies in full — just mentally substitute "separate app" with "feature module under `app/admin/`" wherever it appears.

`CLAUDE.md` lives at the repository root (not inside `docs/`) so Claude Code picks it up automatically on every session.

Update this tree once the actual repo layout is finalized; keep it truthful.

## Tech Stack (do not deviate without discussion)

**Backend**: .NET 10, C#, Clean Architecture, DDD, EF Core, MediatR (CQRS), FluentValidation, ASP.NET Core Identity + JWT, Serilog, xUnit.

**Frontend (public + admin)**: Angular 22, standalone components, Signals, new control-flow syntax (`@if/@for/@switch`), SCSS with CSS custom properties, Reactive Forms, strict TypeScript.

**Database**: SQL Server (decided — use `Microsoft.EntityFrameworkCore.SqlServer` provider).

## Architectural Principles

1. **Clean Architecture dependency rule**: Domain has zero outward dependencies. Application depends only on Domain. Infrastructure implements Application interfaces. API/Presentation wires everything via DI. Never let Domain or Application reference Infrastructure or EF Core directly.
2. **DDD where it earns its keep**: Use rich domain models, value objects, and aggregates for genuinely complex/rule-laden concepts (Test/Question/Attempt grading, AccessPolicy). Don't over-engineer simple CRUD-only entities (e.g., Testimonial) with unnecessary DDD ceremony — use judgment.
3. **CQRS via MediatR**: every use case is a Command or Query with its own Handler. Controllers/endpoints stay thin — they only translate HTTP ↔ MediatR.
4. **Extensibility seams are mandatory, not optional, in these specific areas** (because product requirements are intentionally still evolving here):
   - **Question types** (multiple choice today; open-ended/file-upload type questions may be added later). Use a discriminated/polymorphic design from day one.
   - **Grading strategy** (auto-graded vs. pending manual review).
   - **Content visibility / membership tiers** (`Public` today; `Pro`/members-only later). Build the policy-check seam now; do not build the actual paywall/payment yet.
   - **Payment/subscription integration**: leave an interface seam (e.g., `IPaymentGateway`) unimplemented. Do not build Stripe/payment logic unless explicitly asked.
5. **Result pattern over exceptions** for expected business-rule failures in the Application layer.
6. **Soft delete** for public-facing content entities (Subjects, Tests, Testimonials, CoachingPrograms) — never hard-delete content that may be referenced elsewhere (e.g., a Subject referenced by past Attempts).

## Frontend Principles

1. **Feature-based, lazy-loaded modules** in Angular. Shared design-system components live in `shared/`; singleton services live in `core/`.
2. **Signals-first state management.** Do not introduce NgRx or other heavy state libraries unless complexity genuinely demands it — flag it as a discussion point if you think it's needed.
3. **SEO matters a lot** for the public site (it's a local-business marketing tool). Always consider: meta tags, semantic HTML, structured data (Schema.org), SSR/prerendering implications when building public-facing routes.
4. **Coaching vs. Tutoring visual/structural separation** must be respected in every relevant UI decision (navigation, homepage, component naming) — don't let "Coaching" become a tab under "Subjects."
5. **Locked/Pro content UI pattern should exist visually now** (e.g., a badge/lock component) even though nothing is actually gated yet — so enabling gating later is a data/flag change, not a redesign.
6. **Admin panel UX differs from public site UX** — admin favors data-density, fast workflows, and rich form/table components over marketing polish.

## Language & Localization

- Primary content language: **German** (the center's audience). Architect for i18n-readiness (don't hardcode strings in a way that blocks adding other languages later), but do not over-build a full i18n pipeline unless asked.
- Code, comments, commit messages, and variable names: **English**.

## What Claude Should Always Do in This Project

- Ask before making irreversible infrastructure decisions (DB engine, hosting, monorepo vs. multi-repo) if not already decided in this file.
- Default to the extensibility seams listed above whenever touching Question, Grading, Visibility/Membership, or Payment-adjacent code — even for small features, check whether the seam is being respected.
- Keep Tutoring and Coaching as clearly separate concepts in code (separate aggregates/modules), not flags on the same entity.
- Prefer editing/extending existing patterns over introducing a new pattern for the same kind of problem (e.g., don't introduce a second pagination approach if one already exists in the codebase).
- Write tests for new Application-layer handlers and Domain logic, at minimum.
- Flag scope creep: if a request seems to silently expand into building payment processing, a new membership tier enforcement, or a new question type, pause and confirm before fully implementing — these are flagged as "seam, not yet built" in this file for a reason.

## What Claude Should Avoid

- Do not introduce a UI kit (Angular Material, PrimeNG, etc.) into the public-facing frontend without asking — keep it lightweight/custom there. The admin panel may justify a UI kit; still confirm first.
- Do not build actual payment/subscription logic unless explicitly requested — only the interface seam.
- Do not hardcode subject lists, question types, or membership tiers as fixed enums where the product intent is clearly "this will grow" — use admin-manageable/extensible data structures instead, per the seams above.
- Do not merge the Coaching and Tutoring concepts into one generic "Service" entity without flagging the tradeoff to me first.

## Resolved Decisions

- [x] Database: **SQL Server**.
- [x] Admin panel: **role-gated feature module inside the same Angular app** (`/admin/**` routes, lazy-loaded), not a separate application and not an Nx monorepo.

## Open Decisions (update as resolved)

- [ ] SSR vs. static prerendering for the public site — needs a recommendation + sign-off.
- [ ] Final list of initial Subjects and Coaching programs to seed at launch.

## How to Use the Companion Prompts

This project has three detailed task prompts to drive feature development:
- `01-BACKEND-PROMPT.md` — drives .NET backend work.
- `02-FRONTEND-PROMPT.md` — drives the public Angular site.
- `03-ADMIN-PANEL-PROMPT.md` — drives the Angular admin panel.

See `SKILLS.md` for how Claude should approach recurring task types (adding a new entity, adding a new question type, adding a new public page, etc.) in this specific codebase.
