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
 * Animated number count-up that runs once, the first time the element scrolls into
 * view. SSR-safe and reduced-motion-safe (jumps straight to the final value).
 *
 * Usage: <span [appCountUp]="95" countSuffix="%">95%</span>
 * The projected text is the SSR/no-JS fallback and is overwritten in the browser.
 */
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  readonly appCountUp = input.required<number>();
  readonly countSuffix = input<string>('');
  readonly countPrefix = input<string>('');
  readonly countDuration = input<number>(1600);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    afterNextRender(() => {
      const node = this.el.nativeElement;
      const target = this.appCountUp();
      const render = (value: number) => {
        node.textContent = `${this.countPrefix()}${Math.round(value)}${this.countSuffix()}`;
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        render(target);
        return;
      }

      const io = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            obs.unobserve(node);
            this.animate(target, render);
          }
        },
        { threshold: 0.4 },
      );
      io.observe(node);
    });
  }

  private animate(target: number, render: (v: number) => void): void {
    const duration = this.countDuration();
    let start: number | null = null;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      render(target * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
