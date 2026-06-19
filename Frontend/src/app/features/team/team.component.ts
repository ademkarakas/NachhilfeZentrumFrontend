import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
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
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
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
