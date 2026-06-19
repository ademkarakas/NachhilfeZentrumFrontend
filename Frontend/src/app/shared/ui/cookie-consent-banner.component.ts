import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CookieConsentService } from '../../core/services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss',
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
