import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-impressum',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow">
        <h1>Impressum</h1>
      </div>
    </section>

    <section class="section">
      <div class="container narrow legal-content">
        <h2>Angaben gemäß § 5 TMG</h2>
        <!-- TODO: Echte Firmendaten eintragen -->
        <p>
          Nachhilfezentrum [Firmenname]<br />
          [Rechtsform, z.B. Einzelunternehmen / GmbH]<br />
          Musterstraße 1<br />
          00000 Musterstadt
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: +49 (0) 000 000 000<br />
          E-Mail: info&#64;nachhilfezentrum.de
        </p>

        <h2>Vertreten durch</h2>
        <!-- TODO: Name der vertretungsberechtigten Person -->
        <p>[Vor- und Nachname der vertretungsberechtigten Person]</p>

        <h2>Registereintrag</h2>
        <!-- TODO: Falls im Handelsregister eingetragen -->
        <p>
          Eintragung im Handelsregister.<br />
          Registergericht: [Amtsgericht]<br />
          Registernummer: [HRB-Nummer]
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <!-- TODO: Falls vorhanden -->
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE [Nummer]
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <!-- TODO: Inhaltlich Verantwortliche Person -->
        <p>
          [Vor- und Nachname]<br />
          Musterstraße 1<br />
          00000 Musterstadt
        </p>

        <h2>EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"
            >https://ec.europa.eu/consumers/odr/</a
          >.<br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-band {
        background: var(--color-primary-50);
        padding: var(--space-10) 0 var(--space-8);
      }
      .narrow {
        max-width: 760px;
      }
      .legal-content h2 {
        margin-top: var(--space-8);
        margin-bottom: var(--space-3);
        font-size: var(--fs-xl);
        color: var(--color-primary-dark);
      }
      .legal-content p {
        line-height: 1.7;
        margin-bottom: var(--space-4);
      }
      .legal-content a {
        color: var(--color-primary);
        text-decoration: underline;
      }
    `,
  ],
})
export class ImpressumComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Impressum',
      description: 'Impressum und rechtliche Angaben des Nachhilfezentrums gemäß § 5 TMG.',
      path: '/impressum',
    });
  }
}
