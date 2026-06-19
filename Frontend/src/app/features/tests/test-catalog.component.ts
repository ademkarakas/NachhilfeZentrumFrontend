import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/api/public-api.service';
import { AssessmentListItem, FaqItem, SubjectSummary } from '../../core/models/api.models';
import { AssessmentDifficulty, DIFFICULTY_LABELS, VisibilityLevel } from '../../core/models/enums';
import { SeoService } from '../../core/seo/seo.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { cardsFromBlocks } from '../../shared/content-blocks.util';
import { CountUpDirective } from '../../shared/count-up.directive';
import { RevealDirective } from '../../shared/reveal.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { CtaSectionComponent } from '../../shared/ui/cta-section.component';
import { IconComponent, IconName } from '../../shared/ui/icon.component';
import { LockIndicatorComponent } from '../../shared/ui/lock-indicator.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-test-catalog',
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    LockIndicatorComponent,
    SpinnerComponent,
    RevealDirective,
    IconComponent,
    ButtonComponent,
    CtaSectionComponent,
    CountUpDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './test-catalog.component.html',
  styleUrl: './test-catalog.component.scss',
})
export class TestCatalogComponent implements OnInit {
  private readonly api = inject(PublicApiService);
  private readonly seo = inject(SeoService);
  readonly settings = inject(SiteSettingsService);

  readonly tests = signal<AssessmentListItem[]>([]);
  readonly subjects = signal<SubjectSummary[]>([]);
  readonly subjectFilter = signal('');
  readonly loading = signal(true);
  protected readonly Visibility = VisibilityLevel;

  readonly filtered = computed(() => {
    const id = this.subjectFilter();
    return id ? this.tests().filter((t) => t.subjectId === id) : this.tests();
  });

  readonly usps = signal<{ icon: IconName; title: string; text: string }[]>([
    {
      icon: 'badge-check',
      title: 'Wissen prüfen',
      text: 'Finde heraus, wo du stehst — objektiv und ohne Druck.',
    },
    {
      icon: 'sparkles',
      title: 'Qualität erleben',
      text: 'Unsere Tests spiegeln unsere Unterrichtsmethodik wider.',
    },
    {
      icon: 'target',
      title: 'Fortschritt messen',
      text: 'Wiederhole Tests und sieh, wie sich dein Wissen entwickelt.',
    },
  ]);

  readonly steps = signal<{ icon: IconName; title: string; text: string }[]>([
    {
      icon: 'book-open',
      title: 'Fach wählen',
      text: 'Wähle aus verschiedenen Schulfächern den passenden Bereich.',
    },
    {
      icon: 'arrow-right',
      title: 'Test starten',
      text: 'Ohne Anmeldung — direkt loslegen und dein Wissen testen.',
    },
    {
      icon: 'shield-check',
      title: 'Ergebnis erhalten',
      text: 'Sofortige Auswertung mit Punktzahl und Feedback.',
    },
  ]);

  // Marketing counters — the numeric value is admin-editable via site settings; the
  // suffix and label are part of the design and stay in code.
  readonly stats = computed(() => [
    { value: Number(this.settings.get('tests.stats.tests')) || 120, suffix: '+', label: 'Tests verfügbar' },
    { value: Number(this.settings.get('tests.stats.questions')) || 1500, suffix: '+', label: 'Fragen' },
    { value: Number(this.settings.get('tests.stats.subjects')) || 8, suffix: '', label: 'Fächer' },
    { value: Number(this.settings.get('tests.stats.completed')) || 3200, suffix: '+', label: 'Tests absolviert' },
  ]);

  readonly faq = signal<FaqItem[]>([]);

  ngOnInit(): void {
    this.seo.update({
      title: 'Tests & Übungen',
      description: 'Kostenlose fachbezogene Übungstests — ohne Anmeldung ausprobieren.',
      path: '/tests',
    });
    this.api.getTestCatalog().subscribe({
      next: (t) => {
        this.tests.set(t);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getSubjects().subscribe((s) => this.subjects.set(s));
    this.api
      .getFaq()
      .subscribe((f) => this.faq.set(f.filter((faq) => faq.category?.toLowerCase() === 'tests')));
    this.api.getContentBlocks('tests').subscribe((blocks) => {
      const up = cardsFromBlocks(blocks, 'usps');
      if (up.length) this.usps.set(up);
      const st = cardsFromBlocks(blocks, 'process-steps');
      if (st.length) this.steps.set(st);
    });
  }

  onSubject(event: Event): void {
    this.subjectFilter.set((event.target as HTMLSelectElement).value);
  }

  difficultyLabel(d: AssessmentDifficulty): string {
    return DIFFICULTY_LABELS[d];
  }
}
