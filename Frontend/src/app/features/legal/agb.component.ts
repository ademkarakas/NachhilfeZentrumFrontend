import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-agb',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow">
        <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
      </div>
    </section>

    <section class="section">
      <div class="container narrow legal-content">
        <h2>§ 1 Geltungsbereich</h2>
        <!-- TODO: Anpassen an tatsächliches Angebot -->
        <p>
          Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen dem
          Nachhilfezentrum [Firmenname] (nachfolgend „Anbieter") und dem Kunden über die Nutzung der
          auf dieser Website angebotenen Dienstleistungen.
        </p>
        <p>
          Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter
          stimmt ihrer Geltung ausdrücklich schriftlich zu.
        </p>

        <h2>§ 2 Vertragsschluss</h2>
        <p>
          Die Darstellung der Dienstleistungen auf der Website stellt kein rechtlich bindendes
          Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots (invitatio ad
          offerendum).
        </p>
        <p>
          Ein Vertrag kommt zustande, wenn der Anbieter die Anmeldung des Kunden bestätigt oder die
          Dienstleistung erbringt.
        </p>

        <h2>§ 3 Leistungsbeschreibung</h2>
        <p>Der Anbieter erbringt folgende Leistungen:</p>
        <ul>
          <li>Individuelle Nachhilfe in verschiedenen Schulfächern</li>
          <li>Lerncoaching und Mentoring</li>
          <li>Online-Tests und Übungsaufgaben zur Lernstandserhebung</li>
        </ul>
        <p>
          Der genaue Umfang der Leistungen ergibt sich aus der jeweiligen Leistungsbeschreibung zum
          Zeitpunkt der Buchung.
        </p>

        <h2>§ 4 Preise und Zahlung</h2>
        <!-- TODO: Konkrete Preisgestaltung ergänzen -->
        <p>
          Es gelten die zum Zeitpunkt der Buchung auf der Website angegebenen Preise. Alle Preise
          verstehen sich inklusive der gesetzlichen Mehrwertsteuer, sofern nicht anders angegeben.
        </p>
        <p>
          Die Zahlung erfolgt per [Zahlungsarten]. Der Rechnungsbetrag ist innerhalb von 14 Tagen
          nach Rechnungsstellung fällig.
        </p>

        <h2>§ 5 Widerrufsrecht</h2>
        <p>
          Verbraucher haben bei Fernabsatzverträgen ein gesetzliches Widerrufsrecht. Sie können Ihre
          Vertragserklärung innerhalb von 14 Tagen ohne Angabe von Gründen in Textform (z.B. Brief,
          E-Mail) widerrufen. Die Frist beginnt nach Erhalt dieser Belehrung in Textform.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist genügt die rechtzeitige Absendung des Widerrufs. Der
          Widerruf ist zu richten an:
        </p>
        <!-- TODO: Kontaktdaten für Widerruf -->
        <p>
          Nachhilfezentrum [Firmenname]<br />
          Musterstraße 1<br />
          00000 Musterstadt<br />
          E-Mail: info&#64;nachhilfezentrum.de
        </p>

        <h2>§ 6 Kündigung</h2>
        <p>
          Laufende Nachhilfeverträge können mit einer Frist von [Frist] zum Monatsende gekündigt
          werden. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        </p>

        <h2>§ 7 Haftung</h2>
        <p>
          Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter
          Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten
          (Kardinalpflichten) und beschränkt auf den vorhersehbaren, vertragstypischen Schaden.
        </p>
        <p>
          Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit
          bleibt von den vorstehenden Einschränkungen unberührt.
        </p>

        <h2>§ 8 Datenschutz</h2>
        <p>
          Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer
          <a routerLink="/datenschutz">Datenschutzerklärung</a>.
        </p>

        <h2>§ 9 Schlussbestimmungen</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ist
          der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches
          Sondervermögen, ist Gerichtsstand der Sitz des Anbieters.
        </p>
        <p>
          Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so bleibt die
          Wirksamkeit der übrigen Bestimmungen davon unberührt.
        </p>

        <p class="legal-date">Stand: Juni 2026</p>
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
      .legal-content p,
      .legal-content ul {
        line-height: 1.7;
        margin-bottom: var(--space-4);
      }
      .legal-content ul {
        padding-left: var(--space-6);
      }
      .legal-content li {
        margin-bottom: var(--space-2);
      }
      .legal-content a {
        color: var(--color-primary);
        text-decoration: underline;
      }
      .legal-date {
        margin-top: var(--space-10);
        color: var(--color-neutral-500);
        font-style: italic;
      }
    `,
  ],
})
export class AgbComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'AGB',
      description:
        'Allgemeine Geschäftsbedingungen des Nachhilfezentrums — Vertragsbedingungen für Nachhilfe und Coaching.',
      path: '/agb',
    });
  }
}
