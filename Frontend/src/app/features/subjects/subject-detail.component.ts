import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AssessmentListItem, Subject } from '../../core/models/api.models';
import { DIFFICULTY_LABELS } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { LockIndicatorComponent } from '../../shared/ui/lock-indicator.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { VisibilityLevel } from '../../core/models/enums';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-subject-detail',
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    LockIndicatorComponent,
    SpinnerComponent,
    CtaSectionComponent,
    RevealDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-spinner />
    } @else if (subject(); as s) {
      <section class="hero-band">
        <div class="container">
          <div appReveal>
            <a routerLink="/faecher" class="back">← Alle Fächer</a>
            <span class="eyebrow">Nachhilfe</span>
            <h1>{{ s.name }}</h1>
            <div class="lead rich-content" [innerHTML]="s.description"></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 appReveal>Übungstests in {{ s.name }}</h2>
          @if (tests().length === 0) {
            <p class="empty">Für dieses Fach sind noch keine Tests veröffentlicht.</p>
          } @else {
            <div class="grid grid--3">
              @for (test of tests(); track test.id) {
                <a
                  [routerLink]="['/tests', test.slug]"
                  class="link"
                  appReveal
                  [revealIndex]="$index"
                >
                  <app-card [interactive]="true">
                    <div class="row">
                      <app-badge tone="primary">{{ difficultyLabel(test) }}</app-badge>
                      <app-lock-indicator
                        [requiresMembership]="test.visibilityLevel === Visibility.RequiresMembership"
                      />
                    </div>
                    <h3>{{ test.title }}</h3>
                    <p class="meta">
                      {{ test.questionCount }} Fragen · {{ test.estimatedDurationMinutes }} Min ·
                      {{ test.totalPoints }} Punkte
                    </p>
                  </app-card>
                </a>
              }
            </div>
          }
        </div>
      </section>

      <app-cta-section
        heading="Nachhilfe in {{ s.name }} gesucht?"
        ctaText="Unverbindlich anfragen"
      />
    } @else {
      <div class="container section">
        <p class="empty">Dieses Fach wurde nicht gefunden.</p>
        <a routerLink="/faecher">← Zurück zur Übersicht</a>
      </div>
    }
  `,
  styles: [
    `
      .hero-band {
        position: relative;
        overflow: hidden;
        background: var(--grad-hero);
        padding: clamp(var(--space-10), 8vw, var(--space-12)) 0;
        border-bottom: 1px solid var(--color-line);
      }
      .hero-band::before {
        content: '';
        position: absolute;
        width: 420px;
        height: 420px;
        top: -170px;
        right: -120px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--color-primary-100), transparent 70%);
        filter: blur(70px);
        opacity: 0.55;
        pointer-events: none;
      }
      .hero-band .container {
        position: relative;
        z-index: 1;
      }
      .back {
        display: inline-block;
        margin-bottom: var(--space-3);
        font-weight: 600;
      }
      .lead {
        font-size: var(--fs-lg);
        max-width: 60ch;
      }
      .link {
        text-decoration: none;
        color: inherit;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--space-2);
      }
      .meta {
        color: var(--color-muted);
        font-size: var(--fs-sm);
      }
      .empty {
        color: var(--color-muted);
      }
    `,
  ],
})
export class SubjectDetailComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  /** Bound from the route param via withComponentInputBinding. */
  readonly slug = input.required<string>();

  readonly subject = signal<Subject | null>(null);
  readonly tests = signal<AssessmentListItem[]>([]);
  readonly loading = signal(true);
  protected readonly Visibility = VisibilityLevel;

  ngOnInit(): void {
    this.api.getSubject(this.slug()).subscribe({
      next: (s) => {
        this.subject.set(s);
        this.loading.set(false);
        this.seo.update({
          title: `Nachhilfe ${s.name}`,
          description: s.description,
          path: `/faecher/${s.slug}`,
        });
        this.api.getTestsBySubject(s.id).subscribe((t) => this.tests.set(t));
      },
      error: () => this.loading.set(false),
    });
  }

  difficultyLabel(test: AssessmentListItem): string {
    return DIFFICULTY_LABELS[test.difficulty];
  }
}
