import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cookieService.bannerVisible()) {
      <div class="cb" role="dialog" aria-label="Cookie-Einstellungen" aria-modal="false">
        <div class="cb__inner">
          @if (!showDetails()) {
            <div class="cb__simple">
              <p class="cb__text">
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu
                bieten. Sie können wählen, welche Cookie-Kategorien Sie zulassen möchten.
                <a href="/datenschutz" class="cb__link">Mehr erfahren</a>
              </p>
              <div class="cb__actions">
                <button class="cb__btn cb__btn--primary" (click)="cookieService.acceptAll()">
                  Alle akzeptieren
                </button>
                <button
                  class="cb__btn cb__btn--secondary"
                  (click)="cookieService.acceptEssentialOnly()"
                >
                  Nur essenzielle
                </button>
                <button class="cb__btn cb__btn--ghost" (click)="showDetails.set(true)">
                  Einstellungen
                </button>
              </div>
            </div>
          } @else {
            <div class="cb__details">
              <p class="cb__text">
                Passen Sie Ihre Cookie-Einstellungen an. Essenzielle Cookies können nicht
                deaktiviert werden, da sie für den Betrieb der Website notwendig sind.
              </p>
              <div class="cb__categories">
                <label class="cb__cat">
                  <span class="cb__cat-info">
                    <strong>Essenzielle Cookies</strong>
                    <span>Für die Grundfunktion der Website erforderlich</span>
                  </span>
                  <input type="checkbox" checked disabled />
                </label>
                <label class="cb__cat">
                  <span class="cb__cat-info">
                    <strong>Statistik</strong>
                    <span>Helfen uns zu verstehen, wie Besucher die Website nutzen</span>
                  </span>
                  <input
                    type="checkbox"
                    [checked]="statisticsEnabled()"
                    (change)="statisticsEnabled.set(!statisticsEnabled())"
                  />
                </label>
                <label class="cb__cat">
                  <span class="cb__cat-info">
                    <strong>Marketing</strong>
                    <span>Werden verwendet, um Besuchern relevante Inhalte anzuzeigen</span>
                  </span>
                  <input
                    type="checkbox"
                    [checked]="marketingEnabled()"
                    (change)="marketingEnabled.set(!marketingEnabled())"
                  />
                </label>
              </div>
              <div class="cb__actions">
                <button class="cb__btn cb__btn--primary" (click)="savePreferences()">
                  Auswahl speichern
                </button>
                <button class="cb__btn cb__btn--secondary" (click)="cookieService.acceptAll()">
                  Alle akzeptieren
                </button>
                <button class="cb__btn cb__btn--ghost" (click)="showDetails.set(false)">
                  Zurück
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .cb {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        background: var(--color-surface, #fff);
        border-top: 1px solid var(--color-neutral-200, #e5e5e5);
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .cb__inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--space-5) var(--space-5);
      }
      .cb__text {
        margin-bottom: var(--space-4);
        line-height: 1.6;
        color: var(--color-neutral-700, #333);
        font-size: var(--fs-sm);
      }
      .cb__link {
        color: var(--color-primary);
        text-decoration: underline;
      }
      .cb__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
      }
      .cb__btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md, 6px);
        font-size: var(--fs-sm);
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition:
          background 0.15s ease,
          transform 0.1s ease;
      }
      .cb__btn:active {
        transform: scale(0.97);
      }
      .cb__btn--primary {
        background: var(--color-primary);
        color: #fff;
      }
      .cb__btn--primary:hover {
        background: var(--color-primary-dark);
      }
      .cb__btn--secondary {
        background: var(--color-neutral-100, #f3f3f3);
        color: var(--color-neutral-800, #222);
      }
      .cb__btn--secondary:hover {
        background: var(--color-neutral-200, #e5e5e5);
      }
      .cb__btn--ghost {
        background: transparent;
        color: var(--color-primary);
        text-decoration: underline;
        padding-left: 0;
        padding-right: 0;
      }
      .cb__categories {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin-bottom: var(--space-5);
      }
      .cb__cat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-3) var(--space-4);
        background: var(--color-neutral-50, #fafafa);
        border-radius: var(--radius-md, 6px);
        cursor: pointer;
      }
      .cb__cat-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .cb__cat-info strong {
        font-size: var(--fs-sm);
        color: var(--color-neutral-800, #222);
      }
      .cb__cat-info span {
        font-size: var(--fs-xs, 0.75rem);
        color: var(--color-neutral-500, #666);
      }
      .cb__cat input[type='checkbox'] {
        width: 20px;
        height: 20px;
        accent-color: var(--color-primary);
        cursor: pointer;
      }
      @media (max-width: 600px) {
        .cb__actions {
          flex-direction: column;
        }
        .cb__btn {
          width: 100%;
          text-align: center;
        }
      }
    `,
  ],
})
export class CookieConsentBannerComponent {
  protected readonly cookieService = inject(CookieConsentService);
  protected readonly showDetails = signal(false);
  protected readonly statisticsEnabled = signal(false);
  protected readonly marketingEnabled = signal(false);

  savePreferences(): void {
    this.cookieService.savePreferences(this.statisticsEnabled(), this.marketingEnabled());
  }
}
