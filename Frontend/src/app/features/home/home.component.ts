import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
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

  private readonly allSubjects = signal<SubjectSummary[]>([]);
  private readonly allTestimonials = signal<Testimonial[]>([]);

  // How many featured items the homepage shows — admin-configurable, ordered by displayOrder.
  private readonly featuredSubjectsCount = computed(
    () => +(this.settingsService.get('home.featuredSubjectsCount') || '6') || 6,
  );
  private readonly featuredTestimonialsCount = computed(
    () => +(this.settingsService.get('home.featuredTestimonialsCount') || '3') || 3,
  );

  readonly subjects = computed(() => this.allSubjects().slice(0, this.featuredSubjectsCount()));
  readonly testimonials = computed(() =>
    this.allTestimonials().slice(0, this.featuredTestimonialsCount()),
  );

  get socialProof(): string {
    return this.settingsService.get('home.socialProof') || 'Von über 500 Familien empfohlen';
  }
  get rating(): string {
    return this.settingsService.get('home.rating') || '4,9 / 5';
  }
  get googleReviews(): string {
    return this.settingsService.get('home.googleReviews') || '120+ Google-Bewertungen';
  }

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

    this.api.getSubjects().subscribe((s) => this.allSubjects.set(s));
    this.api.getTestimonials().subscribe((t) => this.allTestimonials.set(t));
  }

  monogram(name: string): string {
    return (name.trim().charAt(0) || '?').toUpperCase();
  }
}
