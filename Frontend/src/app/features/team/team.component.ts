import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { PublicApiService } from '../../core/api/public-api.service';
import { TeamMember } from '../../core/models/api.models';
import { StaffKind } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-team',
  imports: [CardComponent, SpinnerComponent, NgTemplateOutlet, RevealDirective, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero-band">
      <div class="container" appReveal>
        <span class="eyebrow">Team</span>
        <h1>Die Menschen hinter dem Lernerfolg</h1>
        <p class="lead">Qualifizierte Lehrkräfte und Coaches — fachlich stark und persönlich engagiert.</p>
      </div>
    </section>

    @if (loading()) {
      <app-spinner />
    } @else {
      @if (tutors().length) {
        <section class="section">
          <div class="container">
            <h2 class="section__title" appReveal>
              <app-icon name="users" [size]="22" />
              Nachhilfelehrer:innen
            </h2>
            <div class="grid grid--3">
              @for (m of tutors(); track m.id) {
                <app-card appReveal [revealIndex]="$index">
                  <ng-container [ngTemplateOutlet]="memberTpl" [ngTemplateOutletContext]="{ m }" />
                </app-card>
              }
            </div>
          </div>
        </section>
      }

      @if (coaches().length) {
        <section class="section section--alt">
          <div class="container">
            <h2 class="section__title" appReveal>
              <app-icon name="compass" [size]="22" />
              Coaches
            </h2>
            <div class="grid grid--3">
              @for (m of coaches(); track m.id) {
                <app-card appReveal [revealIndex]="$index">
                  <ng-container [ngTemplateOutlet]="memberTpl" [ngTemplateOutletContext]="{ m }" />
                </app-card>
              }
            </div>
          </div>
        </section>
      }

      @if (!tutors().length && !coaches().length) {
        <section class="section">
          <div class="container"><p class="empty">Unser Team wird in Kürze vorgestellt.</p></div>
        </section>
      }
    }

    <ng-template #memberTpl let-m="m">
      <div class="member">
        @if (m.photoUrl) {
          <img
            class="member__photo"
            [src]="m.photoUrl"
            [alt]="m.fullName"
            width="88"
            height="88"
            loading="lazy"
          />
        } @else {
          <span class="member__avatar" aria-hidden="true">{{ initials(m) }}</span>
        }
        <h3>{{ m.fullName }}</h3>
        @if (m.title) {
          <p class="member__title">{{ m.title }}</p>
        }
        <div class="member__bio rich-content" [innerHTML]="m.bio"></div>
        @if (m.subjectsTaught) {
          <p class="member__subjects">{{ m.subjectsTaught }}</p>
        }
      </div>
    </ng-template>
  `,
  styles: [
    `
      .hero-band {
        position: relative;
        overflow: hidden;
        background: var(--grad-hero);
        padding: clamp(var(--space-10), 8vw, var(--space-12)) 0;
        border-bottom: 1px solid var(--color-line);
      }
      .hero-band::before {
        content: '';
        position: absolute;
        width: 420px;
        height: 420px;
        top: -170px;
        right: -120px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--color-primary-100), transparent 70%);
        filter: blur(70px);
        opacity: 0.55;
        pointer-events: none;
      }
      .hero-band .container {
        position: relative;
        z-index: 1;
      }
      .lead {
        font-size: var(--fs-lg);
        max-width: 60ch;
      }
      .section__title {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
      }
      .section__title app-icon {
        color: var(--color-primary);
      }
      .member {
        text-align: center;
      }
      .member__photo,
      .member__avatar {
        width: 88px;
        height: 88px;
        border-radius: var(--radius-full);
        object-fit: cover;
        margin: 0 auto var(--space-3);
      }
      .member__avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary-100);
        color: var(--color-primary-dark);
        font-weight: 700;
        font-size: var(--fs-xl);
      }
      .member__title {
        color: var(--color-primary);
        font-weight: 600;
        margin: 0 0 var(--space-2);
      }
      .member__bio {
        color: var(--color-body);
      }
      .member__subjects {
        color: var(--color-muted);
        font-size: var(--fs-sm);
      }
      .empty {
        color: var(--color-muted);
        text-align: center;
      }
    `,
  ],
})
export class TeamComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(true);

  readonly tutors = computed(() => this.members().filter((m) => m.kind === StaffKind.Tutor));
  readonly coaches = computed(() => this.members().filter((m) => m.kind === StaffKind.Coach));

  ngOnInit(): void {
    this.seo.update({
      title: 'Unser Team',
      description: 'Lernen Sie unsere Nachhilfelehrer:innen und Coaches kennen.',
      path: '/team',
    });
    this.api.getTeam().subscribe({
      next: (m) => {
        this.members.set(m);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  initials(m: TeamMember): string {
    return m.fullName
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
