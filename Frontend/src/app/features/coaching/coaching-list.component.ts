import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { CoachingProgramSummary, FaqItem, Testimonial } from '../../core/models/api.models';
import { cardsFromBlocks } from '../../shared/content-blocks.util';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { StripHtmlPipe } from '../../shared/pipes/strip-html.pipe';

interface TargetGroup {
  icon: IconName;
  title: string;
  text: string;
}
interface Step {
  icon: IconName;
  title: string;
  text: string;
}
interface Benefit {
  icon: IconName;
  title: string;
  text: string;
}

/**
 * Coaching landing page. Coaching is a SEPARATE service line from tutoring — its own
 * page and its own visual identity (coaching accent colour). Never a tab under Subjects.
 *
 * Target groups, steps and benefits are static design copy. Testimonials and FAQ are
 * admin-managed: FAQ via the FAQ module (category "coaching"), testimonials via the
 * testimonials module (entries with no linked subject are treated as coaching/general).
 */
@Component({
  selector: 'app-coaching-list',
  imports: [
    RouterLink,
    CardComponent,
    SpinnerComponent,
    CtaSectionComponent,
    ButtonComponent,
    TestimonialCardComponent,
    RevealDirective,
    IconComponent,
    StripHtmlPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coaching-list.component.html',
  styleUrl: './coaching-list.component.scss',
})
export class CoachingListComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  readonly programs = signal<CoachingProgramSummary[]>([]);
  readonly testimonials = signal<Testimonial[]>([]);
  readonly faqs = signal<FaqItem[]>([]);
  readonly loading = signal(true);

  readonly targetGroups = signal<TargetGroup[]>([
    {
      icon: 'alert-circle',
      title: 'Prüfungsangst',
      text: 'Blackouts, Nervosität und Druck vor Klassenarbeiten und Prüfungen.',
    },
    {
      icon: 'sparkles',
      title: 'Fehlende Motivation',
      text: 'Keine Lust aufs Lernen, Aufschieben und das Gefühl von „Wozu eigentlich?“.',
    },
    {
      icon: 'clock',
      title: 'Lernorganisation',
      text: 'Chaos statt Plan: Lernen auf den letzten Drücker und kein Überblick.',
    },
    {
      icon: 'target',
      title: 'Konzentration',
      text: 'Schnell abgelenkt, Schwierigkeiten beim Dranbleiben und Fokushalten.',
    },
  ]);

  readonly steps = signal<Step[]>([
    {
      icon: 'phone',
      title: 'Kennenlernen',
      text: 'Unverbindliches Erstgespräch — wir hören zu und klären, worum es geht.',
    },
    {
      icon: 'compass',
      title: 'Standortbestimmung',
      text: 'Gemeinsam analysieren wir Lernsituation, Stärken und die größten Hürden.',
    },
    {
      icon: 'target',
      title: 'Coaching-Plan',
      text: 'Ein individueller Plan mit klaren, erreichbaren Zielen entsteht.',
    },
    {
      icon: 'badge-check',
      title: 'Begleitung',
      text: 'Regelmäßige Sessions, in denen wir umsetzen, reflektieren und anpassen.',
    },
  ]);

  readonly benefits = signal<Benefit[]>([
    {
      icon: 'user',
      title: 'Individuell',
      text: 'Jedes Coaching wird persönlich auf die Situation und Ziele abgestimmt.',
    },
    {
      icon: 'book-open',
      title: 'Nachhaltige Strategien',
      text: 'Lernmethoden, die ein Leben lang tragen — über einzelne Noten hinaus.',
    },
    {
      icon: 'sparkles',
      title: 'Mehr Selbstvertrauen',
      text: 'Erfolgserlebnisse stärken das Vertrauen in die eigenen Fähigkeiten.',
    },
    {
      icon: 'shield',
      title: 'Weniger Stress',
      text: 'Souveräner Umgang mit Druck — zuhause und in der Prüfungssituation.',
    },
    {
      icon: 'target',
      title: 'Messbare Fortschritte',
      text: 'Klare Ziele und regelmäßige Reflexion machen Entwicklung sichtbar.',
    },
    {
      icon: 'users',
      title: 'Persönliche Begleitung',
      text: 'Eine feste Ansprechperson, die wirklich an der Seite steht.',
    },
  ]);

  ngOnInit(): void {
    this.seo.update({
      title: 'Lerncoaching & Mentoring',
      description:
        'Coaching-Programme für Motivation, Lernstrategien, Zeitmanagement und Prüfungsangst — getrennt von der fachlichen Nachhilfe.',
      path: '/coaching',
    });
    this.api.getCoachingPrograms().subscribe({
      next: (p) => {
        this.programs.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    // Admin-managed blocks override the built-in copy when present.
    this.api.getContentBlocks('coaching').subscribe((blocks) => {
      const tg = cardsFromBlocks(blocks, 'target-groups');
      if (tg.length) this.targetGroups.set(tg);
      const st = cardsFromBlocks(blocks, 'process-steps');
      if (st.length) this.steps.set(st);
      const bn = cardsFromBlocks(blocks, 'benefits');
      if (bn.length) this.benefits.set(bn);
    });
    // Testimonials without a linked subject are treated as coaching/general voices.
    this.api
      .getTestimonials()
      .subscribe((t) => this.testimonials.set(t.filter((x) => !x.subjectId)));
    this.api.getFaq().subscribe((f) => {
      const coachingFaqs = f.filter((faq) => faq.category?.toLowerCase() === 'coaching');
      this.faqs.set(coachingFaqs);
      this.seo.setStructuredData('faq', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: coachingFaqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      });
    });
  }
}
