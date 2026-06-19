import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { PublicApiService } from '../../core/api/public-api.service';
import { CoachingProgram, FaqItem, Testimonial } from '../../core/models/api.models';
import { cardsFromBlocks } from '../../shared/content-blocks.util';
import { SeoService } from '../../core/seo/seo.service';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { TestimonialCardComponent } from '../../shared/ui/testimonial-card.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { IconComponent, IconName } from '../../shared/ui/icon.component';

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
 * Coaching program detail. A SEPARATE service line from tutoring — coaching accent
 * colour, never styled as a subject page.
 *
 * The route is bound to the `slug` signal input via withComponentInputBinding(). Because
 * Angular reuses this component instance when navigating between two programs, the fetch
 * is driven reactively from the input (toObservable → switchMap) rather than ngOnInit —
 * this guarantees fresh data on every slug change and avoids the stale-content flicker.
 */
@Component({
  selector: 'app-coaching-detail',
  imports: [
    RouterLink,
    SpinnerComponent,
    ButtonComponent,
    CtaSectionComponent,
    TestimonialCardComponent,
    RevealDirective,
    IconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coaching-detail.component.html',
  styleUrl: './coaching-detail.component.scss',
})
export class CoachingDetailComponent {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();
  readonly program = signal<CoachingProgram | null>(null);
  readonly testimonial = signal<Testimonial | null>(null);
  readonly faqs = signal<FaqItem[]>([]);
  readonly loading = signal(true);

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
      title: 'Individuell abgestimmt',
      text: 'Jedes Coaching wird persönlich auf die Situation und Ziele zugeschnitten.',
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
      text: 'Eine feste Ansprechperson, die wirklich an deiner Seite steht.',
    },
  ]);

  constructor() {
    toObservable(this.slug)
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((slug) => this.api.getCoachingProgram(slug).pipe(catchError(() => of(null)))),
        takeUntilDestroyed(),
      )
      .subscribe((p) => {
        this.program.set(p);
        this.loading.set(false);
        if (p) {
          this.seo.update({
            title: p.title,
            description: p.description,
            path: `/coaching/${p.slug}`,
          });
        }
      });

    // Highlighted testimonial: first general (subject-less) published voice.
    this.api
      .getTestimonials()
      .pipe(takeUntilDestroyed())
      .subscribe((t) => this.testimonial.set(t.find((x) => !x.subjectId) ?? null));
    this.api
      .getFaq()
      .pipe(takeUntilDestroyed())
      .subscribe((f) =>
        this.faqs.set(f.filter((faq) => faq.category?.toLowerCase() === 'coaching')),
      );
    this.api
      .getContentBlocks('coaching')
      .pipe(takeUntilDestroyed())
      .subscribe((blocks) => {
        const st = cardsFromBlocks(blocks, 'process-steps');
        if (st.length) this.steps.set(st);
        const bn = cardsFromBlocks(blocks, 'benefits');
        if (bn.length) this.benefits.set(bn);
      });
  }
}
