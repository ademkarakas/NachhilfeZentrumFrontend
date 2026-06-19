import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { SubjectSummary } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';

@Component({
  selector: 'app-subject-list',
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
          <span class="eyebrow"><app-icon name="book-open" [size]="16" /> Nachhilfe</span>
          <h1>Unsere Fächer</h1>
          <p class="lead">
            Individuelle Förderung in allen Hauptfächern — vom Aufholen von Lücken bis zur
            gezielten Prüfungsvorbereitung.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        @if (loading()) {
          <app-spinner />
        } @else if (subjects().length === 0) {
          <p class="empty">Derzeit sind keine Fächer verfügbar. Schauen Sie bald wieder vorbei.</p>
        } @else {
          <div class="grid grid--3">
            @for (subject of subjects(); track subject.id) {
              <a
                [routerLink]="['/faecher', subject.slug]"
                class="link"
                appReveal
                [revealIndex]="$index"
              >
                <app-card [interactive]="true">
                  <h3>{{ subject.name }}</h3>
                  <p>{{ subject.description | stripHtml }}</p>
                  <span class="more">Mehr erfahren <app-icon name="arrow-right" [size]="18" /></span>
                </app-card>
              </a>
            }
          </div>
        }
      </div>
    </section>

    <app-cta-section
      heading="Welches Fach bereitet Schwierigkeiten?"
      subheading="Erzählen Sie uns davon — wir stellen die passende Nachhilfe zusammen."
      ctaText="Beratung anfragen"
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
        background: radial-gradient(circle, var(--color-primary-100), transparent 70%);
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
      }
      .lead {
        font-size: var(--fs-lg);
        max-width: 60ch;
      }
      .link {
        text-decoration: none;
        color: inherit;
      }
      .link h3 {
        color: var(--color-primary-dark);
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
export class SubjectListComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly subjects = signal<SubjectSummary[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.seo.update({
      title: 'Nachhilfe-Fächer',
      description: 'Alle Fächer, in denen wir individuelle Nachhilfe anbieten.',
      path: '/faecher',
    });
    this.api.getSubjects().subscribe({
      next: (s) => {
        this.subjects.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
