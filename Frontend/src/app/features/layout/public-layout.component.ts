import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieConsentBannerComponent } from '../../shared/ui/cookie-consent-banner.component';
import { FloatingCtaComponent } from '../../shared/ui/floating-cta.component';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { PublicFooterComponent } from './public-footer.component';
import { PublicHeaderComponent } from './public-header.component';
import { AnnouncementBannerComponent } from './announcement-banner.component';

/** Chrome (header + footer) shared by every public marketing/e-learning route. */
@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    PublicHeaderComponent,
    PublicFooterComponent,
    FloatingCtaComponent,
    CookieConsentBannerComponent,
    AnnouncementBannerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements OnInit {
  private readonly siteSettings = inject(SiteSettingsService);

  ngOnInit(): void {
    this.siteSettings.load();
  }
}
