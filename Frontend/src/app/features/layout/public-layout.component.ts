import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieConsentBannerComponent } from '../../shared/ui/cookie-consent-banner.component';
import { FloatingCtaComponent } from '../../shared/ui/floating-cta.component';
import { PublicFooterComponent } from './public-footer.component';
import { PublicHeaderComponent } from './public-header.component';

/** Chrome (header + footer) shared by every public marketing/e-learning route. */
@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    PublicHeaderComponent,
    PublicFooterComponent,
    FloatingCtaComponent,
    CookieConsentBannerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip-link" href="#main">Zum Inhalt springen</a>
    <app-public-header />
    <main id="main">
      <router-outlet />
    </main>
    <app-public-footer />
    <app-floating-cta />
    <app-cookie-consent-banner />
  `,
  styles: [
    `
      .skip-link {
        position: absolute;
        left: -999px;
        top: 0;
        background: var(--color-primary);
        color: #fff;
        padding: var(--space-2) var(--space-4);
        z-index: 200;
      }
      .skip-link:focus {
        left: var(--space-3);
        top: var(--space-3);
      }
      main {
        min-height: 60vh;
      }
    `,
  ],
})
export class PublicLayoutComponent {}
