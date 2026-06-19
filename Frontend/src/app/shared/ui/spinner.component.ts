import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Inline loading indicator with an accessible label. */
@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="spinner" role="status">
      <span class="spinner__ring" aria-hidden="true"></span>
      <span class="sr-only">{{ label() }}</span>
    </div>
  `,
  styles: [
    `
      .spinner {
        display: flex;
        justify-content: center;
        padding: var(--space-8) 0;
      }
      .spinner__ring {
        width: 36px;
        height: 36px;
        border: 3px solid var(--color-line);
        border-top-color: var(--color-primary);
        border-radius: var(--radius-full);
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class SpinnerComponent {
  readonly label = input('Wird geladen…');
}
