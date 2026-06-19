import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { CoachingProgramSummary, Testimonial } from '../../core/models/api.models';
import { SeoService } from '../../core/seo/seo.service';
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
interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Coaching landing page. Coaching is a SEPARATE service line from tutoring — its own
 * page and its own visual identity (coaching accent colour). Never a tab under Subjects.
 *
 * Marketing copy (intro, target groups, steps, benefits, FAQ, testimonials) is static
 * German content; only the program cards are loaded from the API.
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

  readonly programs = signal<CoachingProgramSummary[]>([]);
  readonly loading = signal(true);

  readonly targetGroups: TargetGroup[] = [
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
  ];

  readonly steps: Step[] = [
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
  ];

  readonly benefits: Benefit[] = [
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
  ];

  readonly testimonials: Testimonial[] = [
    {
      id: 'c1',
      quote:
        'Mein Sohn geht wieder gerne zur Schule. Das Coaching hat ihm geholfen, sich selbst zu organisieren – und das merkt man in allen Fächern.',
      authorName: 'Sandra K.',
      authorRole: 'Mutter, 8. Klasse',
      displayOrder: 0,
      isPublished: true,
    },
    {
      id: 'c2',
      quote:
        'Vor Prüfungen war ich komplett blockiert. Heute habe ich Strategien, mit denen ich ruhig bleibe. Das hat mein Abitur gerettet.',
      authorName: 'Lena M.',
      authorRole: 'Schülerin, Abitur',
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: 'c3',
      quote:
        'Endlich Struktur im Lernalltag. Statt Streit ums Hausaufgabenmachen gibt es jetzt einen Plan, den unsere Tochter selbst trägt.',
      authorName: 'Familie Yıldız',
      authorRole: 'Eltern',
      displayOrder: 2,
      isPublished: true,
    },
  ];

  readonly faq: FaqEntry[] = [
    {
      question: 'Was ist der Unterschied zwischen Coaching und Nachhilfe?',
      answer:
        'Nachhilfe schließt fachliche Lücken in einem Schulfach. Coaching arbeitet eine Ebene davor – an Motivation, Lernstrategien, Organisation und dem Umgang mit Druck. Beides ergänzt sich, ist aber bewusst getrennt.',
    },
    {
      question: 'Für welches Alter ist Coaching geeignet?',
      answer:
        'Von der Grundschule bis zum Abitur und darüber hinaus. Wir stimmen Sprache, Methoden und Ziele individuell auf das Alter und die Situation ab.',
    },
    {
      question: 'Wie läuft ein Coaching ab?',
      answer:
        'Nach einem kostenlosen Erstgespräch folgen eine Standortbestimmung, ein gemeinsamer Coaching-Plan und regelmäßige Sessions, in denen umgesetzt und reflektiert wird.',
    },
    {
      question: 'Finden die Sitzungen online oder vor Ort statt?',
      answer:
        'Beides ist möglich – vor Ort in unseren Räumen oder flexibel online. Wir richten uns nach dem, was am besten in den Alltag passt.',
    },
    {
      question: 'Wie schnell sieht man Ergebnisse?',
      answer:
        'Erste Veränderungen – etwa mehr Ruhe oder ein klarer Lernplan – zeigen sich oft schon nach wenigen Sitzungen. Nachhaltige Effekte entstehen über einige Wochen kontinuierlicher Begleitung.',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: 'Lerncoaching & Mentoring',
      description:
        'Coaching-Programme für Motivation, Lernstrategien, Zeitmanagement und Prüfungsangst — getrennt von der fachlichen Nachhilfe.',
      path: '/coaching',
    });
    this.seo.setStructuredData('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
    this.api.getCoachingPrograms().subscribe({
      next: (p) => {
        this.programs.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
