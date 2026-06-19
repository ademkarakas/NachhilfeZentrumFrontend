import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonComponent } from './button.component';
import { IconComponent } from './icon.component';

/** Reusable call-to-action band used at the foot of marketing pages. */
@Component({
  selector: 'app-cta-section',
  imports: [ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cta-section.component.html',
  styleUrl: './cta-section.component.scss',
})
export class CtaSectionComponent {
  readonly heading = input.required<string>();
  readonly subheading = input<string | null>(null);
  readonly ctaText = input('Kontakt aufnehmen');
  readonly link = input<string | unknown[]>('/kontakt');
  readonly coaching = input(false);
}
