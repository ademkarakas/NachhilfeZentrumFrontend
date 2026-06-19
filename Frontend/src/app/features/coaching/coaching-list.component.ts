import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { CoachingProgramSummary } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';

/**
 * Coaching is a SEPARATE service line from tutoring — its own page, its own visual
 * identity (coaching accent colour). Never a tab under Subjects.
 */
@Component({
  selector: 'app-coaching-list',
  imports: [
    RouterLink,
    CardComponent,
    SpinnerComponent,
    CtaSectionComponent,
    RevealDirective,
    IconComponent,
    StripHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container">
        <div appReveal>
          <span class="eyebrow"><app-icon name="compass" [size]="16" /> Coaching & Mentoring</span>
          <h1>Lerncoaching für nachhaltigen Erfolg</h1>
          <p class="lead">
            Unser Coaching ist kein Fachunterricht. Wir arbeiten an dem, was Lernen erst möglich
            macht: Motivation, Lernstrategien, Selbstorganisation und der Umgang mit Prüfungsdruck.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        @if (loading()) {
          <app-spinner />
        } @else if (programs().length === 0) {
          <p class="empty">Derzeit sind keine Coaching-Programme verfügbar.</p>
        } @else {
          <div class="grid grid--3">
            @for (program of programs(); track program.id) {
              <a
                [routerLink]="['/coaching', program.slug]"
                class="link"
                appReveal
                [revealIndex]="$index"
              >
                <app-card [interactive]="true">
                  <span class="audience">{{ program.targetAudience }}</span>
                  <h3>{{ program.title }}</h3>
                  <p>{{ program.description | stripHtml }}</p>
                  <span class="more">Programm ansehen <app-icon name="arrow-right" [size]="18" /></span>
                </app-card>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <app-cta-section
      heading="Lernen blockiert? Wir helfen weiter."
      subheading="Im Erstgespräch finden wir heraus, welches Coaching am besten passt."
      ctaText="Coaching-Erstgespräch"
      [coaching]="true"
    />
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
        background: radial-gradient(circle, var(--color-coaching-100), transparent 70%);
        filter: blur(70px);
        opacity: 0.55;
        pointer-events: none;
      }
      .hero-band .container {
        position: relative;
        z-index: 1;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        color: var(--color-coaching);
      }
      .lead {
        font-size: var(--fs-lg);
        max-width: 62ch;
      }
      .link {
        text-decoration: none;
        color: inherit;
      }
      .link h3 {
        color: var(--color-coaching-dark);
      }
      .audience {
        font-size: var(--fs-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-coaching);
      }
      .more {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        font-weight: 700;
        color: var(--color-coaching);
      }
      .empty {
        color: var(--color-muted);
        text-align: center;
      }
    `,
  ],
})
export class CoachingListComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly programs = signal<CoachingProgramSummary[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.seo.update({
      title: 'Lerncoaching & Mentoring',
      description:
        'Coaching-Programme für Motivation, Lernstrategien, Zeitmanagement und Prüfungsangst — getrennt von der fachlichen Nachhilfe.',
      path: '/coaching',
    });
    this.api.getCoachingPrograms().subscribe({
      next: (p) => {
        this.programs.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
