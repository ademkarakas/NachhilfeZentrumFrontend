import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

/** Renders the global toast stack. Mounted once in the app shell. */
@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast--' + toast.kind" role="status">
          <span>{{ toast.message }}</span>
          <button
            class="toast__close"
            type="button"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toasts {
        position: fixed;
        bottom: var(--space-5);
        right: var(--space-5);
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        z-index: 1000;
        max-width: min(380px, calc(100vw - 2rem));
      }
      .toast {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        color: #fff;
        font-size: var(--fs-sm);
        animation: slide-in 0.2s ease;
      }
      .toast--success {
        background: var(--color-success);
      }
      .toast--error {
        background: var(--color-danger);
      }
      .toast--info {
        background: var(--color-ink);
      }
      .toast__close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2rem;
        line-height: 1;
        cursor: pointer;
        margin-left: auto;
      }
      @keyframes slide-in {
        from {
          transform: translateY(8px);
          opacity: 0;
        }
      }
    `,
  ],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
