import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [RouterLink, RevealDirective, CtaSectionComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow" appReveal>
        <span class="eyebrow"><app-icon name="message-square" [size]="16" /> Häufige Fragen</span>
        <h1>FAQ — Ihre Fragen, unsere Antworten</h1>
        <p class="lead">
          Alles Wichtige rund um Nachhilfe, Coaching, Ablauf und Preise auf einen Blick.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        @for (item of faqItems; track item.question; let i = $index) {
          <details class="faq" appReveal [revealIndex]="i">
            <summary class="faq__q">
              <span>{{ item.question }}</span>
              <app-icon name="chevron-down" [size]="20" />
            </summary>
            <div class="faq__a">
              <p>{{ item.answer }}</p>
            </div>
          </details>
        }
      </div>
    </section>

    <section class="section section--alt">
      <div class="container narrow" appReveal>
        <div class="faq-contact">
          <h2>Noch Fragen?</h2>
          <p>Wir helfen Ihnen gerne persönlich weiter — rufen Sie uns an oder schreiben Sie uns.</p>
          <a routerLink="/kontakt" class="faq-contact__link">
            Kontakt aufnehmen <app-icon name="arrow-right" [size]="18" />
          </a>
        </div>
      </div>
    </section>

    <app-cta-section
      heading="Jetzt kostenlose Probestunde sichern"
      subheading="Lernen Sie uns unverbindlich kennen — wir beraten Sie gerne."
      ctaText="Gratis Probestunde"
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
      .faq {
        border: 1px solid var(--color-line);
        border-radius: var(--radius);
        margin-bottom: var(--space-3);
        background: var(--color-surface);
        overflow: hidden;
        transition:
          border-color var(--dur-fast) var(--ease-out),
          box-shadow var(--dur-fast) var(--ease-out);
      }
      .faq:hover {
        border-color: var(--color-line-strong);
      }
      .faq[open] {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary);
      }
      .faq__q {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-4) var(--space-5);
        font-weight: 700;
        font-size: var(--fs-lg);
        color: var(--color-ink);
        cursor: pointer;
        list-style: none;
      }
      .faq__q::-webkit-details-marker {
        display: none;
      }
      .faq__q::marker {
        content: '';
      }
      .faq__q app-icon {
        flex-shrink: 0;
        color: var(--color-muted);
        transition: transform var(--dur-base) var(--ease-out);
      }
      .faq[open] .faq__q app-icon {
        transform: rotate(180deg);
        color: var(--color-primary);
      }
      .faq__a {
        padding: 0 var(--space-5) var(--space-5);
        color: var(--color-body);
        line-height: var(--lh-base);
      }
      .faq__a p {
        margin: 0;
      }
      .faq-contact {
        text-align: center;
      }
      .faq-contact h2 {
        margin-bottom: var(--space-2);
      }
      .faq-contact p {
        color: var(--color-body);
        margin-bottom: var(--space-4);
      }
      .faq-contact__link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-primary);
        font-weight: 700;
        text-decoration: none;
      }
      .faq-contact__link:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class FaqComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly faqItems: FaqItem[] = [
    {
      question: 'Wie läuft die kostenlose Probestunde ab?',
      answer:
        'Vereinbaren Sie einen Termin über unser Kontaktformular oder telefonisch. In der Probestunde lernt Ihr Kind die Lehrkraft kennen, wir ermitteln den aktuellen Wissensstand und besprechen gemeinsam die Lernziele — völlig unverbindlich.',
    },
    {
      question: 'Was kostet Nachhilfe bei Ihnen?',
      answer:
        'Die Preise richten sich nach Unterrichtsform (Einzel oder Gruppe), Fach und Klassenstufe. Einzelnachhilfe beginnt ab 35 € pro Stunde, Gruppenunterricht ab 19 € pro Stunde. Detaillierte Infos finden Sie auf unserer Preise-Seite.',
    },
    {
      question: 'Was ist der Unterschied zwischen Nachhilfe und Coaching?',
      answer:
        'Nachhilfe konzentriert sich auf fachliche Inhalte (z. B. Mathe, Deutsch, Englisch). Coaching dagegen arbeitet an überfachlichen Kompetenzen: Lernstrategien, Zeitmanagement, Motivation und Umgang mit Prüfungsangst. Beide Angebote stehen gleichwertig nebeneinander und können kombiniert werden.',
    },
    {
      question: 'Wie oft sollte mein Kind zur Nachhilfe kommen?',
      answer:
        'Wir empfehlen mindestens eine Stunde pro Woche, um nachhaltige Fortschritte zu erzielen. Je nach Bedarf und Zielsetzung (z. B. Prüfungsvorbereitung) kann die Frequenz angepasst werden.',
    },
    {
      question: 'Findet der Unterricht online oder vor Ort statt?',
      answer:
        'Beides ist möglich. Wir bieten Präsenzunterricht in unserem Zentrum sowie Online-Nachhilfe per Videokonferenz an — flexibel nach Ihren Wünschen.',
    },
    {
      question: 'Welche Fächer bieten Sie an?',
      answer:
        'Unser Angebot umfasst alle gängigen Schulfächer: Mathematik, Deutsch, Englisch, Französisch, Physik, Chemie, Biologie und weitere. Die aktuelle Fächerübersicht finden Sie auf unserer Nachhilfe-Seite.',
    },
    {
      question: 'Wer sind Ihre Lehrkräfte?',
      answer:
        'Unsere Lehrkräfte sind qualifizierte Pädagog:innen, Lehramtsstudierende und Fachexpert:innen mit Nachhilfeerfahrung. Jede Lehrkraft wird sorgfältig ausgewählt und geschult.',
    },
    {
      question: 'Gibt es eine Mindestvertragslaufzeit?',
      answer:
        'Nein. Wir arbeiten ohne langfristige Vertragsbindung. Sie können flexibel pausieren oder kündigen — Transparenz und Fairness sind uns wichtig.',
    },
    {
      question: 'Für welche Klassenstufen ist das Angebot geeignet?',
      answer:
        'Wir betreuen Schüler:innen von der Grundschule bis zum Abitur sowie Auszubildende. Die Inhalte werden individuell auf den jeweiligen Lehrplan und die Anforderungen abgestimmt.',
    },
    {
      question: 'Wie schnell kann ich mit einer Notenverbesserung rechnen?',
      answer:
        'Erste Fortschritte zeigen sich oft schon nach wenigen Wochen. Eine nachhaltige Notenverbesserung um eine ganze Note ist erfahrungsgemäß innerhalb von 3–6 Monaten bei regelmäßiger Teilnahme realistisch.',
    },
    {
      question: 'Kann ich Nachhilfe und Coaching kombinieren?',
      answer:
        'Ja, das ist sogar besonders wirkungsvoll. Fachliche Lücken schließen und gleichzeitig die Lernstrategie verbessern — so wird der Lernerfolg nachhaltig.',
    },
    {
      question: 'Wie kann ich einen Termin vereinbaren?',
      answer:
        'Nutzen Sie unser Kontaktformular, rufen Sie uns an oder schreiben Sie uns eine E-Mail. Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'FAQ — Häufig gestellte Fragen',
      description:
        'Antworten auf häufige Fragen zu Nachhilfe, Coaching, Preisen und Ablauf im Nachhilfezentrum.',
      path: '/faq',
    });

    this.seo.setStructuredData('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }
}
