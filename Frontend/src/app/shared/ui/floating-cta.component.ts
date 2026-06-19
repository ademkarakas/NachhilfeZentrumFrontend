import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { IconComponent } from './icon.component';

/**
 * Sticky floating call button that appears once the user scrolls past the hero section.
 * The navbar already carries the "Gratis Probestunde" CTA, so this button is the
 * persistent click-to-call affordance — especially valuable on mobile, where the
 * header phone number is hidden behind the menu.
 *
 * SSR-safe: hidden by default, only shown in-browser after the scroll threshold. Renders
 * nothing when no phone number is configured in the site settings.
 */
@Component({
  selector: 'app-floating-cta',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './floating-cta.component.html',
  styleUrl: './floating-cta.component.scss',
})
export class FloatingCtaComponent {
  private readonly settings = inject(SiteSettingsService);

  readonly phone = computed(() => this.settings.contactPhone().trim() || null);
  readonly visible = signal(false);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId)) return;

    afterNextRender(() => {
      const threshold = window.innerHeight * 0.6;
      const onScroll = () => this.visible.set(window.scrollY > threshold);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    });
  }
}
