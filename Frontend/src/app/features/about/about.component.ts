import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { TeamMember, Testimonial } from '../../core/models/api.models';
import { StaffKind } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

@Component({
  selector: 'app-about',
  imports: [
    TestimonialCardComponent,
    CtaSectionComponent,
    RevealDirective,
    IconComponent,
    ButtonComponent,
    CardComponent,
    CountUpDirective,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  readonly testimonials = signal<Testimonial[]>([]);
  readonly featuredTeam = signal<TeamMember[]>([]);

  get stats(): Stat[] {
    return [
      {
        value: +(this.settings.statsStudents() || '500'),
        suffix: '+',
        label: 'Betreute Schüler:innen',
      },
      { value: +(this.settings.statsSubjects() || '12'), label: 'Fächer im Angebot' },
      {
        value: +(this.settings.statsReferralRate() || '95'),
        suffix: '%',
        label: 'Weiterempfehlung',
      },
      {
        value: +(this.settings.statsYearsExperience() || '10'),
        suffix: '+',
        label: 'Jahre Erfahrung',
      },
    ];
  }

  readonly steps: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'target',
      title: 'Standortbestimmung',
      text: 'Wir analysieren den aktuellen Stand — ehrlich und ohne Beschönigung.',
    },
    {
      icon: 'sparkles',
      title: 'Individueller Förderplan',
      text: 'Auf Basis der Analyse entsteht ein persönlicher Plan mit klaren Zielen.',
    },
    {
      icon: 'users',
      title: 'Qualifizierte Begleitung',
      text: 'Erfahrene Lehrkräfte und Coaches begleiten den gesamten Lernprozess.',
    },
    {
      icon: 'badge-check',
      title: 'Fortschritt sichtbar machen',
      text: 'Regelmäßige Tests und Berichte zeigen, was sich verbessert hat.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Über uns',
      description:
        'Das Nachhilfezentrum verbindet fachliche Nachhilfe mit professionellem Lerncoaching — individuell, messbar und mit Herz.',
      path: '/ueber-uns',
    });
    this.seo.setStructuredData('about', {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Über das Nachhilfezentrum',
      description:
        'Das Nachhilfezentrum verbindet fachliche Nachhilfe mit professionellem Lerncoaching.',
      mainEntity: this.seo.organizationSchema(),
    });

    this.api.getTestimonials().subscribe((t) => this.testimonials.set(t));
    this.api.getTeam().subscribe((t) => this.featuredTeam.set(t.slice(0, 3)));
  }

  memberInitials(m: TeamMember): string {
    return m.fullName
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  memberRole(m: TeamMember): string {
    return m.title || (m.kind === StaffKind.Tutor ? 'Nachhilfelehrer:in' : 'Coach');
  }
}
