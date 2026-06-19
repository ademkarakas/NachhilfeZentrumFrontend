import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-datenschutz',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container narrow">
        <h1>Datenschutzerklärung</h1>
      </div>
    </section>

    <section class="section">
      <div class="container narrow legal-content">
        <h2>1. Verantwortlicher</h2>
        <!-- TODO: Echte Firmendaten eintragen -->
        <p>
          Nachhilfezentrum [Firmenname]<br />
          Musterstraße 1<br />
          00000 Musterstadt<br />
          E-Mail: info&#64;nachhilfezentrum.de<br />
          Telefon: +49 (0) 000 000 000
        </p>

        <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
        <p>
          Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
          personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        <p>
          Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich.
          Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf
          freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte
          weitergegeben.
        </p>

        <h2>3. Rechtsgrundlagen der Verarbeitung</h2>
        <p>
          Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage der folgenden
          Rechtsgrundlagen:
        </p>
        <ul>
          <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> — Einwilligung der betroffenen Person</li>
          <li>
            <strong>Art. 6 Abs. 1 lit. b DSGVO</strong> — Erfüllung eines Vertrages oder
            vorvertragliche Maßnahmen
          </li>
          <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> — Berechtigtes Interesse</li>
        </ul>

        <h2>4. SSL/TLS-Verschlüsselung</h2>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine
          verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von
          „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
        </p>

        <h2>5. Server-Logfiles</h2>
        <p>
          Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten
          Server-Logfiles, die Ihr Browser automatisch an uns übermittelt. Dies sind:
        </p>
        <ul>
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse (anonymisiert)</li>
        </ul>
        <p>
          Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung dieser Daten
          mit anderen Datenquellen wird nicht vorgenommen. Die Daten werden nach 14 Tagen gelöscht.
          Grundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät
          gespeichert werden. Einige Cookies sind technisch notwendig (essenzielle Cookies), andere
          werden für statistische Zwecke oder Marketingzwecke eingesetzt.
        </p>
        <p>
          Sie können Ihre Cookie-Einstellungen jederzeit über unseren Cookie-Banner anpassen oder
          widerrufen. Essenzielle Cookies können nicht deaktiviert werden, da sie für den
          grundlegenden Betrieb der Website erforderlich sind.
        </p>
        <p>Wir verwenden folgende Cookie-Kategorien:</p>
        <ul>
          <li>
            <strong>Essenzielle Cookies</strong> — Für die Grundfunktion der Website erforderlich
            (z.B. Anmeldung, Cookie-Einstellungen)
          </li>
          <li>
            <strong>Statistik-Cookies</strong> — Helfen uns zu verstehen, wie Besucher die Website
            nutzen (nur mit Ihrer Einwilligung)
          </li>
          <li>
            <strong>Marketing-Cookies</strong> — Werden verwendet, um relevante Inhalte anzuzeigen
            (nur mit Ihrer Einwilligung)
          </li>
        </ul>
        <p>
          Rechtsgrundlage für essenzielle Cookies ist Art. 6 Abs. 1 lit. f DSGVO. Für alle anderen
          Cookies ist die Rechtsgrundlage Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
        </p>

        <h2>7. Kontaktformular</h2>
        <p>
          Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
          Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der
          Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir
          nicht ohne Ihre Einwilligung weiter.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6
          Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung Ihrer Anfrage).
        </p>

        <h2>8. Registrierung / Benutzerkonto</h2>
        <p>
          Sie können auf unserer Website ein Benutzerkonto anlegen. Die im Rahmen der Registrierung
          erhobenen Daten (E-Mail-Adresse, Passwort) werden für die Bereitstellung des
          Benutzerkontos verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          Sie können Ihr Benutzerkonto jederzeit löschen lassen. Wenden Sie sich dazu an die oben
          genannten Kontaktdaten.
        </p>

        <h2>9. Ihre Rechte als betroffene Person</h2>
        <p>Sie haben folgende Rechte gegenüber uns:</p>
        <ul>
          <li>
            <strong>Auskunftsrecht</strong> (Art. 15 DSGVO) — Recht auf Auskunft über Ihre
            gespeicherten Daten
          </li>
          <li>
            <strong>Berichtigungsrecht</strong> (Art. 16 DSGVO) — Recht auf Korrektur unrichtiger
            Daten
          </li>
          <li><strong>Löschungsrecht</strong> (Art. 17 DSGVO) — Recht auf Löschung Ihrer Daten</li>
          <li>
            <strong>Einschränkung</strong> (Art. 18 DSGVO) — Recht auf Einschränkung der
            Verarbeitung
          </li>
          <li>
            <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO) — Recht auf Übertragung Ihrer
            Daten
          </li>
          <li>
            <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) — Recht auf Widerspruch gegen die
            Verarbeitung
          </li>
        </ul>

        <h2>10. Widerrufsrecht bei Einwilligungen</h2>
        <p>
          Sofern die Verarbeitung Ihrer Daten auf einer Einwilligung beruht, haben Sie das Recht,
          diese Einwilligung jederzeit zu widerrufen. Die Rechtmäßigkeit der bis zum Widerruf
          erfolgten Verarbeitung bleibt davon unberührt.
        </p>

        <h2>11. Beschwerderecht bei einer Aufsichtsbehörde</h2>
        <p>
          Unbeschadet eines anderweitigen verwaltungsrechtlichen oder gerichtlichen Rechtsbehelfs
          steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu, wenn Sie der Ansicht
          sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.
        </p>
        <!-- TODO: Zuständige Aufsichtsbehörde eintragen -->

        <h2>12. Aktualität und Änderung dieser Datenschutzerklärung</h2>
        <p>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Juni 2026. Durch die
          Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw. behördlicher
          Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
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
    `,
  ],
})
export class DatenschutzComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Datenschutzerklärung',
      description:
        'Datenschutzerklärung des Nachhilfezentrums — Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.',
      path: '/datenschutz',
    });
  }
}
