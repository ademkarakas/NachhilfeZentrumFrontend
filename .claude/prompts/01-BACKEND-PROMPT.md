# BACKEND DEVELOPMENT PROMPT — Nachhilfezentrum Platform (.NET 10, Clean Architecture + DDD)

## Role
You are a senior .NET backend architect. Build the backend for a marketing + e-learning platform for a **Nachhilfezentrum** (private tutoring / coaching center). The platform's primary goals are: (1) build public visibility and trust for the center, (2) attract and convert prospective students/parents, (3) publish subject-based tests/exams that showcase teaching quality and generate leads, and (4) clearly communicate that the center offers **coaching/mentoring services in addition to tutoring**.

## Tech Stack
- .NET 10, C# (latest language features)
- Clean Architecture (Domain, Application, Infrastructure, Presentation/API layers)
- Domain-Driven Design (DDD) — rich domain models, aggregates, value objects, domain events
- Entity Framework Core 9/10 with **SQL Server** (decided)
- MediatR for CQRS (Commands/Queries)
- FluentValidation for input validation
- ASP.NET Core Identity + JWT (access + refresh tokens) for authentication
- AutoMapper or Mapster for DTO mapping
- Serilog for structured logging
- xUnit + FluentAssertions + Moq/NSubstitute for testing
- Swagger/OpenAPI for API documentation

## Architecture Requirements

### Layering (strict dependency rule: dependencies point inward)
1. **Domain** — Entities, Value Objects, Aggregates, Domain Events, Domain Exceptions, Enums, Specifications. Zero dependencies on other layers or external packages (besides minimal base abstractions).
2. **Application** — Use cases as CQRS Commands/Queries + Handlers (MediatR), DTOs, interfaces for infrastructure (repositories, email service, file storage, etc.), validation (FluentValidation), application-level exceptions, mapping profiles.
3. **Infrastructure** — EF Core DbContext, repository implementations, external service integrations (email/SMTP, file storage, future payment provider), Identity configuration, migrations.
4. **API (Presentation)** — Minimal APIs or Controllers, API versioning, middleware (exception handling, logging, CORS), DI registration, Swagger config.

### DDD Building Blocks to Model
Design the domain so it stays flexible for future expansion (more subjects, more question types, future membership tiers) without major rewrites. Suggested aggregates/entities (adapt as needed, use your judgment on bounded contexts):

- **Subject** (Branş) — e.g., Mathematics, German, English, etc. Must be easily extensible — admin can add new subjects without code changes.
- **CoachingProgram / Service** — represents tutoring vs. coaching/mentoring offerings, each with its own description, target audience, and marketing content. Model this as a first-class concept, not an afterthought — the business explicitly wants coaching distinguished from regular tutoring.
- **Test / Exam (Assessment)** — an aggregate root containing metadata (title, subject, difficulty, description, estimated duration, visibility rule) and a collection of Questions.
- **Question** — design this as an extensible/polymorphic concept from day one. We do NOT yet know the final mix of question types (multiple choice, open-ended/free text, file upload, etc.) — use a strategy/inheritance/discriminator pattern (e.g., abstract `Question` base with `QuestionType` discriminator and EF Core TPH/TPT or a JSON-based flexible answer schema) so new question types can be added later WITHOUT breaking existing data or requiring a full rewrite. Document this extensibility decision clearly in code comments.
- **Attempt / Submission** — records a user's (anonymous or registered) attempt at a Test, their answers, and a grading result. Grading should be abstracted behind an `IGradingStrategy` (or similar) interface — auto-gradable question types calculate a score immediately; types that need manual review get a "Pending Review" status. Don't hardcode the assumption that everything is auto-graded.
- **AccessPolicy / VisibilityRule (Value Object)** — encapsulates whether a Test/content is `Public` or `RequiresMembership` (future-proofing for a Free/Pro tier later). Build this as a simple enum/value object now (e.g., `ContentVisibility.Public`), but design the Application layer's authorization checks so a `Premium`/`Pro` tier can be added later by extending the enum and adding a policy handler — without restructuring the domain.
- **User / Student / Parent / Tutor-Coach (Profile)** — built on top of ASP.NET Core Identity, extended with domain profile data (role: Student, Parent, Tutor, Coach, Admin).
- **Lead / Inquiry** — captures contact-form / "request info" submissions from prospective students/parents (name, contact info, subject of interest, message) — important for the marketing/lead-gen goal of the site.
- **Testimonial / SuccessStory** (optional but recommended) — for social proof on the marketing pages.

### Membership & Monetization (build flexible, do not over-engineer now)
- Today: the platform is open/public — no paywall.
- Design requirement: introduce a `MembershipTier` concept (e.g., `Free`, `Pro`) as a simple, swappable concern in the Application layer (e.g., an `IAccessControlService` checked before serving Test content) so that:
  - Adding a "Pro-only" tier later requires no Domain changes, only enabling existing policy logic.
  - Payment/subscription integration (e.g., Stripe) can be plugged into Infrastructure later via an `IPaymentGateway` interface that does not yet need a concrete implementation — just leave the seam.
- Do not build billing, invoicing, or a payment provider integration now. Just don't block the door.

## Functional Modules to Implement
1. **Public Content / Marketing API** — endpoints for homepage content, about the center, list of subjects offered, list of coaching/mentoring programs offered (distinct from regular tutoring), staff/tutor profiles, testimonials, contact/lead-capture form submission.
2. **Test/Exam Catalog API** — list/browse tests by subject, get test details, start an attempt, submit answers, get results (immediate if auto-gradable, "pending" otherwise).
3. **Auth API** — registration, login, JWT issuance/refresh, password reset, email confirmation. Support anonymous test-taking AND registered-user test-taking (track attempts against a user when logged in).
4. **Admin API** (consumed by the separate Admin Panel frontend) — full CRUD for Subjects, CoachingPrograms, Tests, Questions, Testimonials, Leads (view/manage inquiries), Users/Roles, and basic site content (hero text, announcements). Must enforce Admin-only authorization (role-based + policy-based).
5. **Lead/Inquiry Management** — store and allow admin to view/respond/mark-status on contact form submissions.

## Cross-Cutting Concerns
- Global exception handling middleware → consistent `ProblemDetails` error responses.
- Result pattern (e.g., `Result<T>`) in the Application layer instead of throwing exceptions for expected business failures.
- Pagination, filtering, and sorting support for all "list" endpoints (subjects, tests, leads, etc.) via a reusable query-spec pattern.
- API versioning from day one (`/api/v1/...`).
- CORS configured for the Angular frontend's origin(s).
- Rate limiting on public endpoints (especially lead-capture forms and test submission) to prevent abuse.
- Localization-ready strings (the center likely serves German-speaking users — keep resource strings extractable, default content language: German, but don't hardcode text in a way that blocks future i18n).
- Audit fields (CreatedAt, UpdatedAt, CreatedBy) on all entities via a shared base class/interceptor.
- Soft-delete pattern for content entities (Tests, Subjects, etc.) rather than hard deletes.

## Deliverables I expect from you
1. Solution structure (folder/project layout) reflecting Clean Architecture + DDD.
2. Core domain model code for the aggregates above, including the extensible Question/Assessment design.
3. CQRS command/query examples for at least: CreateTest, SubmitAttempt, GetTestsBySubject, CreateLeadInquiry, AdminCreateSubject.
4. EF Core configuration (DbContext, entity configurations, an initial migration) reflecting the polymorphic Question design.
5. Authentication/authorization setup (JWT, role-based policies, an extensibility seam for the future Free/Pro tier).
6. Sample unit tests for at least one domain aggregate and one CQRS handler.
7. A short README explaining how to run the API locally, run migrations, and seed initial data (subjects, sample tests).

## Constraints
- Prioritize clarity and maintainability over premature optimization — this is a small-to-medium business platform, not a high-scale SaaS, but should be built cleanly enough to grow into one.
- Ask me clarifying questions before making irreversible architectural decisions (e.g., database choice, hosting target) if they aren't already specified.
- Explain key design decisions briefly as you go, especially around the extensibility points (Question types, membership tiers).
