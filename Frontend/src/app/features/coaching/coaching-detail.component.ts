import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { CoachingProgram } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-coaching-detail',
  imports: [
    RouterLink,
    SpinnerComponent,
    ButtonComponent,
    CtaSectionComponent,
    RevealDirective,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <app-spinner />
    } @else if (program(); as p) {
      <section class="hero-band">
        <div class="container">
          <div appReveal>
            <a routerLink="/coaching" class="back">← Alle Coaching-Programme</a>
            <span class="eyebrow"
              ><app-icon name="compass" [size]="16" /> Coaching · {{ p.targetAudience }}</span
            >
            <h1>{{ p.title }}</h1>
            <div class="lead rich-content" [innerHTML]="p.description"></div>
            @if (p.ctaText) {
              <app-button [link]="p.ctaLink || '/kontakt'" variant="coaching" size="lg">
                {{ p.ctaText }}
              </app-button>
            }
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container narrow">
          <h2 appReveal>Das nimmst du mit</h2>
          <div class="outcomes rich-content" appReveal [innerHTML]="p.outcomes"></div>
        </div>
      </section>

      <app-cta-section
        heading="Passt dieses Coaching zu dir?"
        ctaText="Jetzt Erstgespräch buchen"
        [coaching]="true"
      />
    } @else {
      <div class="container section">
        <p>Dieses Coaching-Programm wurde nicht gefunden.</p>
        <a routerLink="/coaching">← Zurück</a>
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
      .back {
        display: inline-block;
        margin-bottom: var(--space-3);
        font-weight: 600;
        color: var(--color-coaching-dark);
      }
      .lead {
        font-size: var(--fs-lg);
        max-width: 62ch;
      }
      .narrow {
        max-width: 760px;
      }
      .outcomes {
        font-size: var(--fs-lg);
        line-height: 1.7;
      }
    `,
  ],
})
export class CoachingDetailComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();
  readonly program = signal<CoachingProgram | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.getCoachingProgram(this.slug()).subscribe({
      next: (p) => {
        this.program.set(p);
        this.loading.set(false);
        this.seo.update({
          title: p.title,
          description: p.description,
          path: `/coaching/${p.slug}`,
        });
      },
      error: () => this.loading.set(false),
    });
  }
}
