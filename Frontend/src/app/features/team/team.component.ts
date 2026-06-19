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
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

@Component({
  selector: 'app-team',
  imports: [
    CardComponent,
    SpinnerComponent,
    NgTemplateOutlet,
    RevealDirective,
    IconComponent,
    ButtonComponent,
    CtaSectionComponent,
    CountUpDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
})
export class TeamComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(true);

  readonly tutors = computed(() => this.members().filter((m) => m.kind === StaffKind.Tutor));
  readonly coaches = computed(() => this.members().filter((m) => m.kind === StaffKind.Coach));

  readonly stats = computed<Stat[]>(() => [
    {
      value: this.members().length || +(this.settings.get('team.stats.members') || '15'),
      label: 'Lehrkräfte & Coaches',
    },
    {
      value: +(this.settings.statsYearsExperience() || '10'),
      suffix: '+',
      label: 'Jahre Erfahrung',
    },
    { value: +(this.settings.statsSubjects() || '12'), label: 'Fächer im Angebot' },
  ]);

  readonly steps: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'shield-check',
      title: 'Fachliche Prüfung',
      text: 'Jede Lehrkraft durchläuft ein mehrstufiges Auswahlverfahren — fachlich und pädagogisch.',
    },
    {
      icon: 'users',
      title: 'Probeunterricht',
      text: 'Im echten Unterricht zeigt sich, ob Didaktik und Persönlichkeit zusammenpassen.',
    },
    {
      icon: 'sparkles',
      title: 'Einarbeitung & Mentoring',
      text: 'Neue Lehrkräfte werden von erfahrenen Kolleg:innen begleitet und eingearbeitet.',
    },
    {
      icon: 'target',
      title: 'Weiterbildung',
      text: 'Regelmäßige Schulungen sichern ein gleichbleibend hohes Unterrichtsniveau.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Unser Team',
      description:
        'Lernen Sie unsere qualifizierten Nachhilfelehrer:innen und Coaches kennen — fachlich stark und persönlich engagiert.',
      path: '/team',
    });
    this.api.getTeam().subscribe({
      next: (m) => {
        this.members.set(m);
        this.loading.set(false);
        this.setStructuredData(m);
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

  private setStructuredData(members: TeamMember[]): void {
    const people = members.map((m) => ({
      '@type': 'Person',
      name: m.fullName,
      jobTitle: m.title || (m.kind === StaffKind.Tutor ? 'Nachhilfelehrer:in' : 'Coach'),
      ...(m.photoUrl ? { image: m.photoUrl } : {}),
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'Nachhilfezentrum',
      },
    }));

    this.seo.setStructuredData('team', {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Unser Team',
      description: 'Qualifizierte Nachhilfelehrer:innen und Coaches des Nachhilfezentrums.',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: people.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: p,
        })),
      },
    });
  }
}
