import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PublicApiService } from '../../core/api/public-api.service';
import { Testimonial } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';

@Component({
  selector: 'app-about',
  imports: [TestimonialCardComponent, CtaSectionComponent, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow" appReveal>
        <span class="eyebrow">Über uns</span>
        <h1>Lernen, das wirkt</h1>
        <p class="lead">
          Das Nachhilfezentrum verbindet zwei Dinge, die selten zusammenkommen: solide fachliche
          Nachhilfe und echtes Lerncoaching. Wir glauben, dass gute Noten nicht nur eine Frage des
          Stoffs sind, sondern auch von Motivation, Selbstvertrauen und der richtigen Lernstrategie.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid--3">
          <div class="value" appReveal [revealIndex]="0">
            <span class="value__icon"><app-icon name="target" [size]="22" /></span>
            <h3>Individuell</h3>
            <p>Kein Schema F: Jede Förderung beginnt mit einer ehrlichen Standortbestimmung.</p>
          </div>
          <div class="value" appReveal [revealIndex]="1">
            <span class="value__icon"><app-icon name="sparkles" [size]="22" /></span>
            <h3>Zwei Angebote</h3>
            <p>
              Fachliche Nachhilfe und Coaching stehen gleichwertig nebeneinander — je nachdem, was
              gebraucht wird.
            </p>
          </div>
          <div class="value" appReveal [revealIndex]="2">
            <span class="value__icon"><app-icon name="check" [size]="22" /></span>
            <h3>Messbar</h3>
            <p>Mit unseren Tests machen wir Fortschritt sichtbar — für Schüler:innen und Eltern.</p>
          </div>
        </div>
      </div>
    </section>

    @if (testimonials().length) {
      <section class="section section--alt">
        <div class="container">
          <div class="section__head" appReveal><h2>Stimmen aus der Praxis</h2></div>
          <div class="grid grid--3">
            @for (t of testimonials(); track t.id) {
              <app-testimonial-card [testimonial]="t" appReveal [revealIndex]="$index" />
            }
          </div>
        </div>
      </section>
    }

    <app-cta-section heading="Lernen Sie uns persönlich kennen" ctaText="Erstgespräch vereinbaren" />
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
      .narrow {
        max-width: 760px;
      }
      .lead {
        font-size: var(--fs-lg);
      }
      .value__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--radius);
        margin-bottom: var(--space-3);
        background: var(--color-primary-50);
        color: var(--color-primary);
      }
      .value h3 {
        color: var(--color-primary-dark);
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly testimonials = signal<Testimonial[]>([]);

  ngOnInit(): void {
    this.seo.update({
      title: 'Über uns',
      description:
        'Das Nachhilfezentrum verbindet fachliche Nachhilfe mit professionellem Lerncoaching.',
      path: '/ueber-uns',
    });
    this.api.getTestimonials().subscribe((t) => this.testimonials.set(t));
  }
}
