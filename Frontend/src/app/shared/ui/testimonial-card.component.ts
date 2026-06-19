import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../core/models/api.models';

/** Social-proof quote card with an editorial pull-quote treatment. */
@Component({
  selector: 'app-testimonial-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss',
})
export class TestimonialCardComponent {
  readonly testimonial = input.required<Testimonial>();

  initials(): string {
    return this.testimonial()
      .authorName.split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
