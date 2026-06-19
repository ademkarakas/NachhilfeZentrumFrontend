import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../core/services/cookie-consent.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { IconComponent } from '../../shared/ui/icon.component';

@Component({
  selector: 'app-public-footer',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss',
})
export class PublicFooterComponent {
  private readonly cookieService = inject(CookieConsentService);
  readonly settings = inject(SiteSettingsService);
  readonly year = new Date().getFullYear();

  openCookieSettings(): void {
    this.cookieService.revokeConsent();
  }
}
