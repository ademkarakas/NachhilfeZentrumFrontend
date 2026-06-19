import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../core/services/cookie-consent.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ft">
      <div class="container ft__grid">
        <div class="ft__brandcol">
          <a routerLink="/" class="ft__brand">
            <span class="ft__logo" aria-hidden="true">
              <app-icon name="graduation-cap" [size]="20" />
            </span>
            Nachhilfezentrum
          </a>
          <p class="ft__about">
            Individuelle Nachhilfe und professionelles Lerncoaching — für mehr Erfolg und
            Selbstvertrauen in Schule und Ausbildung.
          </p>
          <div class="ft__social">
            <a href="#" aria-label="Instagram" class="ft__soc"
              ><app-icon name="instagram" [size]="18"
            /></a>
            <a href="#" aria-label="Facebook" class="ft__soc"
              ><app-icon name="facebook" [size]="18"
            /></a>
          </div>
        </div>

        <nav aria-label="Nachhilfe">
          <h3>Nachhilfe</h3>
          <a routerLink="/faecher">Fächer</a>
          <a routerLink="/tests">Tests &amp; Übungen</a>
        </nav>

        <nav aria-label="Coaching">
          <h3>Coaching</h3>
          <a routerLink="/coaching">Lerncoaching</a>
        </nav>

        <nav aria-label="Unternehmen">
          <h3>Unternehmen</h3>
          <a routerLink="/ueber-uns">Über uns</a>
          <a routerLink="/team">Team</a>
          <a routerLink="/preise">Preise</a>
          <a routerLink="/faq">FAQ</a>
          <a routerLink="/kontakt">Kontakt</a>
        </nav>

        <div class="ft__contact">
          <h3>Kontakt</h3>
          <!-- TODO: echte Kontaktdaten des Zentrums eintragen -->
          <a href="tel:+490000000000"><app-icon name="phone" [size]="16" /> +49 (0) 000 000 000</a>
          <a href="mailto:info@nachhilfezentrum.de"
            ><app-icon name="mail" [size]="16" /> info@nachhilfezentrum.de</a
          >
          <span class="ft__addr"
            ><app-icon name="map-pin" [size]="16" /> Musterstraße 1, 00000 Stadt</span
          >
        </div>
      </div>

      <div class="ft__bar">
        <div class="container ft__bar-inner">
          <span>© {{ year }} Nachhilfezentrum. Alle Rechte vorbehalten.</span>
          <span class="ft__legal">
            <a routerLink="/impressum">Impressum</a>
            <a routerLink="/datenschutz">Datenschutz</a>
            <a routerLink="/agb">AGB</a>
            <button class="ft__cookie-btn" (click)="openCookieSettings()">
              Cookie-Einstellungen
            </button>
          </span>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      /* Footer stays on a deep warm surface in both themes for a grounded close. */
      .ft {
        --ft-text: #cfc7bb;
        --ft-dim: #9a9085;
        background: #18140f;
        color: var(--ft-text);
        margin-top: var(--space-16);
      }
      .ft__grid {
        display: grid;
        gap: var(--space-8) var(--space-6);
        padding: var(--space-12) var(--space-5) var(--space-10);
        grid-template-columns: 1fr;
      }
      @media (min-width: 720px) {
        .ft__grid {
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
        }
      }
      @media (min-width: 1000px) {
        .ft__grid {
          grid-template-columns: 2fr 1fr 1fr 1fr 1.4fr;
        }
      }
      .ft__brand {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        font-weight: 800;
        font-size: var(--fs-lg);
        color: #fff;
        text-decoration: none;
        letter-spacing: -0.02em;
        margin-bottom: var(--space-4);
      }
      .ft__logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: var(--grad-tutoring);
        color: #fff;
      }
      .ft__about {
        max-width: 38ch;
        color: var(--ft-dim);
        line-height: 1.6;
      }
      .ft__social {
        display: flex;
        gap: var(--space-3);
        margin-top: var(--space-5);
      }
      .ft__soc {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--radius-full);
        background: rgba(255, 255, 255, 0.06);
        color: var(--ft-text);
        transition:
          background var(--dur-fast) var(--ease-out),
          color var(--dur-fast) var(--ease-out),
          transform var(--dur-fast) var(--ease-spring);
      }
      .ft__soc:hover {
        background: var(--color-primary);
        color: #fff;
        transform: translateY(-2px);
      }
      h3 {
        color: #fff;
        font-family: var(--font-sans);
        font-size: var(--fs-sm);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: var(--space-4);
      }
      nav a,
      .ft__contact a,
      .ft__addr {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--ft-text);
        text-decoration: none;
        padding: 0.3rem 0;
        line-height: 1.4;
      }
      nav a:hover,
      .ft__contact a:hover {
        color: #fff;
        text-decoration: none;
      }
      .ft__addr {
        color: var(--ft-dim);
        align-items: flex-start;
      }
      .ft__bar {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: var(--space-5) 0;
        font-size: var(--fs-sm);
        color: var(--ft-dim);
      }
      .ft__bar-inner {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        justify-content: space-between;
        align-items: center;
      }
      .ft__legal {
        display: inline-flex;
        gap: var(--space-5);
      }
      .ft__legal a,
      .ft__cookie-btn {
        color: var(--ft-dim);
      }
      .ft__legal a:hover,
      .ft__cookie-btn:hover {
        color: #fff;
      }
      .ft__cookie-btn {
        background: none;
        border: none;
        font: inherit;
        font-size: inherit;
        cursor: pointer;
        padding: 0;
        text-decoration: none;
      }
    `,
  ],
})
export class PublicFooterComponent {
  private readonly cookieService = inject(CookieConsentService);
  readonly year = 2026;

  openCookieSettings(): void {
    this.cookieService.revokeConsent();
  }
}
