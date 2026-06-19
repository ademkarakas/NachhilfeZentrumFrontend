import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BadgeComponent } from './badge.component';
import { IconComponent } from './icon.component';

/**
 * Visual marker for membership-gated ("Pro") content. The UI pattern exists today so
 * that enabling real gating later is a data/flag change — not a redesign. Nothing is
 * actually locked yet (see environment.membershipGatingEnabled).
 */
@Component({
  selector: 'app-lock-indicator',
  imports: [BadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (locked()) {
      <app-badge tone="lock" [attr.aria-label]="'Pro-Inhalt'">
        <app-icon name="lock" [size]="13" [strokeWidth]="2.5" />
        Pro
      </app-badge>
    }
  `,
})
export class LockIndicatorComponent {
  /** Whether the underlying content is flagged as requiring membership. */
  readonly requiresMembership = input(false);
  readonly locked = computed(() => this.requiresMembership());
}
