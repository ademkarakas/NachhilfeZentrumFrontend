import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { FaqItem, SubjectSummary } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';

@Component({
  selector: 'app-nachhilfe-landing',
  imports: [
    RouterLink,
    ButtonComponent,
    CardComponent,
    CtaSectionComponent,
    IconComponent,
    SpinnerComponent,
    RevealDirective,
    StripHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nachhilfe-landing.component.html',
  styleUrl: './nachhilfe-landing.component.scss',
})
export class NachhilfeLandingComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly subjects = signal<SubjectSummary[]>([]);
  readonly faqs = signal<FaqItem[]>([]);
  readonly loading = signal(true);

  readonly steps: { icon: IconName; title: string; text: string }[] = [
    {
      icon: 'phone',
      title: 'Kontakt aufnehmen',
      text: 'Rufen Sie an oder nutzen Sie unser Formular — wir melden uns innerhalb von 24 Stunden.',
    },
    {
      icon: 'users',
      title: 'Lernstandsanalyse',
      text: 'Gemeinsam ermitteln wir den aktuellen Wissensstand und identifizieren Lücken.',
    },
    {
      icon: 'sparkles',
      title: 'Individueller Förderplan',
      text: 'Wir erstellen einen maßgeschneiderten Plan mit klaren Zielen und Meilensteinen.',
    },
    {
      icon: 'badge-check',
      title: 'Regelmäßiges Feedback',
      text: 'Fortschrittsberichte und Elterngespräche — damit alle Beteiligten informiert bleiben.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Nachhilfe — Professionelle Nachhilfe in allen Fächern',
      description:
        'Professionelle Nachhilfe in Mathematik, Deutsch, Englisch und weiteren Fächern. Individuelle Förderung für alle Klassenstufen.',
      path: '/nachhilfe',
    });

    this.api.getSubjects().subscribe({
      next: (s) => {
        this.subjects.set(s);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getFaq().subscribe((f) => {
      const nachhilfeFaqs = f.filter(
        (faq) => !faq.category || faq.category.toLowerCase() === 'nachhilfe',
      );
      this.faqs.set(nachhilfeFaqs.slice(0, 6));
    });
  }

  monogram(name: string): string {
    return (name.trim().charAt(0) || '?').toUpperCase();
  }
}
