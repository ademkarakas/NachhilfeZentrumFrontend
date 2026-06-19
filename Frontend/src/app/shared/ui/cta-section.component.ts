import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from './button.component';
import { IconComponent } from './icon.component';

/** Reusable call-to-action band used at the foot of marketing pages. */
@Component({
  selector: 'app-cta-section',
  imports: [ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cta" [class.cta--coaching]="coaching()">
      <div class="container cta__inner">
        <div class="cta__copy">
          <h2>{{ heading() }}</h2>
          @if (subheading()) {
            <p>{{ subheading() }}</p>
          }
        </div>
        <app-button [link]="link()" size="lg" variant="outline">
          {{ ctaText() }}
          <app-icon name="arrow-right" [size]="20" />
        </app-button>
      </div>
    </section>
  `,
  styles: [
    `
      .cta {
        position: relative;
        margin: 0 var(--space-5) var(--space-12);
        border-radius: var(--radius-xl);
        background: var(--grad-tutoring);
        color: #fff;
        padding: clamp(var(--space-8), 6vw, var(--space-12)) clamp(var(--space-5), 5vw, var(--space-10));
        overflow: hidden;
        isolation: isolate;
      }
      .cta--coaching {
        background: var(--grad-coaching);
      }
      .cta::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: radial-gradient(60% 120% at 90% -10%, rgba(255, 255, 255, 0.25), transparent 60%);
      }
      .cta__inner {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-6);
        align-items: center;
        justify-content: space-between;
        padding: 0;
      }
      .cta__copy {
        max-width: 40ch;
      }
      h2 {
        color: #fff;
        margin: 0;
        font-size: var(--fs-2xl);
      }
      p {
        color: #fff;
        margin: var(--space-3) 0 0;
        opacity: 0.92;
        font-size: var(--fs-lg);
      }
      app-button ::ng-deep .btn--outline {
        border-color: rgba(255, 255, 255, 0.6);
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(4px);
      }
      app-button ::ng-deep .btn--outline:hover {
        background: #fff;
        color: var(--color-ink);
        border-color: #fff;
      }
    `,
  ],
})
export class CtaSectionComponent {
  readonly heading = input.required<string>();
  readonly subheading = input<string | null>(null);
  readonly ctaText = input('Kontakt aufnehmen');
  readonly link = input<string | unknown[]>('/kontakt');
  readonly coaching = input(false);
}
