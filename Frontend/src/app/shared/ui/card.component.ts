import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type CardTone = 'primary' | 'coaching';

/** Surface container for catalog grids, feature blocks and forms. */
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  readonly interactive = input(false);
  /** Accent used for the hover ring. */
  readonly tone = input<CardTone>('primary');
}
