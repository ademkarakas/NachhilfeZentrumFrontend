import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Testimonial } from '../../core/models/api.models';

/** Social-proof quote card with an editorial pull-quote treatment. */
@Component({
  selector: 'app-testimonial-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <figure class="t">
      <span class="t__mark" aria-hidden="true">&ldquo;</span>
      <blockquote class="t__quote rich-content" [innerHTML]="testimonial().quote"></blockquote>
      <figcaption class="t__author">
        @if (testimonial().photoUrl) {
          <img
            class="t__photo"
            [src]="testimonial().photoUrl"
            [alt]="testimonial().authorName"
            loading="lazy"
            width="48"
            height="48"
          />
        } @else {
          <span class="t__avatar" aria-hidden="true">{{ initials() }}</span>
        }
        <span>
          <strong>{{ testimonial().authorName }}</strong>
          @if (testimonial().authorRole) {
            <span class="t__role">{{ testimonial().authorRole }}</span>
          }
        </span>
      </figcaption>
    </figure>
  `,
  styles: [
    `
      .t {
        position: relative;
        margin: 0;
        background: var(--color-surface);
        border: 1px solid var(--color-line);
        border-radius: var(--radius-lg);
        padding: var(--space-6);
        box-shadow: var(--shadow-sm);
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        overflow: hidden;
        transition: box-shadow var(--dur-base) var(--ease-out),
          transform var(--dur-base) var(--ease-out);
      }
      .t:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-4px);
      }
      .t__mark {
        font-family: var(--font-display);
        font-size: 5rem;
        line-height: 0.8;
        color: var(--color-primary-100);
        height: 2.2rem;
        overflow: hidden;
      }
      .t__quote {
        margin: 0;
        font-family: var(--font-display);
        font-size: var(--fs-lg);
        color: var(--color-ink);
        line-height: 1.5;
        letter-spacing: -0.01em;
      }
      .t__author {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-top: auto;
      }
      .t__photo,
      .t__avatar {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-full);
        object-fit: cover;
        flex: none;
      }
      .t__avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary-100);
        color: var(--color-primary-dark);
        font-weight: 700;
        font-size: var(--fs-base);
      }
      .t__author strong {
        color: var(--color-ink);
      }
      .t__role {
        display: block;
        color: var(--color-muted);
        font-size: var(--fs-sm);
      }
      @media (prefers-reduced-motion: reduce) {
        .t:hover {
          transform: none;
        }
      }
    `,
  ],
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
