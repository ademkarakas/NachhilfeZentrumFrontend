import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Scroll-reveal: fades + slides an element into view the first time it enters the
 * viewport. Purposeful motion, not decoration.
 *
 * SSR/no-JS safe — the hidden state is only applied in the browser, so server-rendered
 * markup is fully visible (important for SEO). Fully respects prefers-reduced-motion:
 * when the user opts out, nothing is hidden or animated.
 *
 * Usage: <section appReveal>…</section>  or  <li appReveal [revealIndex]="i">
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  /** Direction the element travels from: up (default), left, right, scale. */
  readonly appReveal = input<'' | 'up' | 'left' | 'right' | 'scale'>('');
  /** Position in a list — used to stagger siblings (each adds `revealStep` ms). */
  readonly revealIndex = input<number>(0);
  /** Per-index stagger in milliseconds. */
  readonly revealStep = input<number>(90);

  constructor() {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return; // leave element visible, no animation

    const node = this.el.nativeElement;

    afterNextRender(() => {
      const from = this.appReveal();
      node.classList.add('reveal');
      if (from && from !== 'up') node.setAttribute('data-reveal', from);
      node.style.setProperty('--reveal-delay', `${this.revealIndex() * this.revealStep()}ms`);

      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('reveal--in');
              obs.unobserve(node);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      io.observe(node);
    });
  }
}
