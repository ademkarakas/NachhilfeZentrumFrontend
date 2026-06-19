# SKILLS.md — Recurring Task Playbooks for the Nachhilfezentrum Platform

This file documents repeatable task patterns specific to this codebase. When asked to do one of these tasks, follow the steps below rather than improvising a fresh approach each time — consistency across the codebase matters more than each individual implementation being clever.

---

## Skill: Add a New Domain Entity / Aggregate (Backend)

**When to use**: Adding a new concept to the system (e.g., "Announcement," "FAQ," "Discount Code").

**Steps**:
1. Determine if it's a true Aggregate Root (has its own lifecycle/invariants) or a simple supporting entity/value object. Don't force DDD ceremony onto simple CRUD data (e.g., a Testimonial doesn't need complex invariants).
2. Create the entity in `Domain/Entities` (or `Domain/<BoundedContext>` if the project uses bounded-context folders). Inherit from the shared `BaseEntity`/`AuditableEntity` for Id, CreatedAt, UpdatedAt, soft-delete flag.
3. If it has business rules, encapsulate them as methods on the entity (not in a service) — keep behavior with data, per DDD.
4. Add EF Core configuration in `Infrastructure/Persistence/Configurations` (a new `IEntityTypeConfiguration<T>` class). Never configure entities via data annotations only — use Fluent API for consistency with the rest of the codebase.
5. Add a migration: `dotnet ef migrations add Add<EntityName> -p Infrastructure -s Api`.
6. Create CQRS Commands/Queries in `Application/Features/<EntityName>/` following the existing folder pattern (`Commands/Create<X>`, `Commands/Update<X>`, `Commands/Delete<X>`, `Queries/Get<X>List`, `Queries/Get<X>ById`).
7. Add FluentValidation validators alongside each Command/Query.
8. Add a thin endpoint/controller action that only translates HTTP → MediatR `Send()`.
9. Write at least one unit test for any non-trivial domain logic and one for the primary command handler.
10. If this entity needs to appear on the public site AND be manageable in admin, confirm both frontend prompts' relevant modules are updated (don't forget the admin CRUD).

---

## Skill: Add a New Question Type (Backend + Admin)

**When to use**: The product currently supports Multiple Choice; this skill applies when adding e.g. Open-Ended, File Upload, True/False, Matching, etc.

**Why this is a guarded skill**: The Question domain model was deliberately designed with an extensibility seam. This skill exists to make sure that seam is actually used, not bypassed.

**Steps**:
1. Confirm the existing `Question` base type/discriminator pattern in `Domain/Entities/Assessment` (or wherever Questions live). Do NOT create a parallel/separate question system — extend the existing discriminator.
2. Add the new subtype (e.g., `OpenEndedQuestion : Question`) with whatever extra fields it needs (e.g., expected answer length, rubric text).
3. Update EF Core configuration to handle the new discriminator value (TPH/TPT or JSON column, whichever pattern is already in use — check before assuming).
4. Implement or extend the `IGradingStrategy` for this type:
   - If auto-gradable (e.g., True/False), implement scoring logic.
   - If not auto-gradable (e.g., Open-Ended, File Upload), route the Attempt's status to "Pending Review" and ensure an admin-facing review/grading UI path exists (or flag that it needs to be added to the Admin Panel's Leads/Attempts area).
5. On the public frontend, extend the `QuestionRendererComponent`'s type-switch with a new rendering branch — do not rebuild the test-taking flow.
6. On the admin panel, extend the Question Builder's type-selector with a new form variant — do not rebuild the builder.
7. Add tests covering: entity creation, grading behavior (or correct "pending" routing), and serialization/deserialization if a JSON-based answer schema is used.

---

## Skill: Add a New Public Page/Section (Frontend)

**When to use**: Adding a new marketing page (e.g., "Events," "Blog," "Pricing").

**Steps**:
1. Create a new lazy-loaded feature folder under `frontend/src/app/features/<page-name>`.
2. Reuse existing `shared/` design-system components (Button, Card, CTASection, TestimonialCard, Badge) before creating new ones. Only add a new shared component if the pattern will clearly repeat elsewhere.
3. Add the route to the router config with lazy loading (`loadComponent` / `loadChildren`).
4. Add an `SeoService` call (title + meta description) for the new route — every public page must set its own SEO metadata, no exceptions.
5. If the page displays admin-manageable content (e.g., Events), confirm there's a corresponding Admin Panel CRUD module — if not, flag it as a gap rather than hardcoding content in the frontend.
6. Check mobile responsiveness explicitly — this is a mobile-first site.
7. If the page is meant to be indexed by search engines, double check SSR/prerendering covers this route.

---

## Skill: Add a New Admin CRUD Module

**When to use**: A new content type needs to be manageable by staff (e.g., "FAQ entries," "Events").

**Steps**:
1. Follow the same pattern as the existing Subjects module (the designated reference pattern per `03-ADMIN-PANEL-PROMPT.md`): list view with the shared `DataTableComponent`, create/edit form, delete confirmation dialog.
2. Wire to the corresponding backend Application Commands/Queries (create them first if they don't exist — see "Add a New Domain Entity" skill above).
3. Add the route behind the existing Admin/Editor role guard — never create a new unguarded admin route.
4. Add toast/snackbar feedback on save/delete success and failure.
5. If the entity has a display order relevant to the public site (like Subjects), implement drag-and-drop reordering consistent with the Subjects module's pattern.

---

## Skill: Touching Membership/Visibility Logic

**When to use**: Any task that touches `ContentVisibility`, `MembershipTier`, `AccessPolicy`, or similar.

**Guardrail**: This is currently a seam, not a built feature. The platform is fully public today.

**Steps**:
1. Before writing code, confirm explicitly with the user whether they want to (a) extend the seam (e.g., add a new visibility value) or (b) actually start enforcing/building the paywall. These are very different scopes — do not assume (b) just because a task mentions "Pro" or "membership."
2. If extending the seam only: keep changes additive (new enum value, new policy check), and do not build payment/billing UI or logic.
3. If actually enforcing gating: confirm which content is gated, what happens to anonymous/free users hitting gated content (redirect? teaser preview? hard block?), and whether this is frontend-only (hide/show) or backend-enforced (401/403 on the API) — it must be backend-enforced for real security; frontend-only hiding is not acceptable as the sole control.

---

## Skill: Touching Payment/Subscription Logic

**When to use**: Any task mentioning Stripe, billing, subscriptions, invoices, or `IPaymentGateway`.

**Guardrail**: Per `CLAUDE.md`, payment logic is explicitly out of scope until requested. This skill exists so this boundary isn't crossed accidentally while implementing something adjacent (e.g., building out the Pro tier).

**Steps**:
1. Stop and confirm with the user before implementing any concrete payment provider integration.
2. If asked to "prepare" for payments: only the `IPaymentGateway` interface seam and a no-op/mock implementation are appropriate — not a real Stripe SDK integration.
3. If asked to actually implement payments: this is a significant scope expansion — recommend treating it as its own dedicated task/prompt rather than folding it into an unrelated feature request.

---

## Skill: Differentiating Coaching vs. Tutoring in New Features

**When to use**: Any new feature that touches both/either service line (e.g., a new "Book a session" feature, a new testimonial type, a new admin report).

**Guardrail**: Per `CLAUDE.md`, these are two distinct service lines and must not be silently merged into one generic concept.

**Steps**:
1. If building something for "services" generically, ask whether it actually applies equally to both Tutoring and Coaching, or whether one needs different fields/behavior (e.g., Coaching might need a "session length" or "outcome type" that Tutoring doesn't).
2. Avoid solving this by adding an `isCoaching: boolean` flag onto a single shared entity unless explicitly approved — prefer separate aggregates/modules (`CoachingProgram` vs. `Subject`) as already established, even if it means slightly more code, because the business wants this distinction emphasized everywhere, including internally in admin reporting.

---

## General Code Review Checklist (apply before considering any task "done")

- [ ] Does this respect the Clean Architecture dependency rule (no inward layer referencing an outward layer)?
- [ ] Is new business logic placed in Domain or Application, not leaked into Controllers or Angular components?
- [ ] Are the four extensibility seams (Question types, Grading, Visibility/Membership, Payment) respected and not bypassed?
- [ ] Is Coaching kept distinct from Tutoring in both data model and UI?
- [ ] Does new public-facing UI have SEO metadata and mobile responsiveness?
- [ ] Does new admin UI have role-guarding, loading/error feedback, and confirmation on destructive actions?
- [ ] Are there at least minimal tests for new Domain logic and Application handlers?
- [ ] Did I avoid introducing a new pattern (pagination, error handling, form validation) where an existing one already covers the case?
