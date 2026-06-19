import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from './icon.component';

/**
 * Sticky floating CTA that appears once the user scrolls past the hero section.
 * Promotes "Gratis Probestunde" — the #1 conversion trigger for tutoring centres.
 * SSR-safe: hidden by default, only shown in-browser after scroll threshold.
 */
@Component({
  selector: 'app-floating-cta',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      routerLink="/kontakt"
      class="fcta"
      [class.fcta--visible]="visible()"
      aria-label="Gratis Probestunde vereinbaren"
    >
      <app-icon name="phone" [size]="18" />
      <span>Gratis Probestunde</span>
    </a>
  `,
  styles: [
    `
      .fcta {
        position: fixed;
        bottom: var(--space-5);
        right: var(--space-5);
        z-index: 90;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-5);
        border-radius: var(--radius-full);
        background: var(--color-primary);
        color: #fff;
        font-weight: 700;
        font-size: var(--fs-sm);
        text-decoration: none;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        transform: translateY(16px);
        pointer-events: none;
        transition:
          opacity var(--dur-base) var(--ease-out),
          transform var(--dur-base) var(--ease-out),
          background var(--dur-fast) var(--ease-out);
      }
      .fcta--visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .fcta:hover {
        background: var(--color-primary-dark);
        text-decoration: none;
      }
      @media (min-width: 921px) {
        .fcta {
          bottom: var(--space-6);
          right: var(--space-6);
          padding: var(--space-3) var(--space-6);
          font-size: var(--fs-base);
        }
      }
    `,
  ],
})
export class FloatingCtaComponent {
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
