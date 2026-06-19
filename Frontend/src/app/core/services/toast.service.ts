import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/**
 * Lightweight signal-based toast store. Consumed by the global error interceptor
 * and by feature components for save/delete feedback.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, kind: ToastKind = 'info', timeoutMs = 4500): void {
    const id = ++this.seq;
    this.toasts.update((list) => [...list, { id, kind, message }]);
    if (timeoutMs > 0 && typeof setTimeout !== 'undefined') {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 6000);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
