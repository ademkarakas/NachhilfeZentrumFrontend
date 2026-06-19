import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';

interface PricingTier {
  title: string;
  subtitle: string;
  price: string;
  unit: string;
  features: string[];
  highlighted: boolean;
  coaching: boolean;
}

@Component({
  selector: 'app-pricing',
  imports: [RevealDirective, ButtonComponent, CtaSectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow" appReveal>
        <span class="eyebrow"><app-icon name="star" [size]="16" /> Preise</span>
        <h1>Transparente Preise, faire Konditionen</h1>
        <p class="lead">
          Keine versteckten Kosten, keine langen Verträge — investieren Sie in den Lernerfolg Ihres
          Kindes.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="pricing-grid">
          @for (tier of tiers; track tier.title; let i = $index) {
            <article
              class="tier"
              [class.tier--highlighted]="tier.highlighted"
              [class.tier--coaching]="tier.coaching"
              appReveal
              [revealIndex]="i"
            >
              @if (tier.highlighted) {
                <span class="tier__badge">Beliebt</span>
              }
              <h3 class="tier__title">{{ tier.title }}</h3>
              <p class="tier__subtitle">{{ tier.subtitle }}</p>
              <div class="tier__price">
                <span class="tier__amount">{{ tier.price }}</span>
                <span class="tier__unit">{{ tier.unit }}</span>
              </div>
              <ul class="tier__features">
                @for (feature of tier.features; track feature) {
                  <li>
                    <app-icon name="check" [size]="16" />
                    <span>{{ feature }}</span>
                  </li>
                }
              </ul>
              <app-button
                link="/kontakt"
                size="md"
                [variant]="tier.highlighted ? 'primary' : 'outline'"
              >
                Gratis Probestunde
              </app-button>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container narrow">
        <div class="includes" appReveal>
          <h2>Bei uns immer inklusive</h2>
          <div class="includes__grid">
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Kostenlose Probestunde</span>
            </div>
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Individueller Lernplan</span>
            </div>
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Regelmäßige Fortschrittsberichte</span>
            </div>
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Flexible Terminplanung</span>
            </div>
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Keine Mindestvertragslaufzeit</span>
            </div>
            <div class="includes__item">
              <app-icon name="check" [size]="18" />
              <span>Eigenes Lernmaterial inklusive</span>
            </div>
          </div>
        </div>

        <div class="note" appReveal>
          <app-icon name="alert-circle" [size]="18" />
          <p>
            Preise können je nach Fach, Klassenstufe und individuellem Bedarf variieren.
            Kontaktieren Sie uns für ein persönliches Angebot.
          </p>
        </div>
      </div>
    </section>

    <app-cta-section
      heading="Bereit für bessere Noten?"
      subheading="Starten Sie mit einer kostenlosen Probestunde — wir beraten Sie unverbindlich."
      ctaText="Jetzt Probestunde sichern"
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
      .narrow {
        max-width: 760px;
      }
      .lead {
        font-size: var(--fs-lg);
      }
      .pricing-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-5);
        align-items: start;
      }
      .tier {
        position: relative;
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        padding: var(--space-6) var(--space-5);
        text-align: center;
        transition:
          border-color var(--dur-fast) var(--ease-out),
          box-shadow var(--dur-fast) var(--ease-out);
      }
      .tier:hover {
        border-color: var(--color-line-strong);
        box-shadow: var(--shadow-md);
      }
      .tier--highlighted {
        border-color: var(--color-primary);
        box-shadow:
          0 0 0 1px var(--color-primary),
          var(--shadow-lg);
        transform: scale(1.02);
      }
      .tier--coaching {
        border-color: var(--color-coaching);
      }
      .tier--coaching:hover {
        border-color: var(--color-coaching);
      }
      .tier__badge {
        position: absolute;
        top: calc(var(--space-3) * -1);
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: #fff;
        font-size: var(--fs-xs);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: var(--ls-wide);
        padding: var(--space-1) var(--space-4);
        border-radius: var(--radius-full);
      }
      .tier__title {
        font-size: var(--fs-xl);
        color: var(--color-ink);
        margin-bottom: var(--space-1);
      }
      .tier__subtitle {
        color: var(--color-muted);
        font-size: var(--fs-sm);
        margin-bottom: var(--space-5);
      }
      .tier__price {
        margin-bottom: var(--space-5);
      }
      .tier__amount {
        font-family: var(--font-display);
        font-size: var(--fs-3xl);
        font-weight: 800;
        color: var(--color-ink);
        letter-spacing: var(--ls-tight);
      }
      .tier--coaching .tier__amount {
        color: var(--color-coaching);
      }
      .tier__unit {
        display: block;
        font-size: var(--fs-sm);
        color: var(--color-muted);
        margin-top: var(--space-1);
      }
      .tier__features {
        list-style: none;
        padding: 0;
        margin: 0 0 var(--space-6);
        text-align: left;
      }
      .tier__features li {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        padding: var(--space-2) 0;
        font-size: var(--fs-sm);
        color: var(--color-body);
      }
      .tier__features li app-icon {
        flex-shrink: 0;
        color: var(--color-primary);
        margin-top: 2px;
      }
      .tier--coaching .tier__features li app-icon {
        color: var(--color-coaching);
      }
      .includes {
        text-align: center;
        margin-bottom: var(--space-8);
      }
      .includes h2 {
        margin-bottom: var(--space-5);
      }
      .includes__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: var(--space-3);
        text-align: left;
      }
      .includes__item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        background: var(--color-surface);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-line);
        font-weight: 600;
        font-size: var(--fs-sm);
      }
      .includes__item app-icon {
        color: var(--color-primary);
        flex-shrink: 0;
      }
      .note {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-5);
        background: var(--color-surface-sunken);
        border-radius: var(--radius);
        border: 1px solid var(--color-line);
      }
      .note app-icon {
        flex-shrink: 0;
        color: var(--color-muted);
        margin-top: 2px;
      }
      .note p {
        margin: 0;
        font-size: var(--fs-sm);
        color: var(--color-body);
      }
    `,
  ],
})
export class PricingComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly tiers: PricingTier[] = [
    {
      title: 'Einzelnachhilfe',
      subtitle: 'Individuell & persönlich',
      price: 'ab 35 €',
      unit: 'pro Stunde (60 Min.)',
      features: [
        '1-zu-1 Betreuung',
        'Individueller Lernplan',
        'Flexible Terminwahl',
        'Online oder vor Ort',
        'Alle Fächer & Klassenstufen',
        'Regelmäßige Fortschrittsgespräche',
      ],
      highlighted: true,
      coaching: false,
    },
    {
      title: 'Gruppenunterricht',
      subtitle: 'Gemeinsam lernen',
      price: 'ab 19 €',
      unit: 'pro Stunde (60 Min.)',
      features: [
        'Kleine Gruppen (max. 4 Schüler)',
        'Gleiches Fach & Niveau',
        'Gegenseitige Motivation',
        'Günstiger als Einzelunterricht',
        'Feste wöchentliche Termine',
      ],
      highlighted: false,
      coaching: false,
    },
    {
      title: 'Lerncoaching',
      subtitle: 'Strategien & Motivation',
      price: 'ab 45 €',
      unit: 'pro Sitzung (60 Min.)',
      features: [
        'Lernstrategien & Zeitmanagement',
        'Motivation & Selbstvertrauen',
        'Umgang mit Prüfungsangst',
        'Individuelle Zielsetzung',
        'Kombinierbar mit Nachhilfe',
      ],
      highlighted: false,
      coaching: true,
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Preise — Nachhilfe & Coaching',
      description:
        'Transparente Preise für Einzelnachhilfe, Gruppenunterricht und Lerncoaching. Ab 19 € pro Stunde. Gratis Probestunde inklusive.',
      path: '/preise',
    });
  }
}
