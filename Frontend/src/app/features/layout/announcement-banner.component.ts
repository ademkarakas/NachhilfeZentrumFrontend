import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { IconComponent } from '../../shared/ui/icon.component';

/**
 * Dismissible announcement banner rendered above the header when `announcement.banner`
 * has content in SiteSettings. Dismissed state is per-session (survives navigation,
 * resets on page reload).
 */
@Component({
  selector: 'app-announcement-banner',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.scss',
})
export class AnnouncementBannerComponent {
  readonly settings = inject(SiteSettingsService);
  readonly dismissed = signal(false);
}
