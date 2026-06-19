import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'primary' | 'coaching' | 'neutral' | 'success' | 'warning' | 'lock';

/** Small status/category pill. */
@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="'badge--' + tone()"><ng-content /></span>`,
  styles: [
    `
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35em;
        font-size: var(--fs-xs);
        font-weight: 700;
        letter-spacing: 0.02em;
        padding: 0.25em 0.7em;
        border-radius: var(--radius-full);
        line-height: 1.4;
      }
      .badge--primary {
        background: var(--color-primary-100);
        color: var(--color-primary-dark);
      }
      .badge--coaching {
        background: var(--color-coaching-100);
        color: var(--color-coaching-dark);
      }
      .badge--neutral {
        background: var(--color-surface-alt);
        color: var(--color-muted);
      }
      .badge--success {
        background: var(--color-success-bg);
        color: var(--color-success);
      }
      .badge--warning {
        background: var(--color-coaching-100);
        color: var(--color-warning);
      }
      .badge--lock {
        background: var(--color-lock-bg);
        color: var(--color-lock);
      }
    `,
  ],
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');
}
