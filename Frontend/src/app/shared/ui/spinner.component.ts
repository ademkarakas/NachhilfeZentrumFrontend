import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Inline loading indicator with an accessible label. */
@Component({
  selector: 'app-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  readonly label = input('Wird geladen…');
}
