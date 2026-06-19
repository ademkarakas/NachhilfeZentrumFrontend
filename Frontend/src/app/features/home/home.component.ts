import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { SubjectSummary, Testimonial } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    ButtonComponent,
    CardComponent,
    CtaSectionComponent,
    TestimonialCardComponent,
    IconComponent,
    RevealDirective,
    CountUpDirective,
    StripHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  private readonly settingsService = inject(SiteSettingsService);

  readonly subjects = signal<SubjectSummary[]>([]);
  readonly testimonials = signal<Testimonial[]>([]);

  get stats(): Stat[] {
    return [
      {
        value: +(this.settingsService.statsStudents() || '500'),
        suffix: '+',
        label: 'Betreute Schüler:innen',
      },
      { value: +(this.settingsService.statsSubjects() || '12'), label: 'Fächer im Angebot' },
      {
        value: +(this.settingsService.statsReferralRate() || '95'),
        suffix: '%',
        label: 'Weiterempfehlung',
      },
      { value: +(this.settingsService.statsYearsExperience() || '10'), label: 'Jahre Erfahrung' },
    ];
  }

  ngOnInit(): void {
    this.seo.update({
      title: 'Nachhilfe & Coaching für nachhaltigen Lernerfolg',
      description:
        'Individuelle Nachhilfe in allen Fächern und professionelles Lerncoaching — persönlich, motivierend und messbar erfolgreich.',
      path: '/',
    });
    this.seo.setStructuredData('org', this.seo.organizationSchema());

    this.api.getSubjects().subscribe((s) => this.subjects.set(s.slice(0, 6)));
    this.api.getTestimonials().subscribe((t) => this.testimonials.set(t.slice(0, 3)));
  }

  monogram(name: string): string {
    return (name.trim().charAt(0) || '?').toUpperCase();
  }
}
