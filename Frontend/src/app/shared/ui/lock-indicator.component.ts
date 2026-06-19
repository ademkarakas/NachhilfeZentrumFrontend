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
  templateUrl: './lock-indicator.component.html',
})
export class LockIndicatorComponent {
  /** Whether the underlying content is flagged as requiring membership. */
  readonly requiresMembership = input(false);
  readonly locked = computed(() => this.requiresMembership());
}
