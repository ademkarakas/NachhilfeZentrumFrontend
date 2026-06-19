import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AssessmentListItem, SubjectSummary } from '../../core/models/api.models';
import { AssessmentDifficulty, DIFFICULTY_LABELS, VisibilityLevel } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { CardComponent } from '../../shared/ui/card.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { LockIndicatorComponent } from '../../shared/ui/lock-indicator.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-test-catalog',
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    LockIndicatorComponent,
    SpinnerComponent,
    RevealDirective,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container" appReveal>
        <span class="eyebrow">E-Learning</span>
        <h1>Tests & Übungen</h1>
        <p class="lead">
          Probiere unsere fachbezogenen Tests aus — kostenlos und ohne Anmeldung. So siehst du
          unsere Qualität und deinen aktuellen Stand.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="filters">
          <label>
            <span class="sr-only">Nach Fach filtern</span>
            <select [value]="subjectFilter()" (change)="onSubject($event)">
              <option value="">Alle Fächer</option>
              @for (s of subjects(); track s.id) {
                <option [value]="s.id">{{ s.name }}</option>
              }
            </select>
          </label>
        </div>

        @if (loading()) {
          <app-spinner />
        } @else if (filtered().length === 0) {
          <p class="empty">Keine Tests gefunden.</p>
        } @else {
          <div class="grid grid--3">
            @for (test of filtered(); track test.id) {
              <a
                [routerLink]="['/tests', test.slug]"
                class="link"
                appReveal
                [revealIndex]="$index"
              >
                <app-card [interactive]="true">
                  <div class="row">
                    <app-badge tone="primary">{{ difficultyLabel(test.difficulty) }}</app-badge>
                    <app-lock-indicator
                      [requiresMembership]="test.visibilityLevel === Visibility.RequiresMembership"
                    />
                  </div>
                  <h3>{{ test.title }}</h3>
                  <p class="meta">
                    <app-icon name="clock" [size]="15" />
                    {{ test.questionCount }} Fragen · {{ test.estimatedDurationMinutes }} Min ·
                    {{ test.totalPoints }} Punkte
                  </p>
                  <span class="more">
                    Test starten
                    <app-icon name="arrow-right" [size]="16" />
                  </span>
                </app-card>
              </a>
            }
          </div>
        }
      </div>
    </section>
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
      .lead {
        font-size: var(--fs-lg);
        max-width: 60ch;
      }
      .filters {
        margin-bottom: var(--space-6);
      }
      select {
        font: inherit;
        padding: 0.5rem 0.9rem;
        border: 1px solid var(--color-line);
        border-radius: var(--radius-sm);
        background: var(--color-surface);
        color: var(--color-ink);
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
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        color: var(--color-muted);
        font-size: var(--fs-sm);
      }
      .more {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        font-weight: 700;
        color: var(--color-primary);
      }
      .empty {
        text-align: center;
        color: var(--color-muted);
      }
    `,
  ],
})
export class TestCatalogComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly tests = signal<AssessmentListItem[]>([]);
  readonly subjects = signal<SubjectSummary[]>([]);
  readonly subjectFilter = signal('');
  readonly loading = signal(true);
  protected readonly Visibility = VisibilityLevel;

  readonly filtered = computed(() => {
    const id = this.subjectFilter();
    return id ? this.tests().filter((t) => t.subjectId === id) : this.tests();
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Tests & Übungen',
      description: 'Kostenlose fachbezogene Übungstests — ohne Anmeldung ausprobieren.',
      path: '/tests',
    });
    this.api.getTestCatalog().subscribe({
      next: (t) => {
        this.tests.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getSubjects().subscribe((s) => this.subjects.set(s));
  }

  onSubject(event: Event): void {
    this.subjectFilter.set((event.target as HTMLSelectElement).value);
  }

  difficultyLabel(d: AssessmentDifficulty): string {
    return DIFFICULTY_LABELS[d];
  }
}
