import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'coaching' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'lg';

/**
 * Design-system button. Renders an <a routerLink> when `link` is set, otherwise a
 * native <button>. The `coaching` variant keeps the coaching service line visually
 * distinct from tutoring everywhere it appears.
 */
@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // A single <ng-content> (in #label) is reused by both the link and button branches.
  // Declaring <ng-content> twice — once per @if branch — is unreliable: Angular honours
  // only one default projection slot, so some buttons would render with no label.
  template: `
    @if (link()) {
      <a [routerLink]="link()" class="btn" [class]="'btn--' + variant() + ' btn--' + size()">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <button
        class="btn"
        [class]="'btn--' + variant() + ' btn--' + size()"
        [type]="type()"
        [disabled]="disabled()"
      >
        <ng-container [ngTemplateOutlet]="label" />
      </button>
    }
    <ng-template #label><ng-content /></ng-template>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        font: inherit;
        font-weight: 700;
        letter-spacing: -0.01em;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: var(--radius-full);
        padding: 0.7rem 1.5rem;
        transition: background var(--dur-fast) var(--ease-out),
          color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out),
          box-shadow var(--dur-base) var(--ease-out), transform var(--dur-fast) var(--ease-spring);
        text-decoration: none;
        white-space: nowrap;
      }
      .btn:hover {
        text-decoration: none;
        transform: translateY(-2px);
      }
      .btn:active {
        transform: translateY(0);
      }
      .btn :where(app-icon) {
        transition: transform var(--dur-base) var(--ease-spring);
      }
      .btn:hover :where(app-icon) {
        transform: translateX(3px);
      }
      .btn--lg {
        padding: 0.95rem 2rem;
        font-size: var(--fs-lg);
      }
      .btn--primary {
        background: var(--color-primary);
        color: var(--color-on-primary);
        box-shadow: var(--shadow-sm);
      }
      .btn--primary:hover {
        background: var(--color-primary-dark);
        box-shadow: var(--shadow-primary);
      }
      .btn--coaching {
        background: var(--color-coaching);
        color: var(--color-on-coaching);
        box-shadow: var(--shadow-sm);
      }
      .btn--coaching:hover {
        background: var(--color-coaching-dark);
        box-shadow: var(--shadow-coaching);
      }
      .btn--outline {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: var(--color-surface);
      }
      .btn--outline:hover {
        border-color: var(--color-primary);
        color: var(--color-on-primary);
        background: var(--color-primary);
        box-shadow: var(--shadow-primary);
      }
      .btn--ghost {
        background: var(--color-surface-alt);
        color: var(--color-ink);
        border-color: var(--color-line);
      }
      .btn--ghost:hover {
        background: var(--color-surface-sunken);
        border-color: var(--color-line-strong);
      }
      .btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .btn,
        .btn:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  /** When set, renders an <a routerLink> instead of a <button>. */
  readonly link = input<string | unknown[] | null>(null);
}
