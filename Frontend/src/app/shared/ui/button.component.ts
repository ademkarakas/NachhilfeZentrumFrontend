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
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  /** When set, renders an <a routerLink> instead of a <button>. */
  readonly link = input<string | unknown[] | null>(null);
  /** Optional URL fragment for anchor scrolling (e.g. 'pakete' → #pakete). */
  readonly fragment = input<string | undefined>(undefined);
}
